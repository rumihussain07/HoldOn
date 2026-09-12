param([string]$Task = 'dev')
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$pnpmCommand = Get-Command pnpm -ErrorAction SilentlyContinue
if ($pnpmCommand) {
  $pnpmPath = $pnpmCommand.Source
} else {
  $runtimeRoot = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies'
  $pnpmPath = Join-Path $runtimeRoot 'bin/fallback/pnpm.cmd'
  if (!(Test-Path -LiteralPath $pnpmPath)) { throw 'Install Node.js and pnpm, then run pnpm dev.' }
  $env:PATH = (Join-Path $runtimeRoot 'node/bin') + ';' + $env:PATH
}
Push-Location $projectRoot
try { & $pnpmPath run $Task; $taskExit = $LASTEXITCODE } finally { Pop-Location }
exit $taskExit
