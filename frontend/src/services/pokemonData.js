import axios from 'axios';

// Use embedded data in production, API in development
const USE_EMBEDDED_DATA = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

let embeddedDataCache = null;
let embeddedDataLoading = null;

async function loadEmbeddedData() {
  if (embeddedDataCache) {
    return embeddedDataCache;
  }
  
  if (embeddedDataLoading) {
    return embeddedDataLoading;
  }
  
  // Use relative path - Vite will copy pokemons-data.json from public/ to dist root
  // Detect the actual base path from current location to build correct URL
  let dataUrl = './pokemons-data.json';
  
  if (typeof window !== 'undefined') {
    // If served from a subdirectory, adjust the path
    const pathname = window.location.pathname;
    const match = pathname.match(/^(\/apps\/pokedex\/)/);
    if (match) {
      dataUrl = `${match[1]}pokemons-data.json`;
    } else if (pathname !== '/' && !pathname.endsWith('.html')) {
      // Extract base path from script location
      const script = document.querySelector('script[type="module"]');
      if (script && script.src) {
        const scriptPath = new URL(script.src, window.location.href).pathname;
        const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
        dataUrl = `${scriptDir}pokemons-data.json`;
      }
    }
  }
  
  console.log('Fetching embedded data from:', dataUrl, 'BASE_URL:', import.meta.env.BASE_URL, 'current location:', typeof window !== 'undefined' ? window.location.href : 'N/A');
  
  embeddedDataLoading = fetch(dataUrl)
    .then(res => {
      console.log('Fetch response status:', res.status, res.statusText, 'URL:', res.url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      embeddedDataCache = data;
      embeddedDataLoading = null;
      console.log('✅ Loaded embedded Pokemon data, count:', data.pokemons?.edges?.length);
      return data;
    })
    .catch(error => {
      console.error('❌ Could not load embedded data:', error.message, 'URL tried:', dataUrl);
      embeddedDataLoading = null;
      return null;
    });
  
  return embeddedDataLoading;
}

export async function fetchPokemons(query = { limit: 151, offset: 0 }) {
  console.log('fetchPokemons called, PROD mode:', USE_EMBEDDED_DATA, 'BASE_URL:', import.meta.env.BASE_URL);
  
  if (USE_EMBEDDED_DATA) {
    // Try to use embedded data
    console.log('Attempting to load embedded data...');
    const embeddedData = await loadEmbeddedData();
    if (embeddedData) {
      console.log('✅ Using embedded data');
      const { edges } = embeddedData.pokemons;
      const { limit = 151, offset = 0 } = query;
      
      return {
        data: {
          data: {
            pokemons: {
              edges: edges.slice(offset, offset + limit),
              count: edges.length,
              limit,
              offset
            }
          }
        }
      };
    }
    console.warn('⚠️ Embedded data not available, falling back to API');
    // If embedded data failed, fall through to API
  }
  
  // Use GraphQL API (development or fallback)
  console.log('Using GraphQL API');
  return axios({
    url: API_URL,
    method: 'post',
    data: {
      query: `
        query {
          pokemons(query: { limit: ${query.limit || 151}, offset: ${query.offset || 0} }) {
            edges {
              id, name, classification, types, resistant, weaknesses,
              evolutions { id, name },
              prevEvolutions { id, name },
              height { maximum, minimum },
              weight { maximum, minimum },
              attacks {
                fast { name, type, damage },
                special { name, type, damage }
              }
            }
          }
        }
      `
    }
  });
}

