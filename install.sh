#!/bin/bash

echo "Installing dependencies..."
echo

cd "$(dirname "$0")"

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

npm install

if [ $? -eq 0 ]; then
    echo
    echo "Installation completed successfully!"
    echo "You can now run ./start.sh to launch the application."
    
    # Give execute permission to start.sh
    chmod +x start.sh
else
    echo
    echo "Installation failed. Please check the error messages above."
fi

echo
read -p "Press Enter to continue..."
