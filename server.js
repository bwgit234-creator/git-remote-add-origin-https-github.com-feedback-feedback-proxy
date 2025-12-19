require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';

let fetchFn = null;
(async () => {
  if (typeof globalThis.fetch === 'function') {
    fetchFn = globalThis.fetch.bind(globalThis);
  } else {
    const nodeFetch = await import('node-fetch');
    fetchFn = nodeFetch.default;
  }
})();

// Разрешаем запросы с любого origin
app.use(cors());
app.use(express.json());

const GAS_URL =
  process.env.GAS_URL ||
  'https://script.google.com/macros/s/AKfycbx-rRgZQUkWubQlbP66wkXqvhQ25UFiSEFAe9t0PJ4hRhEG8bO5CdVojfQVqfSXBzBHSg/exec'; // URL веб-приложения GAS (doPost)

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'feed.html'));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/feedback', async (req, res) => {
  try {
    console.log('[Feedback] Received data:', req.body);
    console.log('[Feedback] Sending to GAS_URL:', GAS_URL);

    if (!fetchFn) {
      throw new Error('Fetch function not initialized yet');
    }

    const response = await fetchFn(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });

    console.log('[Feedback] GAS response status:', response.status);

    const data = await response.json();
    console.log('[Feedback] GAS response data:', data);

    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error('[Feedback] Error:', err.message);
    console.error('[Feedback] Full error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error(`Failed to start proxy server on http://${HOST}:${PORT}`, err);
    process.exitCode = 1;
    return;
  }

  console.log(`Proxy server running at http://${HOST}:${PORT}`);
});
