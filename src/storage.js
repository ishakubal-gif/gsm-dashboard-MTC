const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx');

const DATA_FILE = path.join(__dirname, '..', 'data', 'gsm_data.json');

function classifyQuality(rssi) {
  if (rssi >= -65) return 'Strong';
  if (rssi >= -85) return 'Medium';
  return 'Weak';
}

function validateObservation(obs) {
  const rssi = parseFloat(obs.rssi);
  if (isNaN(rssi) || rssi < -125 || rssi > -40) {
    return { valid: false, error: 'RSSI must be a number between -125 and -40 dBm.' };
  }
  if (!obs.location || String(obs.location).trim() === '') {
    return { valid: false, error: 'Location is required.' };
  }
  if (!['Connected', 'Dropped'].includes(obs.call_success)) {
    return { valid: false, error: 'call_success must be "Connected" or "Dropped".' };
  }
  return { valid: true };
}

function loadObservations() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    if (!fs.existsSync(DATA_FILE)) {
      // Create empty payload on first run
      fs.writeFileSync(DATA_FILE, JSON.stringify({ observations: [] }, null, 2), 'utf8');
      return [];
    }
    
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    
    // Explicitly handle wrapping
    if (parsed && Array.isArray(parsed.observations)) return parsed.observations;
    if (Array.isArray(parsed)) return parsed; // Backward compatibility
    
    return [];
  } catch (err) {
    console.error('[Storage] Load error:', err.message);
    return []; // Never return null
  }
}

function saveObservations(observations) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Consistently structure as { observations: [] }
    fs.writeFileSync(DATA_FILE, JSON.stringify({ observations }, null, 2), 'utf8');
  } catch (err) {
    console.error('[Storage] Save error:', err.message);
    throw new Error('Database write failed.');
  }
}

function addObservation(raw) {
  const validation = validateObservation(raw);
  if (!validation.valid) return { success: false, error: validation.error };

  const rssi = parseFloat(raw.rssi);
  const now = new Date();

  const observation = {
    id: uuidv4(),
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    location: String(raw.location).trim(),
    rssi: rssi,
    call_success: raw.call_success,
    quality: classifyQuality(rssi),
    timestamp: now.toISOString(),
  };

  const obsList = loadObservations();
  obsList.push(observation);
  saveObservations(obsList);

  return { success: true, data: observation };
}

function deleteAllObservations() {
  saveObservations([]); // Will automatically wrap in { observations: [] }
}

function deleteSelectedObservations(ids) {
  const obsList = loadObservations();
  const filtered = obsList.filter(o => !ids.includes(o.id));
  const deleted = obsList.length - filtered.length;
  saveObservations(filtered);
  return { deleted };
}

function exportObservationsAsCSV(observations) {
  const headers = ['ID', 'Timestamp', 'Time', 'Location', 'RSSI (dBm)', 'Call Result', 'Quality'];
  const rows = observations.map(o => [
    o.id, o.timestamp, o.time, `"${o.location}"`, o.rssi, o.call_success, o.quality
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function exportObservationsAsXLSX(observations) {
  const wsData = [
    ['ID', 'Timestamp', 'Time', 'Location', 'RSSI (dBm)', 'Call Result', 'Quality'],
    ...observations.map(o => [o.id, o.timestamp, o.time, o.location, o.rssi, o.call_success, o.quality])
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{ wch: 38 }, { wch: 26 }, { wch: 8 }, { wch: 25 }, { wch: 12 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Readings');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
  classifyQuality, loadObservations, saveObservations, addObservation,
  deleteAllObservations, deleteSelectedObservations,
  exportObservationsAsCSV, exportObservationsAsXLSX,
};
