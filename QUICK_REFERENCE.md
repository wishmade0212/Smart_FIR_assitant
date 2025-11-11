# ⚡ QUICK REFERENCE - FIR Assistant

## 🎯 Choose Your Version (Pick ONE)

```
┌─────────────────────────────────────────────────────┐
│  🤖 AI-POWERED (Recommended)                       │
│  File: index_ai.html                                │
│  Setup: 5 minutes (free API key)                    │
│  Best: Natural language search                      │
│                                                      │
│  GET KEY: https://console.groq.com                  │
│  EDIT: app_api_ai.js line 17                        │
│  OPEN: index_ai.html                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📚 PURE JAVASCRIPT                                 │
│  File: index.html                                   │
│  Setup: None                                        │
│  Best: Learning data structures                     │
│                                                      │
│  OPEN: index.html (that's it!)                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🏗️ C++ BACKEND                                    │
│  File: index_api.html + backend/                    │
│  Setup: 10 minutes (build required)                 │
│  Best: Production deployment                        │
│                                                      │
│  BUILD: cd backend && ./setup.sh                    │
│  RUN: cd build && ./fir_server                      │
│  OPEN: index_api.html                               │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 5-Minute AI Setup

```bash
# Step 1: Get FREE API key
→ Visit: https://console.groq.com
→ Sign up (Google/Email)
→ Create API Key
→ Copy: gsk_abc123...

# Step 2: Add to code
→ Open: app_api_ai.js
→ Find line 17: apiKey: 'YOUR_GROQ_API_KEY_HERE'
→ Replace with: apiKey: 'gsk_abc123...'
→ Save file

# Step 3: Run
→ Open: index_ai.html
→ Login: admin / police123
→ Type: search ipc kill
→ 🎉 Done!
```

---

## 📖 Test Queries

### Keywords (Works in ALL versions):
```
search ipc kill
search ipc theft
search ipc fraud
search ipc assault
search ipc rape
```

### Natural Language (AI ONLY):
```
search ipc someone tried to kill me
search ipc my phone was stolen
search ipc hit by a car and injured
search ipc boss not paying salary
search ipc threatened to leak my photos
```

---

## 🔐 Login Credentials

```
Admin (Police):
  Username: admin
  Password: police123
  Can: Create FIRs, View all, Search IPC

User (Public):
  Username: user
  Password: user123
  Can: Search IPC only
```

---

## 💡 Common Commands

```
help              → Show all commands
search ipc QUERY  → Search IPC sections
list ipc          → Show all IPC sections
create fir        → Create new FIR (admin only)
list firs         → Show all FIRs (admin only)
fir ID            → Show specific FIR (admin only)
logout            → Logout
```

---

## 📊 Feature Comparison (Quick)

| Feature | Pure JS | AI | C++ |
|---------|---------|-----|-----|
| Setup | ✅ None | ⚡ 5min | 🔧 10min |
| Natural Language | ❌ | ✅ | ❌ |
| Offline | ✅ | ❌ | ✅ |
| Speed | ⚡⚡⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡⚡⚡ |
| Production | ❌ | ⚠️ | ✅ |

---

## 🐛 Troubleshooting

### AI not working?
```
Check 1: API key in app_api_ai.js line 17
Check 2: Key starts with "gsk_"
Check 3: Browser console (F12) for errors
```

### C++ backend not working?
```
Check 1: Run setup.sh first
Check 2: Server running? (./fir_server)
Check 3: Port 8080 available?
```

### Pure JS not working?
```
Check 1: Open correct file (index.html)
Check 2: Browser console (F12) for errors
```

---

## 📚 Documentation Files

```
QUICKSTART_AI.md          → AI setup guide (5 min)
API_INTEGRATION_GUIDE.md  → All API options
VERSION_COMPARISON.md     → Detailed comparison
README_CPP.md             → C++ backend guide
START_HERE.md             → Original guide
```

---

## 🎯 Your Problem → Solution

### Problem:
```javascript
// ❌ Static IPC data hardcoded
const sections = [
  {section: "302", keywords: ["kill", "murder"]},
  // ...not scalable
];
```

### Solution:
```javascript
// ✅ AI understands natural language
searchIPCWithAI("someone killed my friend")
// Returns: IPC 302, 304, 307 with context

// ✅ Fallback to static if AI fails
// ✅ Cache for performance
// ✅ FREE API (Groq)
```

---

## ⚙️ Data Structures Used

```
Trie:        O(m) - Keyword prefix search
HashMap:     O(1) - Direct ID lookup
AVL Tree:    O(log n) - Ordered indexing
Graph:       O(1) - Related FIRs
```

---

## 🔥 Pro Tips

1. **First time?** Start with Pure JS (instant)
2. **Real users?** Use AI version (best UX)
3. **Production?** Use C++ backend (scalable)
4. **Learning?** Read all 3 implementations!

---

## 🎁 What You Get

✅ 3 complete working versions
✅ Authentication system
✅ 17+ IPC sections
✅ AI integration (Groq)
✅ C++ backend with REST API
✅ 4 data structures
✅ Comprehensive documentation

---

## 📞 Quick Help

```
🤖 AI Setup:        → QUICKSTART_AI.md
📖 API Guide:       → API_INTEGRATION_GUIDE.md
🏗️ C++ Backend:    → README_CPP.md
📊 Comparison:      → VERSION_COMPARISON.md
```

---

## 🚀 Get Started NOW!

```bash
# Fastest (0 seconds):
open index.html

# Best (5 minutes):
open QUICKSTART_AI.md
# Get API key → Edit app_api_ai.js → Open index_ai.html

# Production (10 minutes):
cd backend && ./setup.sh && cd build && ./fir_server
open index_api.html
```

---

**Ready? Pick a version above and start! 🎉**
