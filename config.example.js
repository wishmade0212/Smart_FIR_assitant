/**
 * Configuration File - Copy this to config.js and add your credentials
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file and rename to: config.js
 * 2. Add your EmailJS credentials below
 * 3. Add your Groq API key (optional)
 * 4. Save the file
 * 5. Refresh browser
 */

const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',      // Get from: https://dashboard.emailjs.com/admin
    templateId: 'YOUR_TEMPLATE_ID',    // Get from: https://dashboard.emailjs.com/admin/templates
    publicKey: 'YOUR_PUBLIC_KEY',      // Get from: https://dashboard.emailjs.com/admin/account
    enabled: false                      // Change to: true (after adding credentials)
};

const AI_CONFIG = {
    enabled: true,
    provider: 'groq',
    groq: {
        apiKey: 'YOUR_GROQ_API_KEY_HERE', // Get free at: https://console.groq.com
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'mixtral-8x7b-32768',
        temperature: 0.2,
        maxTokens: 1500
    },
    fallbackToStatic: true,
    cacheResults: true
};

// Export configs
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAIL_CONFIG, AI_CONFIG };
}
