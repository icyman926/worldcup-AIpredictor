$ErrorActionPreference = "Continue"

$ports = @(7890, 7897, 7899, 1080, 10809, 20171, 33210)
$targets = @(
  "https://api.openai.com/v1/models",
  "https://generativelanguage.googleapis.com/v1beta/models"
)

function Test-ProxyPort($port) {
  $client = New-Object Net.Sockets.TcpClient
  try {
    $async = $client.BeginConnect("127.0.0.1", $port, $null, $null)
    $ok = $async.AsyncWaitHandle.WaitOne(500)
    if ($ok) {
      $client.EndConnect($async)
      return $true
    }
    return $false
  } catch {
    return $false
  } finally {
    $client.Close()
  }
}

Write-Host "Checking common local proxy ports..." -ForegroundColor Cyan
$openPorts = @()
foreach ($port in $ports) {
  if (Test-ProxyPort $port) {
    $openPorts += $port
    Write-Host "OPEN 127.0.0.1:$port" -ForegroundColor Green
  } else {
    Write-Host "closed 127.0.0.1:$port" -ForegroundColor DarkGray
  }
}

if ($openPorts.Count -eq 0) {
  Write-Host ""
  Write-Host "No common local proxy port was open. Check your VPN client's HTTP/Mixed port setting." -ForegroundColor Yellow
  exit 1
}

Write-Host ""
foreach ($port in $openPorts) {
  $proxy = "http://127.0.0.1:$port"
  Write-Host "Testing Node fetch through $proxy" -ForegroundColor Cyan
  $env:NODE_USE_ENV_PROXY = "1"
  $env:HTTP_PROXY = $proxy
  $env:HTTPS_PROXY = $proxy
  $env:NO_PROXY = "localhost,127.0.0.1,::1"
  node -e "const targets=['https://api.openai.com/v1/models','https://generativelanguage.googleapis.com/v1beta/models']; (async()=>{for (const url of targets){try{const r=await fetch(url,{signal:AbortSignal.timeout(12000)}); console.log(url, 'HTTP', r.status)}catch(e){console.log(url, 'FAILED', e.code||e.cause?.code||e.message)}}})()"
}

Write-Host ""
Write-Host "Use the first proxy port that returns HTTP status instead of FAILED." -ForegroundColor Green
