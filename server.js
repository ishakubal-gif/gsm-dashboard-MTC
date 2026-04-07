const express = require('express');
const path = require('path');
const storage = require('./src/storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/mobile.html', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'mobile.html')));
app.get('/installation.html', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'installation.html')));
app.get('/admin.html', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.get('/api/data', (_req, res) => {
  const data = storage.loadObservations();
  res.json({ success: true, count: data.length, data });
});

app.get('/api/latest', (req, res) => {
  const n = Math.min(parseInt(req.query.n) || 10, 100);
  const data = storage.loadObservations();
  const latest = data.slice(-n).reverse();
  res.json({ success: true, count: latest.length, data: latest });
});

app.get('/api/status', (_req, res) => {
  const data = storage.loadObservations();
  const now = new Date();
  const lastReading = data.length > 0 ? data[data.length - 1].timestamp : null;
  res.json({
    success: true,
    status: 'operational',
    totalReadings: data.length,
    lastReading,
    serverTime: now.toISOString(),
    uptime: process.uptime(),
  });
});

app.post('/api/data', (req, res) => {
  const result = storage.addObservation(req.body);
  if (!result.success) return res.status(400).json({ success: false, error: result.error });
  res.status(201).json({ success: true, data: result.data });
});

app.delete('/api/data', (_req, res) => {
  storage.deleteAllObservations();
  res.json({ success: true, message: 'All observations deleted.' });
});

app.post('/api/delete-selected', (req, res) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: 'Provide an array of IDs.' });
  }
  const result = storage.deleteSelectedObservations(ids);
  res.json({ success: true, deleted: result.deleted });
});

app.get('/api/export/json', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename=gsm_data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ observations: storage.loadObservations() }, null, 2));
});

app.get('/api/export/csv', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename=gsm_data.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(storage.exportObservationsAsCSV(storage.loadObservations()));
});

app.get('/api/export/xlsx', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename=gsm_data.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(Buffer.from(storage.exportObservationsAsXLSX(storage.loadObservations())));
});

app.listen(PORT, () => {
  console.log(`\n> GSM Network Performance Server started on http://localhost:${PORT}\n`);
});
