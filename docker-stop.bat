@echo off
REM Stop and remove Docker containers

echo Stopping containers...
docker-compose stop

echo.
echo Removing containers...
docker-compose down

echo.
echo Done! All containers stopped and removed.
pause
