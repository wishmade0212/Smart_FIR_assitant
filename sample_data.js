/* sample_data.js
   Adds sample FIR records and helper to load them into a FIRStore.
*/

const sampleFIRs = [
  { id: 1, complainant: 'Alice Johnson', suspect: 'Bob Lee', date: '2025-11-01', location: 'Downtown', description: 'Theft at shop', status: 'open', tags: ['theft'], relatedIds:[2] },
  { id: 2, complainant: 'Carlos Mendez', suspect: 'Unknown', date: '2025-10-15', location: 'Uptown', description: 'Vandalism', status: 'closed', tags: ['vandalism'], relatedIds:[1] },
  { id: 3, complainant: 'John Doe', suspect: 'Bob Lee', date: '2025-09-20', location: 'Downtown', description: 'Assault', status: 'open', tags: ['assault'], relatedIds:[] },
  { id: 4, complainant: 'Jane Smith', suspect: 'Samuel K', date: '2025-08-11', location: 'West End', description: 'Lost property', status: 'open', tags: ['lost'] }
];

function loadSampleData(store){
  if (!store) throw new Error('store required');
  for (const r of sampleFIRs) store.add(r);
}

window.loadSampleData = loadSampleData;
window.sampleFIRs = sampleFIRs;
