#!/bin/bash

# Universal Auto-Push Script
# Usage: ./auto-push-here.sh
# This script watches the CURRENT directory for changes

WATCH_DIR=$(pwd)
REPO_NAME=$(basename "$WATCH_DIR")

echo "🚀 Automatic Git Push Enabled!"
echo "================================"
echo "📂 Watching: $WATCH_DIR"
echo "📦 Repository: $REPO_NAME"
echo ""
echo "✅ Any file changes will be automatically pushed to GitHub"
echo "⚠️  Press Ctrl+C to stop watching"
echo ""

# Function to push changes
push_changes() {
    if [[ -n $(git status -s) ]]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📝 Changes detected at $(date '+%H:%M:%S')"
        echo ""
        
        # Show what changed
        echo "Modified files:"
        git status -s
        echo ""
        
        # Add all changes
        git add -A
        
        # Commit with timestamp
        COMMIT_MSG="Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$COMMIT_MSG" > /dev/null 2>&1
        
        # Push to GitHub
        echo "⬆️  Pushing to GitHub..."
        if git push origin main > /dev/null 2>&1; then
            echo "✅ Successfully pushed to GitHub!"
        else
            echo "❌ Push failed - check your internet connection"
        fi
        
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    fi
}

# Check if fswatch is installed
if ! command -v fswatch &> /dev/null; then
    echo "❌ fswatch not found. Installing..."
    brew install fswatch
fi

echo "👀 Watching for changes... (save any file to test)"
echo ""

# Watch for file changes in current directory
fswatch -o --exclude='\.git' "$WATCH_DIR" | while read change; do
    sleep 2  # Wait 2 seconds to batch multiple saves
    push_changes
done
