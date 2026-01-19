const axios = require('axios');

const API_URL = process.env.TENNIS_MATCHES_API_URL || 'https://marketsarket.qnsports.live/gettennismatches2';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT, 10) || 15000;

let latestData = [];
let isFetching = false;

const fetchTennisData = async () => {
  if (isFetching) {
    return latestData.length > 0 ? latestData : null;
  }

  isFetching = true;
  try {
    const response = await axios.get(API_URL, {
      timeout: API_TIMEOUT,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    latestData = response.data;
    return latestData;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Tennis API error: Request timeout - API took longer than 15 seconds');
    } else if (error.response) {
      console.error('Tennis API error: Server responded with status', error.response.status);
    } else if (error.request) {
      console.error('Tennis API error: No response received from server');
    } else {
      console.error('Tennis API error:', error.message);
    }
    return latestData.length > 0 ? latestData : null;
  } finally {
    isFetching = false;
  }
};

const getLatestTennisData = () => latestData;

module.exports = {
  fetchTennisData,
  getLatestTennisData,
};

