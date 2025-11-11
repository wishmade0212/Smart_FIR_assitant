/**
 * FIR Assistant - Professional Version with Email Authentication
 * Features: Registration, Email Verification, AI-Powered Search
 */

// ========================================
// Configuration
// ========================================
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

const EMAIL_CONFIG = {
    serviceId: 'service_9btsc1x',      // ✅ Step 2: Service ID (fixed - removed extra space)
    templateId: 'template_eein4ye',    // ✅ Step 3: Template ID
    publicKey: 'BGdkuu47slb_fXcWU',    // ✅ Step 4: Public Key
    enabled: true                       // ✅ Step 5: ENABLED! (changed to true)
};

/* 
📧 QUICK SETUP (2 minutes):
══════════════════════════════════════════════════════════════

1️⃣ SIGN UP (30 sec):
   → Go to: https://dashboard.emailjs.com/sign-up
   → Sign up with Google (instant)

2️⃣ CONNECT GMAIL (30 sec):
   → Dashboard → "Email Services" → "Add New Service"
   → Choose "Gmail" → Connect your account
   → Copy Service ID (like: service_abc1234)
   → Paste above in line 9

3️⃣ CREATE TEMPLATE (60 sec):
   → Dashboard → "Email Templates" → "Create New Template"
   → Copy this template:

   ┌─────────────────────────────────────┐
   │ Subject: Your Verification Code     │
   │                                     │
   │ Hello,                              │
   │                                     │
   │ Your FIR Assistant verification     │
   │ code is: {{verification_code}}     │
   │                                     │
   │ Valid for 10 minutes.               │
   │                                     │
   │ Best regards,                       │
   │ FIR Assistant Team                  │
   └─────────────────────────────────────┘

   → Settings:
     - To Email: {{to_email}}
     - From Name: FIR Assistant
   
   → Save → Copy Template ID (like: template_xyz5678)
   → Paste above in line 10

4️⃣ GET PUBLIC KEY (10 sec):
   → Dashboard → "Account" → "General"
   → Copy Public Key (like: Ab12Cd34Ef56Gh78)
   → Paste above in line 11

5️⃣ ENABLE (5 sec):
   → Change line 12: enabled: true
   → Save this file
   → Refresh browser
   → ✅ DONE!

══════════════════════════════════════════════════════════════
Total time: 2 minutes | Cost: FREE | Emails: 200/month
══════════════════════════════════════════════════════════════
*/

// ========================================
// Data Storage
// ========================================
const aiCache = new Map();
const userDatabase = JSON.parse(localStorage.getItem('fir_users') || '{}');
const firStorage = JSON.parse(localStorage.getItem('fir_records') || '[]');
let firIdCounter = firStorage.length + 1;

// Static IPC data
const STATIC_IPC_SECTIONS = [
    {"section": "302", "title": "Murder", "description": "Punishment for murder", "punishment": "Death or life imprisonment", "keywords": ["kill", "murder", "death", "homicide", "killing"]},
    {"section": "304", "title": "Culpable homicide not amounting to murder", "description": "Punishment for culpable homicide", "punishment": "Imprisonment up to 10 years or life", "keywords": ["kill", "death", "homicide", "culpable"]},
    {"section": "307", "title": "Attempt to murder", "description": "Attempt to commit murder", "punishment": "Imprisonment up to 10 years", "keywords": ["attempt", "kill", "murder", "try to kill"]},
    {"section": "323", "title": "Punishment for voluntarily causing hurt", "description": "Causing hurt voluntarily", "punishment": "Imprisonment up to 1 year or fine", "keywords": ["hurt", "assault", "hit", "beat", "attack", "injury"]},
    {"section": "324", "title": "Voluntarily causing hurt by dangerous weapons", "description": "Causing hurt with dangerous weapons", "punishment": "Imprisonment up to 3 years", "keywords": ["hurt", "weapon", "knife", "assault", "attack"]},
    {"section": "325", "title": "Punishment for voluntarily causing grievous hurt", "description": "Causing grievous hurt", "punishment": "Imprisonment up to 7 years", "keywords": ["hurt", "grievous", "serious injury", "assault"]},
    {"section": "354", "title": "Assault or criminal force to woman", "description": "Assault or criminal force with intent to outrage modesty", "punishment": "Imprisonment up to 2 years", "keywords": ["assault", "woman", "modesty", "molestation", "harassment"]},
    {"section": "376", "title": "Punishment for rape", "description": "Sexual assault", "punishment": "Imprisonment not less than 10 years, may extend to life", "keywords": ["rape", "sexual assault", "sexual violence"]},
    {"section": "379", "title": "Punishment for theft", "description": "Theft of movable property", "punishment": "Imprisonment up to 3 years or fine", "keywords": ["theft", "steal", "stealing", "rob", "loot"]},
    {"section": "380", "title": "Theft in dwelling house", "description": "Theft in a building used as dwelling", "punishment": "Imprisonment up to 7 years", "keywords": ["theft", "burglary", "house theft", "steal from house"]},
    {"section": "392", "title": "Punishment for robbery", "description": "Robbery or dacoity", "punishment": "Imprisonment up to 10 years", "keywords": ["robbery", "rob", "dacoity", "armed theft", "loot"]},
    {"section": "420", "title": "Cheating and dishonestly inducing delivery of property", "description": "Cheating", "punishment": "Imprisonment up to 7 years", "keywords": ["cheat", "fraud", "deception", "dishonest", "scam"]},
    {"section": "504", "title": "Intentional insult", "description": "Intentional insult to provoke breach of peace", "punishment": "Imprisonment up to 2 years or fine", "keywords": ["insult", "provoke", "abuse", "verbal abuse"]},
    {"section": "506", "title": "Punishment for criminal intimidation", "description": "Criminal intimidation", "punishment": "Imprisonment up to 2 years or fine", "keywords": ["threat", "intimidation", "threaten", "blackmail"]}
];

