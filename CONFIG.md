# 🔐 Configuration Guide

## Quick Setup (5 minutes)

### Step 1: Get Groq API Key (FREE)
1. Visit: https://console.groq.com
2. Sign up/Login (free)
3. Go to API Keys section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

### Step 2: Get EmailJS Credentials (FREE)
1. Visit: https://www.emailjs.com
2. Sign up/Login (free)
3. Create an email service
4. Create an email template with `{{verification_code}}` variable
5. Get your credentials:
   - Service ID
   - Template ID  
   - Public Key

### Step 3: Configure the Application

Open `app_professional.js` and update these lines:

**Line 13 - Groq API Key:**
```javascript
apiKey: 'YOUR_GROQ_API_KEY_HERE', // Replace with your gsk_... key
```

**Lines 23-25 - EmailJS Config:**
```javascript
serviceId: 'YOUR_SERVICE_ID',
templateId: 'YOUR_TEMPLATE_ID',
publicKey: 'YOUR_PUBLIC_KEY',
```

### Step 4: Test
1. Open `index.html` in browser
2. Register a new user
3. Check email for verification code
4. Try creating FIR with keywords like "murder", "theft"
5. Verify AI suggestions appear

## Features Enabled by API Keys

### With Groq API Key:
- ✅ AI-powered IPC suggestions
- ✅ Smart crime analysis
- ✅ Context-aware recommendations
- ✅ 70+ IPC sections understanding

### Without Groq API Key:
- ⚠️ Falls back to keyword matching
- ⚠️ Limited IPC suggestions
- ⚠️ No AI analysis

### With EmailJS:
- ✅ Email verification for registration
- ✅ Secure user authentication
- ✅ Verification codes

### Without EmailJS:
- ⚠️ Registration won't work
- ⚠️ No email verification

## Security Notes
- Never commit API keys to GitHub
- Keep your keys private
- Rotate keys if exposed
- Use environment variables in production
