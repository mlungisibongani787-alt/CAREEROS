@echo off
setlocal
set ORIGIN=https://elevate360-6206c.web.app
set FN=https://us-central1-elevate360-6206c.cloudfunctions.net/elevate360AI
set HOST=https://elevate360-6206c.web.app/api/elevate360AI

echo.
echo === DIRECT FUNCTION: OPTIONS / CORS ===
curl.exe -i -X OPTIONS "%FN%" -H "Origin: %ORIGIN%" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type"

echo.
echo === FIREBASE HOSTING REWRITE: OPTIONS / CORS ===
curl.exe -i -X OPTIONS "%HOST%" -H "Origin: %ORIGIN%" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type"

echo.
echo === DIRECT FUNCTION: POST / AI ===
curl.exe -i -X POST "%FN%" -H "Origin: %ORIGIN%" -H "Content-Type: application/json" --data "{\"question\":\"Give me three practical ways to improve my CV.\",\"agent\":\"CV Architect\"}"

echo.
pause
