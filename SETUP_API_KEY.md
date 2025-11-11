# 🔑 Quick API Key Setup (2 Minutes)

## Current Status: ⚠️ AI Disabled

Your FIR Assistant is using **static keyword matching** instead of AI because the API key is not configured.

---

## 🚀 Get FREE Groq API Key (2 minutes)

### Step 1: Sign Up (30 seconds)
1. Open: **https://console.groq.com**
2. Click "Sign Up"
3. Sign up with Google/GitHub (instant - no credit card needed)

### Step 2: Create API Key (30 seconds)
1. After login, click **"API Keys"** in left sidebar
2. Click **"Create API Key"** button
3. Give it a name: "FIR Assistant"
4. Click "Create"
5. **Copy the key** (starts with `gsk_` followed by random characters)

### Step 3: Add to Your Code (30 seconds)
1. Open file: `app_professional.js`
2. Find line 13:
   ```javascript
   apiKey: 'YOUR_GROQ_API_KEY_HERE',
   ```
3. Replace with your key (example format):
   ```javascript
   apiKey: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
   ```
   ⚠️ **Note**: Replace the x's with your actual API key from Groq console
4. Save the file
5. Refresh your browser

### Step 4: Test It! (30 seconds)
In your FIR app, type:
```
search ipc murder
```

You should see:
```
🤖 AI-Powered Search Results
Using: Groq API (mixtral-8x7b-32768)
```

---

## ✅ Quick Test Commands

After adding API key, test with:

1. **Search IPC**:
   ```
   search ipc murder
   search ipc theft
   search ipc suicide
   ```

2. **Create FIR** (Step 3 will use AI):
   ```
   create fir
   [Enter name]
   [Enter contact]
   "Someone killed my brother"  ← AI will suggest IPC sections!
   ```

---

## 🔒 Security Note

**Important**: Your API key should be kept private!

### For Development (Current Setup):
- ✅ Keep `app_professional.js` with placeholder
- ✅ Add real key only on your local machine
- ✅ Don't commit real API key to GitHub

### For Production:
Use environment variables or a config file:

1. Create `config.js` (already in .gitignore):
   ```javascript
   const API_CONFIG = {
       groqApiKey: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
   };
   ```
   ⚠️ Replace x's with your real API key

2. Load it in `index.html`:
   ```html
   <script src="config.js"></script>
   <script src="app_professional.js"></script>
   ```

3. Update `app_professional.js`:
   ```javascript
   apiKey: window.API_CONFIG?.groqApiKey || 'YOUR_GROQ_API_KEY_HERE',
   ```

---

## 🆓 Groq API Limits (FREE Tier)

- **Requests**: 14,400 per day (600 per hour)
- **Tokens**: Generous limits
- **Speed**: Ultra-fast (faster than GPT-4)
- **Cost**: **100% FREE** ✅

Perfect for your FIR Assistant!

---

## ❓ Troubleshooting

### Issue 1: Still seeing "AI is disabled"
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
2. Hard refresh (Ctrl+F5 / Cmd+Shift+R)
3. Check console for errors (F12 → Console tab)

### Issue 2: "Invalid API Key" error
**Solution**:
1. Make sure you copied the entire key (starts with `gsk_`)
2. No extra spaces before/after the key
3. Key is inside quotes: `'gsk_...'`

### Issue 3: "API Rate Limit"
**Solution**:
- Groq free tier: 14,400 requests/day
- If exceeded, wait 1 hour or upgrade (unlikely for FIR usage)

### Issue 4: AI returns weird responses
**Solution**:
1. Check temperature setting (line 16):
   ```javascript
   temperature: 0.2,  // Lower = more precise (0.0 - 1.0)
   ```
2. If too random, reduce to 0.1
3. If too robotic, increase to 0.5

---

## 🎯 What You'll Get With AI:

### Before (Static):
```
User: "my friend attempted suicide"
System: Unknown command
```

### After (With AI):
```
User: "my friend attempted suicide"
OR during FIR Step 3: "my friend attempted suicide"

🤖 Top 3 IPC Suggestions:
  1. IPC 309: Attempt to commit suicide - Up to 1 year
  2. IPC 306: Abetment of suicide - Up to 10 years  
  3. IPC 107: Abetment - As per main offense

Select 1, 2, or 3, or type custom IPC section:
```

---

## 📞 Need Help?

**Can't get API key?**
- Groq signup issues? Try different browser
- Email verification pending? Check spam folder
- Still stuck? Use fallback (static mode works fine, just less intelligent)

**API key working?**
Test in console (F12):
```javascript
console.log(AI_CONFIG.groq.apiKey);
// Should show your key, not 'YOUR_GROQ_API_KEY_HERE'
```

---

## 🚀 Ready?

1. ✅ Go to: https://console.groq.com
2. ✅ Sign up (30 sec)
3. ✅ Get API key (30 sec)
4. ✅ Add to line 13 of `app_professional.js`
5. ✅ Save & refresh
6. ✅ Test with: `search ipc murder`

**Your AI-powered FIR Assistant will be ready!** 🎉

---

**Alternative**: If you want to test **right now** without API key, I can enable a **demo mode** that simulates AI responses. Let me know!
