import { MongoClient } from 'mongodb';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { once } from 'node:events';
import path from 'node:path';
import { createApp } from './app.mjs';
import { applySchema, seed } from './database.mjs';

const port = Number(process.env.PORT ?? 3000);
const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27028/?replicaSet=fekas-demo';
let ownedMongo;
let client;
async function ensureLocalMongo() {
  if (process.env.MONGO_URI) return;
  const executable = process.env.MONGOD_PATH ?? 'mongod';
  if (spawnSync(executable, ['--version'], { windowsHide: true, stdio: 'ignore' }).status !== 0) throw new Error('No se encuentra mongod. Instala MongoDB Community o define MONGOD_PATH. También puedes usar docker compose up --build.');
  const data = path.resolve('data/mongo');
  await mkdir(data, { recursive: true });
  ownedMongo = spawn(executable, ['--dbpath', data, '--port', '27028', '--bind_ip', '127.0.0.1', '--replSet', 'fekas-demo', '--logpath', path.join(data, 'mongod.log'), '--logappend'], { windowsHide: true, stdio: 'ignore' });
  let launchError;
  ownedMongo.once('error', error => { launchError = error; });
  const admin = new MongoClient('mongodb://127.0.0.1:27028/?directConnection=true', { serverSelectionTimeoutMS: 700 });
  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      if (launchError) throw launchError;
      if (ownedMongo.exitCode !== null) throw new Error('MongoDB no pudo arrancar. Comprueba data/mongo/mongod.log y que el puerto 27028 esté libre.');
      try { await admin.connect(); await admin.db('admin').command({ ping: 1 }); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 300)); }
    }
    if (!ready) throw new Error('MongoDB no respondió en el tiempo de arranque');
    try { await admin.db('admin').command({ replSetInitiate: { _id: 'fekas-demo', members: [{ _id: 0, host: '127.0.0.1:27028' }] } }); }
    catch (error) { if (error.code !== 23) throw error; }
    for (let i = 0; i < 40; i++) {
      if ((await admin.db('admin').command({ hello: 1 })).isWritablePrimary) return;
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    throw new Error('MongoDB no eligió un primario');
  } finally { await admin.close(); }
}
async function stop() {
  await client?.close();
  if (ownedMongo && ownedMongo.exitCode === null) {
    const direct = new MongoClient('mongodb://127.0.0.1:27028/?directConnection=true', { serverSelectionTimeoutMS: 500 });
    try { await direct.connect(); await direct.db('admin').command({ shutdown: 1 }); } catch { /* Shutdown closes the socket normally. */ }
    await direct.close();
    await Promise.race([once(ownedMongo, 'exit'), new Promise(resolve => setTimeout(resolve, 1500))]);
  }
}
try {
  await ensureLocalMongo();
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db(process.env.DB_NAME ?? 'by_fekas_corp_demo');
  const hello = await db.admin().command({ hello: 1 });
  if (!hello.setName) throw new Error('Se requiere MongoDB replica set para las transacciones');
  await applySchema(db);
  await seed(db);
  const server = createApp(client, db).listen(port, process.env.HOST ?? '127.0.0.1', () => console.log(`By Fekas ERP disponible en http://127.0.0.1:${port} · MongoDB real · modo demostración`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { server.close(); await stop(); process.exit(0); });
} catch (error) { console.error(error.message); await stop(); process.exitCode = 1; }
