/**
 * METEOMATRIX Enterprise Weather Intelligence System
 * Asynchronous JavaScript & RESTful APIs Module
 * 
 * Features:
 * - Modern async/await architecture using native Fetch API
 * - Granular error handling, timeouts (AbortController), and offline fallback
 * - Parsing & dynamic rendering of complex nested JSON payloads
 * - Live geocoding autocomplete with debouncing & keyboard navigation
 * - Workplace & Commute meteorological intelligence
 * - Dynamic unit switching (°C / °F) with immediate re-computation
 * - LocalStorage persistence for recent searches & user preferences
 */

'use strict';

/* ==========================================================================
   1. GLOBAL CONSTANTS & CONFIGURATION
   ========================================================================== */

const CONFIG = {
  GEOCODING_ENDPOINT: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST_ENDPOINT: 'https://api.open-meteo.com/v1/forecast',
  AIR_QUALITY_ENDPOINT: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  REVERSE_GEO_ENDPOINT: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  TIMEOUT_MS: 9000,
  DEFAULT_CITY: 'London',
  STORAGE_KEYS: {
    THEME: 'meteomatrix_theme',
    UNIT: 'meteomatrix_unit',
    RECENTS: 'meteomatrix_recents',
    LAST_LOCATION: 'meteomatrix_last_loc'
  }
};

/* Safe localStorage wrappers: storage access can throw (private mode,
   hardened browsers, some file:// configurations) and must never crash the app. */
const storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* Ignore quota / privacy errors — persistence is best-effort. */
    }
  }
};

/* Defensive JSON parse: returns the fallback instead of throwing on corrupt data. */
const safeJSON = (raw, fallback) => {
  if (raw === null || raw === undefined) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
};

