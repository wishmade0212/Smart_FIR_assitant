/**
 * FIR Assistant - Frontend Client for C++ Backend
 * Communicates with C++ server via REST API
 */

// ========================================
// Configuration
// ========================================
const BACKEND_URL = 'http://localhost:8080'; // C++ server URL

// Email configuration (still used for verification)
const EMAIL_CONFIG = {
    serviceId: 'service_9btsc1x',
    templateId: 'template_eein4ye',
    publicKey: 'BGdkuu47slb_fXcWU',
    enabled: true
};

// AI configuration (for IPC suggestions - can be called from frontend or backend)
const AI_CONFIG = {
    enabled: true,
    provider: 'groq',
    groq: {
        apiKey: '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',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        maxTokens: 1500
    }
};

// ========================================
// API Helper Functions
// ========================================

/**
 * Make API call to C++ backend
 */
async function callBackend(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error('❌ Backend error:', error);
        
        // Check if server is running
        if (error.message.includes('Failed to fetch')) {
            showError('Cannot connect to C++ backend server. Please start the server first.\n\nRun: cd backend && ./fir_server');
        }
        
        return { success: false, error: error.message };
    }
}

/**
 * Create FIR via C++ backend
 */
async function createFIR(firData) {
    console.log('📤 Sending FIR to C++ backend...');
    const result = await callBackend('/api/fir/create', 'POST', firData);
    
    if (result.success) {
        console.log('✅ FIR created:', result.firId);
    } else {
        console.error('❌ FIR creation failed:', result.error);
    }
    
    return result;
}

/**
 * Get FIR by ID from C++ backend
 */
async function getFIR(firId) {
    console.log('📥 Fetching FIR from C++ backend:', firId);
    const result = await callBackend(`/api/fir/${firId}`, 'GET');
    
    if (result.success) {
        console.log('✅ FIR retrieved:', result.data);
    } else {
        console.error('❌ FIR not found:', result.error);
    }
    
    return result;
}

/**
 * Get all FIRs from C++ backend
 */
async function getAllFIRs() {
    console.log('📥 Fetching all FIRs from C++ backend...');
    const result = await callBackend('/api/fir/all', 'GET');
    
    if (result.success) {
        console.log(`✅ Retrieved ${result.count} FIRs`);
    }
    
    return result;
}

/**
 * Search FIRs via C++ backend
 */
async function searchFIRs(keyword) {
    console.log('🔍 Searching FIRs in C++ backend:', keyword);
    const result = await callBackend(`/api/fir/search/${encodeURIComponent(keyword)}`, 'GET');
    
    if (result.success) {
        console.log(`✅ Found ${result.count} matching FIRs`);
    }
    
    return result;
}

/**
 * Get autocomplete suggestions from C++ backend
 */
async function getAutocomplete(prefix) {
    const result = await callBackend(`/api/autocomplete/${encodeURIComponent(prefix)}`, 'GET');
    return result.success ? result.suggestions : [];
}

/**
 * Update FIR status via C++ backend
 */
async function updateFIRStatus(firId, status) {
    console.log('🔄 Updating FIR status:', firId, status);
    const result = await callBackend(`/api/fir/${firId}/status`, 'PUT', { status });
    
    if (result.success) {
        console.log('✅ Status updated');
    }
    
    return result;
}

// ========================================
// UI State Management
// ========================================
let currentStep = 1;
let currentSection = 'dashboard';
let firData = {};
let userEmail = '';
let verificationCode = '';

// ========================================
// Navigation Functions
// ========================================

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    
    // Load data for specific sections
    if (sectionId === 'view-fir-section') {
        loadAllFIRs();
    }
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(stepDiv => {
        stepDiv.classList.remove('active');
    });
    
    const stepDiv = document.getElementById(`step-${step}`);
    if (stepDiv) {
        stepDiv.classList.add('active');
        currentStep = step;
        
        // Update progress
        updateProgress();
    }
}

function updateProgress() {
    const totalSteps = 15;
    const percentage = (currentStep / totalSteps) * 100;
    
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    const stepInfo = document.querySelector('.step-info');
    if (stepInfo) {
        stepInfo.textContent = `Step ${currentStep} of ${totalSteps}`;
    }
}

// ========================================
// FIR Creation Flow
// ========================================

async function startFIRCreation() {
    firData = {};
    currentStep = 1;
    showSection('create-fir-section');
    showStep(1);
}

