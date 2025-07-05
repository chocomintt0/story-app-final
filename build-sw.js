import { generateSW } from 'workbox-build';
import config from './workbox-config.js';

console.log('Generating service worker with Workbox...');

generateSW(config)
  .then(({ count, size, warnings }) => {
    warnings.forEach(console.warn);
    console.log(
      `✅ Service worker generated successfully: ${count} files will be precached, totaling ${size / 1024} KB.`
    );
  })
  .catch((error) => {
    console.error('Service worker generation failed:', error);
  });