const API_BASE = 'http://localhost:3000';
const MS_CPU_BASE = 'http://localhost:3003';

const api = {
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async get(path) {
    const res = await fetch(`${API_BASE}${path}`);
    return res.json();
  },

  startSimulation(data)       { return this.post('/simulation/start', data); },
  addProcess(data)            { return this.post('/simulation/process', data); },
  resetSimulation()           { return this.post('/simulation/reset', {}); },
  stopSimulation()            { return this.post('/simulation/stop', {}); },
  blockCurrentProcess()       { return this.post('/simulation/block-current', {}); },
  triggerInterruption(data)   { return this.post('/interruptions/trigger', data); },
  getVectorTable()            { return this.get('/interruptions/vector-table'); },
  getState()                  { return this.get('/simulation/state'); },
};

const msApi = {
  async request(path, options = {}) {
    const res = await fetch(`${MS_CPU_BASE}${path}`, options);
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); if (j.message) msg = Array.isArray(j.message) ? j.message.join(', ') : j.message; } catch(_) {}
      throw new Error(msg);
    }
    return res.json();
  },

  getProcesos()             { return this.request('/procesos'); },
  createProceso(body)       { return this.request('/procesos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); },
  deleteProceso(id)         { return this.request(`/procesos/${id}`, { method: 'DELETE' }); },
  deleteAllProcesos()       { return this.request('/procesos', { method: 'DELETE' }); },
  simular(algoritmo, quantum) {
    const qs = quantum ? `&quantum=${encodeURIComponent(quantum)}` : '';
    return this.request(`/simular?algoritmo=${encodeURIComponent(algoritmo)}${qs}`, { method: 'POST' });
  },
  getSimulaciones()         { return this.request('/simulaciones'); },
};
