const axios = require('axios');

const API_URL = process.env.CRICKET_EVENT_API_URL || 'http://170.187.250.13/getbm';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT, 10) || 15000;

// Store data per event ID
const eventDataCache = new Map();
// Track fetching state per event ID
const fetchingStates = new Map();

const fetchCricketEventData = async (eventId) => {
  if (!eventId) {
    console.error('Cricket event API error: eventId is required');
    return null;
  }

  if (fetchingStates.get(eventId)) {
    return eventDataCache.get(eventId) || null;
  }

  fetchingStates.set(eventId, true);

  try {
    const response = await axios.get(`${API_URL}?eventId=${eventId}`, {
      timeout: API_TIMEOUT,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const data = response.data;
    eventDataCache.set(eventId, data);
    return data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(
        `Cricket event API error (eventId: ${eventId}): Request timeout - API took longer than 15 seconds`,
      );
    } else if (error.response) {
      console.error(
        `Cricket event API error (eventId: ${eventId}): Server responded with status`,
        error.response.status,
      );
    } else if (error.request) {
      console.error(`Cricket event API error (eventId: ${eventId}): No response received from server`);
    } else {
      console.error(`Cricket event API error (eventId: ${eventId}):`, error.message);
    }
    return eventDataCache.get(eventId) || null;
  } finally {
    fetchingStates.set(eventId, false);
  }
};

const getLatestCricketEventData = (eventId = null) => {
  if (eventId) {
    return eventDataCache.get(eventId) || null;
  }
  const allData = Array.from(eventDataCache.values());
  return allData.length > 0 ? allData.flat() : null;
};

module.exports = {
  fetchCricketEventData,
  getLatestCricketEventData,
};