/* Defensive numeric coercion: guarantees a finite number for math/rendering. */
const numOr = (value, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

/* WMO Weather Interpretation Codes (WW) Map */
const WMO_CODES = {
  0: { label: 'Clear Sky', icon: 'clear', isSunny: true },
  1: { label: 'Mainly Clear', icon: 'partly-cloudy', isSunny: true },
  2: { label: 'Partly Cloudy', icon: 'partly-cloudy', isSunny: true },
  3: { label: 'Overcast', icon: 'overcast', isSunny: false },
  45: { label: 'Fog & Mist', icon: 'fog', isSunny: false },
  48: { label: 'Depositing Rime Fog', icon: 'fog', isSunny: false },
  51: { label: 'Light Drizzle', icon: 'drizzle', isSunny: false },
  53: { label: 'Moderate Drizzle', icon: 'drizzle', isSunny: false },
  55: { label: 'Dense Drizzle', icon: 'drizzle', isSunny: false },
  61: { label: 'Slight Rain', icon: 'rain', isSunny: false },
  63: { label: 'Moderate Rain', icon: 'rain', isSunny: false },
  65: { label: 'Heavy Rain', icon: 'heavy-rain', isSunny: false },
  71: { label: 'Slight Snowfall', icon: 'snow', isSunny: false },
  73: { label: 'Moderate Snowfall', icon: 'snow', isSunny: false },
  75: { label: 'Heavy Snowfall', icon: 'snow', isSunny: false },
  77: { label: 'Snow Grains', icon: 'snow', isSunny: false },
  80: { label: 'Slight Showers', icon: 'rain', isSunny: false },
  81: { label: 'Moderate Showers', icon: 'rain', isSunny: false },
  82: { label: 'Violent Showers', icon: 'heavy-rain', isSunny: false },
  85: { label: 'Slight Snow Showers', icon: 'snow', isSunny: false },
  86: { label: 'Heavy Snow Showers', icon: 'snow', isSunny: false },
  95: { label: 'Thunderstorm', icon: 'thunderstorm', isSunny: false },
  96: { label: 'Thunderstorm with Hail', icon: 'thunderstorm', isSunny: false },
  99: { label: 'Severe Thunderstorm', icon: 'thunderstorm', isSunny: false }
};

/* ==========================================================================
   2. APPLICATION STATE
   ========================================================================== */

const state = {
  currentUnit: storage.get(CONFIG.STORAGE_KEYS.UNIT) === 'f' ? 'f' : 'c', // 'c' or 'f'
  activeLocation: null,          // location whose data is currently rendered
  activeWeatherData: null,
  activeAirData: null,
  lastAttemptedLocation: null,   // location of the most recent (possibly failed) load
  requestSeq: 0,                 // monotonically increasing token to discard stale responses
  suggestSeq: 0,                 // token for autocomplete responses
  recents: (() => {
    const parsed = safeJSON(storage.get(CONFIG.STORAGE_KEYS.RECENTS), []);
    return Array.isArray(parsed)
      ? parsed.filter(r => r && typeof r.name === 'string'
          && Number.isFinite(Number(r.latitude)) && Number.isFinite(Number(r.longitude)))
      : [];
  })(),
  clockIntervalId: null,
  activeController: null
};

/* Highlighted autocomplete option index (keyboard navigation) */
let suggestionHighlightIndex = -1;

/* ==========================================================================
   3. DOM ELEMENT REFERENCES
   ========================================================================== */

const DOM = {
  // Navigation & Search
  searchContainer: document.querySelector('.search-container'),
  searchForm: document.getElementById('searchForm'),
  cityInput: document.getElementById('cityInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  geoBtn: document.getElementById('geoBtn'),
  suggestionsDropdown: document.getElementById('suggestionsDropdown'),
  searchSubmitBtn: document.getElementById('searchSubmitBtn'),
  unitCelsiusBtn: document.getElementById('unitCelsiusBtn'),
  unitFahrenheitBtn: document.getElementById('unitFahrenheitBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIconSun: document.getElementById('themeIconSun'),
  themeIconMoon: document.getElementById('themeIconMoon'),
  hubsContainer: document.getElementById('hubsContainer'),
  recentsToggleBtn: document.getElementById('recentsToggleBtn'),
  recentsDropdown: document.getElementById('recentsDropdown'),

  // Alerts & Notifications
  networkAlert: document.getElementById('networkAlert'),
  networkAlertText: document.getElementById('networkAlertText'),
  closeAlertBtn: document.getElementById('closeAlertBtn'),
  toastContainer: document.getElementById('toastContainer'),

  // State Containers
  loadingSkeleton: document.getElementById('loadingSkeleton'),
  errorState: document.getElementById('errorState'),
  errorTitle: document.getElementById('errorTitle'),
  errorMessage: document.getElementById('errorMessage'),
  errorRetryBtn: document.getElementById('errorRetryBtn'),
  errorDefaultBtn: document.getElementById('errorDefaultBtn'),
  dashboardContent: document.getElementById('dashboardContent'),

  // Location Header
  cityNameDisplay: document.getElementById('cityNameDisplay'),
  countryBadge: document.getElementById('countryBadge'),
  coordsBadge: document.getElementById('coordsBadge'),
  locationSub: document.getElementById('locationSub'),
  localTimeDisplay: document.getElementById('localTimeDisplay'),
  timezoneDisplay: document.getElementById('timezoneDisplay'),
  lastUpdatedDisplay: document.getElementById('lastUpdatedDisplay'),

  // Hero Condition Card
  conditionBadge: document.getElementById('conditionBadge'),
  heroIconContainer: document.getElementById('heroIconContainer'),
  heroTemp: document.getElementById('heroTemp'),
  heroTempUnit: document.getElementById('heroTempUnit'),
  heroFeelsLike: document.getElementById('heroFeelsLike'),
  heroHighLow: document.getElementById('heroHighLow'),
  executiveSummary: document.getElementById('executiveSummary'),

  // Workplace / Commute Advisory
  comfortBadge: document.getElementById('comfortBadge'),
  commuteVal: document.getElementById('commuteVal'),
  attireVal: document.getElementById('attireVal'),
  hvacVal: document.getElementById('hvacVal'),
  lunchVal: document.getElementById('lunchVal'),

  // Secondary Metrics
  humidityVal: document.getElementById('humidityVal'),
  humidityBar: document.getElementById('humidityBar'),
  dewPointVal: document.getElementById('dewPointVal'),

  windSpeedVal: document.getElementById('windSpeedVal'),
  windUnit: document.getElementById('windUnit'),
  compassNeedle: document.getElementById('compassNeedle'),
  windDirVal: document.getElementById('windDirVal'),

  uvVal: document.getElementById('uvVal'),
  uvPill: document.getElementById('uvPill'),
  uvBar: document.getElementById('uvBar'),
  uvAdvice: document.getElementById('uvAdvice'),

  pressureVal: document.getElementById('pressureVal'),
  pressureBar: document.getElementById('pressureBar'),
  pressureTrend: document.getElementById('pressureTrend'),

  precipProbVal: document.getElementById('precipProbVal'),
  precipBar: document.getElementById('precipBar'),
  precipAmountVal: document.getElementById('precipAmountVal'),

  aqiVal: document.getElementById('aqiVal'),
  aqiPill: document.getElementById('aqiPill'),
  aqiBar: document.getElementById('aqiBar'),
  aqiSub: document.getElementById('aqiSub'),

  // Solar Ephemeris
  daylightDuration: document.getElementById('daylightDuration'),
  sunriseTime: document.getElementById('sunriseTime'),
  sunsetTime: document.getElementById('sunsetTime'),
  daylightProgressFill: document.getElementById('daylightProgressFill'),
  sunMarker: document.getElementById('sunMarker'),
  daylightStatusText: document.getElementById('daylightStatusText'),

  // Forecasts
  hourlyTimeline: document.getElementById('hourlyTimeline'),
  dailyForecastContainer: document.getElementById('dailyForecastContainer')
};

/* ==========================================================================
   4. ASYNCHRONOUS WEATHER API SERVICE (RESTful Client)
   ========================================================================== */

class WeatherService {
  /**
   * Helper to perform fetch with AbortController timeout & HTTP error handling
   * @param {string} url 
   * @param {AbortSignal} externalSignal 
   * @returns {Promise<any>}
   */
  static async fetchJSON(url, externalSignal = null) {
    // Proactive offline detection before any network I/O
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error('You appear to be offline. Reconnect to the internet and press Retry.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
    const onExternalAbort = () => controller.abort();

    // Combine signals if external signal is provided
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else externalSignal.addEventListener('abort', onExternalAbort);
    }

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        const status = response.status;
        if (status === 404) {
          throw new Error('Location or data not found (404). Please verify the city name and try again.');
        }
        if (status === 429) {
          throw new Error('Rate limit reached (429). Please wait a moment and press Retry.');
        }
        if (status >= 500) {
          throw new Error('Weather service is temporarily unavailable (5xx). Please press Retry shortly.');
        }
        throw new Error(`Request failed with HTTP status ${status}. Please press Retry.`);
      }

      try {
        return await response.json();
      } catch (parseError) {
        throw new Error('The server returned an invalid response. Please press Retry.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        const message = externalSignal && externalSignal.aborted
          ? 'Request superseded by a newer request.'
          : 'Network request timed out. Please check your internet connectivity and press Retry.';
        throw new Error(message);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }

  /**
   * Search for locations matching a query string
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  static async searchLocations(query, signal = null) {
    if (!query || query.trim().length < 2) return [];
    
    const encoded = encodeURIComponent(query.trim());
    const url = `${CONFIG.GEOCODING_ENDPOINT}?name=${encoded}&count=6&language=en&format=json`;
    
    const data = await this.fetchJSON(url, signal);
    if (!data || !Array.isArray(data.results)) {
      return [];
    }
    return data.results;
  }

  /**
   * Fetch complete nested weather telemetry from Open-Meteo REST API
   * @param {number} latitude 
   * @param {number} longitude 
   * @param {string} timezone 
   * @returns {Promise<Object>}
   */
  static async fetchForecast(latitude, longitude, timezone = 'auto', signal = null) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'uv_index'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'weather_code',
        'wind_speed_10m'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'precipitation_probability_max',
        'uv_index_max'
      ].join(','),
      timezone: timezone || 'auto',
      forecast_days: '7'
    });

    const url = `${CONFIG.FORECAST_ENDPOINT}?${params.toString()}`;
    return await this.fetchJSON(url, signal);
  }

  /**
   * Fetch Air Quality indices for the coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Object|null>}
   */
  static async fetchAirQuality(latitude, longitude, signal = null) {
    try {
      const url = `${CONFIG.AIR_QUALITY_ENDPOINT}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10`;
      return await this.fetchJSON(url, signal);
    } catch (err) {
      if (signal && signal.aborted) throw err; // propagate cancellation, not a real failure
      console.warn('Air Quality endpoint optional fetch failed:', err.message);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to a clean place name
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<Object>}
   */
  static async reverseGeocode(lat, lon) {
    try {
      const url = `${CONFIG.REVERSE_GEO_ENDPOINT}?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await this.fetchJSON(url);
      return {
        name: res.city || res.locality || res.principalSubdivision || 'Local Station',
        country: res.countryName || 'Station',
        admin1: res.principalSubdivision || '',
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    } catch (e) {
      return {
        name: `Lat: ${lat.toFixed(2)}°`,
        country: `Lon: ${lon.toFixed(2)}°`,
        admin1: '',
        latitude: lat,
        longitude: lon,
        timezone: 'auto'
      };
    }
  }
}

/* ==========================================================================
   5. WEATHER ICON SVG FACTORY
   ========================================================================== */

class WeatherIcons {
  static get(type, isDay = 1) {
    const isNight = isDay === 0;

    switch (type) {
      case 'clear':
        if (isNight) {
          return `<svg viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>`;
        }
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;

      case 'partly-cloudy':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41"></path>
          <path d="M15.5 17a4.5 4.5 0 0 0-4-6.5A5.5 5.5 0 0 0 3 15a4 4 0 0 0 4 4h8.5a4.5 4.5 0 0 0 0-9Z"></path>
        </svg>`;

      case 'overcast':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        </svg>`;

      case 'drizzle':
      case 'rain':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 13a4 4 0 0 0-7.8-1.4A4.5 4.5 0 0 0 3 16a3.5 3.5 0 0 0 3.5 3.5H16a4 4 0 0 0 0-8Z"></path>
          <line x1="8" y1="19" x2="8" y2="22"></line>
          <line x1="12" y1="19" x2="12" y2="22"></line>
          <line x1="16" y1="19" x2="16" y2="22"></line>
        </svg>`;

      case 'heavy-rain':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
          <path d="m9.2 17-2.4 4M13.2 17l-2.4 4M17.2 17l-2.4 4"></path>
        </svg>`;

      case 'snow':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
          <line x1="8" y1="16" x2="8.01" y2="16"></line>
          <line x1="8" y1="20" x2="8.01" y2="20"></line>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
          <line x1="12" y1="22" x2="12.01" y2="22"></line>
          <line x1="16" y1="16" x2="16.01" y2="16"></line>
          <line x1="16" y1="20" x2="16.01" y2="20"></line>
        </svg>`;

      case 'thunderstorm':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
          <polyline points="13 11 9 17 15 17 11 23"></polyline>
        </svg>`;

      case 'fog':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="10" x2="20" y2="10"></line>
          <line x1="4" y1="14" x2="20" y2="14"></line>
          <line x1="6" y1="18" x2="18" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="6"></line>
        </svg>`;

      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
        </svg>`;
    }
  }
}

/* ==========================================================================
   6. UNIT CONVERSIONS & FORMATTING UTILITIES
   ========================================================================== */

class UnitConverter {
  static toFahrenheit(celsius) {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
    return (celsius * 9) / 5 + 32;
  }

  static toCelsius(val) {
    return val;
  }

  static formatTemp(celsius, unit = state.currentUnit) {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
    const num = unit === 'f' ? this.toFahrenheit(celsius) : celsius;
    return Math.round(num);
  }

  static formatWind(kmh, unit = state.currentUnit) {
    if (kmh === null || kmh === undefined || isNaN(kmh)) return { val: '--', unit: 'km/h' };
    if (unit === 'f') {
      const mph = kmh * 0.621371;
      return { val: Math.round(mph), unit: 'mph' };
    }
    return { val: Math.round(kmh), unit: 'km/h' };
  }

  static getWindDirectionName(degrees) {
    if (degrees === null || degrees === undefined || !Number.isFinite(degrees)) return 'VAR';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
    return directions[idx];
  }

  static getUVRating(uv) {
    if (uv === null || uv === undefined || !Number.isFinite(uv)) {
      return { label: 'N/A', class: 'uv-low', advice: 'UV telemetry unavailable' };
    }
    if (uv < 3) return { label: 'Low', class: 'uv-low', advice: 'Safe for outdoor transit & lunch' };
    if (uv < 6) return { label: 'Moderate', class: 'uv-mod', advice: 'Wear sunglasses during afternoon commute' };
    if (uv < 8) return { label: 'High', class: 'uv-high', advice: 'Sun protection recommended during midday' };
    return { label: 'Very High', class: 'uv-very-high', advice: 'Seek shade during peak daylight hours' };
  }

  static getAQIRating(aqi) {
    if (aqi === null || aqi === undefined || !Number.isFinite(aqi)) {
      return { label: 'N/A', desc: 'Air quality telemetry unavailable', color: '#94a3b8' };
    }
    if (aqi <= 50) return { label: 'Good', desc: 'Clean & Healthy', color: '#10b981' };
    if (aqi <= 100) return { label: 'Moderate', desc: 'Acceptable', color: '#f59e0b' };
    if (aqi <= 150) return { label: 'Sensitive', desc: 'Mild Irritation Risk', color: '#f97316' };
    return { label: 'Unhealthy', desc: 'Air Quality Advisory', color: '#ef4444' };
  }
}

/* ==========================================================================
   7. UI CONTROLLER & RENDERING LOGIC
   ========================================================================== */

class UIController {
  /**
   * Render complete weather dashboard
   */
  static renderDashboard(location, forecast, airQuality) {
    this.hideError();
    this.hideLoading();
    DOM.dashboardContent.classList.remove('hidden');

    const current = forecast && typeof forecast === 'object' ? forecast.current : null;
    const daily = (forecast && forecast.daily && typeof forecast.daily === 'object') ? forecast.daily : {};
    const hourly = (forecast && forecast.hourly && typeof forecast.hourly === 'object') ? forecast.hourly : {};

    if (!current || typeof current !== 'object') {
      throw new Error('The weather service returned incomplete weather data. Please press Retry.');
    }

    const codeMeta = WMO_CODES[current.weather_code] || { label: 'Moderate Conditions', icon: 'clear', isSunny: true };

    // 1. Header Location & Telemetry
    DOM.cityNameDisplay.textContent = location.name || 'Unknown Station';
    DOM.countryBadge.textContent = location.country || 'Global Station';

    const lat = Number(location.latitude);
    const lon = Number(location.longitude);
    DOM.coordsBadge.textContent = (Number.isFinite(lat) && Number.isFinite(lon))
      ? `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`
      : 'Coordinates unavailable';

    const adminStr = location.admin1 ? `${location.admin1} • ` : '';
    const elevation = numOr(location.elevation, null) ?? numOr(forecast.elevation, null);
    const elevationStr = elevation !== null ? `Elevation: ${Math.round(elevation)}m` : '';
    DOM.locationSub.textContent = `${adminStr}${location.country || ''} ${elevationStr ? '• ' + elevationStr : ''}`.trim();

    // 2. Local Station Clock & Timezone
    this.startStationClock(forecast.timezone || location.timezone || 'auto');
    DOM.lastUpdatedDisplay.textContent = `Updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // 3. Hero Condition Card
    DOM.conditionBadge.textContent = codeMeta.label;
    DOM.heroIconContainer.innerHTML = WeatherIcons.get(codeMeta.icon, current.is_day);

    const tempFormatted = UnitConverter.formatTemp(current.temperature_2m);
    DOM.heroTemp.textContent = tempFormatted;
    DOM.heroTempUnit.textContent = `°${state.currentUnit.toUpperCase()}`;

    const feelsLikeFormatted = UnitConverter.formatTemp(current.apparent_temperature);
    DOM.heroFeelsLike.textContent = `${feelsLikeFormatted}°${state.currentUnit.toUpperCase()}`;

    // High and Low for Today (from daily array)
    const todayMax = UnitConverter.formatTemp(daily.temperature_2m_max && daily.temperature_2m_max[0]);
    const todayMin = UnitConverter.formatTemp(daily.temperature_2m_min && daily.temperature_2m_min[0]);
    DOM.heroHighLow.textContent = `H: ${todayMax}° • L: ${todayMin}°`;

    // 4. Executive Briefing / Narrative
    this.renderExecutiveSummary(current, daily, codeMeta);

    // 5. Workplace / Commute Advisory
    this.renderWorkplaceAdvisory(current, daily, codeMeta);

    // 6. Secondary Metrics Grid
    this.renderMetricsTiles(current, daily, airQuality);

    // 7. Daylight & Sun Progression
    this.renderDaylightProgression(daily, forecast.timezone || location.timezone || 'auto');

    // 8. Hourly Trajectory (Next 24 hours)
    this.renderHourlyForecast(hourly, current.time);

    // 9. 7-Day Extended Outlook
    this.renderDailyForecast(daily);
  }

  /**
   * Render dynamic executive briefing text
   */
  static renderExecutiveSummary(current, daily, codeMeta) {
    const temp = numOr(current.temperature_2m, null);
    const wind = numOr(current.wind_speed_10m, null);
    const rainProb = Math.round(numOr(daily.precipitation_probability_max && daily.precipitation_probability_max[0], 0));
    const windInfo = UnitConverter.formatWind(wind);

    let summary = `Station reports <strong>${codeMeta.label.toLowerCase()}</strong> with temperatures near <strong>${UnitConverter.formatTemp(temp)}°${state.currentUnit.toUpperCase()}</strong>. `;

    if (rainProb >= 40) {
      summary += `Precipitation risk elevated at <strong>${rainProb}%</strong>; transit delays and wet roadways anticipated. `;
    } else {
      summary += `Favorable low precipitation probability (${rainProb}%). `;
    }

    if (wind !== null && wind > 35) {
      summary += `Notable surface wind gusts (${windInfo.val} ${windInfo.unit}); exercise caution in elevated pedestrian or transport corridors.`;
    } else {
      summary += `Light surface breeze with nominal atmospheric stability.`;
    }

    DOM.executiveSummary.innerHTML = summary;
  }

  /**
   * Render workplace and office commute recommendations
   */
  static renderWorkplaceAdvisory(current, daily, codeMeta) {
    const temp = numOr(current.temperature_2m, 20);
    const precipProb = Math.round(numOr(daily.precipitation_probability_max && daily.precipitation_probability_max[0], 0));
    const wind = numOr(current.wind_speed_10m, 0);
    const humidity = numOr(current.relative_humidity_2m, 50);
    const weatherCode = numOr(current.weather_code, 0);

    // Commute Condition
    if (precipProb >= 60 || weatherCode >= 80) {
      DOM.commuteVal.textContent = 'Wet Roadways / Carry Umbrella';
      DOM.comfortBadge.textContent = 'Caution';
      DOM.comfortBadge.style.color = 'var(--status-warning)';
    } else if (wind > 40) {
      DOM.commuteVal.textContent = 'Gusty Winds / Minor Commute Delay';
      DOM.comfortBadge.textContent = 'Caution';
      DOM.comfortBadge.style.color = 'var(--status-warning)';
    } else {
      DOM.commuteVal.textContent = 'Dry & Clear / Minimal Delay';
      DOM.comfortBadge.textContent = 'Optimal';
      DOM.comfortBadge.style.color = 'var(--status-success)';
    }

    // Attire
    if (temp < 8) {
      DOM.attireVal.textContent = 'Heavy Overcoat & Thermal Layer';
    } else if (temp < 16) {
      DOM.attireVal.textContent = 'Business Trench / Light Jacket';
    } else if (temp > 28) {
      DOM.attireVal.textContent = 'Light Breathable Corporate Linen';
    } else {
      DOM.attireVal.textContent = 'Standard Business Casual';
    }

    // HVAC
    if (humidity > 70) {
      DOM.hvacVal.textContent = 'Dehumidify Mode (21.5°C)';
    } else if (temp < 10) {
      DOM.hvacVal.textContent = 'Moderate Heating (22.0°C)';
    } else {
      DOM.hvacVal.textContent = 'Eco Balanced (21.0°C)';
    }

    // Lunch / Outdoor Meetings
    if (precipProb < 25 && temp >= 15 && temp <= 27 && wind < 25) {
      DOM.lunchVal.textContent = 'Prime for Outdoor Patio Lunch';
    } else if (precipProb >= 40) {
      DOM.lunchVal.textContent = 'Indoor Dining Recommended';
    } else if (temp < 10 || temp > 32) {
      DOM.lunchVal.textContent = 'Climate-Controlled Indoor Space';
    } else {
      DOM.lunchVal.textContent = 'Fair for Brief Walking Break';
    }
  }

  /**
   * Render secondary KPI cards
   */
  static renderMetricsTiles(current, daily, airQuality) {
    // 1. Humidity & Dew Point
    const humidityRaw = current.relative_humidity_2m;
    const humidity = Number.isFinite(humidityRaw) ? humidityRaw : null;
    DOM.humidityVal.textContent = humidity === null ? '--' : Math.round(humidity);
    DOM.humidityBar.style.width = `${humidity === null ? 0 : Math.min(Math.max(humidity, 0), 100)}%`;

    // Calculate approximate dew point: T - ((100 - RH)/5)
    const tempC = numOr(current.temperature_2m, null);
    const dewPointC = (tempC !== null && humidity !== null) ? tempC - (100 - humidity) / 5 : null;
    const dewPointFormatted = UnitConverter.formatTemp(dewPointC);
    DOM.dewPointVal.textContent = `Dew point: ${dewPointFormatted}°${state.currentUnit.toUpperCase()}`;

    // 2. Wind
    const windInfo = UnitConverter.formatWind(current.wind_speed_10m);
    DOM.windSpeedVal.textContent = windInfo.val;
    DOM.windUnit.textContent = windInfo.unit;

    const windDirRaw = current.wind_direction_10m;
    const windDir = Number.isFinite(windDirRaw) ? windDirRaw : null;
    DOM.compassNeedle.style.transform = `rotate(${windDir ?? 0}deg)`;
    const compassDir = UnitConverter.getWindDirectionName(windDir);
    const gustSource = Number.isFinite(current.wind_gusts_10m)
      ? current.wind_gusts_10m
      : (Number.isFinite(current.wind_speed_10m) ? current.wind_speed_10m * 1.3 : null);
    const gustInfo = UnitConverter.formatWind(gustSource);
    DOM.windDirVal.textContent = windDir === null
      ? `${compassDir} • Gusts: ${gustInfo.val} ${gustInfo.unit}`
      : `${compassDir} (${Math.round(windDir)}°) • Gusts: ${gustInfo.val} ${gustInfo.unit}`;

    // 3. UV Index
    const dailyUvMax = daily.uv_index_max && daily.uv_index_max[0];
    const uv = Number.isFinite(current.uv_index)
      ? current.uv_index
      : (Number.isFinite(dailyUvMax) ? dailyUvMax : null);

    if (uv === null) {
      DOM.uvVal.textContent = '--';
      DOM.uvPill.textContent = 'N/A';
      DOM.uvAdvice.textContent = 'UV telemetry unavailable';
      DOM.uvBar.style.width = '0%';
    } else {
      DOM.uvVal.textContent = uv.toFixed(1);
      const uvRating = UnitConverter.getUVRating(uv);
      DOM.uvPill.textContent = uvRating.label;
      DOM.uvAdvice.textContent = uvRating.advice;
      DOM.uvBar.style.width = `${Math.min(Math.max((uv / 11) * 100, 0), 100)}%`;
    }

    // 4. Pressure
    const pressureRaw = current.surface_pressure;
    if (Number.isFinite(pressureRaw)) {
      const pressure = Math.round(pressureRaw);
      DOM.pressureVal.textContent = pressure;
      const pressurePct = Math.min(Math.max(((pressure - 970) / 80) * 100, 5), 95);
      DOM.pressureBar.style.width = `${pressurePct}%`;

      if (pressure > 1020) {
        DOM.pressureTrend.textContent = 'High Barometric (Stable)';
      } else if (pressure < 1005) {
        DOM.pressureTrend.textContent = 'Low Barometric (Precipitation Likely)';
      } else {
        DOM.pressureTrend.textContent = 'Standard Nominal Atmospheric';
      }
    } else {
      DOM.pressureVal.textContent = '--';
      DOM.pressureBar.style.width = '50%';
      DOM.pressureTrend.textContent = 'Pressure telemetry unavailable';
    }

    // 5. Precipitation
    const precipProb = Math.round(numOr(daily.precipitation_probability_max && daily.precipitation_probability_max[0], 0));
    DOM.precipProbVal.textContent = precipProb;
    DOM.precipBar.style.width = `${Math.min(Math.max(precipProb, 0), 100)}%`;
    const accumulation = numOr(current.precipitation, null);
    DOM.precipAmountVal.textContent = accumulation === null
      ? 'Accumulation: -- mm'
      : `Accumulation: ${accumulation.toFixed(1)} mm`;

    // 6. Air Quality (optional endpoint — never fabricate a value)
    const aqiRaw = airQuality && airQuality.current ? airQuality.current.us_aqi : null;
    const pm25Raw = airQuality && airQuality.current ? airQuality.current.pm2_5 : null;

    if (Number.isFinite(aqiRaw)) {
      const aqiRating = UnitConverter.getAQIRating(aqiRaw);
      const pm25 = Number.isFinite(pm25Raw) ? pm25Raw.toFixed(1) : '--';

      DOM.aqiVal.textContent = Math.round(aqiRaw);
      DOM.aqiPill.textContent = aqiRating.label;
      DOM.aqiBar.style.width = `${Math.min(Math.max((aqiRaw / 200) * 100, 0), 100)}%`;
      DOM.aqiSub.textContent = `PM2.5: ${pm25} µg/m³ • ${aqiRating.desc}`;
    } else {
      DOM.aqiVal.textContent = '--';
      DOM.aqiPill.textContent = 'N/A';
      DOM.aqiBar.style.width = '0%';
      DOM.aqiSub.textContent = 'Air quality telemetry unavailable';
    }
  }

  /**
   * Parse an Open-Meteo wall-clock ISO string ("2026-11-07T07:04")
   * into a Date using its literal clock components (station local time).
   * Returns null instead of an Invalid Date for malformed input.
   */
  static parseWallClock(isoString) {
    if (typeof isoString !== 'string') return null;
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
    if (!match) return null;
    const date = new Date(
      Number(match[1]), Number(match[2]) - 1, Number(match[3]),
      Number(match[4]), Number(match[5])
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  /**
   * Current time expressed in the station's wall clock, so daylight
   * progress is correct even when the browser timezone differs.
   */
  static nowInTimeZone(timeZone) {
    const now = new Date();
    if (!timeZone || timeZone === 'auto') return now;
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).formatToParts(now);
      const get = (type) => {
        const part = parts.find(p => p.type === type);
        return part ? Number(part.value) : NaN;
      };
      const date = new Date(
        get('year'), get('month') - 1, get('day'),
        get('hour') % 24, get('minute'), get('second') // some locales report midnight as "24"
      );
      return Number.isNaN(date.getTime()) ? now : date;
    } catch (e) {
      return now;
    }
  }

  /**
   * Render Daylight & Solar Schedule Progress
   */
  static renderDaylightProgression(daily, timeZone = 'auto') {
    const sunriseDate = this.parseWallClock(daily && daily.sunrise && daily.sunrise[0]);
    const sunsetDate = this.parseWallClock(daily && daily.sunset && daily.sunset[0]);

    if (!sunriseDate || !sunsetDate) {
      DOM.sunriseTime.textContent = '--:--';
      DOM.sunsetTime.textContent = '--:--';
      DOM.daylightDuration.textContent = 'Daylight: --h --m';
      DOM.daylightProgressFill.style.width = '0%';
      DOM.sunMarker.style.left = '0%';
      DOM.daylightStatusText.textContent = 'Solar telemetry unavailable for this location';
      return;
    }

    const sunriseFormatted = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetFormatted = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    DOM.sunriseTime.textContent = sunriseFormatted;
    DOM.sunsetTime.textContent = sunsetFormatted;

    // Daylight duration (both values are station wall-clock, so this is exact)
    const diffMs = sunsetDate - sunriseDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    DOM.daylightDuration.textContent = `Daylight: ${diffHours}h ${diffMins}m`;

    // Progress percentage (now converted to the station's wall clock)
    const nowDate = this.nowInTimeZone(timeZone);
    const totalDaylightMs = sunsetDate - sunriseDate;
    const elapsedMs = nowDate - sunriseDate;

    let progress = 0;
    if (nowDate < sunriseDate) {
      progress = 0;
      DOM.daylightStatusText.textContent = `Dawn approaching in ${Math.max(0, Math.round((sunriseDate - nowDate) / (1000 * 60)))} mins`;
    } else if (nowDate > sunsetDate) {
      progress = 100;
      DOM.daylightStatusText.textContent = 'Night cycle active • Ephemeris reset at dawn';
    } else {
      progress = totalDaylightMs > 0 ? Math.min(Math.max((elapsedMs / totalDaylightMs) * 100, 0), 100) : 0;
      DOM.daylightStatusText.textContent = `Daylight active (${Math.round(progress)}% elapsed)`;
    }

    DOM.daylightProgressFill.style.width = `${progress}%`;
    DOM.sunMarker.style.left = `${progress}%`;
  }

  /**
   * Render dynamic hourly forecast trajectory
   */
  static renderHourlyForecast(hourly, currentIsoTime) {
    DOM.hourlyTimeline.innerHTML = '';
    if (!hourly || !Array.isArray(hourly.time) || hourly.time.length === 0) return;

    // Find starting hour index (exact hour match, else first hour >= now)
    let startIndex = 0;
    if (currentIsoTime) {
      const currentHourPrefix = String(currentIsoTime).slice(0, 13);
      const exactIdx = hourly.time.findIndex(t => typeof t === 'string' && t.startsWith(currentHourPrefix));
      if (exactIdx !== -1) {
        startIndex = exactIdx;
      } else {
        const nextIdx = hourly.time.findIndex(t => typeof t === 'string' && t >= String(currentIsoTime));
        if (nextIdx !== -1) startIndex = nextIdx;
      }
    }

    // Render next 24 consecutive hours
    const count = Math.min(24, hourly.time.length - startIndex);
    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const timeStr = hourly.time[idx];
      const date = this.parseWallClock(timeStr);
      const hourLabel = i === 0
        ? 'Now'
        : (date ? date.toLocaleTimeString([], { hour: 'numeric' }) : '--');

      const code = hourly.weather_code ? hourly.weather_code[idx] : undefined;
      const meta = WMO_CODES[code] || { label: 'Clear', icon: 'clear' };
      const temp = UnitConverter.formatTemp(hourly.temperature_2m && hourly.temperature_2m[idx]);

      const rainRaw = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : null;
      const rain = Number.isFinite(Number(rainRaw)) ? Math.round(Number(rainRaw)) : 0;

      const windRaw = hourly.wind_speed_10m ? hourly.wind_speed_10m[idx] : null;
      const windInfo = UnitConverter.formatWind(typeof windRaw === 'number' && Number.isFinite(windRaw) ? windRaw : null);

      // Determine day/night based on station hour
      const hourNum = date ? date.getHours() : 12;
      const isDay = hourNum >= 6 && hourNum <= 19 ? 1 : 0;

      const hourCard = document.createElement('div');
      hourCard.className = `hour-card ${i === 0 ? 'active-hour' : ''}`;
      hourCard.innerHTML = `
        <span class="hour-time">${hourLabel}</span>
        <div class="hour-icon" title="${meta.label}" aria-hidden="true">
          ${WeatherIcons.get(meta.icon, isDay)}
        </div>
        <span class="hour-temp">${temp}°</span>
        <span class="hour-precip" title="Rain probability">
          <span aria-hidden="true">💧</span> ${rain}%
        </span>
        <span class="hour-wind">${windInfo.val} ${windInfo.unit}</span>
      `;
      DOM.hourlyTimeline.appendChild(hourCard);
    }
  }

  /**
   * Render 7-day extended multi-day forecast table
   */
  static renderDailyForecast(daily) {
    DOM.dailyForecastContainer.innerHTML = '';
    if (!daily || !Array.isArray(daily.time) || daily.time.length === 0) return;

    // Calculate global min and max across all 7 days for relative bar gradient
    const allMins = (Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : []).slice(0, 7).filter(Number.isFinite);
    const allMaxs = (Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : []).slice(0, 7).filter(Number.isFinite);
    const globalMin = allMins.length ? Math.min(...allMins) : 0;
    const globalMax = allMaxs.length ? Math.max(...allMaxs) : 0;
    const tempRange = Math.max(globalMax - globalMin, 1);

    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const date = this.parseWallClock(daily.time[i]);
      const dayName = i === 0
        ? 'Today'
        : (date ? date.toLocaleDateString([], { weekday: 'short' }) : `Day ${i + 1}`);
      const dateSub = date ? date.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';

      const code = daily.weather_code ? daily.weather_code[i] : undefined;
      const meta = WMO_CODES[code] || { label: 'Fair', icon: 'clear' };

      const minVal = daily.temperature_2m_min ? daily.temperature_2m_min[i] : null;
      const maxVal = daily.temperature_2m_max ? daily.temperature_2m_max[i] : null;
      const minFormatted = UnitConverter.formatTemp(minVal);
      const maxFormatted = UnitConverter.formatTemp(maxVal);
      const hasRange = Number.isFinite(minVal) && Number.isFinite(maxVal);

      const rainProbRaw = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : null;
      const rainProb = Number.isFinite(Number(rainProbRaw)) && rainProbRaw !== null && rainProbRaw !== undefined
        ? Math.round(Number(rainProbRaw))
        : 0;

      // Calculate bar offsets (NaN-safe)
      const leftPercent = hasRange
        ? Math.min(100, Math.max(0, ((minVal - globalMin) / tempRange) * 100))
        : 0;
      const widthPercent = hasRange
        ? Math.min(100 - leftPercent, Math.max(12, ((maxVal - minVal) / tempRange) * 100))
        : 12;

      const sunriseDate = this.parseWallClock(daily.sunrise && daily.sunrise[i]);
      const sunriseFormatted = sunriseDate
        ? sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--:--';

      const row = document.createElement('div');
      row.className = 'daily-row';
      row.innerHTML = `
        <div class="daily-day-group">
          <span class="daily-day-name">${dayName}</span>
          <span class="daily-date-sub">${dateSub}</span>
        </div>
        <div class="daily-condition-group">
          <div class="daily-icon" title="${meta.label}" aria-hidden="true">
            ${WeatherIcons.get(meta.icon, 1)}
          </div>
          <span class="daily-condition-text">${meta.label}</span>
        </div>
        <span class="daily-precip-badge"><span aria-hidden="true">💧</span> ${rainProb}%</span>
        <div class="temp-bar-container">
          <span class="temp-bar-min">${minFormatted}°</span>
          <div class="temp-bar-track">
            <div class="temp-bar-gradient" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
          </div>
          <span class="temp-bar-max">${maxFormatted}°</span>
        </div>
        <div class="daily-sun-group">
          <span><span aria-hidden="true">🌅</span> ${sunriseFormatted}</span>
        </div>
      `;
      DOM.dailyForecastContainer.appendChild(row);
    }
  }

  /**
   * Station live clock synchronizer
   */
  static startStationClock(timeZone = 'auto') {
    if (state.clockIntervalId) {
      clearInterval(state.clockIntervalId);
    }

    const updateClock = () => {
      try {
        const now = new Date();
        const options = {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };

        if (timeZone && timeZone !== 'auto') {
          options.timeZone = timeZone;
        }

        const timeStr = new Intl.DateTimeFormat([], options).format(now);
        DOM.localTimeDisplay.textContent = timeStr;

        // Formatted timezone string
        DOM.timezoneDisplay.textContent = timeZone && timeZone !== 'auto' ? String(timeZone).replace(/_/g, ' ') : 'Station Local';
      } catch (err) {
        DOM.localTimeDisplay.textContent = new Date().toLocaleTimeString([], { hour12: false });
        DOM.timezoneDisplay.textContent = 'Local Time';
      }
    };

    updateClock();
    state.clockIntervalId = setInterval(updateClock, 1000);
  }

  /**
   * Show Loading Skeleton
   */
  static showLoading() {
    DOM.loadingSkeleton.classList.remove('hidden');
    DOM.dashboardContent.classList.add('hidden');
    DOM.errorState.classList.add('hidden');
    // Prevent duplicate submits / refreshes / geo lookups while a request is in flight
    DOM.searchSubmitBtn.disabled = true;
    DOM.geoBtn.disabled = true;
    DOM.refreshBtn.disabled = true;
    DOM.refreshBtn.querySelector('.refresh-icon').classList.add('rotating');
  }

  /**
   * Hide Loading Skeleton
   */
  static hideLoading() {
    DOM.loadingSkeleton.classList.add('hidden');
    DOM.searchSubmitBtn.disabled = false;
    DOM.geoBtn.disabled = false;
    DOM.refreshBtn.disabled = false;
    DOM.refreshBtn.querySelector('.refresh-icon').classList.remove('rotating');
  }

  /**
   * Display Error State
   */
  static showError(title, message) {
    this.hideLoading();
    DOM.dashboardContent.classList.add('hidden');
    DOM.errorState.classList.remove('hidden');
    DOM.errorTitle.textContent = title;
    DOM.errorMessage.textContent = message;
  }

  /**
   * Hide Error State
   */
  static hideError() {
    DOM.errorState.classList.add('hidden');
  }

  /**
   * Display toast notification
   */
  static showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'error') icon = '⚠️';
    if (type === 'success') icon = '✅';

    // Build with textContent so messages (which may contain user input) are never parsed as HTML
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon;
    iconSpan.setAttribute('aria-hidden', 'true');
    const textSpan = document.createElement('span');
    textSpan.textContent = String(message === null || message === undefined ? '' : message);

    toast.append(iconSpan, textSpan);
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Update Recent Search history UI
   */
  static updateRecentsUI() {
    DOM.recentsDropdown.innerHTML = '';
    if (!Array.isArray(state.recents) || state.recents.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'recents-empty';
      empty.textContent = 'No recent search records';
      DOM.recentsDropdown.appendChild(empty);
      return;
    }

    state.recents.forEach(item => {
      if (!item || typeof item.name !== 'string') return;

      const row = document.createElement('div');
      row.className = 'recent-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'recent-name';
      nameSpan.textContent = item.country ? `${item.name}, ${item.country}` : item.name;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'recent-remove-btn';
      removeBtn.title = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove ${item.name} from recent searches`);
      removeBtn.textContent = '×';

      row.append(nameSpan, removeBtn);

      row.addEventListener('click', (e) => {
        if (e.target === removeBtn || removeBtn.contains(e.target)) {
          e.stopPropagation();
          App.removeRecent(item.name);
          return;
        }
        DOM.recentsDropdown.classList.add('hidden');
        App.loadLocation(item);
      });

      DOM.recentsDropdown.appendChild(row);
    });
  }
}

/* ==========================================================================
   8. APPLICATION ORCHESTRATOR
   ========================================================================== */

class App {
  /**
   * Initialize Application
   */
  static async init() {
    this.initTheme();
    this.initUnit();
    this.registerEventListeners();
    UIController.updateRecentsUI();

    // Check Network status
    this.checkNetworkStatus();

    // Load initial city from localStorage or default headquarters
    const saved = storage.get(CONFIG.STORAGE_KEYS.LAST_LOCATION);
    if (saved) {
      const parsed = safeJSON(saved, null);
      if (parsed && typeof parsed === 'object'
          && Number.isFinite(Number(parsed.latitude))
          && Number.isFinite(Number(parsed.longitude))) {
        await this.loadLocation(parsed);
        return;
      }
      console.warn('Saved location invalid, reverting to default.');
    }

    // Default: London Headquarters
    await this.searchAndLoadCity(CONFIG.DEFAULT_CITY);
  }

  /**
   * Query city by name and fetch full data
   * @param {string} cityName 
   */
  static async searchAndLoadCity(cityName) {
    if (!cityName || !cityName.trim()) return;
    const token = ++state.requestSeq;
    state.suggestSeq++; // invalidate any in-flight autocomplete responses
    DOM.suggestionsDropdown.classList.add('hidden');
    UIController.showLoading();

    try {
      const locations = await WeatherService.searchLocations(cityName);
      if (token !== state.requestSeq) return; // superseded by a newer query
      if (!locations || locations.length === 0) {
        throw new Error(`Location "${cityName}" not found. Verify the spelling or try a nearby metropolitan area.`);
      }

      const bestMatch = locations[0];
      await this.loadLocation(bestMatch);
    } catch (err) {
      if (token !== state.requestSeq) return; // stale error from an abandoned query
      console.error('Search error:', err);
      UIController.showError('Location Query Unsuccessful', err.message);
      UIController.showToast(err.message, 'error');
    }
  }

  /**
   * Load specific location coordinates into dashboard
   * @param {Object} loc 
   */
  static async loadLocation(loc) {
    // Abort any in-flight request; only the newest request may update the UI
    if (state.activeController) {
      state.activeController.abort();
    }
    const controller = new AbortController();
    state.activeController = controller;
    const token = ++state.requestSeq;
    state.suggestSeq++; // invalidate pending autocomplete responses

    // Validate coordinates before any network I/O
    const latitude = Number(loc && loc.latitude);
    const longitude = Number(loc && loc.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      UIController.showError('Invalid Location Data', 'This entry is missing valid coordinates. Please search for a city instead.');
      UIController.showToast('Invalid location data for this entry.', 'error');
      return;
    }

    UIController.showLoading();
    state.lastAttemptedLocation = loc;

    try {
      // Parallel fetch for Forecast and Air Quality using modern Promise.all
      const [forecastData, airData] = await Promise.all([
        WeatherService.fetchForecast(latitude, longitude, (loc && loc.timezone) || 'auto', controller.signal),
        WeatherService.fetchAirQuality(latitude, longitude, controller.signal)
      ]);

      // Discard superseded responses so a slow older request can never overwrite a newer one
      if (token !== state.requestSeq || controller.signal.aborted) return;

      if (!forecastData || typeof forecastData !== 'object'
          || !forecastData.current || typeof forecastData.current !== 'object') {
        throw new Error('The weather service returned incomplete weather data. Please press Retry.');
      }

      state.activeLocation = loc;
      state.activeWeatherData = forecastData;
      state.activeAirData = airData;

      // Save to localStorage
      storage.set(CONFIG.STORAGE_KEYS.LAST_LOCATION, JSON.stringify(loc));
      this.addRecent(loc);

      // Render dashboard
      UIController.renderDashboard(loc, forecastData, airData);
      this.highlightHubChip(loc.name);

      UIController.showToast(`Updated conditions for ${loc.name}`, 'success', 2500);
    } catch (err) {
      if (token !== state.requestSeq || controller.signal.aborted) return; // superseded — ignore
      console.error('Failed to load telemetry:', err);
      UIController.showError('Telemetry Acquisition Failed', err.message);
      UIController.showToast(err.message, 'error');
    }
  }

  /**
   * Add to recent history
   */
  static addRecent(loc) {
    if (!loc || typeof loc.name !== 'string') return;
    state.recents = state.recents.filter(r => r && typeof r.name === 'string'
      && r.name.toLowerCase() !== loc.name.toLowerCase());
    state.recents.unshift({
      name: loc.name,
      country: loc.country,
      admin1: loc.admin1 || '',
      elevation: numOr(loc.elevation, null),
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      timezone: loc.timezone
    });
    if (state.recents.length > 8) state.recents.pop();
    storage.set(CONFIG.STORAGE_KEYS.RECENTS, JSON.stringify(state.recents));
    UIController.updateRecentsUI();
  }

  /**
   * Remove item from recents
   */
  static removeRecent(name) {
    state.recents = state.recents.filter(r => r && r.name !== name);
    storage.set(CONFIG.STORAGE_KEYS.RECENTS, JSON.stringify(state.recents));
    UIController.updateRecentsUI();
  }

  /**
   * Highlight matching quick hub chip
   */
  static highlightHubChip(cityName) {
    document.querySelectorAll('.hub-chip').forEach(chip => {
      if (chip.dataset.city.toLowerCase() === cityName.toLowerCase()) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  /**
   * Set Temperature Unit (°C or °F)
   */
  static setUnit(unit) {
    if (state.currentUnit === unit) return;
    state.currentUnit = unit;
    storage.set(CONFIG.STORAGE_KEYS.UNIT, unit);

    if (unit === 'c') {
      DOM.unitCelsiusBtn.classList.add('active');
      DOM.unitFahrenheitBtn.classList.remove('active');
    } else {
      DOM.unitFahrenheitBtn.classList.add('active');
      DOM.unitCelsiusBtn.classList.remove('active');
    }

    // Immediately re-render active data without re-fetching
    if (state.activeLocation && state.activeWeatherData) {
      try {
        UIController.renderDashboard(state.activeLocation, state.activeWeatherData, state.activeAirData);
      } catch (err) {
        console.error('Unit toggle re-render failed:', err);
        UIController.showToast('Unable to re-render with the new units.', 'error');
      }
    }
  }

  /**
   * Toggle Office Color Theme (Corporate Dark vs Corporate Light)
   */
  static toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    storage.set(CONFIG.STORAGE_KEYS.THEME, nextTheme);

    if (nextTheme === 'light') {
      DOM.themeIconSun.classList.remove('hidden');
      DOM.themeIconMoon.classList.add('hidden');
    } else {
      DOM.themeIconSun.classList.add('hidden');
      DOM.themeIconMoon.classList.remove('hidden');
    }
  }

  /**
   * Initialize Theme from Storage
   */
  static initTheme() {
    const saved = storage.get(CONFIG.STORAGE_KEYS.THEME);
    const theme = (saved === 'light') ? 'light' : 'dark'; // only known themes are applied
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      DOM.themeIconSun.classList.remove('hidden');
      DOM.themeIconMoon.classList.add('hidden');
    } else {
      DOM.themeIconSun.classList.add('hidden');
      DOM.themeIconMoon.classList.remove('hidden');
    }
  }

  /**
   * Initialize Unit buttons
   */
  static initUnit() {
    if (state.currentUnit === 'f') {
      DOM.unitFahrenheitBtn.classList.add('active');
      DOM.unitCelsiusBtn.classList.remove('active');
    } else {
      DOM.unitCelsiusBtn.classList.add('active');
      DOM.unitFahrenheitBtn.classList.remove('active');
    }
  }

  /**
   * Handle Device Geolocation
   */
  static handleGeolocation() {
    if (!navigator.geolocation) {
      UIController.showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    const token = ++state.requestSeq;
    UIController.showToast('Detecting location coordinates...', 'info', 2000);
    UIController.showLoading();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (token !== state.requestSeq) return; // superseded while waiting for permission
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await WeatherService.reverseGeocode(lat, lon);
          if (token !== state.requestSeq) return;
          await this.loadLocation(loc);
        } catch (err) {
          if (token !== state.requestSeq) return;
          console.error(err);
          UIController.showError('Geolocation Error', 'Unable to resolve local station coordinates.');
          UIController.showToast('Unable to resolve your location.', 'error');
        }
      },
      (err) => {
        if (token !== state.requestSeq) return;
        console.warn('Geolocation denied or failed:', err.message);
        UIController.hideLoading();
        UIController.showToast('Location permission denied or unavailable.', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  /**
   * Network online/offline monitor
   */
  static checkNetworkStatus() {
    const update = () => {
      if (!navigator.onLine) {
        DOM.networkAlert.classList.remove('hidden');
        DOM.networkAlertText.textContent = 'Network offline. Showing cached telemetries where available.';
      } else {
        DOM.networkAlert.classList.add('hidden');
      }
    };

    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }

  /**
   * Bind DOM Events
   */
  static registerEventListeners() {
    // 1. Search Form
    let debounceTimer = null;

    DOM.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearTimeout(debounceTimer);
      state.suggestSeq++; // cancel pending autocomplete responses
      DOM.suggestionsDropdown.classList.add('hidden');
      DOM.cityInput.setAttribute('aria-expanded', 'false');
      const val = DOM.cityInput.value.trim();
      if (val) this.searchAndLoadCity(val);
    });

    // 2. City Input with Debounced Autocomplete
    DOM.cityInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      clearTimeout(debounceTimer);

      if (!val) {
        DOM.clearSearchBtn.classList.add('hidden');
        DOM.suggestionsDropdown.classList.add('hidden');
        DOM.cityInput.setAttribute('aria-expanded', 'false');
        state.suggestSeq++; // invalidate in-flight suggestions
        return;
      }

      DOM.clearSearchBtn.classList.remove('hidden');

      if (val.length < 2) {
        DOM.suggestionsDropdown.classList.add('hidden');
        DOM.cityInput.setAttribute('aria-expanded', 'false');
        state.suggestSeq++;
        return;
      }

      debounceTimer = setTimeout(async () => {
        const query = DOM.cityInput.value.trim(); // read the live value at fire time
        if (query.length < 2) return;
        const token = ++state.suggestSeq;
        try {
          const results = await WeatherService.searchLocations(query);
          if (token !== state.suggestSeq) return; // stale response — a newer keystroke owns the list
          this.renderSuggestions(results);
        } catch (err) {
          console.warn('Autocomplete fetch failed:', err.message);
        }
      }, 250);
    });

    // Keyboard navigation for the suggestions list (ArrowUp/Down, Enter, Escape)
    DOM.cityInput.addEventListener('keydown', (e) => this.handleSuggestionKeys(e));

    // Clear search input button
    DOM.clearSearchBtn.addEventListener('click', () => {
      clearTimeout(debounceTimer);
      state.suggestSeq++;
      DOM.cityInput.value = '';
      DOM.clearSearchBtn.classList.add('hidden');
      DOM.suggestionsDropdown.classList.add('hidden');
      DOM.cityInput.setAttribute('aria-expanded', 'false');
      DOM.cityInput.focus();
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (!DOM.searchContainer?.contains(e.target) && !DOM.searchForm.contains(e.target)) {
        DOM.suggestionsDropdown.classList.add('hidden');
        DOM.cityInput.setAttribute('aria-expanded', 'false');
        suggestionHighlightIndex = -1;
      }
      if (!DOM.recentsToggleBtn.contains(e.target) && !DOM.recentsDropdown.contains(e.target)) {
        DOM.recentsDropdown.classList.add('hidden');
      }
    });

    // 3. Geolocation button
    DOM.geoBtn.addEventListener('click', () => this.handleGeolocation());

    // 4. Units
    DOM.unitCelsiusBtn.addEventListener('click', () => this.setUnit('c'));
    DOM.unitFahrenheitBtn.addEventListener('click', () => this.setUnit('f'));

    // 5. Refresh
    DOM.refreshBtn.addEventListener('click', () => {
      if (state.activeLocation) {
        this.loadLocation(state.activeLocation);
      }
    });

    // 6. Theme Toggle
    DOM.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // 7. Global Hub Chips
    DOM.hubsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.hub-chip');
      if (chip && chip.dataset.city) {
        this.searchAndLoadCity(chip.dataset.city);
      }
    });

    // 8. Recents Toggle
    DOM.recentsToggleBtn.addEventListener('click', () => {
      DOM.recentsDropdown.classList.toggle('hidden');
    });

    // 9. Error retry buttons
    DOM.errorRetryBtn.addEventListener('click', () => {
      const target = state.lastAttemptedLocation || state.activeLocation;
      if (target) {
        this.loadLocation(target);
      } else {
        this.searchAndLoadCity(CONFIG.DEFAULT_CITY);
      }
    });

    DOM.errorDefaultBtn.addEventListener('click', () => {
      this.searchAndLoadCity(CONFIG.DEFAULT_CITY);
    });

    // 10. Close alert banner
    DOM.closeAlertBtn.addEventListener('click', () => {
      DOM.networkAlert.classList.add('hidden');
    });
  }

  /**
   * Render autocomplete suggestions (XSS-safe DOM construction)
   */
  static renderSuggestions(results) {
    DOM.suggestionsDropdown.innerHTML = '';
    suggestionHighlightIndex = -1;
    DOM.cityInput.removeAttribute('aria-activedescendant');

    if (!Array.isArray(results) || results.length === 0) {
      DOM.suggestionsDropdown.classList.add('hidden');
      DOM.cityInput.setAttribute('aria-expanded', 'false');
      return;
    }

    results.forEach((item, index) => {
      if (!item || typeof item.name !== 'string') return;

      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.id = `suggestion-option-${index}`;
      div.setAttribute('role', 'option');
      div.setAttribute('aria-selected', 'false');

      const nameSpan = document.createElement('span');
      nameSpan.className = 'suggestion-name';
      nameSpan.textContent = item.name;

      const subSpan = document.createElement('span');
      subSpan.className = 'suggestion-sub';
      subSpan.textContent = `${item.admin1 ? `${item.admin1}, ` : ''}${item.country || ''}`;

      div.append(nameSpan, subSpan);
      div.addEventListener('click', () => this.selectSuggestion(item));

      DOM.suggestionsDropdown.appendChild(div);
    });

    DOM.suggestionsDropdown.classList.remove('hidden');
    DOM.cityInput.setAttribute('aria-expanded', 'true');
  }

  /**
   * Apply a highlighted suggestion to the input and load it
   */
  static selectSuggestion(item) {
    if (!item || typeof item.name !== 'string') return;
    DOM.cityInput.value = item.country ? `${item.name}, ${item.country}` : item.name;
    DOM.clearSearchBtn.classList.remove('hidden');
    DOM.suggestionsDropdown.classList.add('hidden');
    DOM.cityInput.setAttribute('aria-expanded', 'false');
    DOM.cityInput.removeAttribute('aria-activedescendant');
    suggestionHighlightIndex = -1;
    state.suggestSeq++;
    this.loadLocation(item);
  }

  /**
   * Keyboard navigation for the autocomplete listbox
   */
  static handleSuggestionKeys(e) {
    const isOpen = !DOM.suggestionsDropdown.classList.contains('hidden');

    if (e.key === 'Escape') {
      DOM.suggestionsDropdown.classList.add('hidden');
      DOM.cityInput.setAttribute('aria-expanded', 'false');
      DOM.cityInput.removeAttribute('aria-activedescendant');
      suggestionHighlightIndex = -1;
      return;
    }

    if (!isOpen) return;

    const options = Array.from(DOM.suggestionsDropdown.querySelectorAll('.suggestion-item'));
    if (options.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      suggestionHighlightIndex = (suggestionHighlightIndex + direction + options.length) % options.length;

      options.forEach((opt, i) => {
        const on = i === suggestionHighlightIndex;
        opt.classList.toggle('highlighted', on);
        opt.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      const active = options[suggestionHighlightIndex];
      DOM.cityInput.setAttribute('aria-activedescendant', active.id);
      if (typeof active.scrollIntoView === 'function') active.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && suggestionHighlightIndex >= 0) {
      e.preventDefault(); // select instead of submitting the raw input
      options[suggestionHighlightIndex].click();
    }
  }
}

/* ==========================================================================
   9. APPLICATION BOOTSTRAP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  App.init().catch((err) => {
    console.error('Application bootstrap failed:', err);
    UIController.showError('Startup Failed', 'The dashboard could not initialize. Please reload the page.');
  });
});
