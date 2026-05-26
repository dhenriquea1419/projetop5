const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const clientsFile = path.join(dataDir, 'clients.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(clientsFile)) fs.writeFileSync(clientsFile, JSON.stringify([]), 'utf8');
}

function readClients() {
  ensureDataFile();
  const raw = fs.readFileSync(clientsFile, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeClients(arr) {
  ensureDataFile();
  fs.writeFileSync(clientsFile, JSON.stringify(arr, null, 2), 'utf8');
}

const mockDb = {
  getAll: async (search) => {
    const all = readClients();
    if (!search) return all.sort((a,b)=>b.created_at - a.created_at);
    const s = String(search).toLowerCase();
    return all.filter(c => (c.name && c.name.toLowerCase().includes(s)) || (c.email && c.email.toLowerCase().includes(s)));
  },

  getById: async (id) => {
    const all = readClients();
    return all.find(c => String(c.id) === String(id));
  },

  create: async (payload) => {
    const all = readClients();
    const id = Date.now();
    const now = Date.now();
    const item = Object.assign({ id, created_at: now }, payload);
    all.push(item);
    writeClients(all);
    return item;
  },

  update: async (id, payload) => {
    const all = readClients();
    const idx = all.findIndex(c => String(c.id) === String(id));
    if (idx === -1) return null;
    all[idx] = Object.assign(all[idx], payload);
    writeClients(all);
    return all[idx];
  },

  delete: async (id) => {
    let all = readClients();
    const before = all.length;
    all = all.filter(c => String(c.id) !== String(id));
    writeClients(all);
    return all.length !== before;
  }
};

module.exports = mockDb;
