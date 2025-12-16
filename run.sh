#!/bin/bash
# Universal launcher for goshxt - works without execute permission
# Usage: bash run.sh

cd "$(dirname "$0")"

echo "🚀 Starting goshxt..."

# Auto-detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    EXEC_NAME="goshxt-mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    EXEC_NAME="goshxt-linux"
else
    echo "❌ Unsupported platform: $OSTYPE"
    exit 1
fi

# Check if executable exists
if [ ! -f "$EXEC_NAME" ]; then
    echo "❌ Executable not found: $EXEC_NAME"
    echo "   Please ensure you're running this from the correct directory."
    exit 1
fi

# Set execute permission if needed
if [ ! -x "$EXEC_NAME" ]; then
    echo "🔧 Setting executable permission..."
    chmod +x "$EXEC_NAME"
    if [ $? -ne 0 ]; then
        echo "❌ Failed to set permission. Please run:"
        echo "   chmod +x $EXEC_NAME"
        exit 1
    fi
    echo "✅ Permission granted"
fi

# Run the executable
echo "✅ Launching $EXEC_NAME..."
./"$EXEC_NAME"
