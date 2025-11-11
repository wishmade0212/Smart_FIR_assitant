# 📧 EmailJS Setup Guide - 2 Minutes Setup

## Why EmailJS?
✅ **FREE** - 200 emails/month on free tier  
✅ **NO BACKEND** - Works entirely from browser  
✅ **RELIABLE** - Industry standard, used by thousands  
✅ **QUICK** - Setup takes only 2 minutes  

---

## 🚀 QUICK SETUP (Follow These Steps)

### Step 1: Sign Up (30 seconds)
1. Go to: **https://dashboard.emailjs.com/sign-up**
2. Click **"Sign up with Google"** (instant, no form filling)
3. ✅ Done! You're now logged in

---

### Step 2: Connect Your Gmail (30 seconds)

1. From the dashboard, click **"Email Services"** in the left sidebar
2. Click **"Add New Service"** button
3. Select **"Gmail"**
4. Click **"Connect Account"** 
5. Login with your Gmail account
6. Allow EmailJS to send emails on your behalf
7. **IMPORTANT**: Copy the **Service ID** that appears
   - It looks like: `service_abc1234`
   - Keep this for later!

---

### Step 3: Create Email Template (60 seconds)

1. Click **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. **Delete everything** in the template editor
4. **Copy and paste** this EXACT template:

```
Subject: Your FIR Assistant Verification Code

Content:
-------------------------------------------------

Hello,

Thank you for registering with FIR Assistant!

Your email verification code is:

🔐 {{verification_code}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
FIR Assistant Team
© {{year}}

-------------------------------------------------
```

5. In the **Settings** section on the right:
   - **To Email**: `{{to_email}}`
   - **From Name**: `FIR Assistant`
   - **From Email**: Your Gmail address (auto-filled)
   
6. Click **"Save"** button (top right)
7. **IMPORTANT**: Copy the **Template ID** 
   - It looks like: `template_xyz5678`
   - Keep this for later!

---

### Step 4: Get Public Key (10 seconds)

1. Click **"Account"** in the left sidebar
2. Click **"General"** tab
3. Find the **"Public Key"** section
4. **IMPORTANT**: Copy your **Public Key**
   - It looks like: `Ab12Cd34Ef56Gh78`
   - Keep this for later!

---

### Step 5: Add Credentials to Your Code (30 seconds)

1. Open the file: **`app_professional.js`**
2. Find lines 20-23 (EMAIL_CONFIG section)
3. Replace the placeholder values:

**BEFORE:**
```javascript
const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',      // Paste here
    templateId: 'YOUR_TEMPLATE_ID',    // Paste here  
    publicKey: 'YOUR_PUBLIC_KEY',      // Paste here
    enabled: false                      // Change to true
};
```

**AFTER (with your values):**
```javascript
const EMAIL_CONFIG = {
    serviceId: 'service_abc1234',      // Your Service ID
    templateId: 'template_xyz5678',    // Your Template ID  
    publicKey: 'Ab12Cd34Ef56Gh78',     // Your Public Key
    enabled: true                       // MUST be true!
};
```

4. **Save the file** (Cmd+S / Ctrl+S)
5. **Refresh your browser** (F5)
6. ✅ **DONE!** Email verification now works!

---

## 🧪 Test It!

1. Open `index_professional.html` in your browser
2. Click **"Create Account"**
3. Fill in your details with your **real email**
4. Click **"Register"**
5. Check your **inbox** (and spam folder)
6. Enter the **6-digit code** you received
7. ✅ Success!

---

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] ✅ I signed up for EmailJS
- [ ] ✅ I connected my Gmail account
- [ ] ✅ I created the email template with `{{verification_code}}` and `{{to_email}}`
- [ ] ✅ I copied all 3 credentials (Service ID, Template ID, Public Key)
- [ ] ✅ I pasted them into `app_professional.js` lines 20-23
- [ ] ✅ I changed `enabled: false` to `enabled: true`
- [ ] ✅ I saved the file
- [ ] ✅ I refreshed the browser

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Email service not configured" alert
**Solution**: 
- Make sure `enabled: true` in EMAIL_CONFIG
- Check that all 3 credentials are pasted (not still saying YOUR_SERVICE_ID)
- Save file and refresh browser

### Issue 2: "Invalid credentials" error
**Solution**:
- Go back to EmailJS dashboard
- Verify Service ID under "Email Services"
- Verify Template ID under "Email Templates"
- Verify Public Key under "Account > General"
- Copy them again carefully (no extra spaces)

### Issue 3: No email received
**Solution**:
- Check spam/junk folder
- Verify you connected Gmail account in EmailJS
- Make sure template has `{{to_email}}` in the "To Email" field
- Check EmailJS dashboard "History" tab for delivery status

### Issue 4: Template variables not working
**Solution**:
- Template MUST have: `{{to_email}}`, `{{verification_code}}`, `{{year}}`
- Variables use double curly braces: `{{variable_name}}`
- "To Email" field MUST be: `{{to_email}}` (not your actual email)

---

## 📊 Free Tier Limits

- **200 emails per month** - More than enough for testing!
- **50 emails per day** - Prevent spam abuse
- **No credit card required** - 100% free forever

Need more? Upgrade starts at $7/month for 1000 emails.

---

## 🎯 What You Get

After setup:
- ✅ Real emails sent to users
- ✅ Professional-looking verification emails
- ✅ 6-digit codes delivered instantly
- ✅ No backend server needed
- ✅ Works from any browser
- ✅ Production-ready email system

---

## 🆘 Still Need Help?

If you followed all steps and it still doesn't work:

1. Open browser console (F12)
2. Look for red error messages
3. Check the error text
4. Common errors:
   - "Invalid public key" → Copy Public Key again from Account > General
   - "Service not found" → Copy Service ID again from Email Services
   - "Template not found" → Copy Template ID again from Email Templates

---

## 🎉 Success!

Once working, you'll see:
- ✅ Alert: "Verification code sent to: your@email.com"
- 📧 Email arrives within 10 seconds
- 🔐 6-digit code in email
- ✅ Code works when entered

**Now you have a professional email verification system!** 🚀

---

## 📞 Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Free tier includes email support!

---

**Total Time**: 2 minutes  
**Cost**: FREE  
**Result**: Professional email verification system! ✅
