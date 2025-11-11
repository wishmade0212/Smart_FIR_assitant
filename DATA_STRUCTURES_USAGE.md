# 🗂️ Data Structures Used in FIR System

## Overview
This document explains **exactly where and how** each C++ data structure is used in the FIR management system.

---

## 📊 Data Structures Summary

| Data Structure | Purpose | Use Case | Time Complexity |
|---------------|---------|----------|-----------------|
| **AVL Tree** | Fast FIR search by ID | Search FIR by ID | O(log n) |
| **Trie** | Autocomplete names | Type complainant/suspect name, get suggestions | O(m) where m = length |
| **Hash Map** | Instant FIR lookup | Direct FIR retrieval by ID | O(1) |
| **Graph** | Criminal network analysis | Find connections between suspects | O(V + E) |
| **Stack** | Activity history | Undo/Redo actions, navigation history | O(1) |
| **Vector/Array** | Store all FIRs | List all FIRs chronologically | O(n) |

---

## 1️⃣ AVL Tree - FIR Search by ID

### **Where Used:**
When you click **"View Full Details"** or search for a specific FIR by ID

### **Example:**
```cpp
// User searches for "FIR-123"
AVLTree firTree;
FIRRecord* fir = firTree.search("FIR-123");  // O(log n) - Very fast!

// Without AVL Tree: O(n) - slow for large databases
for (auto& fir : allFIRs) {
    if (fir.id == "FIR-123") return fir;  // Check every FIR
}
```

### **Real Scenario:**
```
👤 User Action: Click "View FIR-5" button
🔍 C++ Backend:
   - Root node: FIR-8
   - Go left (5 < 8)
   - Found: FIR-5
   - Return details in 3 comparisons instead of 1000!

Tree Structure:
        FIR-8
       /     \
    FIR-5   FIR-12
    /  \      /  \
 FIR-3 FIR-6 FIR-10 FIR-15
```

### **Code Location:**
`backend/fir_server.cpp` - Lines 114-240

---

## 2️⃣ Trie - Autocomplete Names

### **Where Used:**
When user types in **complainant name** or **suspect name** input fields

### **Example:**
```cpp
// User types "Raj" in complainant name field
Trie nameAutocomplete;

// Stored names: Rajesh, Ravi, Ramesh, Rakesh, Vijay
nameAutocomplete.insert("Rajesh");
nameAutocomplete.insert("Ravi");
nameAutocomplete.insert("Rakesh");

// User types "Ra"
vector<string> suggestions = nameAutocomplete.autocomplete("Ra");
// Returns: ["Rajesh", "Ravi", "Rakesh", "Ramesh"]
```

### **Real Scenario:**
```
👤 User Action: Types "Ar" in "Complainant Name" field
🔍 C++ Backend:
   Trie structure:
   root
    ├─ A
    │  └─ r
    │     ├─ j (Arjun)
    │     ├─ u (Arun)
    │     └─ v (Arvind)
    ├─ V (Vijay)
    └─ R (Ravi)

   Suggestions shown: ["Arjun", "Arun", "Arvind"]
```

### **UI Implementation:**
```javascript
// In app_cpp_client.js
async function handleNameInput(input) {
    const response = await fetch('http://localhost:8080/api/autocomplete', {
        method: 'POST',
        body: JSON.stringify({ prefix: input.value })
    });
    
    const suggestions = await response.json();
    showDropdown(suggestions); // Show: Arjun, Arun, Arvind
}
```

### **Code Location:**
`backend/fir_server.cpp` - Lines 242-295

---

## 3️⃣ Hash Map (unordered_map) - Instant FIR Lookup

### **Where Used:**
When system needs to retrieve FIR details **instantly** without searching

### **Example:**
```cpp
// O(1) - Constant time lookup
unordered_map<string, FIRRecord> firMap;

// Store FIRs
firMap["FIR-1"] = fir1;
firMap["FIR-2"] = fir2;
firMap["FIR-3"] = fir3;

// Instant retrieval
FIRRecord fir = firMap["FIR-2"];  // Found immediately!
```

