@echo off
REM Script to import and run Docker images on new machine

echo ========================================
echo  Docker Import and Deploy Script
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

echo [STEP 1/3] Checking for .tar files...
echo.

if not exist nlp-backend.tar (
    echo [ERROR] nlp-backend.tar not found!
    echo Please copy the exported files to this directory.
    pause
    exit /b 1
)

if not exist nlp-frontend.tar (
    echo [ERROR] nlp-frontend.tar not found!
    echo Please copy the exported files to this directory.
    pause
    exit /b 1
)

if not exist docker-compose.yml (
    echo [ERROR] docker-compose.yml not found!
    echo Please copy the docker-compose.yml file to this directory.
    pause
    exit /b 1
)

echo All files found!
echo.

echo [STEP 2/3] Importing images...
echo This will take 2-5 minutes...
echo.

echo Importing backend...
docker load -i nlp-backend.tar

if %errorlevel% neq 0 (
    echo [ERROR] Failed to import backend!
    pause
    exit /b 1
)

echo.
echo Importing frontend...
docker load -i nlp-frontend.tar

if %errorlevel% neq 0 (
    echo [ERROR] Failed to import frontend!
    pause
    exit /b 1
)

echo.
echo [STEP 3/3] Starting containers...
echo.

docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers!
    echo Run 'docker-compose logs' to see errors.
    pause
    exit /b 1
)

echo.
echo Waiting for services to start...
timeout /t 10 >nul

docker ps

echo.
echo ========================================
echo  SUCCESS! Application is running
echo ========================================
echo.
echo  Frontend:  http://localhost
echo  Backend:   http://localhost:8000
echo  API Docs:  http://localhost:8000/docs
echo.
echo Opening browser...
timeout /t 3 >nul
start http://localhost

echo.
echo To stop:   docker-compose stop
echo To remove: docker-compose down
echo.
pause
