/* app.js - assistant UI and logic with authentication */

(function(){
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Initializing FIR Assistant...');
    
  const store = new window.FIRStore();
  const ipcStore = new window.IPCStore();
  
  // Auth state
  let currentUser = null; // { username, role: 'admin' | 'user' }
  
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

  console.log('DOM elements loaded:', {
    loginScreen: !!loginScreen,
    app: !!app,
    loginForm: !!loginForm
  });

  // Authentication
  const users = {
    admin: { password: 'police123', role: 'admin', name: 'Police Admin' },
    user: { password: 'user123', role: 'user', name: 'Public User' }
  };

  loginForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const userData = users[username];
    console.log('Login attempt:', username, userData ? 'user found' : 'user not found');
    if (userData && userData.password === password){
      currentUser = { username, role: userData.role, name: userData.name };
      console.log('Login successful, calling showApp()');
      showApp();
    } else {
      alert('Invalid credentials');
    }
  });

  logoutBtn.addEventListener('click', ()=>{
    currentUser = null;
    app.style.display = 'none';
    loginScreen.style.display = 'flex';
    messagesEl.innerHTML = '';
  });

  function showApp(){
    console.log('showApp() called');
    console.log('loginScreen:', loginScreen);
    console.log('app:', app);
    loginScreen.style.display = 'none';
    app.style.display = 'grid';
    userRoleEl.textContent = currentUser.name + ' (' + currentUser.role + ')';
    
    // Show admin controls
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
    const d = document.createElement('div'); d.className = 'message ' + (who==='user'?'user':'bot');
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
    
    // IPC commands (both roles)
    if (/^search ipc\s+(.+)$/i.test(lower)){
      const m = lower.match(/^search ipc\s+(.+)$/i); return {action:'searchIPC', q: m[1]};
    }
    if (lower === 'list all ipc' || lower === 'list ipc') return {action:'listAllIPC'};
    
    // Admin-only commands
    if (lower === 'create fir') return {action:'createFIR'};
    if (/^find fir by id\s*(\d+)$/i.test(lower)){
      const m = lower.match(/^find fir by id\s*(\d+)$/i); return {action:'findById', id: Number(m[1])};
    }
    if (/^search complainant\s+(.+)$/i.test(lower)){
      const m = lower.match(/^search complainant\s+(.+)$/i); return {action:'searchComplainant', q: m[1]};
    }
    if (/^search suspect\s+(.+)$/i.test(lower)){
      const m = lower.match(/^search suspect\s+(.+)$/i); return {action:'searchSuspect', q: m[1]};
    }
    if (/^list status\s+(open|closed)$/i.test(lower)){
      const m = lower.match(/^list status\s+(open|closed)$/i); return {action:'listStatus', status: m[1]};
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

  // FIR creation wizard (admin only)
  let creatingFIR = false;
  let firDraft = {};

  function startFIRCreation(){
    creatingFIR = true;
    firDraft = { id: Date.now() };
    respondTo('Creating new FIR. Please provide:<br>1. <strong>Complainant name:</strong>');
  }

  function handleFIRCreationStep(text){
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
      firDraft.tags = [];
      firDraft.relatedIds = [];
      store.add(firDraft);
      respondTo('✅ FIR created successfully!<br>' + formatRecord(firDraft));
      creatingFIR = false;
      firDraft = {};
    }
  }

  chatForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const text = chatInput.value.trim(); if (!text) return;
    appendMessage(text, 'user'); chatInput.value = '';
    
    // Handle FIR creation wizard
    if (creatingFIR){
      handleFIRCreationStep(text);
      return;
    }
    
    const cmd = parseCommand(text);
    try{
      // IPC commands (both roles)
      if (cmd.action === 'searchIPC'){
        const results = ipcStore.searchByKeyword(cmd.q);
        if (!results.length) respondTo('No IPC sections found for keyword: ' + cmd.q);
        else respondTo('<strong>Found ' + results.length + ' IPC sections:</strong><br><br>' + results.map(formatIPCSection).join('<br>---<br>'));
        return;
      }
      if (cmd.action === 'listAllIPC'){
        const all = ipcStore.getAll();
        respondTo('<strong>All IPC Sections (' + all.length + '):</strong><br><br>' + all.map(s => `Section ${s.section}: ${s.title}`).join('<br>'));
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
          const r = store.getById(cmd.id);
          respondTo(r ? formatRecord(r) : `No FIR with id ${cmd.id}`);
          break;
        }
        case 'searchComplainant': {
          const results = store.searchComplainant(cmd.q);
          if (!results.length) respondTo('No matches');
          else respondTo('<strong>Found ' + results.length + ' FIR(s):</strong><br><br>' + results.map(formatRecord).join('<br>---<br>'));
          break;
        }
        case 'searchSuspect': {
          const results = store.searchSuspect(cmd.q);
          if (!results.length) respondTo('No matches');
          else respondTo('<strong>Found ' + results.length + ' FIR(s):</strong><br><br>' + results.map(formatRecord).join('<br>---<br>'));
          break;
        }
        case 'listStatus': {
          const results = store.listByStatus(cmd.status);
          if (!results.length) respondTo('No records');
          else respondTo('<strong>FIRs with status "' + cmd.status + '":</strong><br><br>' + results.map(formatRecord).join('<br>---<br>'));
          break;
        }
        case 'stats': {
          const all = store.all();
          const total = all.length;
          const open = all.filter(r=>String(r.status).toLowerCase()==='open').length;
          respondTo(`<strong>Statistics:</strong><br>Total FIRs: ${total}<br>Open: ${open}<br>Closed: ${total-open}`);
          break;
        }
        default:
          respondTo('I did not understand that. Try one of the quick commands on the right.');
      }
    } catch(err){
      respondTo('Error: '+err.message);
    }
  });

  loadSampleBtn.addEventListener('click', ()=>{
    loadSampleData(store);
    respondTo('Sample data loaded. Use commands like `search complainant Alice` or `find fir by id 1`.');
  });

  exportBtn.addEventListener('click', ()=>{
    const json = store.export();
    const blob = new Blob([json], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'firs.json'; a.click();
    URL.revokeObjectURL(url);
  });

  importFile.addEventListener('change', (ev)=>{
    const f = ev.target.files && ev.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const arr = JSON.parse(e.target.result);
        if (!Array.isArray(arr)) throw new Error('expected array');
        store.importArray(arr);
        respondTo('Imported '+arr.length+' records.');
      } catch(err){ respondTo('Import error: '+err.message) }
    };
    reader.readAsText(f);
  });

  // expose for console debugging
  window.__FIR = { store, ipcStore, currentUser: ()=>currentUser };
  
  } // end init()
})();