let currentUser = null;
let pendingUser = null;
let verificationCode = null;
let firCreationState = null;

// ========================================
// Data Structures for FIR Management
// ========================================

// Stack implementation for Suspect search (LIFO - Most Recent First)
class FIRStack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    toArray() {
        return [...this.items].reverse(); // LIFO - most recent first
    }
    
    clear() {
        this.items = [];
    }
}

// Array implementation for Complainant search (Chronological order)
class FIRArray {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    filter(predicate) {
        return this.items.filter(predicate);
    }
    
    find(predicate) {
        return this.items.find(predicate);
    }
    
    toArray() {
        return [...this.items]; // Original order preserved
    }
    
    length() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}

// Initialize data structures
const complainantArray = new FIRArray();
const suspectStack = new FIRStack();

// ========================================
// Email Service - Using EmailJS
// ========================================
class EmailService {
    static initialized = false;

    static initialize() {
        if (!EMAIL_CONFIG.enabled) {
            console.warn('⚠️ Email service is disabled');
            return false;
        }

        if (!EMAIL_CONFIG.publicKey || EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            console.error('❌ EmailJS not configured! Add credentials to EMAIL_CONFIG');
            return false;
        }

        if (!this.initialized) {
            emailjs.init(EMAIL_CONFIG.publicKey);
            this.initialized = true;
            console.log('✅ EmailJS initialized');
        }

        return true;
    }

    static async sendVerificationEmail(email, code) {
        console.log(`📧 Attempting to send verification code to ${email}`);
        console.log(`🔧 Config check:`, {
            serviceId: EMAIL_CONFIG.serviceId,
            templateId: EMAIL_CONFIG.templateId,
            publicKey: EMAIL_CONFIG.publicKey,
            enabled: EMAIL_CONFIG.enabled
        });

        // Check if EmailJS is configured
        if (!this.initialize()) {
            alert(`⚠️ EMAIL SERVICE NOT CONFIGURED

Please follow these steps:

1️⃣ Open app_professional.js
2️⃣ Follow the 2-minute setup guide at line 20
3️⃣ Add your EmailJS credentials:
   - Service ID
   - Template ID  
   - Public Key
4️⃣ Set enabled: true
5️⃣ Save and refresh

Your temporary code: ${code}`);
            return false;
        }

        try {
            // Prepare email template parameters
            const templateParams = {
                to_email: email,
                verification_code: code,
                user_name: email.split('@')[0], // Extract name from email
                year: new Date().getFullYear()
            };

            console.log('📤 Sending email via EmailJS...');
            console.log('📋 Template params:', templateParams);

            // Send email using EmailJS
            const response = await emailjs.send(
                EMAIL_CONFIG.serviceId,
                EMAIL_CONFIG.templateId,
                templateParams
            );

            console.log('📬 EmailJS response:', response);

            if (response.status === 200) {
                console.log('✅ Email sent successfully!');
                alert(`✅ Verification code sent to:\n${email}\n\nPlease check your inbox (and spam folder).\n\nCode is valid for 10 minutes.`);
                return true;
            } else {
                throw new Error(`EmailJS returned status: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Email sending failed:', error);
            console.error('❌ Error details:', {
                message: error.message,
                text: error.text,
                status: error.status
            });
            
            let errorMsg = '❌ Failed to send email';
            
            if (error.text && error.text.includes('Invalid')) {
                errorMsg += '\n\n⚠️ Invalid EmailJS credentials!\n\nPlease check:\n- Service ID\n- Template ID\n- Public Key\n\nSee app_professional.js line 20 for setup guide.';
            } else {
                errorMsg += `\n\nError: ${error.text || error.message || 'Unknown error'}`;
            }

            errorMsg += `\n\nTemporary code for testing:\n🔐 ${code}`;

            alert(errorMsg);
            return false;
        }
    }
}

// ========================================
// AI IPC Service
// ========================================
class AIIPCService {
    async searchIPC(keyword) {
        if (AI_CONFIG.cacheResults && aiCache.has(keyword.toLowerCase())) {
            console.log('📦 Using cached AI response');
            return aiCache.get(keyword.toLowerCase());
        }

        if (!AI_CONFIG.enabled || !AI_CONFIG.groq.apiKey || AI_CONFIG.groq.apiKey === 'YOUR_GROQ_API_KEY_HERE') {
            console.log('🔧 AI disabled, using static data');
            return this.searchStatic(keyword);
        }

        try {
            console.log('🤖 Searching with AI:', keyword);
            const result = await this.searchWithAI(keyword);
            
            if (AI_CONFIG.cacheResults) {
                aiCache.set(keyword.toLowerCase(), result);
            }
            
            return result;
        } catch (error) {
            console.error('❌ AI failed:', error);
            if (AI_CONFIG.fallbackToStatic) {
                return this.searchStatic(keyword);
            }
            throw error;
        }
    }

    async searchWithAI(keyword) {
        const response = await fetch(AI_CONFIG.groq.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.groq.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.groq.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert on Indian Penal Code. Return relevant IPC sections as JSON array only. Format: [{"section": "302", "title": "Murder", "description": "...", "punishment": "...", "keywords": ["kill"]}]`
                    },
                    {
                        role: 'user',
                        content: keyword
                    }
                ],
                temperature: AI_CONFIG.groq.temperature,
                max_tokens: AI_CONFIG.groq.maxTokens
            })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const sections = JSON.parse(jsonContent);

