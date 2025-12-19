@echo off
REM Quick start script for Docker deployment

echo ========================================
echo  NLP Text Analyzer - Docker Deployment
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [INFO] Docker is running...
echo.

REM Build and start containers
echo [INFO] Building and starting containers...
echo This will take 10-20 minutes for the first time...
echo.

docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Application is running
    echo ========================================
    echo.
    echo  Frontend:  http://localhost
    echo  Backend:   http://localhost:8000
    echo  API Docs:  http://localhost:8000/docs
    echo.
    echo To view logs:    docker-compose logs -f
    echo To stop:         docker-compose stop
    echo To remove:       docker-compose down
    echo.
    
    REM Open browser
    timeout /t 3 >nul
    start http://localhost
) else (
    echo.
    echo [ERROR] Failed to start containers
    echo Run 'docker-compose logs' to see errors
    pause
)
