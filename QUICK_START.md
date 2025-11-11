# ⚡ EMAILJS - 2 MINUTE QUICK START

## Step-by-Step With Screenshots Guide

---

### 🎯 What You Need
- A Gmail account
- 2 minutes of your time
- 3 pieces of information to copy

---

## 📝 THE 5 STEPS

### ✅ STEP 1: Sign Up (30 sec)
```
URL: https://dashboard.emailjs.com/sign-up

ACTION: Click "Sign up with Google"

RESULT: Instantly logged in ✓
```

---

### ✅ STEP 2: Connect Gmail (30 sec)
```
LOCATION: Left Sidebar → "Email Services"

ACTION: 
1. Click "Add New Service"
2. Select "Gmail"
3. Click "Connect Account"
4. Login to Gmail
5. Allow permissions

COPY THIS: Service ID (looks like: service_abc1234)
└─ Example: service_j8x9k2l
```

---

### ✅ STEP 3: Create Template (60 sec)
```
LOCATION: Left Sidebar → "Email Templates"

ACTION:
1. Click "Create New Template"
2. PASTE THIS TEMPLATE:

┌──────────────────────────────────────────┐
│ Subject: Your FIR Assistant Verification │
│                                          │
│ Hello,                                   │
│                                          │
│ Your verification code is:               │
│                                          │
│ 🔐 {{verification_code}}                │
│                                          │
│ Valid for 10 minutes.                    │
│                                          │
│ FIR Assistant Team                       │
│ © {{year}}                              │
└──────────────────────────────────────────┘

3. Settings (Right Panel):
   To Email: {{to_email}}
   From Name: FIR Assistant

4. Click "Save"

COPY THIS: Template ID (looks like: template_xyz5678)
└─ Example: template_m4n5p6q
```

---

### ✅ STEP 4: Get Public Key (10 sec)
```
LOCATION: Left Sidebar → "Account" → "General"

FIND: Public Key section

COPY THIS: Public Key (looks like: Ab12Cd34Ef56Gh78)
└─ Example: yB9kL3pM7qR2sT6v
```

---

### ✅ STEP 5: Update Code (30 sec)
```
FILE: app_professional.js
LINES: 20-23

CHANGE FROM:
────────────────────────────────────────
const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY',
    enabled: false
};
────────────────────────────────────────

CHANGE TO:
────────────────────────────────────────
const EMAIL_CONFIG = {
    serviceId: 'service_j8x9k2l',      // ← Your Service ID
    templateId: 'template_m4n5p6q',    // ← Your Template ID
    publicKey: 'yB9kL3pM7qR2sT6v',     // ← Your Public Key
    enabled: true                       // ← MUST BE TRUE!
};
────────────────────────────────────────

SAVE FILE: Cmd+S (Mac) or Ctrl+S (Windows)
REFRESH BROWSER: F5
```

---

## 🧪 TEST IT NOW!

```
1. Open: index_professional.html
2. Click: "Create Account"
3. Enter: Your real email + password
4. Click: "Register"
5. Check: Your email inbox
6. Enter: 6-digit code from email
7. ✅ Success!
```

---

## 📋 THE 3 THINGS YOU NEED

```
┌─────────────────────────────────────────────┐
│ 1️⃣ Service ID:  service_________          │
│    (From: Email Services tab)              │
│                                            │
│ 2️⃣ Template ID: template_________         │
│    (From: Email Templates tab)             │
│                                            │
│ 3️⃣ Public Key:  _______________           │
│    (From: Account → General)               │
└─────────────────────────────────────────────┘
```

---

## ⚠️ TROUBLESHOOTING

### Problem: "Email service not configured"
```
FIX:
✓ Check enabled: true (not false)
✓ Remove quotes: YOUR_SERVICE_ID → service_abc123
✓ Save file (Cmd+S)
✓ Refresh browser (F5)
```

### Problem: "Invalid credentials"
```
FIX:
✓ Go back to EmailJS dashboard
✓ Copy credentials again (no spaces)
✓ Make sure using LATEST credentials
✓ Check for typos
```

### Problem: "No email received"
```
FIX:
✓ Check spam folder
✓ Wait 30 seconds (emails not instant)
✓ Verify template has {{to_email}}
✓ Check EmailJS dashboard → History
```

### Problem: "Template variables not working"
```
FIX:
✓ Use double braces: {{verification_code}}
✓ Template "To Email" must be: {{to_email}}
✓ NOT your actual email address
```

---

## ✅ SUCCESS CHECKLIST

```
Before saying "it doesn't work":

[ ] I signed up at EmailJS
[ ] I connected Gmail
[ ] I created template with {{verification_code}}
[ ] I set "To Email" as {{to_email}}
[ ] I copied Service ID correctly
[ ] I copied Template ID correctly  
[ ] I copied Public Key correctly
[ ] I pasted all 3 into app_professional.js
[ ] I changed enabled to TRUE
[ ] I saved the file
[ ] I refreshed the browser
[ ] I tested with my REAL email
[ ] I checked spam folder
```

---

## 🎉 WHAT YOU GET

```
✅ Professional verification emails
✅ Real 6-digit codes sent to inbox
✅ Works within 10 seconds
✅ No backend server needed
✅ FREE (200 emails/month)
✅ Production-ready system
```

---

## 🔗 QUICK LINKS

```
Sign Up:    https://dashboard.emailjs.com/sign-up
Dashboard:  https://dashboard.emailjs.com
Email Services: https://dashboard.emailjs.com/admin
Templates:  https://dashboard.emailjs.com/admin/templates
Account:    https://dashboard.emailjs.com/admin/account
```

---

## ⏱️ ESTIMATED TIME

```
Step 1: Sign Up          → 30 seconds
Step 2: Connect Gmail    → 30 seconds
Step 3: Create Template  → 60 seconds
Step 4: Get Public Key   → 10 seconds
Step 5: Update Code      → 30 seconds
───────────────────────────────────────
TOTAL:                     2.5 minutes
```

---

## 💡 PRO TIP

```
✨ Save your credentials somewhere safe:

Service ID:  service_________
Template ID: template_________
Public Key:  _______________

So you don't need to find them again!
```

---

**That's it! 2 minutes to professional email verification! 🚀**

Need more help? Open: EMAILJS_SETUP_GUIDE.md
