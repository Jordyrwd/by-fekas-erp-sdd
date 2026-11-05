/* By Fekas Corp. | Ejecutar: mongosh "mongodb://localhost:27017" by_fekas_corp_db.mongodb.js
   En Compass: abrir como Playground. Requiere permisos createCollection/collMod/createIndex.
   Las referencias se documentan en relaciones; MongoDB no impone FK entre colecciones. */
const erpDb = db.getSiblingDB('by_fekas_corp_db');
const O = { bsonType: 'objectId' };
const S = { bsonType: 'string', minLength: 1 };
const D = { bsonType: 'date' };
const B = { bsonType: 'bool' };
const N = { bsonType: 'int', minimum: 0 };
const Q = { bsonType: 'decimal', minimum: NumberDecimal('0') };
const Qr = (minimum, maximum) => ({ bsonType:'decimal', minimum:NumberDecimal(String(minimum)), maximum:NumberDecimal(String(maximum)) });
const A = (item) => ({ bsonType: 'array', items: item });
const E = (...values) => ({ bsonType: 'string', enum: values });
const I = (key, unique = false, extra = {}) => ({ key, unique, ...extra });
const R = (campo, ref, cardinalidad) => ({ campo, ref, cardinalidad });
function C(nombre, propiedades, obligatorios, indices, relaciones = []) {
  return {
    nombre,
    validator: { $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['tenant_id', 'created_at', 'updated_at', ...obligatorios],
      properties: { _id: O, __v: { bsonType: 'int' }, tenant_id: O, created_at: D, updated_at: D, ...propiedades }
    } },
    indices,
    relaciones
  };
}
const colecciones = [
  // 1–5 Seguridad, usuarios y auditoría
  C('usuarios', {
    email: S, password_hash: S, nombre: S, activo: B, rol_ids: A(O),
    granja_ids: A(O), piscina_ids: A(O), ultimo_acceso: D,
    cedula_cifrada: { bsonType: 'binData' }, cedula_iv: { bsonType: 'binData' }, cedula_tag: { bsonType: 'binData' }
  }, ['email','password_hash','nombre','activo','rol_ids','granja_ids','piscina_ids'],
  [I({tenant_id:1,email:1},true), I({tenant_id:1,activo:1})],
  [R('rol_ids','roles','N:M'),R('granja_ids','granjas_camaroneras','N:M'),R('piscina_ids','piscinas_estanques','N:M')]),
  C('roles', { codigo:S, nombre:S, permiso_ids:A(O), activo:B },
  ['codigo','nombre','permiso_ids','activo'], [I({tenant_id:1,codigo:1},true)],
  [R('permiso_ids','permisos','N:M')]),
  C('permisos', { codigo:S, recurso:S, accion:E('leer','crear','editar','eliminar','aprobar'), descripcion:S },
  ['codigo','recurso','accion'], [I({tenant_id:1,codigo:1},true)]),
  C('sesiones_activas', { usuario_id:O, jti_hash:S, refresh_hash:S, expires_at:D, revocada:B, ip_hash:S, user_agent:S, rotada_en:D },
  ['usuario_id','jti_hash','refresh_hash','expires_at','revocada'],
  [I({tenant_id:1,jti_hash:1},true),I({tenant_id:1,usuario_id:1,revocada:1}),I({expires_at:1},false,{expireAfterSeconds:0})],
  [R('usuario_id','usuarios','N:1')]),
  C('logs_auditoria', { usuario_id:O, accion:S, recurso:S, recurso_id:O, fecha:D, ip_hash:S, resultado:E('exito','denegado','error'), detalle:S },
  ['accion','recurso','fecha','resultado'],
  [I({tenant_id:1,fecha:-1}),I({tenant_id:1,usuario_id:1,fecha:-1}),I({tenant_id:1,recurso:1,recurso_id:1})],
  [R('usuario_id','usuarios','N:1'),R('recurso_id','coleccion indicada por recurso','N:1 polimórfica')]),
  // 6–11 Infraestructura y producción
  C('granjas_camaroneras', { codigo:S, nombre:S, ubicacion:S, superficie_ha:Q, activa:B, responsable_id:O },
  ['codigo','nombre','ubicacion','superficie_ha','activa'],
  [I({tenant_id:1,codigo:1},true),I({tenant_id:1,activa:1})], [R('responsable_id','usuarios','N:1')]),
  C('piscinas_estanques', { granja_id:O, codigo:S, area_ha:Q, profundidad_m:Q, estado:E('activa','mantenimiento','inactiva'), capacidad_m3:Q },
  ['granja_id','codigo','area_ha','profundidad_m','estado'],
  [I({tenant_id:1,granja_id:1,codigo:1},true),I({tenant_id:1,granja_id:1,estado:1})],
  [R('granja_id','granjas_camaroneras','N:1')]),
  C('ciclos_cultivo', { granja_id:O, piscina_id:O, codigo:S, fecha_inicio:D, fecha_fin:D, estado:E('planificado','activo','cerrado'), biomasa_estimada_kg:Q, especie:S },
  ['granja_id','piscina_id','codigo','fecha_inicio','estado','especie'],
  [I({tenant_id:1,piscina_id:1,codigo:1},true),I({tenant_id:1,granja_id:1,estado:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('piscina_id','piscinas_estanques','N:1')]),
  C('siembras_larvas', { granja_id:O, ciclo_id:O, proveedor_id:O, fecha:D, cantidad:N, densidad_m2:Q, lote_larvas:S, supervivencia_estimada_pct:Qr(0,100) },
  ['granja_id','ciclo_id','fecha','cantidad','densidad_m2','lote_larvas'],
  [I({tenant_id:1,ciclo_id:1,fecha:-1}),I({tenant_id:1,lote_larvas:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('proveedor_id','proveedores','N:1')]),
  C('muestreos_biometricos', { granja_id:O, piscina_id:O, ciclo_id:O, usuario_id:O, fecha:D, peso_promedio_g:Q, talla_promedio_cm:Q, muestra_individuos:N, biomasa_estimada_kg:Q, observacion:S },
  ['granja_id','piscina_id','ciclo_id','usuario_id','fecha','peso_promedio_g','talla_promedio_cm','muestra_individuos'],
  [I({tenant_id:1,piscina_id:1,fecha:-1}),I({tenant_id:1,ciclo_id:1,fecha:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('piscina_id','piscinas_estanques','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('usuario_id','usuarios','N:1')]),
  C('registro_mortalidad', { granja_id:O, piscina_id:O, ciclo_id:O, usuario_id:O, fecha:D, cantidad:N, causa:S, observacion:S },
  ['granja_id','piscina_id','ciclo_id','usuario_id','fecha','cantidad','causa'],
  [I({tenant_id:1,piscina_id:1,fecha:-1}),I({tenant_id:1,ciclo_id:1,fecha:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('piscina_id','piscinas_estanques','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('usuario_id','usuarios','N:1')]),
  // 12–14 Agua y alimentación
  C('parametros_agua', { granja_id:O, piscina_id:O, ciclo_id:O, usuario_id:O, fecha:D, oxigeno_mg_l:Qr(0.000001,30), salinidad_ppt:Qr(0,60), ph:Qr(0,14), temperatura_c:Qr(0,45), amonio_mg_l:Qr(0,50), alerta:B },
  ['granja_id','piscina_id','ciclo_id','usuario_id','fecha','oxigeno_mg_l','salinidad_ppt','ph','temperatura_c','amonio_mg_l'],
  [I({tenant_id:1,piscina_id:1,fecha:-1}),I({tenant_id:1,alerta:1,fecha:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('piscina_id','piscinas_estanques','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('usuario_id','usuarios','N:1')]),
  C('planes_alimentacion', { granja_id:O, ciclo_id:O, producto_id:O, fecha_inicio:D, fecha_fin:D, racion_diaria_kg:Q, frecuencia_diaria:N, aprobado_por:O, estado:E('borrador','aprobado','cerrado') },
  ['granja_id','ciclo_id','producto_id','fecha_inicio','racion_diaria_kg','frecuencia_diaria','estado'],
  [I({tenant_id:1,ciclo_id:1,fecha_inicio:-1}),I({tenant_id:1,estado:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('producto_id','insumos_productos','N:1'),R('aprobado_por','usuarios','N:1')]),
  C('consumo_alimento_diario', { granja_id:O, piscina_id:O, ciclo_id:O, plan_id:O, lote_id:O, usuario_id:O, fecha:D, cantidad_kg:Q, fca:Qr(0,20), biomasa_kg:Q, observacion:S },
  ['granja_id','piscina_id','ciclo_id','lote_id','usuario_id','fecha','cantidad_kg'],
  [I({tenant_id:1,ciclo_id:1,fecha:-1}),I({tenant_id:1,lote_id:1,fecha:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('piscina_id','piscinas_estanques','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('plan_id','planes_alimentacion','N:1'),R('lote_id','lotes_inventario','N:1'),R('usuario_id','usuarios','N:1')]),
  // 15–20 Inventario, bodega y compras
  C('bodegas', { granja_id:O, codigo:S, nombre:S, ubicacion:S, responsable_id:O, activa:B },
  ['granja_id','codigo','nombre','ubicacion','activa'],
  [I({tenant_id:1,granja_id:1,codigo:1},true),I({tenant_id:1,granja_id:1,activa:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('responsable_id','usuarios','N:1')]),
  C('insumos_productos', { sku:S, nombre:S, categoria:E('balanceado','probiotico','quimico','fertilizante','otro'), unidad:E('kg','l','unidad'), stock_minimo:Q, activo:B },
  ['sku','nombre','categoria','unidad','stock_minimo','activo'],
  [I({tenant_id:1,sku:1},true),I({tenant_id:1,categoria:1,nombre:1})]),
  C('lotes_inventario', { granja_id:O, bodega_id:O, producto_id:O, proveedor_id:O, codigo_lote:S, fecha_ingreso:D, vence_at:D, cantidad_inicial:Q, cantidad_actual:Q, costo_unitario:Q },
  ['granja_id','bodega_id','producto_id','codigo_lote','fecha_ingreso','cantidad_inicial','cantidad_actual'],
  [I({tenant_id:1,bodega_id:1,producto_id:1,codigo_lote:1},true),I({tenant_id:1,bodega_id:1,vence_at:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('bodega_id','bodegas','N:1'),R('producto_id','insumos_productos','N:1'),R('proveedor_id','proveedores','N:1')]),
  C('movimientos_kardex', { granja_id:O, bodega_id:O, lote_id:O, usuario_id:O, fecha:D, tipo:E('entrada','salida','ajuste'), cantidad:Q, saldo_posterior:Q, referencia:S, motivo:S },
  ['granja_id','bodega_id','lote_id','usuario_id','fecha','tipo','cantidad','saldo_posterior','referencia'],
  [I({tenant_id:1,lote_id:1,fecha:-1}),I({tenant_id:1,bodega_id:1,fecha:-1}),I({tenant_id:1,referencia:1},true)],
  [R('granja_id','granjas_camaroneras','N:1'),R('bodega_id','bodegas','N:1'),R('lote_id','lotes_inventario','N:1'),R('usuario_id','usuarios','N:1')]),
  C('proveedores', { codigo:S, nombre:S, ruc_cifrado:{bsonType:'binData'}, ruc_iv:{bsonType:'binData'}, ruc_tag:{bsonType:'binData'}, cuenta_cifrada:{bsonType:'binData'}, cuenta_iv:{bsonType:'binData'}, cuenta_tag:{bsonType:'binData'}, contacto:S, activo:B },
  ['codigo','nombre','activo'], [I({tenant_id:1,codigo:1},true),I({tenant_id:1,nombre:1})]),
  C('ordenes_compra', { granja_id:O, proveedor_id:O, bodega_id:O, numero:S, fecha:D, estado:E('borrador','aprobada','recibida','cancelada'), total:Q, creado_por:O, aprobado_por:O,
    lineas:A({ bsonType:'object', additionalProperties:false, required:['producto_id','cantidad','precio_unitario'], properties:{producto_id:O,cantidad:Q,precio_unitario:Q} }) },
  ['granja_id','proveedor_id','bodega_id','numero','fecha','estado','total','creado_por','lineas'],
  [I({tenant_id:1,numero:1},true),I({tenant_id:1,granja_id:1,estado:1,fecha:-1}),I({tenant_id:1,proveedor_id:1,fecha:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('proveedor_id','proveedores','N:1'),R('bodega_id','bodegas','N:1'),R('creado_por','usuarios','N:1'),R('aprobado_por','usuarios','N:1'),R('lineas.producto_id','insumos_productos','N:M')]),
  // 21–26 Cosecha, calidad, ventas, finanzas y nómina
  C('cosechas_pesca', { granja_id:O, piscina_id:O, ciclo_id:O, fecha:D, peso_bruto_kg:Q, peso_neto_kg:Q, cantidad_estimada:N, responsable_id:O, estado:E('programada','ejecutada','anulada') },
  ['granja_id','piscina_id','ciclo_id','fecha','peso_bruto_kg','peso_neto_kg','responsable_id','estado'],
  [I({tenant_id:1,ciclo_id:1,fecha:-1}),I({tenant_id:1,granja_id:1,estado:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('piscina_id','piscinas_estanques','N:1'),R('ciclo_id','ciclos_cultivo','N:1'),R('responsable_id','usuarios','N:1')]),
  C('control_calidad_cosecha', { granja_id:O, cosecha_id:O, analista_id:O, fecha:D, gramaje_g:Q, metabisulfito_ppm:Q, textura:E('firme','media','blanda'), aprobado:B, observacion:S },
  ['granja_id','cosecha_id','analista_id','fecha','gramaje_g','metabisulfito_ppm','textura','aprobado'],
  [I({tenant_id:1,cosecha_id:1},true),I({tenant_id:1,aprobado:1,fecha:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('cosecha_id','cosechas_pesca','1:1'),R('analista_id','usuarios','N:1')]),
  C('clientes_empacadoras', { codigo:S, nombre:S, ruc_cifrado:{bsonType:'binData'}, ruc_iv:{bsonType:'binData'}, ruc_tag:{bsonType:'binData'}, contacto:S, activo:B },
  ['codigo','nombre','activo'], [I({tenant_id:1,codigo:1},true),I({tenant_id:1,nombre:1})]),
  C('facturas_venta', { granja_id:O, cliente_id:O, cosecha_id:O, numero:S, fecha:D, vence_at:D, subtotal:Q, impuestos:Q, total:Q, estado:E('emitida','pagada','anulada'), creado_por:O },
  ['granja_id','cliente_id','cosecha_id','numero','fecha','subtotal','impuestos','total','estado','creado_por'],
  [I({tenant_id:1,numero:1},true),I({tenant_id:1,cliente_id:1,fecha:-1}),I({tenant_id:1,estado:1,vence_at:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('cliente_id','clientes_empacadoras','N:1'),R('cosecha_id','cosechas_pesca','N:1'),R('creado_por','usuarios','N:1')]),
  C('cuentas_por_pagar_cobrar', { granja_id:O, tipo:E('pagar','cobrar'), proveedor_id:O, cliente_id:O, orden_compra_id:O, factura_id:O, fecha_emision:D, vence_at:D, monto_original:Q, saldo_pendiente:Q, estado:E('pendiente','parcial','pagada','vencida'), aprobado_por:O },
  ['granja_id','tipo','fecha_emision','vence_at','monto_original','saldo_pendiente','estado'],
  [I({tenant_id:1,granja_id:1,tipo:1,vence_at:1}),I({tenant_id:1,estado:1,vence_at:1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('proveedor_id','proveedores','N:1'),R('cliente_id','clientes_empacadoras','N:1'),R('orden_compra_id','ordenes_compra','N:1'),R('factura_id','facturas_venta','N:1'),R('aprobado_por','usuarios','N:1')]),
  C('nomina_empleados_campo', { granja_id:O, usuario_id:O, periodo_inicio:D, periodo_fin:D, dias_trabajados:N, sueldo_bruto:Q, deducciones:Q, sueldo_neto:Q, cuenta_cifrada:{bsonType:'binData'}, cuenta_iv:{bsonType:'binData'}, cuenta_tag:{bsonType:'binData'}, aprobado_por:O, estado:E('borrador','aprobada','pagada') },
  ['granja_id','usuario_id','periodo_inicio','periodo_fin','dias_trabajados','sueldo_bruto','deducciones','sueldo_neto','estado'],
  [I({tenant_id:1,usuario_id:1,periodo_inicio:1},true),I({tenant_id:1,granja_id:1,periodo_inicio:-1})],
  [R('granja_id','granjas_camaroneras','N:1'),R('usuario_id','usuarios','N:1'),R('aprobado_por','usuarios','N:1')])
];
for (const def of colecciones) {
  if (erpDb.getCollectionInfos({name:def.nombre}).length === 0) {
    erpDb.createCollection(def.nombre, {validator:def.validator, validationLevel:'strict', validationAction:'error'});
  } else {
    erpDb.runCommand({collMod:def.nombre, validator:def.validator, validationLevel:'strict', validationAction:'error'});
  }
  for (const indice of def.indices) erpDb.getCollection(def.nombre).createIndex(indice.key, {unique:indice.unique, ...Object.fromEntries(Object.entries(indice).filter(([k]) => !['key','unique'].includes(k)))});
  print(`${def.nombre}: ${def.indices.length} índices; ${def.relaciones.length} relaciones`);
}
print(`ERP By Fekas Corp.: ${colecciones.length} colecciones configuradas.`);
