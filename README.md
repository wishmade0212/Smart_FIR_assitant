# 🚔 FIR Assistant - Professional AI Powered System

Professional FIR (First Information Report) management system with **email verification** and **AI-powered IPC search**.

## ✨ Features
- 🔐 **Email Verification** - Real verification codes sent to user emails (EmailJS)
- 🤖 **AI-Powered IPC Search** - Natural language Indian Penal Code search (Groq API)
- 👮 **Role-Based Access** - Police Officer and Public User roles
- 📝 **FIR Management** - Create, view, and manage FIR records
- 💾 **Local Storage** - Data persists in browser localStorage
- 🎨 **Professional UI** - Modern gradient design with animations

---

## 🚀 Quick Start

### Option 1: Use Latest Professional Version (Recommended)

**File**: `index_professional.html`

1. **Setup EmailJS** (2 minutes - Required for email verification):
   - Follow `SETUP_CHECKLIST.md` for step-by-step guide
   - Get free credentials from https://dashboard.emailjs.com
   - Update `app_professional.js` lines 22-26 with your credentials

2. **Open Application**:
   ```bash
   open index_professional.html
   ```

3. **Register** with your real email and get verification code!

### Option 2: Use Original Version (No Email Required)

**File**: `index.html`

Pre-configured demo accounts:
- **Admin**: username: `admin`, password: `police123`
- **User**: username: `user`, password: `user123`

---

## 📂 File Structure

### Main Application Files
```
index_professional.html      # ⭐ Latest version with email verification
app_professional.js          # Professional version logic
index.html                   # Original version (simpler, no email)
app.js                       # Original version logic
styles.css                   # Shared styling
```

### Setup Guides (For Professional Version)
```
SETUP_CHECKLIST.md          # ⭐ START HERE! Quick setup
QUICK_START.md              # Quick reference guide
EMAILJS_SETUP_GUIDE.md      # Detailed email setup
README_EMAIL_SETUP.md       # Email configuration overview
```

### Backend (Optional - C++ REST API)
```
backend/
├── server.cpp              # C++ REST API server
├── trie.hpp                # Trie data structure
├── avl_tree.hpp           # AVL tree
├── CMakeLists.txt         # Build configuration
└── setup.sh               # Setup script
```

---

## ⚙️ Configuration (Professional Version)

### 1. EmailJS Setup (Required for Email Verification)