        return {
            success: true,
            sections: sections || [],
            source: 'ai',
            model: AI_CONFIG.groq.model
        };
    }

    async searchStatic(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const matchingSections = STATIC_IPC_SECTIONS.filter(section => 
            section.keywords.some(kw => kw.includes(lowerKeyword))
        );
        
        return {
            success: true,
            sections: matchingSections,
            source: 'static'
        };
    }
}

const aiService = new AIIPCService();

// ========================================
// Authentication Functions
// ========================================
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function handleRegister(name, email, role, password) {
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
        alert('❌ Please enter a valid email address');
        return false;
    }

    // Check if user exists
    if (userDatabase[email]) {
        alert('❌ Email already registered. Please login.');
        return false;
    }

    // Store pending user
    pendingUser = {
        name,
        email,
        role,
        password,
        verified: false,
        createdAt: new Date().toISOString()
    };

    // Generate and send verification code
    verificationCode = generateVerificationCode();
    await EmailService.sendVerificationEmail(email, verificationCode);

    return true;
}

function verifyCode(enteredCode) {
    if (enteredCode === verificationCode) {
        // Save user to database
        userDatabase[pendingUser.email] = {
            ...pendingUser,
            verified: true
        };
        localStorage.setItem('fir_users', JSON.stringify(userDatabase));
        
        // Login user
        currentUser = {
            email: pendingUser.email,
            name: pendingUser.name,
            role: pendingUser.role,
            verified: true
        };
        
        pendingUser = null;
        verificationCode = null;
        
        return true;
    }
    return false;
}

function handleLogin(email, password) {
    const user = userDatabase[email];
    
    if (!user) {
        alert('❌ Email not found. Please register first.');
        return false;
    }
    
    if (user.password !== password) {
        alert('❌ Incorrect password.');
        return false;
    }
    
    if (!user.verified) {
        alert('❌ Please verify your email first.');
        return false;
    }
    
    currentUser = {
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified
    };
    
    return true;
}

function logout() {
    currentUser = null;
    showScreen('loginScreen');
    addMessage('system', '✅ Logged out successfully. Have a great day! 👋');
}

// ========================================
// Screen Navigation
// ========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showApp() {
    showScreen('appScreen');
    
    const userInfo = document.getElementById('userInfo');
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    userInfo.innerHTML = `
        <div class="user-profile">
            <div class="user-avatar">${initials}</div>
            <div>
                <div style="font-weight: 600;">${currentUser.name}</div>
                <div style="font-size: 12px; opacity: 0.9;">
                    ${currentUser.role === 'admin' ? '👮 Police Officer' : '👤 Public User'}
                    <span class="verified-badge">✓ Verified</span>
                </div>
            </div>
        </div>
        <button onclick="logout()" class="btn-logout">Logout</button>
    `;
    
    addMessage('system', `Welcome, ${currentUser.name}! 👋`);
    addMessage('system', `Role: <strong>${currentUser.role === 'admin' ? 'Police Officer' : 'Public User'}</strong> <span class="verified-badge">✓ Verified</span>`);
    
    const aiStatus = AI_CONFIG.enabled && AI_CONFIG.groq.apiKey !== 'YOUR_GROQ_API_KEY_HERE' 
        ? '🤖 AI-powered search is <strong>enabled</strong>!' 
        : '⚠️ AI is disabled. Using static database.';
    addMessage('system', aiStatus);
    
    addMessage('system', 'Type "help" to see available commands.');
}

// ========================================
// Command Parser
// ========================================
async function parseCommand(input) {
    const cmd = input.toLowerCase().trim();
    
    if (cmd === 'logout') {
        logout();
        return;
    }
    
    if (cmd === 'help') {
        showHelp();
        return;
    }
    
    if (cmd.startsWith('search ipc ') || cmd.startsWith('ipc ')) {
        const keyword = cmd.replace('search ipc ', '').replace('ipc ', '').trim();
        if (keyword) {
            await handleIPCSearch(keyword);
        } else {
            addMessage('system', 'Please provide a keyword. Example: search ipc theft');
        }
        return;
    }
    
    if (cmd === 'list ipc' || cmd === 'all ipc') {
        handleListAllIPC();
        return;
    }
    
    if (currentUser.role !== 'admin') {
        addMessage('system', '🚫 Access denied. This command requires admin privileges.');
        return;
    }
    
    if (cmd === 'create fir') {
        startFIRCreation();
        return;
    }
    
    if (cmd === 'list firs' || cmd === 'all firs') {
        handleListFIRs();
        return;
    }
    
    // NEW: Search FIR by Complainant Name (Array - Chronological)
    if (cmd.startsWith('search complainant ') || cmd.startsWith('complainant ')) {
        const name = input.replace(/search complainant /i, '').replace(/complainant /i, '').trim();
        handleSearchByComplainant(name);
        return;
    }
    
    // NEW: Search FIR by Suspect Name (Stack - Most Recent First)
    if (cmd.startsWith('search suspect ') || cmd.startsWith('suspect ')) {
        const name = input.replace(/search suspect /i, '').replace(/suspect /i, '').trim();
        handleSearchBySuspect(name);
        return;
    }
    
    if (cmd.startsWith('fir ')) {
        const firId = cmd.replace('fir ', '').trim();
        handleGetFIR(firId);
        return;
    }
    
    addMessage('system', `❓ Unknown command: "${input}". Type "help" for available commands.`);
}

