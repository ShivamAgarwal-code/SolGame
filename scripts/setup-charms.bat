@echo off
REM Charms Protocol Setup Script for Windows
REM This script helps set up the Charms protocol integration for SolGame

echo 🔮 Setting up Charms Protocol Integration...
echo.

REM Check if Rust is installed
where rustc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Rust is not installed. Please install Rust first:
    echo    Visit: https://www.rust-lang.org/tools/install
    exit /b 1
)

echo ✅ Rust is installed
rustc --version
echo.

REM Check if Cargo is installed
where cargo >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Cargo is not installed. Please install Cargo (comes with Rust).
    exit /b 1
)

echo ✅ Cargo is installed
cargo --version
echo.

REM Install Charms CLI
echo 📦 Installing Charms CLI...
cargo install --locked Charms

REM Verify installation
where Charms >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Charms CLI installed successfully!
    Charms --version
) else (
    echo ⚠️  Charms CLI installed but not in PATH. You may need to add %%USERPROFILE%%\.cargo\bin to your PATH.
)

echo.
echo 📁 Creating charms-apps directory...
if not exist "charms-apps" mkdir charms-apps

echo.
echo ✨ Charms setup complete!
echo.
echo Next steps:
echo 1. Create a Charms app:
echo    cd charms-apps
echo    Charms app new solgame-tokens
echo.
echo 2. Configure your app in the generated directory
echo.
echo 3. Use the CharmsProvider in your React components
echo.
echo For more information, see: docs\CHARMS_INTEGRATION.md

pause

