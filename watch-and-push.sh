#!/bin/bash

# Automatic Git Push on File Changes
# This script watches for any file changes and automatically pushes to GitHub

echo "🚀 Automatic Git Push Enabled!"
echo "================================"
echo "📂 Watching: /Users/apple/Downloads/FIR"
echo "🔄 Auto-pushing to: https://github.com/wishmade0212/Smart_FIR_assitant"
echo ""
echo "✅ Any file changes will be automatically pushed to GitHub"
echo "⚠️  Press Ctrl+C to stop watching"
echo ""

cd /Users/apple/Downloads/FIR

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

# Install fswatch if not installed (for Mac)
if ! command -v fswatch &> /dev/null; then
    echo "📦 Installing fswatch (file watcher)..."
    if command -v brew &> /dev/null; then
        brew install fswatch
    else
        echo "❌ Homebrew not found. Please install it first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
fi

echo "👀 Watching for changes... (save any file to test)"
echo ""

# Watch for file changes (excluding .git directory)
fswatch -o --exclude='\.git' /Users/apple/Downloads/FIR | while read change; do
    sleep 2  # Wait 2 seconds to batch multiple saves
    push_changes
done
