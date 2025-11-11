# User Journey Flowcharts

## Journey 1: Public User Learns About Laws

```
START: User wants to know about theft laws
  ↓
┌───────────────────────┐
│ Open index.html       │
│ in browser            │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ See login screen      │
│                       │
│ Enter: user/user123   │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Click [Login]         │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Authenticated ✓       │
│ Role: Public User     │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ See welcome message:  │
│ "You can search IPC   │
│  sections..."         │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Type in chat:         │
│ "search ipc theft"    │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot responds with:    │
│ • Section 379 (3 yrs) │
│ • Section 380 (7 yrs) │
│ • Section 392 (10 yrs)│
└───────────────────────┘
  ↓
┌───────────────────────┐
│ User learns about:    │
│ • Legal definitions   │
│ • Punishments         │
│ • Related keywords    │
└───────────────────────┘
  ↓
END: User is informed about legal consequences
```

## Journey 2: Police Officer Creates FIR

```
START: Officer receives complaint
  ↓
┌───────────────────────┐
│ Open FIR Assistant    │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Login as admin        │
│ admin/police123       │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Click [Load sample]   │
│ (optional - for demo) │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Type: "create fir"    │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot: "Complainant     │
│       name?"          │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Officer types:        │
│ "John Doe"            │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot: "Suspect name?"  │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Officer types:        │
│ "Jane Smith"          │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot: "Location?"      │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Officer types:        │
│ "Downtown Mall"       │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot: "Description?"   │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Officer types:        │
│ "Theft of phone"      │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ FIR Created! ✅       │
│ ID: 1731283200000     │
│ Status: open          │
│ Date: auto-filled     │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ FIR stored in:        │
│ • HashMap (by ID)     │
│ • Trie (by names)     │
│ • AVL Tree (ordered)  │
│ • Graph (relations)   │
└───────────────────────┘
  ↓
END: FIR registered in system
```

## Journey 3: Officer Searches Existing Cases

```
START: Officer needs to check prior cases
  ↓
┌───────────────────────┐
│ Already logged in     │
│ as admin              │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Type: "search suspect │
│        Bob Lee"       │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ System performs:      │
│ Trie.startsWith("bob")│
│ O(m) complexity       │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Returns FIR IDs:      │
│ [1, 3]                │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Fetches from HashMap: │
│ O(1) per ID           │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot displays:         │
│ • FIR #1: Theft       │
│ • FIR #3: Assault     │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Officer sees pattern: │
│ "Repeat offender!"    │
└───────────────────────┘
  ↓
END: Officer makes informed decision
```

## Journey 4: Unauthorized Access Attempt

```
START: Public user tries admin command
  ↓
┌───────────────────────┐
│ Logged in as: user    │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ User types:           │
│ "create fir"          │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ System checks:        │
│ currentUser.role      │
│ = "user"              │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Command requires:     │
│ role = "admin"        │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Access DENIED ⛔      │
└───────────────────────┘
  ↓
┌───────────────────────┐
│ Bot responds:         │
│ "Admin access         │
│  required"            │
└───────────────────────┘
  ↓
END: Security maintained
```

## Decision Tree: Command Routing

```
User sends message
  ↓
┌─────────────────────────────────────┐
│ Is user logged in?                  │
└─────────────────────────────────────┘
  ↓ No                    ↓ Yes
[Redirect to login]    [Continue]
                          ↓
              ┌───────────────────────┐
              │ Parse command         │
              └───────────────────────┘
                          ↓
              ┌───────────────────────┐
              │ Is FIR wizard active? │
              └───────────────────────┘
                ↓ Yes          ↓ No
        [Handle wizard]   [Parse command]
                                ↓
                    ┌───────────┴───────────┐
                    ↓                       ↓
            [IPC command?]          [FIR command?]
                    ↓                       ↓
              [Allow both]        [Check role: admin?]
                    ↓                       ↓
              [Execute]           ↓ Yes        ↓ No
                            [Execute]      [Block ⛔]
```

## System State Transitions

```
┌─────────────┐
│ Not Loaded  │
└─────────────┘
      ↓ Page loads
┌─────────────┐
│ Login Screen│
└─────────────┘
      ↓ Valid credentials
┌─────────────┐
│ Authenticated│─────┐
└─────────────┘      │
      ↓               │
┌─────────────┐      │
│ Main App    │      │
│ (Role-based)│      │
└─────────────┘      │
      ↓               │
┌─────────────┐      │
│ Interacting │      │
│ with Bot    │      │
└─────────────┘      │
      ↓               │
┌─────────────┐      │
│ Logout      │      │
└─────────────┘      │
      ↓               │
      └───────────────┘
      Back to Login Screen
```

## Data Flow: IPC Search

```
User: "search ipc kill"
  ↓
┌────────────────────────────┐
│ 1. Input Sanitization      │
│    toLowerCase() → "kill"  │
└────────────────────────────┘
  ↓
┌────────────────────────────┐
│ 2. Trie Traversal          │
│    k → ki → kil → kill     │
│    Collect IDs at each node│
└────────────────────────────┘
  ↓
┌────────────────────────────┐
│ 3. Return Indices          │
│    [0, 1, 2]               │
└────────────────────────────┘
  ↓
┌────────────────────────────┐
│ 4. Map to Sections         │
│    0 → Section 302         │
│    1 → Section 304         │
│    2 → Section 307         │
└────────────────────────────┘
  ↓
┌────────────────────────────┐
│ 5. Format Output           │
│    HTML with details       │
└────────────────────────────┘
  ↓
┌────────────────────────────┐
│ 6. Display in Chat         │
│    User sees results       │
└────────────────────────────┘
```

## Performance Comparison: Search Methods

```
Naive String Search (No Data Structure)
  For each record:
    Check if keyword in text
  O(n × m) where n=records, m=text length
  Example: 1000 records × 100 chars = 100,000 ops
  ❌ SLOW for large datasets

Trie-Based Search (Our Implementation)
  Traverse tree: O(k) where k=keyword length
  Return pre-computed IDs: O(1)
  Example: "kill" = 4 chars
  ✅ FAST regardless of dataset size
```

## Wizard State Machine

```
State: IDLE
  ↓ "create fir"
State: AWAITING_COMPLAINANT
  ↓ User provides name
State: AWAITING_SUSPECT
  ↓ User provides name
State: AWAITING_LOCATION
  ↓ User provides location
State: AWAITING_DESCRIPTION
  ↓ User provides description
State: CREATING
  ↓ Store in data structures
State: COMPLETE
  ↓ Show confirmation
State: IDLE (reset)
```

## Error Handling Flow

```
User Action
  ↓
┌─────────────────┐
│ Try Block       │
│ • Parse command │
│ • Execute logic │
│ • Format output │
└─────────────────┘
  ↓ Error occurs
┌─────────────────┐
│ Catch Block     │
│ • Log error     │
│ • Show friendly │
│   message       │
└─────────────────┘
  ↓
User sees: "Error: [message]"
System remains stable
```

## Complete User Flow Map

```
┌─────────┐
│  START  │
└─────────┘
     ↓
┌─────────────┐
│   Landing   │
│   (Login)   │
└─────────────┘
     ↓
   Choose
     ↓
 ┌───┴───┐
 ↓       ↓
[User]  [Admin]
 ↓       ↓
IPC     Full
Only    Access
 ↓       ↓
┌──────┬───────┬──────┐
↓      ↓       ↓      ↓
Search View  Create Search
IPC    IPC   FIR    FIRs
       All
```

This complete set of flowcharts shows every major path through the system!