### **Real Scenario:**
```
👤 User Action: Click "Get FIR" button with ID "FIR-789"
🔍 C++ Backend:
   Hash Map: [FIR-1] [FIR-2] ... [FIR-789] ...
                                      ↑
                                  Found in 1 step!
   
   AVL Tree would take: log₂(1000) ≈ 10 steps
   Hash Map takes: 1 step ⚡
```

### **Why Both AVL Tree AND Hash Map?**
- **AVL Tree**: Ordered traversal, range queries (e.g., get FIRs from FIR-100 to FIR-200)
- **Hash Map**: Instant single FIR lookup

### **Code Location:**
`backend/fir_server.cpp` - Lines 303, 366-372

---

## 4️⃣ Graph - Criminal Network Analysis

### **Where Used:**
Finding connections between suspects, criminal networks

### **Example:**
```cpp
// Criminal Network Graph
class CriminalGraph {
    unordered_map<string, vector<string>> adjacencyList;
    
    void addConnection(string suspect1, string suspect2) {
        adjacencyList[suspect1].push_back(suspect2);
        adjacencyList[suspect2].push_back(suspect1);
    }
    
    vector<string> findNetwork(string suspect) {
        // BFS/DFS to find all connected criminals
    }
};
```

### **Real Scenario:**
```
👤 User Action: Search "Find criminal network for Rajesh"
🔍 C++ Backend:

Criminal Network Graph:
    Rajesh ─── Suresh
      │          │
      │          │
    Mukesh ─── Ramesh
      │
    Vijay

Query: findNetwork("Rajesh")
Returns: [Rajesh, Suresh, Mukesh, Ramesh, Vijay]

💡 Use Case: If Rajesh is a suspect in one FIR, police can 
   instantly see all his known associates from other FIRs
```

### **Code Location:**
`backend/data_structures.hpp` - Graph implementation (future enhancement)

---

## 5️⃣ Stack - Activity History (Undo/Redo)

### **Where Used:**
Tracking user actions for undo/redo, navigation history

### **Example:**
```cpp
// Action Stack
stack<string> actionHistory;

// User creates FIRs
actionHistory.push("Created FIR-1");
actionHistory.push("Updated FIR-1");
actionHistory.push("Created FIR-2");

// User clicks "Undo"
string lastAction = actionHistory.top();  // "Created FIR-2"
actionHistory.pop();  // Remove it
// Undo: Delete FIR-2
```

### **Real Scenario:**
```
👤 User Actions:
   1. Create FIR-1 (theft)
   2. Update complainant phone
   3. Add IPC section 379
   4. Create FIR-2 (assault)
   5. Oops! Want to undo step 4

Stack State:
   [Create FIR-2]      ← Top (most recent)
   [Add IPC 379]
   [Update phone]
   [Create FIR-1]      ← Bottom (oldest)

🔙 Undo clicked:
   - Pop "Create FIR-2"
   - Reverse the action
   - Delete FIR-2
```

### **Code Location:**
`backend/activity_tracker.cpp` (planned feature)

---

## 6️⃣ Vector/Array - All FIRs List

### **Where Used:**
Displaying **all FIRs** in chronological order, dashboard statistics

### **Example:**
```cpp
// All FIRs stored in order
vector<FIRRecord> allFIRs = {fir1, fir2, fir3, fir4, fir5};

// Display all FIRs
for (auto& fir : allFIRs) {
    cout << fir.id << " - " << fir.complainantName << endl;
}

// Get recent 5 FIRs
vector<FIRRecord> recentFIRs(allFIRs.end() - 5, allFIRs.end());
```

