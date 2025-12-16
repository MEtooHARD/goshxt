#!/bin/bash
cd "$(dirname "$0")"

# Auto-detect platform and set executable permissions
if [ -f "goshxt-mac" ]; then
    if [ ! -x "goshxt-mac" ]; then
        echo "Setting executable permission for goshxt-mac..."
        chmod +x goshxt-mac
    fi
    ./goshxt-mac
elif [ -f "goshxt-linux" ]; then
    if [ ! -x "goshxt-linux" ]; then
        echo "Setting executable permission for goshxt-linux..."
        chmod +x goshxt-linux
    fi
    ./goshxt-linux
else
    # Fallback to npm start for development
    npm start
fi
