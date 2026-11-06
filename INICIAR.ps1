$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Test-Path -LiteralPath 'node_modules')) { npm.cmd ci; if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar dependencias' } }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'La compilación falló' }
Write-Host 'Abre http://127.0.0.1:3000 cuando aparezca el mensaje de arranque.'
npm.cmd start