async function nextStep() {
    // Get current step data
    const stepDiv = document.getElementById(`step-${currentStep}`);
    const inputs = stepDiv.querySelectorAll('input, select, textarea');
    
    // Validate inputs
    let isValid = true;
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Store value
        if (input.value.trim()) {
            firData[input.name] = input.value.trim();
        }
    });
    
    if (!isValid) {
        showError('Please fill all required fields');
        return;
    }
    
    // Special validation for phone (Step 8)
    if (currentStep === 8) {
        const phone = firData.complainantPhone;
        if (!/^\d{10}$/.test(phone)) {
            showError('Phone number must be exactly 10 digits');
            return;
        }
    }
    
    // Handle suspect "unknown" case (Step 4)
    if (currentStep === 4 && firData.suspectName.toLowerCase() === 'unknown') {
        // Skip to Step 7 (IPC sections)
        currentStep = 6;
    }
    
    // Move to next step or submit
    if (currentStep < 15) {
        showStep(currentStep + 1);
    } else {
        await submitFIR();
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Handle going back from Step 7 if suspect was "unknown"
        if (currentStep === 7 && firData.suspectName && firData.suspectName.toLowerCase() === 'unknown') {
            currentStep = 5; // Go back to Step 4
        }
        
        showStep(currentStep - 1);
    }
}

/**
 * Submit FIR to C++ backend
 */
async function submitFIR() {
    try {
        showLoading('Creating FIR in C++ backend...');
        
        // Get IPC sections from AI or user selection
        const ipcSections = await getIPCSuggestions(firData.incidentDescription);
        firData.ipcSections = ipcSections;
        
        // Send to C++ backend
        const result = await createFIR(firData);
        
        hideLoading();
        
        if (result.success) {
            showSuccess(`FIR Created Successfully!\n\nFIR ID: ${result.firId}\n\nYour FIR has been stored in the C++ backend database.`);
            
            // Reset and go back to dashboard
            firData = {};
            setTimeout(() => {
                showSection('dashboard');
            }, 3000);
        } else {
            showError(`Failed to create FIR:\n${result.error}`);
        }
        
    } catch (error) {
        hideLoading();
        showError('Error creating FIR: ' + error.message);
    }
}

// ========================================
// FIR Retrieval Functions
// ========================================

/**
 * Load all FIRs from C++ backend
 */
