#!/bin/bash
set -e

# --- Configuration ---
REPO_URL="https://github.com/Xznder1984/XHTML-RUNTIME.git"
INSTALL_DIR="$HOME/.xhtml-runtime"
CMD_PATH="/usr/local/bin/xhtml"

# --- Main ---
echo "--- Installing XHTML Runtime ---"

# 1. Check for dependencies
echo "Checking for Git and Node.js..."
if ! command -v git &> /dev/null || ! command -v node &> /dev/null; then
    echo "Error: Git and Node.js are required."
    exit 1
fi

# 2. Clone or update repo
if [ -d "$INSTALL_DIR" ]; then
    echo "Updating existing installation..."
    cd "$INSTALL_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR"
fi
cd "$INSTALL_DIR"

# 3. Install dependencies
echo "Installing dependencies..."
npm install --silent --no-progress

# 4. Create the command wrapper
echo "Creating 'xhtml' command at $CMD_PATH..."
WRAPPER_SCRIPT="#!/bin/bash
exec node "$INSTALL_DIR/cli.js" "\$@""

# Use sudo to write the command, asking for password if needed.
echo -e "$WRAPPER_SCRIPT" | sudo tee "$CMD_PATH" > /dev/null
sudo chmod +x "$CMD_PATH"

echo -e "
--- Installation Complete! ---"
echo "You can now use the 'xhtml' command from anywhere."
echo "Try running 'xhtml init' in a new project directory."
