cmake_minimum_required(VERSION 3.10)
project(FIRBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(jsoncpp REQUIRED)

# Include httplib (header-only library)
include_directories(${CMAKE_CURRENT_SOURCE_DIR})

# Source files
set(SOURCE_FILES
    server.cpp
)

# Executable
add_executable(fir_server ${SOURCE_FILES})

# Link libraries
target_link_libraries(fir_server 
    jsoncpp_lib
    pthread
)

# Include directories
target_include_directories(fir_server PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}
)
