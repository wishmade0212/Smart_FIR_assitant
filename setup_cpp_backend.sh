#!/bin/bash

echo "🚀 Setting up FIR C++ Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend

# Step 1: Download required header files
echo "📥 Downloading header files..."

# Download cpp-httplib
if [ ! -f "httplib.h" ]; then
    echo "  → Downloading cpp-httplib..."
    curl -s -O https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
    echo "  ✅ cpp-httplib downloaded"
else
    echo "  ✅ cpp-httplib already exists"
fi

# Download nlohmann/json
if [ ! -f "json.hpp" ]; then
    echo "  → Downloading nlohmann/json..."
    curl -s -O https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp
    echo "  ✅ nlohmann/json downloaded"
else
    echo "  ✅ nlohmann/json already exists"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 Compiling C++ server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Compile
g++ -std=c++17 -pthread fir_server.cpp -o fir_server

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 Setup Complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "To start the server:"
    echo "  cd backend"
    echo "  ./fir_server"
    echo ""
    echo "Server will run on: http://localhost:8080"
    echo ""
else
    echo "❌ Compilation failed!"
    echo ""
    echo "Try installing required packages:"
    echo "  brew install gcc"
    exit 1
fi
