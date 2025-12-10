const fs = require('fs');
const path = require('path');

// Read the pokemons.json from backend
const pokemonsPath = path.resolve(__dirname, '../../backend/src/pokemons.json');
console.log('Looking for pokemons.json at:', pokemonsPath);
console.log('File exists:', fs.existsSync(pokemonsPath));

if (!fs.existsSync(pokemonsPath)) {
  console.error('❌ Error: pokemons.json not found at:', pokemonsPath);
  process.exit(1);
}

const pokemonsData = JSON.parse(fs.readFileSync(pokemonsPath, 'utf-8'));
console.log(`Loaded ${pokemonsData.length} Pokemon records from backend`);

// Transform to match GraphQL response structure
const transformedData = {
  pokemons: {
    edges: pokemonsData.map(pokemon => ({
      id: String(pokemon.id).padStart(3, '0'),
      name: pokemon.name,
      classification: pokemon.classification,
      types: pokemon.types,
      resistant: pokemon.resistant,
      weaknesses: pokemon.weaknesses,
      height: pokemon.height,
      weight: pokemon.weight,
      evolutions: (pokemon.evolutions || []).map(ev => ({
        id: String(ev.id).padStart(3, '0'),
        name: ev.name
      })),
      prevEvolutions: (pokemon.prevEvolutions || []).map(ev => ({
        id: String(ev.id).padStart(3, '0'),
        name: ev.name
      })),
      attacks: pokemon.attacks || { fast: [], special: [] }
    }))
  }
};

// Write to public folder so it's included in the build
const publicPath = path.resolve(__dirname, '../public/pokemons-data.json');
console.log('Writing to:', publicPath);

// Ensure public directory exists
const publicDir = path.dirname(publicPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(publicPath, JSON.stringify(transformedData, null, 2));

console.log(`✅ Embedded ${pokemonsData.length} Pokemon records into public/pokemons-data.json`);
console.log('File written successfully:', fs.existsSync(publicPath));

