# Testing Guide for FIR Smart Assistant

## Quick Test Steps

### 1. Test User (Public) Role
1. Login with:
   - Username: `user`
   - Password: `user123`
2. Try these commands:
   - `search ipc kill` → Should show murder-related sections (302, 304, 307)
   - `search ipc theft` → Should show theft-related sections (379, 380, 392)
   - `search ipc assault` → Should show assault sections (323, 324, 325, 354)
   - `search ipc fraud` → Should show cheating section (420)
   - `list all ipc` → Shows all IPC sections
3. Try admin command (should be blocked):
   - `create fir` → Should show "Admin access required"

### 2. Test Admin (Police) Role
1. Logout and login with:
   - Username: `admin`
   - Password: `police123`
2. Test IPC search (same as user):
   - `search ipc kill`
   - `search ipc theft`
3. Test FIR creation:
   - Type: `create fir`
   - Follow wizard:
     - Complainant: `John Doe`
     - Suspect: `Jane Smith`
     - Location: `Downtown`
     - Description: `Theft of mobile phone`
   - Should create FIR successfully
4. Test FIR search:
   - `find fir by id <id from above>`
   - `search complainant john`
   - `search suspect jane`
   - `list status open`
   - `stats`
5. Load sample data:
   - Click "Load sample data" button
   - Try: `search complainant Alice`
   - Try: `search suspect Bob Lee`

### 3. Test Data Structures
Open browser console (F12) and run:
```javascript
// Access the store
const { store, ipcStore } = window.__FIR;

// Test Trie prefix search
store.searchComplainant('ali'); // Should find "Alice Johnson"

// Test AVL tree
store.getById(1); // Fast O(log n) lookup

// Test Graph relations
store.related(1); // Should show FIR #2 (related)

// Test IPC keyword search
ipcStore.searchByKeyword('kill'); // Returns murder sections
ipcStore.searchByKeyword('ro'); // Returns robbery (prefix match)
```

## Expected Behaviors

### User Role
- ✅ Can search IPC sections by keyword
- ✅ Can list all IPC sections
- ❌ Cannot create FIRs
- ❌ Cannot view FIR records
- ❌ No admin buttons visible

### Admin Role
- ✅ Can do everything user can
- ✅ Can create FIRs with wizard
- ✅ Can search/view FIR records
- ✅ Can load sample data
- ✅ Can export/import JSON

## Data Structure Features

1. **Trie** - O(m) prefix search where m = query length
   - Used for: complainant names, suspect names, IPC keywords
   - Example: "ali" matches "Alice Johnson"

2. **HashMap** - O(1) direct lookup
   - Used for: FIR by ID storage

3. **AVL Tree** - O(log n) balanced search
   - Used for: ordered FIR index by ID

4. **Graph** - O(1) adjacency lookup
   - Used for: related FIRs connections
   - Example: FIR #1 ↔ FIR #2 (bidirectional)

## Common Issues & Solutions

**Issue**: Blank screen
- **Solution**: Check browser console for errors, ensure all JS files loaded

**Issue**: IPC search returns nothing
- **Solution**: Try partial keywords (e.g., "kil" instead of "killing")

**Issue**: Cannot create FIR
- **Solution**: Ensure logged in as admin, follow wizard steps in order

**Issue**: Sample data already loaded
- **Solution**: Refresh page to reset, or just continue with existing data
