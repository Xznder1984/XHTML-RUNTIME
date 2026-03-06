# XHTML Runtime Installer for Windows

$ErrorActionPreference = "Stop"

# --- Configuration ---
$repoUrl = "https://github.com/Xznder1984/XHTML-RUNTIME.git"
$installDir = "$env:APPDATA\XHTML-RUNTIME"
$repoDir = "$installDirepo" # <-- FIX: Correctly defined the repo directory path

# --- Main Script ---
Write-Host "--- Installing XHTML Runtime ---"

# 1. Check for Git and Node.js
Write-Host "Checking for Git and Node.js..."
if (-not (Get-Command git -ErrorAction SilentlyContinue) -or -not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git and Node.js are required." -ForegroundColor Red
    Write-Host "Please install them from: https://git-scm.com/ and https://nodejs.org/"
    exit 1
}

# 2. Setup Directories
if (Test-Path $repoDir) {
    Write-Host "Updating existing installation..."
    cd $repoDir
    git pull
} else {
    Write-Host "Cloning repository..."
    git clone $repoUrl $repoDir
}
cd $repoDir

# 3. Install Dependencies
Write-Host "Installing dependencies..."
npm install --silent --no-progress

# 4. Create the Command Wrapper
Write-Host "Creating 'xhtml' command..."
$wrapperContent = "@echo off`r`nnode `"$repoDir\cli.js`" %*"
$wrapperPath = "$installDir\xhtml.cmd"
Set-Content -Path $wrapperPath -Value $wrapperContent

# 5. Add to User's PATH
Write-Host "Adding to your PATH..."
$currentUserPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentUserPath -notlike "*$installDir*") {
    $newPath = "$currentUserPath;$installDir"
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "Added installation directory to your PATH."
} else {
    Write-Host "Installation directory is already in your PATH."
}

Write-Host "`n--- Installation Complete! ---" -ForegroundColor Green
Write-Host "Please restart your terminal for the 'xhtml' command to be available."
