/* ==========================================
   mscpu.js — Planificador CPU (ms-cpu :3003)
   ========================================== */

const msQ = id => document.getElementById(id);
const MS_PALETTE = ['#6C63FF', '#FF6584', '#43E97B', '#F7971E', '#4FACFE', '#FA709A', '#FFD93D', '#30CFD0'];
let msTimers = [];

function initMsTabs() {
  document.querySelectorAll('.mstab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mstab').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tabpanel').forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
    });
  });
}

const MsGantt = {
  _full: [],
  _processMap: {},

  reset() {
    this._full = [];
    this._processMap = {};
    msTimers.forEach(t => clearTimeout(t));
    msTimers = [];
    this._render();
  },

  _colorFor(pid, name) {
    if (!this._processMap[pid]) {
      this._processMap[pid] = {
        name: name || `P${pid}`,
        color: MS_PALETTE[(pid - 1) % MS_PALETTE.length],
      };
    }
    return this._processMap[pid];
  },

  setFull(result, hintPrefix) {
    this._full = (result.gantt || []).map(e => {
      const info = this._colorFor(e.procesoId, e.procesoNombre);
      return {
        pid: e.procesoId,
        name: info.name,
        color: info.color,
        start: e.inicio,
        end: e.fin,
        tipo: e.tipo,
      };
    });
    const total = this._full.length;
    if (hintPrefix) msQ('msGanttHint').textContent = hintPrefix;
    return total;
  },

  _render(limit) {
    const rowsEl = msQ('msGanttRows');
    const axisEl = msQ('msGanttAxis');
    const emptyEl = msQ('msGanttEmptyState');
    const legendEl = msQ('msGanttLegend');
    if (!rowsEl || !axisEl || !legendEl) return;

    const entries = limit ? this._full.slice(0, limit) : this._full;

    if (entries.length === 0) {
      rowsEl.innerHTML = '';
      axisEl.innerHTML = '';
      legendEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    const totalTicks = Math.max(...this._full.map(e => e.end), 1);
    const byPid = {};
    entries.forEach(e => {
      if (!byPid[e.pid]) byPid[e.pid] = [];
      byPid[e.pid].push(e);
    });

    rowsEl.innerHTML = '';
    Object.keys(byPid).forEach(pid => {
      const segs = byPid[pid];
      const info = this._processMap[pid] || { name: `P${pid}`, color: '#6C63FF' };

      const wrap = document.createElement('div');
      wrap.className = 'gantt-row-wrap';

      const label = document.createElement('div');
      label.className = 'gantt-row-label';
      label.textContent = info.name;
      label.style.color = info.color;

      const track = document.createElement('div');
      track.className = 'gantt-row-track';

      let cursor = 0;
      segs.forEach(seg => {
        if (seg.start > cursor) {
          const gap = document.createElement('div');
          gap.style.cssText = `flex: ${seg.start - cursor}; background: transparent;`;
          track.appendChild(gap);
        }

        const len = seg.end - seg.start;
        const bar = document.createElement('div');
        bar.className = 'gantt-seg';
        bar.style.flex = len;
        if (seg.tipo === 'io') {
          bar.style.background = `repeating-linear-gradient(45deg, ${seg.color}55 0 4px, ${seg.color}BB 4px 8px)`;
          bar.style.borderRight = '1px dashed rgba(255,255,255,.15)';
          bar.textContent = 'I/O';
        } else {
          bar.style.background = seg.color;
          bar.style.opacity = '0.85';
          if (len / totalTicks > 0.04) {
            bar.textContent = `${seg.start}–${seg.end}`;
            bar.style.fontSize = '9px';
            bar.style.fontWeight = '700';
          }
        }
        bar.setAttribute('data-tip', `${info.name} · ${seg.tipo === 'io' ? 'I/O' : 'CPU'} · ticks ${seg.start}–${seg.end} (${len})`);
        track.appendChild(bar);
        cursor = seg.end;
      });

      if (cursor < totalTicks) {
        const tail = document.createElement('div');
        tail.style.flex = totalTicks - cursor;
        track.appendChild(tail);
      }

      wrap.appendChild(label);
      wrap.appendChild(track);
      rowsEl.appendChild(wrap);
    });

    axisEl.innerHTML = '';
    axisEl.style.minWidth = '400px';
    const tickStep = totalTicks <= 20 ? 1 : totalTicks <= 50 ? 2 : 5;
    for (let t = 0; t <= totalTicks; t += tickStep) {
      const tick = document.createElement('div');
      tick.className = 'gantt-tick';
      tick.style.flex = tickStep;
      tick.textContent = t;
      axisEl.appendChild(tick);
    }

    legendEl.innerHTML = '';
    Object.values(this._processMap).forEach(info => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `<span class="legend-dot" style="background:${info.color}"></span>${info.name}`;
      legendEl.appendChild(item);
    });
    const ioItem = document.createElement('div');
    ioItem.className = 'legend-item';
    ioItem.innerHTML = `<span class="legend-dot" style="background:repeating-linear-gradient(45deg,#F7971E55 0 3px,#F7971EBB 3px 6px)"></span>I/O`;
    legendEl.appendChild(ioItem);
  },

  animate(result, prefix) {
    this.reset();
    const total = this.setFull(result, prefix);
    if (total === 0) {
      msQ('msGanttHint').textContent = 'Sin segmentos para dibujar';
      return;
    }
    const durations = { 1: 500, 8: 380, 15: 260, 30: 180 };
    const per = durations[Math.min(total, 30)] || 120;
    for (let i = 1; i <= total; i++) {
      msTimers.push(setTimeout(() => {
        this._render(i);
        msQ('msGanttHint').textContent = `${prefix} · ${i}/${total} segmentos`;
      }, i * per));
    }
    msTimers.push(setTimeout(() => {
      this._render(total);
      msQ('msGanttHint').textContent = prefix || '';
    }, (total + 1) * per));
  },
};

