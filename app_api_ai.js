/**
 * FIR Assistant - AI-Powered STANDALONE Version with Groq API
 * This version uses Groq AI for intelligent IPC section search
 * NO BACKEND REQUIRED - Works completely in browser!
 */

// Set to null since we don't need backend for AI-only version
const API_BASE_URL = null; // Not needed for standalone AI version

// ========================================
// AI Configuration
// ========================================
const AI_CONFIG = {
    enabled: true,
    provider: 'groq', // 'groq', 'openai', 'gemini', or 'none'
    groq: {
        apiKey: 'YOUR_GROQ_API_KEY_HERE', // Get free at: https://console.groq.com
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'mixtral-8x7b-32768', // Fast and accurate
        temperature: 0.2,
        maxTokens: 1500
    },
    fallbackToStatic: true, // Use backend static data if AI fails
    cacheResults: true // Cache AI responses for performance
};

// Simple cache for AI responses
const aiCache = new Map();

// Static IPC data as fallback (no backend needed)
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
    {"section": "425", "title": "Mischief", "description": "Causing damage to property", "punishment": "Imprisonment up to 3 months or fine", "keywords": ["damage", "vandalism", "mischief", "destroy property"]},
    {"section": "427", "title": "Mischief causing damage", "description": "Mischief causing damage to property", "punishment": "Imprisonment up to 2 years or fine", "keywords": ["damage", "vandalism", "property damage"]},
    {"section": "504", "title": "Intentional insult", "description": "Intentional insult to provoke breach of peace", "punishment": "Imprisonment up to 2 years or fine", "keywords": ["insult", "provoke", "abuse", "verbal abuse"]},
    {"section": "506", "title": "Punishment for criminal intimidation", "description": "Criminal intimidation", "punishment": "Imprisonment up to 2 years or fine", "keywords": ["threat", "intimidation", "threaten", "blackmail"]},
    {"section": "511", "title": "Punishment for attempting to commit offences", "description": "Attempting to commit offences punishable with imprisonment", "punishment": "Half of longest term for the offence", "keywords": ["attempt", "trying to commit"]}
];

// In-memory FIR storage (since no backend)
const firStorage = [];
let firIdCounter = 1;

// ========================================
// AI Service
// ========================================
class AIIPCService {
    async searchIPC(keyword) {
        // Check cache first
        if (AI_CONFIG.cacheResults && aiCache.has(keyword.toLowerCase())) {
            console.log('📦 Using cached AI response for:', keyword);
            return aiCache.get(keyword.toLowerCase());
        }

        // If AI disabled or no API key, use static backend
        if (!AI_CONFIG.enabled || !AI_CONFIG.groq.apiKey || AI_CONFIG.groq.apiKey === 'YOUR_GROQ_API_KEY_HERE') {
            console.log('🔧 AI disabled, using static backend');
            return this.searchStaticBackend(keyword);
        }

        // Try AI search
        try {
            console.log('🤖 Searching with AI for:', keyword);
            const result = await this.searchWithGroqAI(keyword);
            
            // Cache the result
            if (AI_CONFIG.cacheResults) {
                aiCache.set(keyword.toLowerCase(), result);
            }
            
            return result;
        } catch (error) {
            console.error('❌ AI search failed:', error);
            
            // Fallback to static backend
            if (AI_CONFIG.fallbackToStatic) {
                console.log('🔄 Falling back to static backend');
                return this.searchStaticBackend(keyword);
            }
            
            throw error;
        }
    }

    async searchWithGroqAI(keyword) {
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
                        content: `You are an expert on Indian Penal Code (IPC) and Indian law.
                                  When given a keyword or scenario, return relevant IPC sections.
                                  
                                  IMPORTANT: Return ONLY a valid JSON array, no explanation or markdown.
                                  Format: [{"section": "302", "title": "Murder", "description": "Punishment for murder", "punishment": "Death or life imprisonment", "keywords": ["kill", "murder", "death"]}]
                                  
                                  Rules:
                                  - Include 1-5 most relevant sections
                                  - Be accurate with section numbers and punishments
                                  - Use Indian Penal Code 1860 sections
                                  - Return empty array [] if no relevant sections found`
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

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Parse JSON response
        let sections;
        try {
            // Remove markdown code blocks if AI adds them
            const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            sections = JSON.parse(jsonContent);
        } catch (parseError) {
            console.error('Failed to parse AI response:', content);
            throw new Error('Invalid JSON response from AI');
        }

        return {
            success: true,
            sections: sections || [],
            source: 'ai',
            model: AI_CONFIG.groq.model
        };
    }

