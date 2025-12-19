@echo off
REM Script to build and export Docker images for deployment

echo ========================================
echo  Docker Build and Export Script
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

echo [STEP 1/5] Building Docker images...
echo This will take 15-30 minutes...
echo.

docker-compose build

if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [STEP 2/5] Testing containers...
echo.

docker-compose up -d

timeout /t 10 >nul

docker ps

echo.
echo Please test the app at http://localhost
echo Press any key after testing is complete...
pause >nul

docker-compose down

echo.
echo [STEP 3/5] Exporting backend image...
echo This will take 5-10 minutes (file size ~3-4GB)...
echo.

docker save -o nlp-backend.tar demo-web-backend:latest

if %errorlevel% neq 0 (
    echo [ERROR] Failed to export backend!
    pause
    exit /b 1
)

echo.
echo [STEP 4/5] Exporting frontend image...
echo.

docker save -o nlp-frontend.tar demo-web-frontend:latest

if %errorlevel% neq 0 (
    echo [ERROR] Failed to export frontend!
    pause
    exit /b 1
)

echo.
echo [STEP 5/5] Checking exported files...
echo.

dir nlp-*.tar

echo.
echo ========================================
echo  SUCCESS! Export completed
echo ========================================
echo.
echo Files ready for deployment:
echo  1. nlp-backend.tar  (~3-4GB)
echo  2. nlp-frontend.tar (~50MB)
echo  3. docker-compose.yml
echo.
echo Copy these 3 files to the new machine.
echo See DEPLOYMENT-GUIDE.md for next steps.
echo.
pause
