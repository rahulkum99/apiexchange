require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { fetchCricketData } = require('./data/cricketMatches');
const { fetchCricketEventData } = require('./data/cricketEvent');
const { fetchSoccerData } = require('./data/soccerMatches');
const { fetchSoccerEventData } = require('./data/soccerEvent');
const { fetchTennisData } = require('./data/tennisMatches');
const { fetchTennisEventData } = require('./data/tennisEvent');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Exchange API is running' });
});

// Cricket matches
app.get('/cricket/matches', async (req, res) => {
  try {
    const data = await fetchCricketData();
    if (!data) {
      return res.status(503).json({ error: 'No cricket data available' });
    }
    // Same response as upstream API (just forward JSON)
    return res.json(data);
  } catch (err) {
    console.error('Error in /cricket/matches:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Cricket event
app.get('/cricket/event', async (req, res) => {
  try {
    const { eventId } = req.query;
    const data = await fetchCricketEventData(eventId);
    if (!data) {
      return res.status(503).json({ error: 'No cricket event data available' });
    }
    return res.json(data);
  } catch (err) {
    console.error('Error in /cricket/event:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Soccer matches
app.get('/soccer/matches', async (req, res) => {
  try {
    const data = await fetchSoccerData();
    if (!data) {
      return res.status(503).json({ error: 'No soccer data available' });
    }
    return res.json(data);
  } catch (err) {
    console.error('Error in /soccer/matches:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Soccer event
app.get('/soccer/event', async (req, res) => {
  try {
    const { eventId } = req.query;
    const data = await fetchSoccerEventData(eventId);
    if (!data) {
      return res.status(503).json({ error: 'No soccer event data available' });
    }
    return res.json(data);
  } catch (err) {
    console.error('Error in /soccer/event:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Tennis matches
app.get('/tennis/matches', async (req, res) => {
  try {
    const data = await fetchTennisData();
    if (!data) {
      return res.status(503).json({ error: 'No tennis data available' });
    }
    return res.json(data);
  } catch (err) {
    console.error('Error in /tennis/matches:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Tennis event
app.get('/tennis/event', async (req, res) => {
  try {
    const { eventId } = req.query;
    const data = await fetchTennisEventData(eventId);
    if (!data) {
      return res.status(503).json({ error: 'No tennis event data available' });
    }
    return res.json(data);
  } catch (err) {
    console.error('Error in /tennis/event:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Exchange API server listening on port ${PORT}`);
});

