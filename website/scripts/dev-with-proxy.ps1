param(
  [int]$Port = 3000,
  [int]$ProxyPort = 7890
)

$proxy = "http://127.0.0.1:$ProxyPort"
$env:NODE_USE_ENV_PROXY = "1"
$env:HTTP_PROXY = $proxy
$env:HTTPS_PROXY = $proxy
$env:NO_PROXY = "localhost,127.0.0.1,::1"

Write-Host "Starting Next.js with Node proxy enabled:" -ForegroundColor Cyan
Write-Host "  NODE_USE_ENV_PROXY=$env:NODE_USE_ENV_PROXY"
Write-Host "  HTTP_PROXY=$env:HTTP_PROXY"
Write-Host "  HTTPS_PROXY=$env:HTTPS_PROXY"
Write-Host "  NO_PROXY=$env:NO_PROXY"
Write-Host ""

npm.cmd run dev -- -p $Port