// ========================================
// IPC Search
// ========================================
async function handleIPCSearch(keyword) {
    addMessage('user', `search ipc ${keyword}`);
    addMessage('system', `🔍 Searching IPC sections for: "${keyword}"...`);
    
    try {
        const result = await aiService.searchIPC(keyword);
        
        if (!result.success || result.sections.length === 0) {
            addMessage('system', `No IPC sections found for keyword: "${keyword}"`);
            return;
        }
        
        const sourceIcon = result.source === 'ai' ? '🤖' : '📚';
        const sourceName = result.source === 'ai' ? `AI (${result.model})` : 'Static Database';
        addMessage('system', `${sourceIcon} Found ${result.sections.length} section(s) using ${sourceName}:`);
        
        result.sections.forEach(section => {
            const keywords = section.keywords ? section.keywords.join(', ') : 'N/A';
            const message = `
                <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-left: 4px solid #667eea; padding: 15px; margin: 10px 0; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong>IPC Section ${section.section}</strong>
                        <span style="background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px;">${section.title}</span>
                    </div>
                    <p><strong>Description:</strong> ${section.description}</p>
                    <p><strong>Punishment:</strong> ${section.punishment}</p>
                    <p><strong>Keywords:</strong> <em>${keywords}</em></p>
                </div>
            `;
            addMessage('system', message);
        });
        
    } catch (error) {
        addMessage('system', `❌ Error searching IPC: ${error.message}`);
    }
}

function handleListAllIPC() {
    addMessage('user', 'list ipc');
    addMessage('system', `📚 Showing all ${STATIC_IPC_SECTIONS.length} IPC sections:`);
    
    STATIC_IPC_SECTIONS.forEach(section => {
        const message = `
            <div style="background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #667eea;">
                <strong>IPC ${section.section}:</strong> ${section.title} - ${section.punishment}
            </div>
        `;
        addMessage('system', message);
    });
}