Edit `app_professional.js` lines 22-26:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',      // From EmailJS dashboard
    templateId: 'YOUR_TEMPLATE_ID',    // From EmailJS templates
    publicKey: 'YOUR_PUBLIC_KEY',      // From EmailJS account
    enabled: true                       // Must be true!
};
```

**Get credentials**: Follow `SETUP_CHECKLIST.md` (takes 2 minutes)

### 2. Groq AI Setup (Optional - For AI Search)

Edit `app_professional.js` line 13:

```javascript
apiKey: 'YOUR_GROQ_API_KEY_HERE'  // Get free at: https://console.groq.com
```

**Without AI**: App falls back to static IPC database (works fine!)

---

## 🧪 Testing

### Professional Version (index_professional.html)

**Create New Account**:
1. Click "Create Account"
2. Enter your **real email** address
3. Check inbox for 6-digit code
4. Enter code to verify
5. Login!

**Demo Accounts** (pre-verified):
- Police: `admin@fir.gov.in` / `police123`
- Public: `user@demo.com` / `user123`

### Original Version (index.html)

- Admin: `admin` / `police123`
- User: `user` / `user123`

---

## 📖 Usage

### IPC Search (All Users)
```
Commands:
search ipc <keyword>    # Search IPC sections
list ipc                # View all sections
help                    # Show help
```

**Examples**:
- `search ipc theft` → Sections 379, 380, 392
- `search ipc murder` → Sections 302, 304, 307

### FIR Management (Police Only)
```
Commands:
create fir             # Create new FIR
list firs              # View all FIRs
fir <FIR-ID>          # View specific FIR
```

---

## 🔐 Data Storage

**Where is data stored?**
- ✅ Browser `localStorage` (your computer only)
- ✅ Persists after closing browser
- ❌ NOT synced across devices
- ❌ Cleared when you clear browser data

**What is stored?**
- User accounts (email, password, role)
- FIR records
- User preferences

---

## 🌐 GitHub & Deployment

### Pushing to GitHub

**Data Storage**:
- User accounts are stored **locally** (in each user's browser)
- Your registered accounts won't transfer to others
- Each user creates their own account

**EmailJS Credentials**:
⚠️ **IMPORTANT**: Your EmailJS credentials in `app_professional.js` will be visible!

**Options**:

1. **Keep credentials** (Simple):
   - Others can use your EmailJS account
   - They'll use your 200 emails/month quota
   - Emails sent from your Gmail

2. **Remove credentials** (Secure):
   - Replace credentials with placeholders before pushing
   - Users must add their own EmailJS credentials
   - Each user uses their own email quota

### GitHub Pages Deployment

1. Push repository to GitHub
2. Settings → Pages → Select main branch
3. ✅ Live website!

**Users must**:
- Add their own EmailJS credentials
- Register their own accounts
- Data stored locally in their browser

---

## 🆘 Troubleshooting

### Email Not Received
- ✅ Check spam/junk folder
- ✅ Wait 30-60 seconds (first email may be slow)
- ✅ Verify EmailJS template has `{{to_email}}` field
- ✅ Check EmailJS dashboard → History tab

### "Email service not configured"
- ✅ Open `app_professional.js`
- ✅ Check lines 22-26 have real credentials (not YOUR_SERVICE_ID)
- ✅ Verify `enabled: true`
- ✅ Save file and refresh browser (F5)

### AI Search Not Working
- ✅ Add Groq API key OR
- ✅ App will use static IPC database (works without AI)

### Lost Data After Browser Refresh
- ✅ Data should persist (localStorage)
- ✅ Don't clear browser data/cookies
- ✅ Use same browser

---

## 📊 Free Tier Limits

**EmailJS**:
- ✅ 200 emails/month
- ✅ 50 emails/day
- ✅ No credit card required
- ✅ FREE forever

**Groq API**:
- ✅ Free tier available
- ✅ Rate limits apply
- ✅ No credit card required

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Email**: EmailJS API (client-side email sending)
- **AI**: Groq API (Mixtral-8x7b model)
- **Storage**: Browser localStorage
- **No Backend**: Fully client-side (optional C++ backend available)

---

## 🔒 Security Notes

⚠️ **This is a demo/prototype**. For production:

**Current Limitations**:
- EmailJS credentials visible in source code
- Passwords stored in plain text in localStorage
- No server-side validation
- Data only in browser (not backed up)

**For Production Use**:
- ✅ Use backend server with database
- ✅ Hash passwords (bcrypt)
- ✅ Store credentials server-side
- ✅ Add rate limiting
- ✅ Use HTTPS
- ✅ Add CSRF protection

---

## 📚 Documentation

### Setup Guides (Professional Version)
- `SETUP_CHECKLIST.md` - ⭐ Quick setup checklist (START HERE!)
- `QUICK_START.md` - Quick reference guide
- `EMAILJS_SETUP_GUIDE.md` - Detailed email setup
- `README_EMAIL_SETUP.md` - Email overview

### Architecture (Original Version)
- `CODE_INDEX.md` - Complete navigation guide
- `SUMMARY.md` - Project overview
- `FEATURES.md` - Feature breakdown
- `ARCHITECTURE.md` - System design

---

## 🎉 What's New in Professional Version

**v2.0 (Professional)**:
- ✅ Real email verification with EmailJS
- ✅ AI-powered IPC search with Groq
- ✅ Professional UI with gradients
- ✅ Registration system
- ✅ Email verification codes
- ✅ Better error handling

**v1.0 (Original)**:
- ✅ Basic authentication
- ✅ FIR management
- ✅ Static IPC search
- ✅ Data structures (Trie, AVL, Graph)

---

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📄 License

Open source - Free to use for learning and development

---

## 🎓 Learning Resources

This project demonstrates:
- Client-side authentication
- Email integration (EmailJS)
- AI API integration (Groq)
- LocalStorage usage
- Role-based access control
- Modern UI/UX design
- Data structures (Trie, AVL, HashMap, Graph)

---

## 📞 Support

**Setup Help**: See `SETUP_CHECKLIST.md`  
**Email Issues**: See `EMAILJS_SETUP_GUIDE.md`  
**General Questions**: Open an issue

---

**Happy Coding! 🚀**
