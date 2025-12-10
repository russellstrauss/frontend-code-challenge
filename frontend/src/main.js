console.log('main.js: Starting to load...');

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

console.log('main.js: Imports successful');

// Add unhandled error handlers before app creation
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  console.error('Error details:', event);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  const app = createApp(App);
  app.use(router);
  app.use(store);

  // Add global error handler
  app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err);
    console.error('Component:', instance);
    console.error('Info:', info);
  };

  // Mount the app - router will handle routing
  console.log('main.js: Mounting Vue app to #app element...');
  const appElement = document.getElementById('app');
  if (!appElement) {
    console.error('ERROR: #app element not found in DOM!');
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: monospace; color: red;">
        <h1>Application Error</h1>
        <p>#app element not found in DOM!</p>
      </div>
    `;
  } else {
    console.log('main.js: #app element found, mounting...');
    app.mount("#app");
    console.log('main.js: App mounted successfully');
  }
} catch (error) {
  console.error('main.js: Fatal error during initialization:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: monospace; color: red;">
      <h1>Application Error</h1>
      <p>Failed to initialize application:</p>
      <pre>${error.stack || error.message}</pre>
    </div>
  `;
}
