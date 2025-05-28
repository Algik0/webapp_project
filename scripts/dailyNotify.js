// filepath: scripts/dailyNotify.js
// Script für täglichen E-Mail-Versand um 0 Uhr
const fetch = require('node-fetch');
const cron = require('node-cron');

// Cronjob: Jeden Tag um 0 Uhr
cron.schedule('0 0 * * *', async () => {
  try {
    // API-Request an lokalen Server
    const response = await fetch('http://localhost:3000/api/notify-important', {
      method: 'POST',
    });
    const data = await response.json();
    console.log('Notify-Job:', data);
  } catch (err) {
    console.error('Fehler beim Notify-Job:', err);
  }
});

console.log('Cronjob für täglichen Notify-Job läuft.');