async function loadAllFIRs() {
    try {
        showLoading('Loading FIRs from C++ backend...');
        
        const result = await getAllFIRs();
        
        hideLoading();
        
        const container = document.getElementById('fir-list');
        if (!container) return;
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(fir => `
                <div class="fir-card">
                    <div class="fir-header">
                        <h3>${fir.id}</h3>
                        <span class="badge badge-${fir.status}">${fir.status}</span>
                    </div>
                    <div class="fir-body">
                        <p><strong>Complainant:</strong> ${fir.complainantName}</p>
                        <p><strong>Incident:</strong> ${fir.incidentDescription.substring(0, 100)}...</p>
                        <p><strong>Date:</strong> ${fir.dateOfIncident || 'Not specified'}</p>
                        <p><strong>Location:</strong> ${fir.placeOfIncident || 'Not specified'}</p>
                    </div>
                    <div class="fir-footer">
                        <button onclick="viewFIRDetails('${fir.id}')" class="btn btn-primary">
                            📄 View Full Details
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="no-data">No FIRs found. Create your first FIR!</p>';
        }
        
    } catch (error) {
        hideLoading();
        showError('Error loading FIRs: ' + error.message);
    }
}

/**
 * View FIR details from C++ backend
 */
async function viewFIRDetails(firId) {
    try {
        showLoading('Loading FIR details from C++ backend...');
        
        const result = await getFIR(firId);
        
        hideLoading();
        
        if (result.success) {
            displayFIRDetails(result.data);
        } else {
            showError('FIR not found: ' + result.error);
        }
        
    } catch (error) {
        hideLoading();
        showError('Error loading FIR: ' + error.message);
    }
}

/**
 * Display FIR details in modal
 */
function displayFIRDetails(fir) {
    const modal = document.getElementById('fir-details-modal');
    const content = document.getElementById('fir-details-content');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="fir-detail-view">
            <div class="fir-detail-header">
                <h2>FIRST INFORMATION REPORT</h2>
                <p class="fir-id">FIR No: ${fir.id}</p>
                <p class="fir-date">Date: ${fir.timestamp}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>1. District & Police Station</h3>
                <p><strong>District:</strong> ${fir.district}</p>
                <p><strong>Police Station:</strong> ${fir.policeStation}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>2. Complainant Details</h3>
                <p><strong>Name:</strong> ${fir.complainantName}</p>
                <p><strong>Father's Name:</strong> ${fir.complainantFatherName || 'N/A'}</p>
                <p><strong>Address:</strong> ${fir.complainantAddress || 'N/A'}</p>
                <p><strong>Phone:</strong> ${fir.complainantPhone}</p>
                <p><strong>Email:</strong> ${fir.complainantEmail}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>3. Incident Details</h3>
                <p><strong>Date:</strong> ${fir.dateOfIncident || 'Not specified'}</p>
                <p><strong>Time:</strong> ${fir.timeOfIncident || 'Not specified'}</p>
                <p><strong>Place:</strong> ${fir.placeOfIncident || 'Not specified'}</p>
                <p><strong>Description:</strong> ${fir.incidentDescription}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>4. Suspect Details</h3>
                <p><strong>Name:</strong> ${fir.suspectName || 'Unknown'}</p>
                <p><strong>Age:</strong> ${fir.suspectAge || 'N/A'}</p>
                <p><strong>Address:</strong> ${fir.suspectAddress || 'N/A'}</p>
                <p><strong>Description:</strong> ${fir.suspectDescription || 'N/A'}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>5. Property Details</h3>
                <p>${fir.propertyDescription || 'No property involved'}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>6. IPC Sections Applied</h3>
                <p>${fir.ipcSections && fir.ipcSections.length > 0 ? fir.ipcSections.join(', ') : 'To be determined'}</p>
            </div>
            
            <div class="fir-detail-section">
                <h3>7. Status</h3>
                <p class="status-badge status-${fir.status}">${fir.status.toUpperCase()}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeFIRDetails() {
    const modal = document.getElementById('fir-details-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========================================
// Search Function
// ========================================

async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const keyword = searchInput ? searchInput.value.trim() : '';
    
    if (!keyword) {
        showError('Please enter a search keyword');
        return;
    }
    
    try {
        showLoading('Searching in C++ backend...');
        
        const result = await searchFIRs(keyword);
        
        hideLoading();
        
        if (result.success && result.data.length > 0) {
            displaySearchResults(result.data);
        } else {
            showError('No FIRs found matching your search');
        }
        
    } catch (error) {
        hideLoading();
        showError('Search error: ' + error.message);
    }
}

function displaySearchResults(firs) {
    // Similar to loadAllFIRs but with search results
    const container = document.getElementById('search-results');
    if (!container) return;
    
    container.innerHTML = firs.map(fir => `
        <div class="fir-card">
            <div class="fir-header">
                <h3>${fir.id}</h3>
                <span class="badge badge-${fir.status}">${fir.status}</span>
            </div>
            <div class="fir-body">
                <p><strong>Complainant:</strong> ${fir.complainantName}</p>
                <p><strong>Incident:</strong> ${fir.incidentDescription.substring(0, 100)}...</p>
            </div>
            <div class="fir-footer">
                <button onclick="viewFIRDetails('${fir.id}')" class="btn btn-primary">View Details</button>
            </div>
        </div>
    `).join('');
}

// ========================================
// AI IPC Suggestions (Still from frontend)
// ========================================

async function getIPCSuggestions(description) {
    if (!AI_CONFIG.enabled) {
        return [];
    }
    
    try {
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
                        content: 'You are an Indian Penal Code expert. Suggest relevant IPC sections based on incident description. Return only section numbers separated by commas.'
                    },
                    {
                        role: 'user',
                        content: `Incident: ${description}\n\nSuggest relevant IPC sections:`
                    }
                ],
                temperature: AI_CONFIG.groq.temperature,
                max_tokens: AI_CONFIG.groq.maxTokens
            })
        });
        
        const data = await response.json();
        const sections = data.choices[0].message.content.split(',').map(s => s.trim());
        return sections;
        
    } catch (error) {
        console.error('AI suggestion error:', error);
        return [];
    }
}

// ========================================
// Utility Functions
// ========================================

function showError(message) {
    alert('❌ Error:\n\n' + message);
}

function showSuccess(message) {
    alert('✅ Success:\n\n' + message);
}

function showLoading(message = 'Loading...') {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    
    if (loader) {
        loader.style.display = 'flex';
        if (loaderText) {
            loaderText.textContent = message;
        }
    }
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FIR Assistant initialized');
    console.log('🔧 Backend URL:', BACKEND_URL);
    console.log('💾 Using C++ Backend Server');
    
    // Check if C++ server is running
    callBackend('/').then(result => {
        if (result.status === 'running') {
            console.log('✅ C++ Backend server is running');
            console.log('📊 Service:', result.service);
            console.log('📌 Version:', result.version);
        } else {
            console.warn('⚠️  C++ Backend server not responding');
            showError('Cannot connect to C++ backend.\n\nPlease start the server:\ncd backend\n./fir_server');
        }
    });
});

console.log('✅ FIR Client loaded - Ready to connect to C++ backend');