function clearMsResult() {
  MsGantt.reset();
  msQ('msGanttHint').textContent = 'CPU sólido · E/S rayado';
  ['msMetricaEspera', 'msMetricaRetorno', 'msMetricaAlgo', 'msMetricaQuantum'].forEach(id => msQ(id).textContent = '—');
  msQ('msMetricasTable').innerHTML = '<tr><td colspan="8" class="ms-table-empty">Sin resultados</td></tr>';
}

async function loadProcesos() {
  try {
    const list = await msApi.getProcesos();
    renderProcesoList(list);
  } catch (e) {
    resaltarMs('msProcesoList', `ms-cpu no responde en :3003 — ${e.message}`, true);
  }
}

function resaltarMs(containerId, msg, isError) {
  const el = msQ(containerId);
  if (!el) return;
  el.innerHTML = `<div class="${isError ? 'ms-error' : 'ms-info'}">${msg}</div>`;
}

function renderProcesoList(list) {
  const container = msQ('msProcesoList');
  const header = msQ('msProcesoHeader');
  if (!Array.isArray(list) || list.length === 0) {
    msQ('msProcesoCount').textContent = '0';
    header.style.display = 'none';
    container.innerHTML = '<div class="queue-empty">No hay procesos en la BD</div>';
    return;
  }
  header.style.display = 'flex';
  msQ('msProcesoCount').textContent = list.length;

  container.innerHTML = '';
  list.forEach(p => {
    const color = MS_PALETTE[(p.id - 1) % MS_PALETTE.length];
    const chip = document.createElement('div');
    chip.className = 'proc-chip';
    let tags = `<span class="proc-chip-tag">B <b>${p.burstTime}</b></span>`;
    if (p.ioTime) tags += `<span class="proc-chip-tag">E/S <b>${p.ioTime}</b></span>`;
    tags += `<span class="proc-chip-tag">P <b>${p.prioridad}</b></span>`;
    chip.innerHTML = `
      <span class="proc-chip-dot" style="background:${color}"></span>
      <span class="proc-chip-name" title="${p.nombre || ('P' + p.id)}">${p.nombre || ('P' + p.id)}</span>
      <span class="proc-chip-pid">#${p.id}</span>
      <span class="ms-chip-tags">${tags}</span>
      <button class="chip-del" data-id="${p.id}" title="Eliminar proceso">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    container.appendChild(chip);
  });
  container.querySelectorAll('.chip-del').forEach(btn => {
    btn.addEventListener('click', () => handleMsDelete(parseInt(btn.dataset.id, 10)));
  });
}

async function handleMsAdd() {
  const body = {
    nombre: msQ('msInputNombre').value.trim() || 'Proceso A',
    burstTime: parseInt(msQ('msInputBurst').value, 10),
    arrivalTime: parseInt(msQ('msInputArrival').value, 10) || 0,
    prioridad: parseInt(msQ('msInputPrioridad').value, 10) || 1,
    ioTime: parseInt(msQ('msInputIo').value, 10) || 0,
  };
  if (!body.burstTime || body.burstTime < 1) return showToast('Burst Time debe ser ≥ 1', 'error');
  try {
    await msApi.createProceso(body);
    showToast(`✓ Proceso "${body.nombre}" creado en ms-cpu`, 'success');
    await loadProcesos();
  } catch (e) {
    showToast(`ms-cpu: ${e.message}`, 'error');
  }
}

async function handleMsDelete(id) {
  try {
    await msApi.deleteProceso(id);
    showToast(`✓ Proceso #${id} eliminado`, 'info');
    await loadProcesos();
  } catch (e) {
    showToast(`ms-cpu: ${e.message}`, 'error');
  }
}

async function handleMsBorrarTodos() {
  try {
    await msApi.deleteAllProcesos();
    showToast('✓ Todos los procesos eliminados', 'info');
    await loadProcesos();
  } catch (e) {
    showToast(`ms-cpu: ${e.message}`, 'error');
  }
}

async function handleMsSimular() {
  const algo = msQ('msInputAlgo').value;
  const quantum = parseInt(msQ('msInputQuantum').value, 10) || undefined;
  msQ('msBtnSimular').disabled = true;
  clearMsResult();
  try {
    const res = await msApi.simular(algo, quantum);
    presentarResultado(res);
    await loadMsHistorico();
  } catch (e) {
    showToast(`ms-cpu: ${e.message}`, 'error');
  } finally {
    msQ('msBtnSimular').disabled = false;
  }
}

function presentarResultado(res) {
  msQ('msMetricaAlgo').textContent = res.algoritmo || '—';
  msQ('msMetricaQuantum').textContent = res.quantum != null ? `${res.quantum} ticks` : '—';
  if (res.tiempoEsperaPromedio != null) msQ('msMetricaEspera').textContent = res.tiempoEsperaPromedio.toFixed(2);
  if (res.tiempoRetornoPromedio != null) msQ('msMetricaRetorno').textContent = res.tiempoRetornoPromedio.toFixed(2);
  renderMetricasTable(res.metricasPorProceso || []);
  const prefijo = res.algoritmo + (res.quantum != null ? ` · Q=${res.quantum}` : '');
  MsGantt.animate(res, prefijo);
}

function renderMetricasTable(metricas) {
  const tbody = msQ('msMetricasTable');
  if (!Array.isArray(metricas) || metricas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="ms-table-empty">Sin resultados</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  metricas.forEach(m => {
    const tr = document.createElement('tr');
    const color = MS_PALETTE[(m.procesoId - 1) % MS_PALETTE.length];
    tr.innerHTML = `
      <td class="ms-name" style="color:${color}">${m.procesoNombre || ('P' + m.procesoId)}</td>
      <td>${m.tiempoLlegada}</td>
      <td>${m.tiempoRafaga}</td>
      <td>${m.tiempoIO ?? 0}</td>
      <td>${m.tiempoInicio}</td>
      <td>${m.tiempoFinal}</td>
      <td>${m.tiempoEspera}</td>
      <td class="ms-last">${m.tiempoRetorno}</td>`;
    tbody.appendChild(tr);
  });
}

async function loadMsHistorico() {
  try {
    const sims = await msApi.getSimulaciones();
    renderHistorico(sims);
  } catch (_) {
    msQ('msHistorico').innerHTML = '<div class="log-empty">No se pudo cargar el historial</div>';
  }
}

function renderHistorico(sims) {
  const el = msQ('msHistorico');
  if (!Array.isArray(sims) || sims.length === 0) {
    el.innerHTML = '<div class="log-empty">Aún no hay simulaciones guardadas</div>';
    return;
  }
  el.innerHTML = '';
  sims.forEach(s => {
    const row = document.createElement('div');
    row.className = 'log-entry';
    row.style.cursor = 'pointer';
    const fecha = s.createdAt ? new Date(s.createdAt).toLocaleString() : '';
    row.innerHTML = `
      <span class="log-tick">#${s.id}</span>
      <span class="log-badge badge-default">${s.algoritmo}</span>
      <span class="log-action">${s.quantum ? 'Q:' + s.quantum : ''} · ${fecha}</span>
      <span class="log-open"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg></span>`;
    row.title = 'Clic para reabrir esta simulación';
    row.addEventListener('click', async () => {
      try {
        const full = await msApi.request(`/simulaciones/${s.id}`);
        presentarResultado({ ...(full.resultado || {}), id: full.id });
      } catch (e) {
        showToast(`ms-cpu: ${e.message}`, 'error');
      }
    });
    el.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMsTabs();
  clearMsResult();
  loadProcesos();
  loadMsHistorico();

  msQ('msBtnAdd').addEventListener('click', handleMsAdd);
  msQ('msBtnRefresh').addEventListener('click', loadProcesos);
  msQ('msBtnBorrarTodos').addEventListener('click', handleMsBorrarTodos);
  msQ('msBtnSimular').addEventListener('click', handleMsSimular);
  msQ('msBtnLimpiar').addEventListener('click', clearMsResult);
});