param(
  [int]$ProxyPort = 7890
)

$proxy = "http://127.0.0.1:$ProxyPort"
$env:NODE_USE_ENV_PROXY = "1"
$env:HTTP_PROXY = $proxy
$env:HTTPS_PROXY = $proxy
$env:NO_PROXY = "localhost,127.0.0.1,::1"

Write-Host "Building with Node proxy enabled: $proxy" -ForegroundColor Cyan
npm.cmd run build
