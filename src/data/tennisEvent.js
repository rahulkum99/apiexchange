const axios = require('axios');

const API_URL = process.env.TENNIS_EVENT_API_URL || 'http://172.232.74.157/getdata';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT, 10) || 15000;

const tennisEventDataCache = new Map();
const fetchingStates = new Map();

const fetchTennisEventData = async (eventId) => {
  if (!eventId) {
    console.error('Tennis event API error: eventId is required');
    return null;
  }

  if (fetchingStates.get(eventId)) {
    return tennisEventDataCache.get(eventId) || null;
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
    tennisEventDataCache.set(eventId, data);
    return data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(
        `Tennis event API error (eventId: ${eventId}): Request timeout - API took longer than 15 seconds`,
      );
    } else if (error.response) {
      console.error(
        `Tennis event API error (eventId: ${eventId}): Server responded with status`,
        error.response.status,
      );
    } else if (error.request) {
      console.error(`Tennis event API error (eventId: ${eventId}): No response received from server`);
    } else {
      console.error(`Tennis event API error (eventId: ${eventId}):`, error.message);
    }
    return tennisEventDataCache.get(eventId) || null;
  } finally {
    fetchingStates.set(eventId, false);
  }
};

const getLatestTennisEventData = (eventId = null) => {
  if (eventId) {
    return tennisEventDataCache.get(eventId) || null;
  }
  const allData = Array.from(tennisEventDataCache.values());
  return allData.length > 0 ? allData.flat() : null;
};

module.exports = {
  fetchTennisEventData,
  getLatestTennisEventData,
};

