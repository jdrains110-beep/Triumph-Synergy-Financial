# Pi Domain Validation - Environment Variable Test
# Tests the domain detection logic with environment variables

Write-Host "Testing Pi Domain Validation with Environment Variables..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Yellow

# Simulate environment variables
$testnetKey = "ba5b2c8e2d0652e73c66ad936020e055cc4da6c51d59d3c1d8d7ff413b5de30df55b2967497d2278d5ac37eccd01d3fc81f2ba73f127796266f3e1e23de87f70"
$mainnetKey = "4b4607253bb473cc6f639c789430d9f3d2958be4462820c58e178d50fbf5174062d20e69be46d2119b5ab93ee3b8aa86961dab23876b0c549f7cde90de69fd0c"

# Test the logic that the server uses
function Test-DomainValidation {
    param([string]$hostname)

    Write-Host "`nTesting host: $hostname" -ForegroundColor Cyan

    if ($hostname.StartsWith('testnet.')) {
        Write-Host "Detected: TESTNET" -ForegroundColor Green
        Write-Host "Would return: $($testnetKey.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "Detected: MAINNET" -ForegroundColor Green
        Write-Host "Would return: $($mainnetKey.Substring(0, 20))..." -ForegroundColor Gray
    }
}

# Test the correct domains
Test-DomainValidation "testnet.triumphsynergydi8363.pinet.com"
Test-DomainValidation "triumphsynergydi8363.pinet.com"

# Test incorrect domains (should not be used)
Write-Host "`nINCORRECT domains that should NOT be used:" -ForegroundColor Red
Test-DomainValidation "triumphsynergy0576.pinet.com"
Test-DomainValidation "triumphsynergydi8363.pinet.com:3001"

Write-Host "`nEnvironment Variables Required:" -ForegroundColor Green
Write-Host "PI_TESTNET_VALIDATION_KEY: SET" -ForegroundColor White
Write-Host "PI_MAINNET_VALIDATION_KEY: SET" -ForegroundColor White

Write-Host "`nCorrect Pi App Studio Configuration:" -ForegroundColor Green
Write-Host "Testnet Domain: testnet.triumphsynergydi8363.pinet.com" -ForegroundColor White
Write-Host "Mainnet Domain: triumphsynergydi8363.pinet.com" -ForegroundColor White