// ========================================
// FIR Management - Enhanced with AI Suggestions
// ========================================
function startFIRCreation() {
    addMessage('user', 'create fir');
    firCreationState = { step: 1, data: {}, suggestedIPC: [] };
    addMessage('system', '📝 Creating new FIR - Smart Assistant Mode');
    addMessage('system', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addMessage('system', '<strong>Step 1/7:</strong> Enter complainant name:');
}

async function handleFIRCreationStep(input) {
    const step = firCreationState.step;
    
    if (step === 1) {
        // Step 1: Complainant Name
        firCreationState.data.complainantName = input;
        firCreationState.step = 2;
        addMessage('system', '<strong>Step 2/7:</strong> Enter complainant contact number:');
        
    } else if (step === 2) {
        // Step 2: Complainant Contact
        firCreationState.data.complainantContact = input;
        firCreationState.step = 3;
        addMessage('system', '<strong>Step 3/7:</strong> Describe the incident (be specific, include keywords like "kill", "theft", "assault"):');
        
    } else if (step === 3) {
        // Step 3: Incident Description + Auto IPC Suggestion
        firCreationState.data.incidentDescription = input;
        
        addMessage('system', '🔍 Analyzing incident description...');
        
        // Auto-detect IPC sections from keywords
        const suggestedSections = await analyzeIncidentAndSuggestIPC(input);
        firCreationState.suggestedIPC = suggestedSections;
        
        if (suggestedSections.length > 0) {
            addMessage('system', '<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;"><strong>💡 Suggested IPC Sections:</strong></div>');
            suggestedSections.forEach((section, index) => {
                const msg = `
                    <div style="background: white; border-left: 4px solid #ff9800; padding: 12px; margin: 8px 0; border-radius: 5px; cursor: pointer;" onclick="quickCommand('${index + 1}')">
                        <strong>${index + 1}. IPC ${section.section} - ${section.title}</strong>
                        <br><small style="color: #666;">${section.description}</small>
                        <br><strong>Punishment:</strong> ${section.punishment}
                    </div>
                `;
                addMessage('system', msg);
            });
            addMessage('system', '<strong>Step 4/7:</strong> Enter suspect name (or type "unknown"):');
        } else {
            addMessage('system', '⚠️ No IPC sections auto-detected. You can manually enter later.');
            addMessage('system', '<strong>Step 4/7:</strong> Enter suspect name (or type "unknown"):');
        }
        
        firCreationState.step = 4;
        
    } else if (step === 4) {
        // Step 4: Suspect Name + Criminal History Check
        firCreationState.data.suspectName = input;
        
        if (input.toLowerCase() !== 'unknown') {
            addMessage('system', '🔎 Checking suspect\'s criminal history...');
            
            // Search for previous FIRs involving this suspect
            const previousCases = searchSuspectHistory(input);
            
            if (previousCases.length > 0) {
                addMessage('system', `<div style="background: #ffebee; border: 2px solid #f44336; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong>⚠️ CRIMINAL HISTORY FOUND!</strong>
                    <br><br>
                    <strong>${input}</strong> has <strong>${previousCases.length}</strong> previous case(s):
                </div>`);
                
                previousCases.forEach((fir, index) => {
                    const caseMsg = `
                        <div style="background: white; border-left: 4px solid #f44336; padding: 12px; margin: 8px 0; border-radius: 5px;">
                            <strong>Case ${index + 1}: ${fir.id}</strong>
                            <br><strong>IPC:</strong> ${fir.ipcSection}
                            <br><strong>Status:</strong> ${fir.status}
                            <br><strong>Date:</strong> ${fir.dateRegistered}
                            <br><small>${fir.incidentDescription?.substring(0, 100)}...</small>
                        </div>
                    `;
                    addMessage('system', caseMsg);
                });
                
                addMessage('system', `<div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                    <strong>⚖️ Recommendation:</strong> Consider stricter punishment due to repeat offense.
                </div>`);
            } else {
                addMessage('system', `<div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin: 10px 0;">
                    ✅ No previous criminal records found for <strong>${input}</strong> (First-time offender)
                </div>`);
            }
        }
        
        firCreationState.step = 5;
        addMessage('system', '<strong>Step 5/7:</strong> Enter suspect age:');
        
    } else if (step === 5) {
        // Step 5: Suspect Age
        firCreationState.data.suspectAge = input;
        firCreationState.step = 6;
        addMessage('system', '<strong>Step 6/7:</strong> Enter suspect address:');
        
    } else if (step === 6) {
        // Step 6: Suspect Address
        firCreationState.data.suspectAddress = input;
        firCreationState.step = 7;
        
        // Show suggested IPC sections again
        if (firCreationState.suggestedIPC.length > 0) {
            addMessage('system', '<div style="background: #e3f2fd; padding: 10px; border-radius: 5px;"><strong>💡 Suggested IPC Sections (from Step 3):</strong></div>');
            firCreationState.suggestedIPC.forEach((section, index) => {
                addMessage('system', `${index + 1}. IPC ${section.section} - ${section.title}`);
            });
            addMessage('system', '<strong>Step 7/7:</strong> Select IPC section number (e.g., 1) or type custom (e.g., 302):');
        } else {
            addMessage('system', '<strong>Step 7/7:</strong> Enter IPC section (e.g., 302):');
        }
        
    } else if (step === 7) {
        // Step 7: IPC Section Selection
        const ipcInput = input.trim();
        
        // Check if user selected from suggestions (number) or custom IPC
        if (!isNaN(ipcInput) && firCreationState.suggestedIPC.length > 0) {
            const index = parseInt(ipcInput) - 1;
            if (index >= 0 && index < firCreationState.suggestedIPC.length) {
                const selected = firCreationState.suggestedIPC[index];
                firCreationState.data.ipcSection = selected.section;
                firCreationState.data.ipcTitle = selected.title;
                firCreationState.data.ipcPunishment = selected.punishment;
            } else {
                firCreationState.data.ipcSection = ipcInput;
            }
        } else {
            firCreationState.data.ipcSection = ipcInput;
        }
        
        // Auto-generate FIR and show template
        generateAndDisplayFIR();
    }
}

// Analyze incident description and suggest IPC sections
async function analyzeIncidentAndSuggestIPC(description) {
    try {
        const result = await aiService.searchIPC(description);
        if (result.success && result.sections.length > 0) {
            return result.sections.slice(0, 3); // Top 3 suggestions
        }
    } catch (error) {
        console.error('IPC suggestion failed:', error);
    }
    
    // Fallback: keyword matching from static data
    const lowerDesc = description.toLowerCase();
    const matches = STATIC_IPC_SECTIONS.filter(section => 
        section.keywords.some(keyword => lowerDesc.includes(keyword))
    );
    
    return matches.slice(0, 3);
}

// Search suspect's criminal history
function searchSuspectHistory(suspectName) {
    const lowerName = suspectName.toLowerCase();
    return firStorage.filter(fir => 
        fir.suspectName && fir.suspectName.toLowerCase().includes(lowerName)
    );
}

// Generate professional FIR template
function generateAndDisplayFIR() {
    const fir = {
        id: 'FIR-' + firIdCounter++,
        ...firCreationState.data,
        dateRegistered: new Date().toISOString().split('T')[0],
        timeRegistered: new Date().toLocaleTimeString(),
        status: 'Registered',
        createdBy: currentUser.email,
        officerName: currentUser.name
    };
    
    // Save to storage
    firStorage.push(fir);
    localStorage.setItem('fir_records', JSON.stringify(firStorage));
    
    // Add to data structures
    // Array for complainant (chronological order)
    complainantArray.push({
        complainantName: fir.complainantName,
        firId: fir.id,
        date: fir.dateRegistered
    });
    
    // Stack for suspect (LIFO - most recent first)
    suspectStack.push({
        suspectName: fir.suspectName,
        firId: fir.id,
        date: fir.dateRegistered
    });
    
    console.log('📊 Data Structures Updated:');
    console.log('Array (Complainant):', complainantArray.toArray());
    console.log('Stack (Suspect):', suspectStack.toArray());
    
    // Display professional FIR template
    const firTemplate = `
        <div style="background: white; border: 3px solid #333; padding: 30px; margin: 20px 0; border-radius: 10px; font-family: 'Courier New', monospace; max-width: 800px;">
            <div style="text-align: center; border-bottom: 3px double #333; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1a237e;">FIRST INFORMATION REPORT</h2>
                <div style="font-size: 12px; margin-top: 5px;">Under Section 154 Cr.P.C.</div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5; width: 40%;"><strong>FIR No.</strong></td>
                    <td style="padding: 8px; border: 1px solid #333;"><strong>${fir.id}</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5;"><strong>Date of Registration</strong></td>
                    <td style="padding: 8px; border: 1px solid #333;">${fir.dateRegistered} at ${fir.timeRegistered}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5;"><strong>Police Station</strong></td>
                    <td style="padding: 8px; border: 1px solid #333;">Central Police Station</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5;"><strong>Registered By</strong></td>
                    <td style="padding: 8px; border: 1px solid #333;">${fir.officerName}</td>
                </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #2e7d32;">COMPLAINANT DETAILS</h3>
                <p><strong>Name:</strong> ${fir.complainantName}</p>
                <p><strong>Contact:</strong> ${fir.complainantContact}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #ffebee; border: 2px solid #f44336; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #c62828;">SUSPECT/ACCUSED DETAILS</h3>
                <p><strong>Name:</strong> ${fir.suspectName}</p>
                <p><strong>Age:</strong> ${fir.suspectAge} years</p>
                <p><strong>Address:</strong> ${fir.suspectAddress}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 2px solid #ff9800; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #e65100;">INCIDENT DETAILS</h3>
                <p style="text-align: justify; line-height: 1.6;">${fir.incidentDescription}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border: 2px solid #2196f3; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #0d47a1;">SECTIONS APPLIED</h3>
                <p><strong>IPC Section:</strong> ${fir.ipcSection}${fir.ipcTitle ? ' - ' + fir.ipcTitle : ''}</p>
                ${fir.ipcPunishment ? '<p><strong>Punishment:</strong> ' + fir.ipcPunishment + '</p>' : ''}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; border: 2px solid #333; border-radius: 5px;">
                <p><strong>Status:</strong> <span style="color: #4caf50; font-weight: bold;">${fir.status}</span></p>
                <p><strong>Action:</strong> Investigation Initiated</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #333; text-align: right;">
                <p><strong>Signature of Officer</strong></p>
                <p style="margin-top: 30px;">_______________________</p>
                <p style="font-size: 12px;">${fir.officerName}<br>Police Officer</p>
            </div>
        </div>
    `;
    
    addMessage('system', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addMessage('system', '<div style="text-align: center;"><strong style="color: #4caf50; font-size: 18px;">✅ FIR CREATED SUCCESSFULLY!</strong></div>');
    addMessage('system', firTemplate);
    addMessage('system', `<div style="text-align: center; padding: 15px; background: #e8f5e9; border-radius: 5px; margin: 10px 0;">
        <strong>FIR ID: ${fir.id}</strong><br>
        <small>Use command "fir ${fir.id}" to view this FIR anytime</small>
    </div>`);
    
    firCreationState = null;
}

function handleListFIRs() {
    addMessage('user', 'list firs');
    
    if (firStorage.length > 0) {
        addMessage('system', `Found ${firStorage.length} FIR(s):`);
        
        firStorage.forEach(fir => {
            const message = `
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 8px 0; border-radius: 5px;">
                    <strong>FIR ${fir.id}</strong> | ${fir.status}
                    <br>Complainant: ${fir.complainantName}
                    <br>Suspect: ${fir.suspectName}
                    <br>IPC: ${fir.ipcSection}
                </div>
            `;
            addMessage('system', message);
        });
    } else {
        addMessage('system', 'No FIRs found. Create one with "create fir" command.');
    }
}

// ========================================
// Search FIR by Complainant (Array - Chronological Order)
// ========================================
function handleSearchByComplainant(name) {
    addMessage('user', `search complainant ${name}`);
    addMessage('system', `🔍 Searching FIRs by complainant: "${name}" (Array - Chronological Order)...`);
    
    const lowerName = name.toLowerCase();
    const results = firStorage.filter(fir => 
        fir.complainantName && fir.complainantName.toLowerCase().includes(lowerName)
    );
    
    if (results.length > 0) {
        addMessage('system', `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #4caf50;">
                <strong>📊 Data Structure: Array (Chronological Order)</strong><br>
                Found ${results.length} FIR(s) filed by "${name}" in chronological order (oldest to newest)
            </div>
        `);
        
        // Display in chronological order (Array maintains insertion order)
        results.forEach((fir, index) => {
            const message = `
                <div style="background: white; border-left: 4px solid #4caf50; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong style="color: #2e7d32;">Case ${index + 1}: ${fir.id}</strong>
                        <span style="background: ${fir.status === 'Closed' ? '#f44336' : '#4caf50'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${fir.status}</span>
                    </div>
                    <p><strong>📅 Date:</strong> ${fir.dateRegistered}${fir.timeRegistered ? ' at ' + fir.timeRegistered : ''}</p>
                    <p><strong>👤 Complainant:</strong> ${fir.complainantName}</p>
                    ${fir.complainantContact ? '<p><strong>📞 Contact:</strong> ' + fir.complainantContact + '</p>' : ''}
                    <p><strong>🔴 Suspect:</strong> ${fir.suspectName}</p>
                    <p><strong>⚖️ IPC Section:</strong> ${fir.ipcSection}${fir.ipcTitle ? ' - ' + fir.ipcTitle : ''}</p>
                    <p><strong>📝 Incident:</strong> ${fir.incidentDescription?.substring(0, 150)}${fir.incidentDescription?.length > 150 ? '...' : ''}</p>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                        <button onclick="quickCommand('fir ${fir.id}')" style="background: #2196f3; color: white; border: none; padding: 6px 15px; border-radius: 5px; cursor: pointer; font-size: 12px;">View Full FIR</button>
                    </div>
                </div>
            `;
            addMessage('system', message);
        });
        
        addMessage('system', `
            <div style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center;">
                <strong>📈 Showing ${results.length} case(s) in chronological order (Array data structure)</strong>
            </div>
        `);
    } else {
        addMessage('system', `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ff9800;">
                ⚠️ No FIRs found for complainant: "${name}"
            </div>
        `);
    }
}

// ========================================
// Search FIR by Suspect (Stack - Most Recent First - LIFO)
// ========================================
function handleSearchBySuspect(name) {
    addMessage('user', `search suspect ${name}`);
    addMessage('system', `🔍 Searching FIRs by suspect: "${name}" (Stack - Most Recent First)...`);
    
    const lowerName = name.toLowerCase();
    const results = firStorage.filter(fir => 
        fir.suspectName && fir.suspectName.toLowerCase().includes(lowerName)
    );
    
    if (results.length > 0) {
        // Sort in LIFO order (most recent first) - Stack behavior
        const stackOrder = [...results].reverse();
        
        addMessage('system', `
            <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #f44336;">
                <strong>📊 Data Structure: Stack (LIFO - Last In First Out)</strong><br>
                Found ${stackOrder.length} FIR(s) against "${name}" showing most recent cases first
            </div>
        `);
        
        // Check if repeat offender
        if (stackOrder.length > 1) {
            addMessage('system', `
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ff9800;">
                    <strong>⚠️ REPEAT OFFENDER ALERT!</strong><br>
                    This suspect has ${stackOrder.length} cases on record. Latest case shown first (Stack - LIFO order)
                </div>
            `);
        }
        
        // Display in LIFO order (Stack - most recent on top)
        stackOrder.forEach((fir, index) => {
            const isLatest = index === 0;
            const message = `
                <div style="background: white; border-left: 4px solid #f44336; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); ${isLatest ? 'border: 3px solid #ff5722;' : ''}">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong style="color: #c62828;">${isLatest ? '🔥 LATEST CASE: ' : 'Case ' + (index + 1) + ': '}${fir.id}</strong>
                        <span style="background: ${fir.status === 'Closed' ? '#9e9e9e' : '#f44336'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${fir.status}</span>
                    </div>
                    ${isLatest ? '<div style="background: #ff5722; color: white; padding: 5px 10px; border-radius: 5px; margin-bottom: 10px; font-size: 12px; text-align: center;"><strong>⬆️ TOP OF STACK (Most Recent)</strong></div>' : ''}
                    <p><strong>📅 Date:</strong> ${fir.dateRegistered}${fir.timeRegistered ? ' at ' + fir.timeRegistered : ''}</p>
                    <p><strong>🔴 Suspect:</strong> ${fir.suspectName}</p>
                    ${fir.suspectAge ? '<p><strong>👤 Age:</strong> ' + fir.suspectAge + ' years</p>' : ''}
                    ${fir.suspectAddress ? '<p><strong>📍 Address:</strong> ' + fir.suspectAddress + '</p>' : ''}
                    <p><strong>👤 Complainant:</strong> ${fir.complainantName}</p>
                    <p><strong>⚖️ IPC Section:</strong> ${fir.ipcSection}${fir.ipcTitle ? ' - ' + fir.ipcTitle : ''}</p>
                    ${fir.ipcPunishment ? '<p><strong>⚖️ Punishment:</strong> ' + fir.ipcPunishment + '</p>' : ''}
                    <p><strong>📝 Incident:</strong> ${fir.incidentDescription?.substring(0, 150)}${fir.incidentDescription?.length > 150 ? '...' : ''}</p>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                        <button onclick="quickCommand('fir ${fir.id}')" style="background: #f44336; color: white; border: none; padding: 6px 15px; border-radius: 5px; cursor: pointer; font-size: 12px;">View Full FIR</button>
                    </div>
                </div>
            `;
            addMessage('system', message);
        });
        
        addMessage('system', `
            <div style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center;">
                <strong>📉 Showing ${stackOrder.length} case(s) in LIFO order (Stack data structure)</strong><br>
                <small>Most recent case is on top, oldest at bottom</small>
            </div>
        `);
        
        // Show recommendation for repeat offenders
        if (stackOrder.length >= 2) {
            addMessage('system', `
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ff9800;">
                    <strong>⚖️ RECOMMENDATION:</strong><br>
                    Due to ${stackOrder.length} previous cases, consider:
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Stricter bail conditions</li>
                        <li>Enhanced punishment as per repeat offender guidelines</li>
                        <li>Monitoring and surveillance</li>
                        <li>Referral to criminal psychology assessment</li>
                    </ul>
                </div>
            `);
        }
    } else {
        addMessage('system', `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #4caf50;">
                ✅ No previous cases found for suspect: "${name}"<br>
                <small>(First-time offender - Stack is empty for this name)</small>
            </div>
        `);
    }
}

function handleGetFIR(firId) {
    const fir = firStorage.find(f => f.id === firId);
    
    if (fir) {
        // Display full professional FIR template
        const firTemplate = `
            <div style="background: white; border: 3px solid #333; padding: 30px; margin: 20px 0; border-radius: 10px; font-family: 'Courier New', monospace; max-width: 800px;">
                <div style="text-align: center; border-bottom: 3px double #333; padding-bottom: 15px; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #1a237e;">FIRST INFORMATION REPORT</h2>
                    <div style="font-size: 12px; margin-top: 5px;">Under Section 154 Cr.P.C.</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5; width: 40%;"><strong>FIR No.</strong></td>
                        <td style="padding: 8px; border: 1px solid #333;"><strong>${fir.id}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5;"><strong>Date of Registration</strong></td>
                        <td style="padding: 8px; border: 1px solid #333;">${fir.dateRegistered}${fir.timeRegistered ? ' at ' + fir.timeRegistered : ''}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5;"><strong>Police Station</strong></td>
                        <td style="padding: 8px; border: 1px solid #333;">Central Police Station</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #333; background: #f5f5f5;"><strong>Registered By</strong></td>
                        <td style="padding: 8px; border: 1px solid #333;">${fir.officerName || fir.createdBy}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border: 2px solid #4caf50; border-radius: 5px;">
                    <h3 style="margin-top: 0; color: #2e7d32;">COMPLAINANT DETAILS</h3>
                    <p><strong>Name:</strong> ${fir.complainantName}</p>
                    ${fir.complainantContact ? '<p><strong>Contact:</strong> ' + fir.complainantContact + '</p>' : ''}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #ffebee; border: 2px solid #f44336; border-radius: 5px;">
                    <h3 style="margin-top: 0; color: #c62828;">SUSPECT/ACCUSED DETAILS</h3>
                    <p><strong>Name:</strong> ${fir.suspectName}</p>
                    ${fir.suspectAge ? '<p><strong>Age:</strong> ' + fir.suspectAge + ' years</p>' : ''}
                    ${fir.suspectAddress ? '<p><strong>Address:</strong> ' + fir.suspectAddress + '</p>' : ''}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 2px solid #ff9800; border-radius: 5px;">
                    <h3 style="margin-top: 0; color: #e65100;">INCIDENT DETAILS</h3>
                    <p style="text-align: justify; line-height: 1.6;">${fir.incidentDescription}</p>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border: 2px solid #2196f3; border-radius: 5px;">
                    <h3 style="margin-top: 0; color: #0d47a1;">SECTIONS APPLIED</h3>
                    <p><strong>IPC Section:</strong> ${fir.ipcSection}${fir.ipcTitle ? ' - ' + fir.ipcTitle : ''}</p>
                    ${fir.ipcPunishment ? '<p><strong>Punishment:</strong> ' + fir.ipcPunishment + '</p>' : ''}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; border: 2px solid #333; border-radius: 5px;">
                    <p><strong>Status:</strong> <span style="color: ${fir.status === 'Closed' ? '#f44336' : '#4caf50'}; font-weight: bold;">${fir.status}</span></p>
                    <p><strong>Action:</strong> ${fir.status === 'Closed' ? 'Case Closed' : 'Investigation Ongoing'}</p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #333; text-align: right;">
                    <p><strong>Signature of Officer</strong></p>
                    <p style="margin-top: 30px;">_______________________</p>
                    <p style="font-size: 12px;">${fir.officerName || fir.createdBy}<br>Police Officer</p>
                </div>
            </div>
        `;
        addMessage('system', firTemplate);
    } else {
        addMessage('system', `❌ FIR not found: ${firId}`);
    }
}

// ========================================
// UI Functions
// ========================================
function showHelp() {
    const role = currentUser.role;
    const commands = [
        'help - Show this help message',
        'search ipc <keyword> - Search IPC sections with AI',
        'list ipc - View all IPC sections',
        'logout - Logout from the system'
    ];
    
    if (role === 'admin') {
        commands.push(
            '',
            '👮 Admin Commands:',
            'create fir - Create a new FIR (7-step process with AI suggestions)',
            'list firs - View all FIRs',
            'fir <id> - View specific FIR details',
            '',
            '🔍 Search Commands (Data Structures):',
            'search complainant <name> - Search FIRs by complainant (Array - Chronological)',
            'search suspect <name> - Search FIRs by suspect (Stack - Most Recent First)'
        );
    }
    
    const helpMessage = `
        <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; margin: 10px 0;">
            <h3>📚 Available Commands</h3>
            ${commands.map(cmd => `<div style="margin: 5px 0;">${cmd}</div>`).join('')}
        </div>
    `;
    
    addMessage('system', helpMessage);
}

function addMessage(type, content) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `<strong>${content}</strong>`;
    } else {
        messageDiv.innerHTML = content;
    }
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function quickCommand(cmd) {
    const input = document.getElementById('commandInput');
    input.value = cmd;
    if (!cmd.endsWith(' ')) {
        document.getElementById('sendBtn').click();
    } else {
        input.focus();
    }
}

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (handleLogin(email, password)) {
            showApp();
        }
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const role = document.getElementById('registerRole').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('❌ Passwords do not match!');
            return;
        }
        
        if (await handleRegister(name, email, role, password)) {
            document.getElementById('verificationEmail').textContent = email;
            showScreen('verificationScreen');
            document.querySelector('.code-input').focus();
        }
    });
    
    // Verification code inputs
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
    
    // Verify code button
    document.getElementById('verifyCodeBtn').addEventListener('click', () => {
        const code = Array.from(codeInputs).map(input => input.value).join('');
        
        if (code.length !== 6) {
            alert('❌ Please enter all 6 digits');
            return;
        }
        
        if (verifyCode(code)) {
            alert('✅ Email verified successfully!');
            showApp();
        } else {
            alert('❌ Invalid verification code. Please try again.');
            codeInputs.forEach(input => input.value = '');
            codeInputs[0].focus();
        }
    });
    
    // Resend code
    document.getElementById('resendCodeLink').addEventListener('click', async () => {
        verificationCode = generateVerificationCode();
        await EmailService.sendVerificationEmail(pendingUser.email, verificationCode);
    });
    
    // Show register link
    document.getElementById('showRegisterLink').addEventListener('click', () => {
        showScreen('registerScreen');
    });
    
    // Show login link
    document.getElementById('showLoginLink').addEventListener('click', () => {
        showScreen('loginScreen');
    });
    
    // Command input
    document.getElementById('sendBtn').addEventListener('click', () => {
        const input = document.getElementById('commandInput');
        const value = input.value.trim();
        if (!value) return;
        
        if (firCreationState) {
            addMessage('user', value);
            handleFIRCreationStep(value);
        } else {
            parseCommand(value);
        }
        
        input.value = '';
    });
    
    document.getElementById('commandInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('sendBtn').click();
        }
    });

    // Add demo users for testing
    if (Object.keys(userDatabase).length === 0) {
        userDatabase['admin@fir.gov.in'] = {
            name: 'Police Officer',
            email: 'admin@fir.gov.in',
            role: 'admin',
            password: 'police123',
            verified: true,
            createdAt: new Date().toISOString()
        };
        userDatabase['user@demo.com'] = {
            name: 'Public User',
            email: 'user@demo.com',
            role: 'user',
            password: 'user123',
            verified: true,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('fir_users', JSON.stringify(userDatabase));
    }
});