    async searchStaticBackend(keyword) {
        // Search in local static data (no backend needed)
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
// Authentication & Session
// ========================================
let currentUser = null;

const USERS = {
    admin: { password: 'police123', role: 'admin', name: 'Police Officer' },
    user: { password: 'user123', role: 'user', name: 'Public User' }
};

async function handleLogin(username, password) {
    // Client-side authentication (no backend needed for AI version)
    if (USERS[username] && USERS[username].password === password) {
        currentUser = {
            username: username,
            role: USERS[username].role,
            name: USERS[username].name
        };
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    showLogin();
    addMessage('system', 'Logged out successfully. Have a great day! 👋');
}

// ========================================
// Command Parser
// ========================================
async function parseCommand(input) {
    const cmd = input.toLowerCase().trim();
    
    // Logout
    if (cmd === 'logout') {
        logout();
        return;
    }
    
    // Help
    if (cmd === 'help') {
        showHelp();
        return;
    }
    
    // Search IPC with AI
    if (cmd.startsWith('search ipc ') || cmd.startsWith('ipc ')) {
        const keyword = cmd.replace('search ipc ', '').replace('ipc ', '').trim();
        if (keyword) {
            await handleIPCSearch(keyword);
        } else {
            addMessage('system', 'Please provide a keyword. Example: search ipc theft');
        }
        return;
    }
    
    // View all IPC sections
    if (cmd === 'list ipc' || cmd === 'all ipc') {
        await handleListAllIPC();
        return;
    }
    
    // Admin-only commands
    if (currentUser.role !== 'admin') {
        addMessage('system', '🚫 Access denied. This command requires admin privileges.');
        return;
    }
    
    // Create FIR (Admin only)
    if (cmd === 'create fir') {
        startFIRCreation();
        return;
    }
    
    // View FIRs
    if (cmd === 'list firs' || cmd === 'all firs') {
        await handleListFIRs();
        return;
    }
    
    // Search FIR by ID
    if (cmd.startsWith('fir ')) {
        const firId = cmd.replace('fir ', '').trim();
        await handleGetFIR(firId);
        return;
    }
    
    // Unknown command
    addMessage('system', `❓ Unknown command: "${input}". Type "help" for available commands.`);
}

// ========================================
// IPC Search with AI
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
        
        // Show source
        const sourceIcon = result.source === 'ai' ? '🤖' : '📚';
        const sourceName = result.source === 'ai' ? `AI (${result.model})` : 'Static Database';
        addMessage('system', `${sourceIcon} Found ${result.sections.length} section(s) using ${sourceName}:`);
        
        // Display results
        result.sections.forEach(section => {
            const keywords = section.keywords ? section.keywords.join(', ') : 'N/A';
            const message = `
                <div class="ipc-result">
                    <div class="ipc-header">
                        <strong>IPC Section ${section.section}</strong>
                        <span class="badge">${section.title}</span>
                    </div>
                    <p><strong>Description:</strong> ${section.description}</p>
                    <p><strong>Punishment:</strong> ${section.punishment}</p>
                    <p><strong>Keywords:</strong> <em>${keywords}</em></p>
                </div>
            `;
            addMessage('system', message);
        });
        
        // AI-specific features
        if (result.source === 'ai') {
            addMessage('system', `💡 Tip: AI can understand complex scenarios. Try: "someone stole my phone" or "hit by a car"`);
        }
        
    } catch (error) {
        addMessage('system', `❌ Error searching IPC: ${error.message}`);
    }
}

async function handleListAllIPC() {
    addMessage('user', 'list ipc');
    addMessage('system', '📚 Showing all IPC sections...');
    
    if (STATIC_IPC_SECTIONS.length > 0) {
        addMessage('system', `Found ${STATIC_IPC_SECTIONS.length} IPC sections:`);
        
        STATIC_IPC_SECTIONS.forEach(section => {
            const message = `
                <div class="ipc-result-compact">
                    <strong>IPC ${section.section}:</strong> ${section.title} - ${section.punishment}
                </div>
            `;
            addMessage('system', message);
        });
    } else {
        addMessage('system', 'No IPC sections found.');
    }
}

// ========================================
// FIR Management (Admin only)
// ========================================
let firCreationState = null;

function startFIRCreation() {
    addMessage('user', 'create fir');
    firCreationState = { step: 1, data: {} };
    addMessage('system', '📝 Creating new FIR. Step 1/5: Enter complainant name:');
}

async function handleFIRCreationStep(input) {
    const step = firCreationState.step;
    
    if (step === 1) {
        firCreationState.data.complainantName = input;
        firCreationState.step = 2;
        addMessage('system', 'Step 2/5: Enter suspect name:');
    } else if (step === 2) {
        firCreationState.data.suspectName = input;
        firCreationState.step = 3;
        addMessage('system', 'Step 3/5: Enter incident description:');
    } else if (step === 3) {
        firCreationState.data.incidentDescription = input;
        firCreationState.step = 4;
        addMessage('system', 'Step 4/5: Enter IPC section (e.g., 302):');
    } else if (step === 4) {
        firCreationState.data.ipcSection = input;
        firCreationState.step = 5;
        addMessage('system', 'Step 5/5: Enter status (Registered/Under Investigation/Closed):');
    } else if (step === 5) {
        firCreationState.data.status = input;
        await submitFIR();
    }
}

async function submitFIR() {
    // Store FIR in local memory (no backend needed)
    const fir = {
        id: 'FIR-' + firIdCounter++,
        ...firCreationState.data,
        dateRegistered: new Date().toISOString().split('T')[0]
    };
    
    firStorage.push(fir);
    addMessage('system', `✅ FIR created successfully! ID: ${fir.id}`);
    
    firCreationState = null;
}

async function handleListFIRs() {
    addMessage('user', 'list firs');
    
    if (firStorage.length > 0) {
        addMessage('system', `Found ${firStorage.length} FIR(s):`);
        
        firStorage.forEach(fir => {
            const message = `
                <div class="fir-result">
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

async function handleGetFIR(firId) {
    const fir = firStorage.find(f => f.id === firId);
    
    if (fir) {
        const message = `
            <div class="fir-detail">
                <h3>FIR Details - ${fir.id}</h3>
                <p><strong>Complainant:</strong> ${fir.complainantName}</p>
                <p><strong>Suspect:</strong> ${fir.suspectName}</p>
                <p><strong>Incident:</strong> ${fir.incidentDescription}</p>
                <p><strong>IPC Section:</strong> ${fir.ipcSection}</p>
                <p><strong>Status:</strong> ${fir.status}</p>
                <p><strong>Date:</strong> ${fir.dateRegistered}</p>
            </div>
        `;
        addMessage('system', message);
    } else {
        addMessage('system', `FIR not found: ${firId}`);
    }
}

// ========================================
// UI Functions
// ========================================
function showHelp() {
    const role = currentUser.role;
    const commands = [
        'help - Show this help message',
        'search ipc <keyword> - Search IPC sections with AI (e.g., "search ipc theft")',
        'list ipc - View all IPC sections',
        'logout - Logout from the system'
    ];
    
    if (role === 'admin') {
        commands.push(
            '',
            '👮 Admin Commands:',
            'create fir - Create a new FIR',
            'list firs - View all FIRs',
            'fir <id> - View specific FIR details'
        );
    }
    
    const helpMessage = `
        <div class="help-box">
            <h3>📚 Available Commands</h3>
            ${commands.map(cmd => `<div>${cmd}</div>`).join('')}
            <br>
            <p><strong>🤖 AI Features:</strong></p>
            <ul>
                <li>Natural language search: "someone killed my friend"</li>
                <li>Scenario-based: "hit by a car and injured"</li>
                <li>Keyword-based: "fraud", "theft", "assault"</li>
            </ul>
            <p><em>AI Status: ${AI_CONFIG.enabled && AI_CONFIG.groq.apiKey !== 'YOUR_GROQ_API_KEY_HERE' ? '✅ Enabled (Groq)' : '⚠️ Disabled (using static data)'}</em></p>
        </div>
    `;
    
    addMessage('system', helpMessage);
}

function addMessage(type, content) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `<strong>You:</strong> ${content}`;
    } else if (type === 'system') {
        messageDiv.innerHTML = content;
    }
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
}

function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';
    
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
        <span>${currentUser.name} (${currentUser.role})</span>
        <button onclick="logout()" class="btn-logout">Logout</button>
    `;
    
    addMessage('system', `Welcome, ${currentUser.name}! 👋`);
    addMessage('system', `You are logged in as: <strong>${currentUser.role}</strong>`);
    
    // Show AI status
    const aiStatus = AI_CONFIG.enabled && AI_CONFIG.groq.apiKey !== 'YOUR_GROQ_API_KEY_HERE' 
        ? '🤖 AI-powered search is <strong>enabled</strong>!' 
        : '⚠️ AI is disabled. Using static database. Add your Groq API key to enable AI.';
    addMessage('system', aiStatus);
    
    addMessage('system', 'Type "help" to see available commands.');
}

// ========================================
// Event Handlers
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const commandInput = document.getElementById('commandInput');
    const sendBtn = document.getElementById('sendBtn');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const success = await handleLogin(username, password);
        
        if (success) {
            showApp();
        } else {
            alert('Invalid credentials! Try: admin/police123 or user/user123');
        }
    });
    
    sendBtn.addEventListener('click', () => {
        const input = commandInput.value.trim();
        if (!input) return;
        
        if (firCreationState) {
            addMessage('user', input);
            handleFIRCreationStep(input);
        } else {
            parseCommand(input);
        }
        
        commandInput.value = '';
    });
    
    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});
