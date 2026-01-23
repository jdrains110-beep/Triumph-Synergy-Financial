@echo off
echo Testing Pi Network domain validation setup...
echo.

REM Test static file serving
echo Testing static validation files...
curl -s http://localhost:3000/validation-key.txt
echo.
curl -s http://localhost:3000/.well-known/pi-domain-validation.txt
echo.

REM Test dynamic validation endpoint
echo Testing dynamic validation endpoint...
curl -s -H "Host: testnet.triumphsynergy.com" http://localhost:3000/pi-domain-validation
echo.
curl -s -H "Host: triumphsynergy.com" http://localhost:3000/pi-domain-validation
echo.

echo Test complete.