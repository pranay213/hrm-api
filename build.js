const esbuild = require('esbuild');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Build the script
esbuild
  .build({
    entryPoints: ['./src/server.ts'], // Entry point of your Node.js project
    bundle: true, // Bundles all dependencies into a single file
    platform: 'node', // Target platform (Node.js)
    target: 'node16', // Specify Node.js version for compatibility
    outfile: './build/server.js', // Output file location
    minify: true, // Minify the output (optional)
    sourcemap: true, // Generate source maps (optional)
    external: ['express', 'mongoose'], // Mark external dependencies if needed
    loader: {
      '.js': 'jsx', // Specify loaders if you're using JSX, TS, etc.
      '.ts': 'ts',
    },
    define: Object.keys(process.env).reduce((acc, key) => {
      acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
      return acc;
    }, {}),
  })
  .then(() => {
    console.log('Build completed successfully!');
  })
  .catch((error) => {
    console.error('Build failed:', error);
    process.exit(1);
  });
