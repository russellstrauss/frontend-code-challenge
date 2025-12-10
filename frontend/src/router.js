import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js';

// Detect the actual base path from the current location
// The app is being served from /apps/pokedex/, so we need to detect and use that
function getBasePath() {
	if (typeof window !== 'undefined') {
		const pathname = window.location.pathname;
		console.log('Current pathname:', pathname);
		
		// Extract base path: if pathname is /apps/pokedex/ or /apps/pokedex/index.html
		// Remove trailing index.html and route segments
		// We want to find the directory where index.html is located
		let basePath = pathname;
		
		// Remove index.html if present
		basePath = basePath.replace(/\/index\.html$/, '');
		
		// Remove route segments (everything after the base directory)
		// For /apps/pokedex/, basePath should be /apps/pokedex/
		// For /apps/pokedex/profile/bulbasaur, we want /apps/pokedex/
		
		// If the pathname contains /apps/pokedex/, that's our base
		const match = pathname.match(/^(\/apps\/pokedex\/)/);
		if (match) {
			console.log('Detected base path:', match[1]);
			return match[1];
		}
		
		// Otherwise, try to detect from pathname structure
		// If pathname has multiple segments, the base is likely everything before the route
		// But we can't reliably detect this, so fall back to Vite's BASE_URL
	}
	
	// Fallback: use BASE_URL from Vite
	let baseUrl = import.meta.env.BASE_URL;
	
	// If BASE_URL is './', we need to detect from the script source
	if (baseUrl === './' && typeof document !== 'undefined') {
		const script = document.querySelector('script[type="module"]');
		if (script && script.src) {
			const scriptPath = new URL(script.src, window.location.href).pathname;
			// Extract directory from script path: /apps/pokedex/app.js -> /apps/pokedex/
			const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
			if (scriptDir && scriptDir !== '/') {
				console.log('Detected base path from script src:', scriptDir);
				return scriptDir;
			}
		}
	}
	
	// Last resort: use BASE_URL as-is
	return baseUrl || '/';
}

const basePath = getBasePath();
console.log('Router initialization - BASE_URL:', import.meta.env.BASE_URL, 'resolved base path:', basePath);

const router = createRouter({
	history: createWebHistory(basePath),
	routes: routes
});

// Debug router navigation
router.beforeEach((to, from, next) => {
	console.log('Router navigation:', from.path, '->', to.path);
	next();
});

router.afterEach((to, from) => {
	console.log('Router navigation complete:', to.path, 'matched route:', to.name);
});

export default router;