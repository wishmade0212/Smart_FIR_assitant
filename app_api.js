/* app_api.js - Frontend that calls C++ backend API */

(function(){
  // API base URL
  const API_URL = 'http://localhost:8080/api';
  
  // Auth state
  let currentUser = null;
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Initializing FIR Assistant with C++ Backend...');
    
    // DOM elements
    const loginScreen = document.getElementById('login-screen');
    const app = document.getElementById('app');
    const loginForm = document.getElementById('login-form');
    const messagesEl = document.getElementById('messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const loadSampleBtn = document.getElementById('load-sample');
    const exportBtn = document.getElementById('export-data');
    const importFile = document.getElementById('import-file');
    const logoutBtn = document.getElementById('logout');
    const userRoleEl = document.getElementById('user-role');
    const commandList = document.getElementById('command-list');

    console.log('DOM elements loaded');

    loginForm.addEventListener('submit', async function(ev){
      ev.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password})
        });
        
        const data = await response.json();
        
        if (data.success) {
          currentUser = { username, role: data.role, name: data.name };
          showApp();
        } else {
          alert(data.message || 'Invalid credentials');
        }
      } catch (error) {
        alert('Cannot connect to backend server. Make sure the C++ server is running on port 8080.');
        console.error(error);
      }
    });

    logoutBtn.addEventListener('click', ()=>{
      currentUser = null;
      app.style.display = 'none';
      loginScreen.style.display = 'flex';
      messagesEl.innerHTML = '';
    });

    function showApp(){
      loginScreen.style.display = 'none';
      app.style.display = 'grid';
      userRoleEl.textContent = currentUser.name + ' (' + currentUser.role + ')';
      
      if (currentUser.role === 'admin'){
        loadSampleBtn.style.display = 'inline-block';
        exportBtn.style.display = 'inline-block';
        importFile.style.display = 'inline-block';
        commandList.innerHTML = `
          <li>create fir</li>
          <li>find fir by id &lt;id&gt;</li>
          <li>search complainant &lt;name&gt;</li>
          <li>search suspect &lt;name&gt;</li>
          <li>list status &lt;open|closed&gt;</li>
          <li>stats</li>
          <li>search ipc &lt;keyword&gt;</li>
          <li>list all ipc</li>
        `;
        respondTo('Welcome Admin! You can create FIRs, view records, and search IPC sections. Try: <strong>search ipc kill</strong>');
      } else {
        loadSampleBtn.style.display = 'none';
        exportBtn.style.display = 'none';
        importFile.style.display = 'none';
        commandList.innerHTML = `
          <li>search ipc &lt;keyword&gt;</li>
          <li>list all ipc</li>
        `;
        respondTo('Welcome! You can search IPC sections and acts. Try: <strong>search ipc kill</strong> or <strong>search ipc theft</strong>');
      }
    }

    function appendMessage(text, who='bot'){
      const d = document.createElement('div');
      d.className = 'message ' + (who==='user'?'user':'bot');
      d.innerHTML = '<div>'+text+'</div>';
      messagesEl.appendChild(d);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function respondTo(text){
      appendMessage(text, 'bot');
    }

    function parseCommand(text){
      text = (text||'').trim();
      const lower = text.toLowerCase();
      
      if (/^search ipc\s+(.+)$/i.test(lower)){
        const m = lower.match(/^search ipc\s+(.+)$/i);
        return {action:'searchIPC', q: m[1]};
      }
      if (lower === 'list all ipc' || lower === 'list ipc') return {action:'listAllIPC'};
      
      if (lower === 'create fir') return {action:'createFIR'};
      if (/^find fir by id\s*(\d+)$/i.test(lower)){
        const m = lower.match(/^find fir by id\s*(\d+)$/i);
        return {action:'findById', id: Number(m[1])};
      }
      if (/^search complainant\s+(.+)$/i.test(lower)){
        const m = lower.match(/^search complainant\s+(.+)$/i);
        return {action:'searchComplainant', q: m[1]};
      }
      if (/^search suspect\s+(.+)$/i.test(lower)){
        const m = lower.match(/^search suspect\s+(.+)$/i);
        return {action:'searchSuspect', q: m[1]};
      }
      if (/^list status\s+(open|closed)$/i.test(lower)){
        const m = lower.match(/^list status\s+(open|closed)$/i);
        return {action:'listStatus', status: m[1]};
      }
      if (lower === 'stats') return {action:'stats'};
      
      return {action:'unknown'};
    }

    function formatRecord(r){
      if (!r) return 'No record';
      return `<strong>ID:</strong> ${r.id}<br><strong>Complainant:</strong> ${r.complainant}<br><strong>Suspect:</strong> ${r.suspect}<br><strong>Date:</strong> ${r.date}<br><strong>Location:</strong> ${r.location}<br><strong>Status:</strong> ${r.status}<br><strong>Description:</strong> ${r.description}`;
    }

    function formatIPCSection(s){
      if (!s) return 'No section';
      return `<strong>Section ${s.section}:</strong> ${s.title}<br><strong>Description:</strong> ${s.description}<br><strong>Punishment:</strong> ${s.punishment}<br><strong>Keywords:</strong> ${s.keywords.join(', ')}`;
    }

    // FIR creation wizard
    let creatingFIR = false;
    let firDraft = {};

    function startFIRCreation(){
      creatingFIR = true;
      firDraft = { id: Date.now(), tags: [], relatedIds: [] };
      respondTo('Creating new FIR. Please provide:<br>1. <strong>Complainant name:</strong>');
    }

    async function handleFIRCreationStep(text){
      if (!firDraft.complainant){ 
        firDraft.complainant = text;
        respondTo('2. <strong>Suspect name (or "Unknown"):</strong>');
      } else if (!firDraft.suspect){ 
        firDraft.suspect = text;
        respondTo('3. <strong>Location:</strong>');
      } else if (!firDraft.location){ 
        firDraft.location = text;
        respondTo('4. <strong>Description:</strong>');
      } else if (!firDraft.description){ 
        firDraft.description = text;
        firDraft.date = new Date().toISOString().split('T')[0];
        firDraft.status = 'open';
        
        try {
          const response = await fetch(`${API_URL}/fir/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(firDraft)
          });
          
          const data = await response.json();
          
          if (data.success) {
            respondTo('✅ FIR created successfully!<br>' + formatRecord(data.record));
          } else {
            respondTo('Error creating FIR: ' + data.message);
          }
        } catch (error) {
          respondTo('Error: ' + error.message);
        }
        
        creatingFIR = false;
        firDraft = {};
      }
    }

    chatForm.addEventListener('submit', async function(ev){
      ev.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendMessage(text, 'user');
      chatInput.value = '';
      
      if (creatingFIR){
        await handleFIRCreationStep(text);
        return;
      }
      
      const cmd = parseCommand(text);
      
      try{
        // IPC commands (both roles)
        if (cmd.action === 'searchIPC'){
          const response = await fetch(`${API_URL}/ipc/search/${encodeURIComponent(cmd.q)}`);
          const data = await response.json();
          
          if (data.success && data.sections.length > 0) {
            respondTo('<strong>Found ' + data.sections.length + ' IPC sections:</strong><br><br>' + data.sections.map(formatIPCSection).join('<br>---<br>'));
          } else {
            respondTo('No IPC sections found for keyword: ' + cmd.q);
          }
          return;
        }
        
        if (cmd.action === 'listAllIPC'){
          const response = await fetch(`${API_URL}/ipc/all`);
          const data = await response.json();
          
          if (data.success) {
            respondTo('<strong>All IPC Sections (' + data.sections.length + '):</strong><br><br>' + data.sections.map(s => `Section ${s.section}: ${s.title}`).join('<br>'));
          }
          return;
        }
        
        // Admin-only commands
        if (currentUser.role !== 'admin' && ['findById','searchComplainant','searchSuspect','listStatus','stats','createFIR'].includes(cmd.action)){
          respondTo('⛔ Admin access required for this command.');
          return;
        }
        
        switch(cmd.action){
          case 'createFIR':
            startFIRCreation();
            break;
            
          case 'findById': {
            const response = await fetch(`${API_URL}/fir/${cmd.id}`);
            const data = await response.json();
            respondTo(data.success ? formatRecord(data.record) : `No FIR with id ${cmd.id}`);
            break;
          }
          
          case 'searchComplainant': {
            const response = await fetch(`${API_URL}/fir/search/complainant/${encodeURIComponent(cmd.q)}`);
            const data = await response.json();
            if (data.success && data.records.length > 0) {
              respondTo('<strong>Found ' + data.records.length + ' FIR(s):</strong><br><br>' + data.records.map(formatRecord).join('<br>---<br>'));
            } else {
              respondTo('No matches');
            }
            break;
          }
          
          case 'searchSuspect': {
            const response = await fetch(`${API_URL}/fir/search/suspect/${encodeURIComponent(cmd.q)}`);
            const data = await response.json();
            if (data.success && data.records.length > 0) {
              respondTo('<strong>Found ' + data.records.length + ' FIR(s):</strong><br><br>' + data.records.map(formatRecord).join('<br>---<br>'));
            } else {
              respondTo('No matches');
            }
            break;
          }
          
          case 'listStatus': {
            const response = await fetch(`${API_URL}/fir/status/${cmd.status}`);
            const data = await response.json();
            if (data.success && data.records.length > 0) {
              respondTo('<strong>FIRs with status "' + cmd.status + '":</strong><br><br>' + data.records.map(formatRecord).join('<br>---<br>'));
            } else {
              respondTo('No records');
            }
            break;
          }
          
          case 'stats': {
            const response = await fetch(`${API_URL}/fir/stats`);
            const data = await response.json();
            if (data.success) {
              respondTo(`<strong>Statistics:</strong><br>Total FIRs: ${data.total}<br>Open: ${data.open}<br>Closed: ${data.closed}`);
            }
            break;
          }
          
          default:
            respondTo('I did not understand that. Try one of the quick commands on the right.');
        }
      } catch(error){
        respondTo('Error: ' + error.message + '<br>Make sure the C++ backend server is running on port 8080.');
      }
    });

    loadSampleBtn.addEventListener('click', async ()=>{
      try {
        const response = await fetch(`${API_URL}/fir/load-sample`, {method: 'POST'});
        const data = await response.json();
        if (data.success) {
          respondTo('Sample data loaded. Use commands like `search complainant Alice` or `find fir by id 1`.');
        }
      } catch (error) {
        respondTo('Error loading sample data: ' + error.message);
      }
    });

    exportBtn.addEventListener('click', ()=>{
      respondTo('Export feature not yet implemented for backend version.');
    });

    importFile.addEventListener('change', ()=>{
      respondTo('Import feature not yet implemented for backend version.');
    });
  }
})();
