#!/bin/bash

echo "Setting up C++ Backend for FIR Assistant..."

# Check if we're in the right directory
if [ ! -f "server.cpp" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Download httplib if it doesn't exist
if [ ! -f "httplib.h" ]; then
    echo "Downloading cpp-httplib..."
    curl -L https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o httplib.h
    if [ $? -ne 0 ]; then
        echo "Error downloading httplib.h"
        exit 1
    fi
    echo "✓ Downloaded httplib.h"
else
    echo "✓ httplib.h already exists"
fi

# Check for dependencies
echo ""
echo "Checking dependencies..."

# Check for cmake
if ! command -v cmake &> /dev/null; then
    echo "❌ cmake not found. Please install it:"
    echo "   macOS: brew install cmake"
    echo "   Linux: sudo apt-get install cmake"
    exit 1
fi
echo "✓ cmake found"

# Check for jsoncpp
if [ "$(uname)" == "Darwin" ]; then
    # macOS
    if ! brew list jsoncpp &> /dev/null; then
        echo "❌ jsoncpp not found. Installing..."
        brew install jsoncpp
    fi
    echo "✓ jsoncpp found"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Linux
    if ! dpkg -s libjsoncpp-dev &> /dev/null; then
        echo "❌ jsoncpp not found. Please install it:"
        echo "   sudo apt-get install libjsoncpp-dev"
        exit 1
    fi
    echo "✓ jsoncpp found"
fi

# Build the project
echo ""
echo "Building the project..."
mkdir -p build
cd build
cmake ..
make

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To run the server:"
    echo "   cd build"
    echo "   ./fir_server"
    echo ""
    echo "Server will run on http://localhost:8080"
else
    echo ""
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
