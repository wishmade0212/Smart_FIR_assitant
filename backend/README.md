# FIR Backend - C++ Implementation

This is the C++ backend for the FIR Smart Assistant, implementing all data structures (Trie, AVL Tree, Graph) and providing a REST API.

## Prerequisites

### macOS
```bash
# Install dependencies
brew install cmake jsoncpp

# Download cpp-httplib (header-only library)
cd backend
curl -O https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install cmake libjsoncpp-dev

# Download cpp-httplib
cd backend
wget https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
```

## Build Instructions

```bash
cd backend
mkdir build
cd build
cmake ..
make
```

## Run the Server

```bash
./fir_server
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/login` - Login with username and password

### FIR Operations (Admin only)
- `POST /api/fir/create` - Create new FIR
- `GET /api/fir/:id` - Get FIR by ID
- `GET /api/fir/search/complainant/:name` - Search by complainant name
- `GET /api/fir/search/suspect/:name` - Search by suspect name
- `GET /api/fir/status/:status` - List FIRs by status (open/closed)
- `GET /api/fir/stats` - Get FIR statistics
- `POST /api/fir/load-sample` - Load sample data

### IPC Operations (All users)
- `GET /api/ipc/search/:keyword` - Search IPC sections by keyword
- `GET /api/ipc/all` - Get all IPC sections

## Data Structures Implemented

1. **Trie** (`trie.hpp`) - O(m) prefix search for names and keywords
2. **AVL Tree** (`avl_tree.hpp`) - O(log n) balanced binary search tree
3. **Graph** (`graph.hpp`) - O(1) adjacency lookup for related cases
4. **HashMap** (std::unordered_map) - O(1) direct lookup

## Architecture

```
backend/
├── server.cpp           # Main HTTP server
├── trie.hpp            # Trie implementation
├── avl_tree.hpp        # AVL tree implementation
├── graph.hpp           # Graph implementation
├── fir_record.hpp      # Data structures (FIRRecord, IPCSection)
├── fir_store.hpp       # FIR storage with composite data structures
├── ipc_store.hpp       # IPC sections storage
├── httplib.h           # HTTP library (download separately)
└── CMakeLists.txt      # Build configuration
```

## Testing

### Test IPC Search
```bash
curl http://localhost:8080/api/ipc/search/kill
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"police123"}'
```

### Load Sample Data
```bash
curl -X POST http://localhost:8080/api/fir/load-sample
```

### Search Complainant
```bash
curl http://localhost:8080/api/fir/search/complainant/alice
```

## Frontend Integration

Update the frontend JavaScript to call these API endpoints instead of using local JavaScript data structures. The frontend files remain in the parent directory.

## Performance

- Trie search: O(m) where m = query length
- AVL tree operations: O(log n)
- HashMap lookup: O(1)
- Graph neighbor lookup: O(1)

All data structures are implemented from scratch in C++!
