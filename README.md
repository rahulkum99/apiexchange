## Exchange API

Simple Node.js/Express wrapper around upstream sports APIs (cricket, soccer, tennis).  
This app forwards requests to the original endpoints, caches results briefly in memory, and returns **the same JSON shape** as the source APIs.

### Tech stack

- **Runtime**: Node.js (CommonJS)
- **Server**: Express
- **HTTP client**: Axios
- **Env config**: dotenv

### Install

From the project root:

```bash
npm install
```

### Run

```bash
npm start
```

The server will start on `http://localhost:3000` (or `PORT` from your env).

### Environment variables (optional)

- **`PORT`** – server port (default: `3000`)
- **`API_TIMEOUT`** – timeout in ms for upstream API calls (default: `15000`)
- **`CRICKET_MATCHES_API_URL`** – default: `https://marketsarket.qnsports.live/getcricketmatches2`
- **`CRICKET_EVENT_API_URL`** – default: `http://170.187.250.13/getbm`
- **`SOCCER_MATCHES_API_URL`** – default: `https://marketsarket.qnsports.live/getsoccermatches2`
- **`SOCCER_EVENT_API_URL`** – default: `http://172.232.74.157/getdata`
- **`TENNIS_MATCHES_API_URL`** – default: `https://marketsarket.qnsports.live/gettennismatches2`
- **`TENNIS_EVENT_API_URL`** – default: `http://172.232.74.157/getdata`

You can create a `.env` file in the project root, for example:

```bash
PORT=3000
API_TIMEOUT=15000
```

### Endpoints

All endpoints respond with JSON. They proxy the upstream services and preserve the original response body.

- **Health check**
  - **GET** `/`
  - Returns basic status of the API.

- **Cricket**
  - **GET** `/cricket/matches` – list of cricket matches.
  - **GET** `/cricket/event?eventId={id}` – data for a specific cricket event.

- **Soccer**
  - **GET** `/soccer/matches` – list of soccer matches.
  - **GET** `/soccer/event?eventId={id}` – data for a specific soccer event.

- **Tennis**
  - **GET** `/tennis/matches` – list of tennis matches.
  - **GET** `/tennis/event?eventId={id}` – data for a specific tennis event.

### Notes

- Basic in-memory caching is used inside the data modules to avoid overlapping requests and to serve the last successful response when the upstream API fails or times out.
- This app is stateless other than that in-memory cache; restarting the server clears all cached data.

