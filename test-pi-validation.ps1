# Pi Domain Validation Test Script

Write-Host "Testing Pi Domain Validation Endpoints..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Yellow

# Test testnet subdomain
Write-Host "`nTesting Testnet Subdomain: testnet.triumphsynergydi8363.pinet.com" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------------" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "https://testnet.triumphsynergydi8363.pinet.com/.well-known/pi-domain-validation.txt" -UseBasicParsing
    Write-Host "✅ /.well-known/pi-domain-validation.txt: $($response.Content.Length) chars" -ForegroundColor Green
    if ($response.Content.Length -gt 100) {
        Write-Host "   Key starts with: $($response.Content.Substring(0, 20))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ /.well-known/pi-domain-validation.txt: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "https://testnet.triumphsynergydi8363.pinet.com/debug/pi-validation" -UseBasicParsing
    Write-Host "✅ /debug/pi-validation: $($response.Content.Length) chars" -ForegroundColor Green
    $json = $response.Content | ConvertFrom-Json
    Write-Host "   Host detected: $($json.host)" -ForegroundColor Gray
    Write-Host "   Is Testnet: $($json.isTestnet)" -ForegroundColor Gray
} catch {
    Write-Host "❌ /debug/pi-validation: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test mainnet domain
Write-Host "`nTesting Mainnet Domain: triumphsynergydi8363.pinet.com" -ForegroundColor Cyan
Write-Host "-------------------------------------------------------" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "https://triumphsynergydi8363.pinet.com/.well-known/pi-domain-validation.txt" -UseBasicParsing
    Write-Host "✅ /.well-known/pi-domain-validation.txt: $($response.Content.Length) chars" -ForegroundColor Green
    if ($response.Content.Length -gt 100) {
        Write-Host "   Key starts with: $($response.Content.Substring(0, 20))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ /.well-known/pi-domain-validation.txt: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "https://triumphsynergydi8363.pinet.com/debug/pi-validation" -UseBasicParsing
    Write-Host "✅ /debug/pi-validation: $($response.Content.Length) chars" -ForegroundColor Green
    $json = $response.Content | ConvertFrom-Json
    Write-Host "   Host detected: $($json.host)" -ForegroundColor Gray
    Write-Host "   Is Testnet: $($json.isTestnet)" -ForegroundColor Gray
} catch {
    Write-Host "❌ /debug/pi-validation: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`nValidation Test Summary" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Yellow
Write-Host "If all endpoints return 200+ character responses, validation should work!" -ForegroundColor White
Write-Host "Testnet should return key starting with 'ba5b2c8e...'" -ForegroundColor White
Write-Host "Mainnet should return key starting with '4b4607...'" -ForegroundColor White
Write-Host "`nNext: Configure domains in Pi App Studio" -ForegroundColor Green
Write-Host "- Testnet: testnet.triumphsynergydi8363.pinet.com" -ForegroundColor White
Write-Host "- Mainnet: triumphsynergydi8363.pinet.com" -ForegroundColor White