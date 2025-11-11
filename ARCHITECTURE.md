# FIR Smart Assistant - System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│                         (index.html)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐              ┌────────────────────────┐      │
│  │  Login Screen   │              │   Main Application     │      │
│  │                 │  Login OK    │                        │      │
│  │  • Username     │─────────────→│  • Chat Interface      │      │
│  │  • Password     │              │  • Command Sidebar     │      │
│  │  • Role hints   │              │  • Control Buttons     │      │
│  └─────────────────┘              │  • Role Badge          │      │
│                                    └────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION LAYER                           │
│                          (app.js)                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐         ┌─────────────────────────┐         │
│  │  User Database   │         │  Role Checker           │         │
│  │                  │         │                         │         │
│  │  admin/police123 │────────→│  • Admin: Full access   │         │
│  │  user/user123    │         │  • User: IPC only       │         │
│  └──────────────────┘         └─────────────────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      ASSISTANT LOGIC LAYER                          │
│                          (app.js)                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Command Parser                                        │        │
│  │  • search ipc <keyword>    → searchIPC()              │        │
│  │  • create fir              → startFIRCreation()       │        │
│  │  • find fir by id          → findById()               │        │
│  │  • search complainant      → searchComplainant()      │        │
│  │  • list status             → listByStatus()           │        │
│  └────────────────────────────────────────────────────────┘        │
│                         ↓                  ↓                        │
│         ┌───────────────────┐    ┌──────────────────┐             │
│         │  FIR Operations   │    │  IPC Operations  │             │
│         └───────────────────┘    └──────────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                    ↓                              ↓
┌──────────────────────────────┐    ┌─────────────────────────────┐
│      FIR STORE               │    │       IPC STORE             │
│  (data_structures.js)        │    │   (ipc_data.js)             │
├──────────────────────────────┤    ├─────────────────────────────┤
│                              │    │                             │
│  ┌────────────────────────┐ │    │  ┌───────────────────────┐ │
│  │  HashMap               │ │    │  │  Trie (Keywords)      │ │
│  │  id → record           │ │    │  │  "kill" → [0,1,2]     │ │
│  │  O(1) lookup           │ │    │  │  O(m) prefix search   │ │
│  └────────────────────────┘ │    │  └───────────────────────┘ │
│                              │    │                             │
│  ┌────────────────────────┐ │    │  ┌───────────────────────┐ │
│  │  Trie (Complainant)    │ │    │  │  Section Array        │ │
│  │  "ali" → [1,3]         │ │    │  │  17+ IPC sections     │ │
│  │  O(m) prefix search    │ │    │  │  with metadata        │ │
│  └────────────────────────┘ │    │  └───────────────────────┘ │
│                              │    │                             │
│  ┌────────────────────────┐ │    └─────────────────────────────┘
│  │  Trie (Suspect)        │ │
│  │  "bob" → [1,3]         │ │
│  │  O(m) prefix search    │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │  AVL Tree (ID Index)   │ │
│  │  Balanced BST          │ │
│  │  O(log n) ops          │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │  Graph (Relations)     │ │
│  │  1 ↔ 2 ↔ 3            │ │
│  │  O(1) neighbors        │ │
│  └────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

## Data Flow Diagrams

### Flow 1: Public User Searches IPC

```
User Input: "search ipc kill"
      ↓
[Authentication Check] → User role: "user" ✓
      ↓
[Command Parser] → Action: searchIPC, query: "kill"
      ↓
[IPC Store] → keywordTrie.startsWith("kill")
      ↓
[Trie Search] → Returns indices: [0, 1, 2]
      ↓
[Map Indices] → Sections: [302, 304, 307]
      ↓
[Format Output] → HTML with section details
      ↓
[UI Display] → Chat message shown to user
```

### Flow 2: Admin Creates FIR

```
Admin Input: "create fir"
      ↓
[Authentication Check] → User role: "admin" ✓
      ↓
[Start Wizard] → creatingFIR = true
      ↓
[Prompt 1] → "Complainant name?"
      ↓
Admin: "John Doe"
      ↓
[Prompt 2] → "Suspect name?"
      ↓
Admin: "Jane Smith"
      ↓
[Prompt 3] → "Location?"
      ↓
Admin: "Downtown"
      ↓
[Prompt 4] → "Description?"
      ↓
Admin: "Theft of phone"
      ↓
[Create Record]
  • id = Date.now()
  • date = today
  • status = "open"
      ↓
[Store in Multiple Structures]
  ├→ HashMap.put(id, record)     [O(1)]
  ├→ Trie.insert("john doe", id) [O(m)]
  ├→ Trie.insert("jane smith", id) [O(m)]
  ├→ AVLTree.insert(id, record)  [O(log n)]
  └→ Graph.addVertex(id)         [O(1)]
      ↓
[Success Response] → Show formatted FIR
      ↓
[Reset State] → creatingFIR = false
```

