# ✅ EMAILJS SETUP CHECKLIST

Print this or keep it open while setting up!

---

## 🎯 WHAT YOU'LL GET

After completing this checklist:
- Service ID
- Template ID  
- Public Key

Then paste them into `app_professional.js` and you're done!

---

## 📝 STEP-BY-STEP CHECKLIST

### □ STEP 1: Create Account
- [ ] Go to: https://dashboard.emailjs.com/sign-up
- [ ] Click "Sign up with Google"
- [ ] ✅ You're now logged in

---

### □ STEP 2: Get Service ID
- [ ] Go to: Email Services (left sidebar)
- [ ] Click: "Add New Service"
- [ ] Select: "Gmail"
- [ ] Click: "Connect Account"
- [ ] Login with Gmail
- [ ] Allow permissions
- [ ] **COPY & SAVE**: Service ID

```
┌──────────────────────────────────────┐
│ My Service ID:                       │
│                                      │
│ service_9btsc1x        │
│                                      │
└──────────────────────────────────────┘
```

---

### □ STEP 3: Get Template ID
- [ ] Go to: Email Templates (left sidebar)
- [ ] Click: "Create New Template"
- [ ] Paste this in "Content" box:

```
Subject: Your FIR Assistant Verification Code

Hello,

Your verification code is:

🔐 {{verification_code}}

Valid for 10 minutes.

Best regards,
FIR Assistant Team
© {{year}}
```

- [ ] In Settings (right side):
  - [ ] To Email: `{{to_email}}`
  - [ ] From Name: `FIR Assistant`
- [ ] Click: "Save"
- [ ] **COPY & SAVE**: Template ID

```
┌──────────────────────────────────────┐
│ My Template ID:                      │
│                                      │
│ template_eein4ye      │
│                                      │
└──────────────────────────────────────┘
```

---

### □ STEP 4: Get Public Key
- [ ] Go to: Account (left sidebar)
- [ ] Click: "General" tab
- [ ] Find: "Public Key" section
- [ ] **COPY & SAVE**: Public Key

```
┌──────────────────────────────────────┐
│ My Public Key:                       │
│                                      │
│ BGdkuu47slb_fXcWU   │
│                                      │
└──────────────────────────────────────┘
```

---

### □ STEP 5: Update Code
- [ ] Open file: `app_professional.js`
- [ ] Find lines: 20-23
- [ ] Replace these values:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_9btsc1x  ',      // ← Paste Service ID here
    templateId: 'template_eein4ye  ',    // ← Paste Template ID here
    publicKey: 'BGdkuu47slb_fXcWU',      // ← Paste Public Key here
    enabled: true                      // ← Change to true
};
```

**AFTER PASTING:**
```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_9btsc1x ',       // ✅ Your ID
    templateId: 'template_eein4ye ',     // ✅ Your ID
    publicKey: 'BGdkuu47slb_fXcWU',         // ✅ Your Key
    enabled: true                       // ✅ TRUE!
};
```

- [ ] **SAVE FILE**: Cmd+S (Mac) or Ctrl+S (Windows)
- [ ] **REFRESH BROWSER**: Press F5

---

## 🧪 TESTING CHECKLIST

- [ ] Open: `index_professional.html` in browser
- [ ] Click: "Create Account"
- [ ] Fill in: Your REAL email address
- [ ] Click: "Register"
- [ ] Wait: 10-30 seconds
- [ ] Check: Email inbox (and spam folder)
- [ ] Find: Email with subject "Your FIR Assistant Verification Code"
- [ ] Copy: 6-digit code from email
- [ ] Enter: Code in verification screen
- [ ] Click: "Verify"
- [ ] ✅ SUCCESS: You're now logged in!

---

## ⚠️ TROUBLESHOOTING

### If you see: "Email service not configured"
- [ ] Check: `enabled: true` (not false)
- [ ] Check: All 3 IDs pasted (not still saying YOUR_SERVICE_ID)
- [ ] Save file again
- [ ] Refresh browser

### If you see: "Invalid credentials"
- [ ] Go back to EmailJS dashboard
- [ ] Copy all 3 credentials AGAIN
- [ ] Make sure no extra spaces
- [ ] Paste carefully

### If NO email arrives:
- [ ] Check spam/junk folder
- [ ] Wait 1-2 minutes
- [ ] Check EmailJS dashboard → History tab
- [ ] Verify template has `{{to_email}}` in "To Email" field

---

## 📊 YOUR CREDENTIALS (Save These!)

```
┌─────────────────────────────────────────────┐
│                                             │
│ Service ID:  service___________________    │
│                                             │
│ Template ID: template__________________    │
│                                             │
│ Public Key:  ___________________________   │
│                                             │
│ Enabled:     true  ✓                       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎉 COMPLETION CHECKLIST

All done when you can check these:

- [ ] ✅ I have all 3 credentials
- [ ] ✅ I pasted them into app_professional.js
- [ ] ✅ I changed enabled to true
- [ ] ✅ I saved the file
- [ ] ✅ I refreshed the browser
- [ ] ✅ I tested with my real email
- [ ] ✅ I received the verification email
- [ ] ✅ The code worked and I logged in

---

## 🚀 YOU'RE DONE!

Now your FIR Assistant has:
- ✅ Professional email verification
- ✅ Real codes sent to user inboxes
- ✅ Production-ready authentication
- ✅ FREE (200 emails/month)

**Congratulations! 🎊**

---

**Questions?** See: EMAILJS_SETUP_GUIDE.md
**Quick Reference?** See: QUICK_START.md
