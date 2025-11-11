# 🚀 Quick Start - AI-Powered FIR Assistant

## ⚡ 5-Minute Setup

### Step 1: Get Free Groq API Key (1 minute)

1. Visit: **https://console.groq.com**
2. Sign up with Google/Email (free)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_...`)

### Step 2: Add API Key (30 seconds)

Open `app_api_ai.js` and find line 17:

```javascript
groq: {
    apiKey: 'YOUR_GROQ_API_KEY_HERE', // ← Replace this
```

Replace with your actual key:

```javascript
groq: {
    apiKey: 'gsk_abc123xyz...', // ← Your key here
```

### Step 3: Open and Test (30 seconds)

1. Open `index_ai.html` in your browser
2. Login: `admin` / `police123`
3. Try: **"search ipc kill"**
4. See AI-powered results! 🎉

---

## 🎯 What You Get

### ✅ **AI-Powered Features**

1. **Natural Language Understanding**
   - ❌ Old: Only exact keyword match
   - ✅ New: "someone killed my friend" → Murder laws

2. **Context-Aware Search**
   - Understands scenarios: "hit by a car and injured"
   - Explains punishments in detail
   - Suggests related sections

3. **Smart Fallback**
   - If AI fails → Uses static database
   - No downtime, always works!

4. **Performance**
   - Caches AI responses
   - First search: ~2 seconds
   - Cached search: Instant!

---

## 📊 Compare: Static vs AI

### **Static Database** (ipc_data.js)
```
User types: "kill"
→ Searches keywords array
→ Returns: IPC 302, 304, 307
→ Speed: Instant
→ Limitation: Only exact keyword matches
```

### **AI Database** (Groq API)
```
User types: "someone tried to kill me"
→ AI analyzes context
→ Returns: IPC 307 (Attempt to murder) + explanation
→ Speed: ~2 seconds (then cached)
→ Benefit: Understands natural language!
```

---

## 🧪 Test Queries

Try these in the app:

### Basic Keywords:
- `search ipc kill`
- `search ipc theft`
- `search ipc fraud`
- `search ipc assault`

### Natural Language (AI only):
- `search ipc someone stole my phone`
- `search ipc hit by a car and injured`
- `search ipc threatened to leak my photos`
- `search ipc someone cheated me in online transaction`

---

## 🔧 Configuration Options

Edit `app_api_ai.js` to customize:

```javascript
const AI_CONFIG = {
    enabled: true,              // Set false to disable AI
    provider: 'groq',           // Future: 'openai', 'gemini'
    fallbackToStatic: true,     // Use static if AI fails
    cacheResults: true          // Cache for speed
};
```

---

## 📂 File Structure

```
FIR/
├── index_ai.html          ← Open this (AI version)
├── app_api_ai.js          ← Add API key here
├── styles.css             ← Shared styles
│
├── index.html             ← Pure JS version (no API)
├── index_api.html         ← C++ backend version
│
└── backend/               ← C++ server (optional)
    ├── server.cpp
    └── ...
```

---

## 🎁 Three Versions Available

### **1. Pure JavaScript** (index.html)
- ✅ No setup, works offline
- ✅ Good for learning data structures
- ❌ Static IPC data only

### **2. AI-Powered** (index_ai.html) ⭐ **RECOMMENDED**
- ✅ Natural language search
- ✅ Smart AI responses
- ✅ Fallback to static data
- ⚠️ Requires API key (free)

### **3. C++ Backend** (index_api.html + backend/)
- ✅ Production-ready
- ✅ Better performance
- ✅ Server-side processing
- ⚠️ Requires building backend

---

## ❓ Troubleshooting

### AI not working?

**Check 1: API Key**
```javascript
// In app_api_ai.js, line 17
apiKey: 'gsk_...'  // Must start with 'gsk_'
```

**Check 2: Browser Console**
```
Press F12 → Console tab
Look for: "🤖 Searching with AI for: kill"
```

**Check 3: Network**
```
F12 → Network tab → Look for request to:
https://api.groq.com/openai/v1/chat/completions
```

### Common Issues:

1. **"AI disabled, using static backend"**
   - API key not set or invalid
   - Check if key starts with `gsk_`

2. **"Groq API error: 401"**
   - Invalid API key
   - Get new key from console.groq.com

3. **"Failed to parse AI response"**
   - AI returned invalid JSON
   - Fallback to static data activated automatically

---

## 🚀 Next Steps

1. ✅ Get Groq API key
2. ✅ Add to `app_api_ai.js`
3. ✅ Open `index_ai.html`
4. ✅ Test with "search ipc kill"
5. 🎉 Enjoy AI-powered IPC search!

---

## 📚 Resources

- **Groq Console**: https://console.groq.com
- **API Documentation**: See `API_INTEGRATION_GUIDE.md`
- **Backend Setup**: See `README_CPP.md`

---

## 💡 Pro Tips

1. **First search is slow?**
   - AI takes ~2 seconds first time
   - Results are cached for instant repeat searches

2. **Want offline mode?**
   - Set `enabled: false` in AI_CONFIG
   - App will use static database

3. **Want to add more APIs?**
   - See `API_INTEGRATION_GUIDE.md`
   - Supports OpenAI, Gemini, Hugging Face

4. **Production deployment?**
   - Move API key to backend (never expose in frontend)
   - Use environment variables
   - Add rate limiting

---

**Built with ❤️ using:**
- 🤖 Groq AI (Mixtral-8x7B)
- 🌳 Data Structures (Trie, AVL, Graph, HashMap)
- 🎨 Vanilla JavaScript
- 💅 Modern CSS

---

**Questions?** Check `API_INTEGRATION_GUIDE.md` for detailed documentation!