### **Real Scenario:**
```
👤 User Action: Click "View All FIRs" button
🔍 C++ Backend:

Vector: [FIR-1] [FIR-2] [FIR-3] [FIR-4] [FIR-5]
           ↓       ↓       ↓       ↓       ↓
Display in order on dashboard:

📋 All FIRs (5 total)
┌──────────┬─────────────┬──────────┬────────────┐
│ FIR ID   │ Complainant │ District │ Status     │
├──────────┼─────────────┼──────────┼────────────┤
│ FIR-1    │ Rajesh      │ Mumbai   │ Closed     │
│ FIR-2    │ Suresh      │ Delhi    │ Pending    │
│ FIR-3    │ Mukesh      │ Chennai  │ Investigating │
│ FIR-4    │ Ramesh      │ Kolkata  │ Pending    │
│ FIR-5    │ Vijay       │ Bangalore│ Closed     │
└──────────┴─────────────┴──────────┴────────────┘
```

### **Code Location:**
`backend/fir_server.cpp` - Lines 234 (getAllRecords)

---

## 🎯 Complete FIR Creation Flow with Data Structures

### **Step-by-Step Example:**

```
👤 USER: Creates new FIR

Step 1: User enters "Raj" in complainant name
├─ 📊 Trie autocomplete activated
├─ Suggests: ["Rajesh", "Ravi", "Rakesh"]
└─ User selects: "Rajesh"

Step 2: User enters phone "9876543210"
├─ ✅ Validation: Regex check (10 digits)
└─ Valid! Proceed

Step 3: User submits FIR
├─ 🆔 Generate ID: "FIR-1234"
├─ 📊 Store in AVL Tree: O(log n) balanced insertion
├─ 📊 Store in Hash Map: O(1) instant access
├─ 📊 Add name to Trie: For future autocomplete
├─ 📊 Add to Vector: Chronological order
└─ ✅ Success!

Step 4: User searches "FIR-1234"
├─ 📊 Hash Map lookup: O(1) instant retrieval
└─ 📄 Display full FIR details

Step 5: User types "Raj" in search
├─ 📊 Trie autocomplete: O(m) where m=3
├─ Shows all FIRs with "Raj" names
└─ Fast suggestions!
```

---

## 📁 File Structure with Data Structures

```
backend/
├── fir_server.cpp              # Main server
│   ├── AVLTree class           # Lines 114-240
│   ├── Trie class             # Lines 242-295
│   ├── unordered_map          # Line 303 (firMap)
│   └── vector                 # Line 234 (getAllRecords)
│
├── data_structures.hpp         # Advanced DS
│   ├── Graph class            # Criminal networks
│   ├── Stack class            # Activity history
│   └── Custom DS              # Future enhancements
│
└── oop_concepts.hpp           # OOP examples
    ├── Law classes            # Inheritance
    ├── User classes           # Polymorphism
    └── FIR classes           # Encapsulation
```

---

## 🚀 Performance Comparison

| Operation | Without DS | With Optimized DS | Improvement |
|-----------|-----------|-------------------|-------------|
| Search FIR by ID | O(n) = 1000 ops | O(log n) = 10 ops | **100x faster** |
| Autocomplete name | O(n×m) | O(m) | **1000x faster** |
| Get FIR instantly | O(n) | O(1) | **Instant** |
| Find criminal network | Not possible | O(V+E) | **New feature** |
| List all FIRs | O(n) | O(n) | Same (optimal) |

**Example with 10,000 FIRs:**
- Linear search: 10,000 comparisons
- AVL Tree: 14 comparisons (log₂ 10,000 ≈ 13.3)
- Hash Map: 1 lookup

---

## 💡 Key Takeaways

1. **AVL Tree** - Sorted storage, fast search by ID
2. **Trie** - Smart autocomplete for names
3. **Hash Map** - Instant FIR retrieval
4. **Graph** - Criminal network analysis
5. **Stack** - Undo/Redo functionality
6. **Vector** - Chronological FIR list

Each data structure solves a **specific problem** efficiently! 🎯
