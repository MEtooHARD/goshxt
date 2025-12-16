#!/bin/bash
# macOS double-clickable launcher
cd "$(dirname "$0")"

# Auto-set permission and run
if [ ! -x "goshxt-mac" ]; then
    chmod +x goshxt-mac
fi

./goshxt-mac
