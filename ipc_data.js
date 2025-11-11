/* ipc_data.js
   IPC (Indian Penal Code) sections with keywords for search
*/

const ipcSections = [
  { section: '302', title: 'Murder', description: 'Punishment for murder', keywords: ['kill', 'murder', 'death', 'homicide', 'killing'], punishment: 'Death or life imprisonment' },
  { section: '304', title: 'Culpable homicide not amounting to murder', description: 'Punishment for culpable homicide', keywords: ['kill', 'death', 'homicide', 'culpable'], punishment: 'Imprisonment up to 10 years or life' },
  { section: '307', title: 'Attempt to murder', description: 'Attempt to commit murder', keywords: ['attempt', 'kill', 'murder', 'try to kill'], punishment: 'Imprisonment up to 10 years' },
  { section: '323', title: 'Punishment for voluntarily causing hurt', description: 'Causing hurt voluntarily', keywords: ['hurt', 'assault', 'hit', 'beat', 'attack', 'injury'], punishment: 'Imprisonment up to 1 year or fine' },
  { section: '324', title: 'Voluntarily causing hurt by dangerous weapons', description: 'Causing hurt with dangerous weapons', keywords: ['hurt', 'weapon', 'knife', 'assault', 'attack'], punishment: 'Imprisonment up to 3 years' },
  { section: '325', title: 'Punishment for voluntarily causing grievous hurt', description: 'Causing grievous hurt', keywords: ['hurt', 'grievous', 'serious injury', 'assault'], punishment: 'Imprisonment up to 7 years' },
  { section: '354', title: 'Assault or criminal force to woman', description: 'Assault or criminal force with intent to outrage modesty', keywords: ['assault', 'woman', 'modesty', 'molestation', 'harassment'], punishment: 'Imprisonment up to 2 years' },
  { section: '376', title: 'Punishment for rape', description: 'Sexual assault', keywords: ['rape', 'sexual assault', 'sexual violence'], punishment: 'Imprisonment not less than 10 years, may extend to life' },
  { section: '379', title: 'Punishment for theft', description: 'Theft of movable property', keywords: ['theft', 'steal', 'stealing', 'rob', 'loot'], punishment: 'Imprisonment up to 3 years or fine' },
  { section: '380', title: 'Theft in dwelling house', description: 'Theft in a building used as dwelling', keywords: ['theft', 'burglary', 'house theft', 'steal from house'], punishment: 'Imprisonment up to 7 years' },
  { section: '392', title: 'Punishment for robbery', description: 'Robbery or dacoity', keywords: ['robbery', 'rob', 'dacoity', 'armed theft', 'loot'], punishment: 'Imprisonment up to 10 years' },
  { section: '420', title: 'Cheating and dishonestly inducing delivery of property', description: 'Cheating', keywords: ['cheat', 'fraud', 'deception', 'dishonest', 'scam'], punishment: 'Imprisonment up to 7 years' },
  { section: '425', title: 'Mischief', description: 'Causing damage to property', keywords: ['damage', 'vandalism', 'mischief', 'destroy property'], punishment: 'Imprisonment up to 3 months or fine' },
  { section: '427', title: 'Mischief causing damage', description: 'Mischief causing damage to property', keywords: ['damage', 'vandalism', 'property damage'], punishment: 'Imprisonment up to 2 years or fine' },
  { section: '504', title: 'Intentional insult', description: 'Intentional insult to provoke breach of peace', keywords: ['insult', 'provoke', 'abuse', 'verbal abuse'], punishment: 'Imprisonment up to 2 years or fine' },
  { section: '506', title: 'Punishment for criminal intimidation', description: 'Criminal intimidation', keywords: ['threat', 'intimidation', 'threaten', 'blackmail'], punishment: 'Imprisonment up to 2 years or fine' },
  { section: '511', title: 'Punishment for attempting to commit offences', description: 'Attempting to commit offences punishable with imprisonment', keywords: ['attempt', 'trying to commit'], punishment: 'Half of longest term for the offence' }
];

// IPCStore using Trie for keyword search
class IPCStore {
  constructor(){
    this.sections = ipcSections;
    this.keywordTrie = window.Trie ? new window.Trie() : null;
    this._buildIndex();
  }
  _buildIndex(){
    if (!this.keywordTrie) return;
    this.sections.forEach((s, idx) => {
      s.keywords.forEach(kw => {
        this.keywordTrie.insert(kw, idx);
      });
    });
  }
  searchByKeyword(query){
    if (!this.keywordTrie) return [];
    const q = (query||'').toLowerCase().trim();
    const indices = this.keywordTrie.startsWith(q);
    const unique = [...new Set(indices)];
    return unique.map(i => this.sections[i]).filter(Boolean);
  }
  getAll(){ return this.sections }
  getBySection(sec){ return this.sections.find(s => s.section === String(sec)) }
}

window.IPCStore = IPCStore;
window.ipcSections = ipcSections;
