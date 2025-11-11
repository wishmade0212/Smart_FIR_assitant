#!/bin/bash

# Auto-push script for FIR Assistant
# Watches for file changes and automatically pushes to GitHub

echo "🚀 Auto-push enabled! Watching for changes..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
    # Check if there are any changes
    if [[ -n $(git status -s) ]]; then
        echo "📝 Changes detected at $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Add all changes
        git add -A
        
        # Commit with timestamp
        git commit -m "Auto update: $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Push to GitHub
        git push origin main
        
        echo "✅ Pushed to GitHub!"
        echo ""
    fi
    
    # Wait 30 seconds before checking again
    sleep 30
done
