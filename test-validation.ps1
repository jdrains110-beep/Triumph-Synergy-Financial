Write-Host "Starting server..." -ForegroundColor Cyan
$serverJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\13865\Downloads\Triumph-Synergy-Financial-main\Triumph-Synergy-Financial-main"
    node dist/index.js
}

Start-Sleep -Seconds 5

Write-Host "`n=== Testing Pi Network Domain Validation ===" -ForegroundColor Yellow
Write-Host "`n1. Testing MAINNET domain (triumphsynergy.com):" -ForegroundColor Green
$mainnetResult = curl.exe -s -H "Host: triumphsynergy.com" http://localhost:3000/validation-key.txt
Write-Host "Response: $mainnetResult" -ForegroundColor White

Write-Host "`nExpected MAINNET key:" -ForegroundColor Gray
Write-Host "4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c" -ForegroundColor Gray

if ($mainnetResult -eq "4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c") {
    Write-Host "✓ MAINNET validation key CORRECT!" -ForegroundColor Green
} else {
    Write-Host "✗ MAINNET validation key MISMATCH!" -ForegroundColor Red
}

Write-Host "`n2. Testing TESTNET subdomain:" -ForegroundColor Green
$testnetResult = curl.exe -s -H "Host: testnet.triumphsynergy.com" http://localhost:3000/validation-key.txt
Write-Host "Response: $testnetResult" -ForegroundColor White

Write-Host "`nExpected TESTNET key:" -ForegroundColor Gray
Write-Host "ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70" -ForegroundColor Gray

if ($testnetResult -eq "ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70") {
    Write-Host "✓ TESTNET validation key CORRECT!" -ForegroundColor Green
} else {
    Write-Host "✗ TESTNET validation key MISMATCH!" -ForegroundColor Red
}

Write-Host "`n3. Testing static file (default mainnet):" -ForegroundColor Green
$staticResult = curl.exe -s http://localhost:3000/validation-key.txt
Write-Host "Response: $staticResult" -ForegroundColor White

Write-Host "`nStopping server..." -ForegroundColor Cyan
Stop-Job $serverJob
Remove-Job $serverJob

Write-Host "`nTest complete!" -ForegroundColor Yellow