### Flow 3: Admin Searches Complainant

```
Admin Input: "search complainant ali"
      ↓
[Authentication Check] → User role: "admin" ✓
      ↓
[Command Parser] → Action: searchComplainant, query: "ali"
      ↓
[FIR Store] → complainantTrie.startsWith("ali")
      ↓
[Trie Search] → Returns IDs: [1]
      ↓
[Fetch Records] → byId.get(1)
      ↓
[Format Output] → HTML with FIR details
      ↓
[UI Display] → Chat message with record
```

### Flow 4: User Tries Admin Command (Blocked)

```
User Input: "create fir"
      ↓
[Authentication Check] → User role: "user" ✓
      ↓
[Command Parser] → Action: createFIR
      ↓
[Role Check] → Required: "admin", Current: "user" ✗
      ↓
[Block Access] → "Admin access required"
      ↓
[UI Display] → Error message shown
```

## Component Relationships

```
┌────────────────────────────────────────────────────────┐
│                    Single Page App                     │
└────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ↓                 ↓                 ↓
    ┌────────┐      ┌──────────┐     ┌───────────┐
    │  HTML  │      │   CSS    │     │    JS     │
    │ (View) │      │ (Style)  │     │  (Logic)  │
    └────────┘      └──────────┘     └───────────┘
                                           │
                    ┌──────────────────────┼──────────────┐
                    ↓                      ↓              ↓
            ┌───────────────┐    ┌──────────────┐  ┌──────────┐
            │  app.js       │    │ data_        │  │ ipc_     │
            │  (Controller) │    │ structures.js│  │ data.js  │
            └───────────────┘    └──────────────┘  └──────────┘
                    │                     │              │
                    └──────────┬──────────┘              │
                               ↓                         ↓
                        ┌──────────────┐         ┌─────────────┐
                        │  FIRStore    │         │  IPCStore   │
                        │  (Composite) │         │  (Wrapper)  │
                        └──────────────┘         └─────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ↓                  ↓                  ↓
      ┌─────────┐        ┌─────────┐       ┌─────────┐
      │  Trie   │        │ HashMap │       │AVL Tree │
      └─────────┘        └─────────┘       └─────────┘
            ↓
      ┌─────────┐
      │  Graph  │
      └─────────┘
```

## State Management

```
Application State
├── currentUser: { username, role, name }
├── creatingFIR: boolean
├── firDraft: { ... } (temp)
├── store: FIRStore instance
└── ipcStore: IPCStore instance

FIRStore State
├── byId: HashMap<id, record>
├── complainantTrie: Trie
├── suspectTrie: Trie
├── idIndex: AVLTree
└── graph: Graph

IPCStore State
├── sections: Array<IPCSection>
└── keywordTrie: Trie
```

## Security Model

```
Request Flow with Security Checks:

User Action
    ↓
[Session Check]
    ├─ Not logged in? → Redirect to login
    └─ Logged in ✓
         ↓
[Parse Command]
    ↓
[Permission Check]
    ├─ Public command? → Allow (IPC search)
    ├─ Admin command + Admin role? → Allow (FIR ops)
    └─ Admin command + User role? → Block ⛔
         ↓
[Execute Action]
    ↓
[Return Result]
```

## Performance Optimization

```
Optimization Strategies Used:

1. Multiple Indexes
   └─ Same data in HashMap (id), Trie (name), AVL (ordered)
      Trade-off: More space for faster queries

2. Prefix Search (Trie)
   └─ O(m) vs O(n×m) naive search
      Benefit: Sub-linear for large datasets

3. Balanced Tree (AVL)
   └─ O(log n) vs O(n) worst-case BST
      Benefit: Guaranteed performance

4. Adjacency List (Graph)
   └─ O(1) neighbor lookup vs O(V²) matrix
      Benefit: Space-efficient for sparse graphs

5. Direct Lookup (HashMap)
   └─ O(1) vs O(n) array search
      Benefit: Instant retrieval by ID
```

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable data access patterns
- ✅ Security at multiple layers
- ✅ Efficient data structures for each use case
- ✅ Maintainable and testable code
