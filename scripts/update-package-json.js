const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson.scripts['build:dev']) {
    packageJson.scripts['build:dev'] = 'vite build --mode development';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Successfully added build:dev script to package.json');
  } else {
    console.log('build:dev script already exists in package.json');
  }
} catch (error) {
  console.error('Error updating package.json:', error);

  // Replace process.exit(1) with more browser-friendly error handling
  if (typeof window === 'undefined') {
    // Node.js environment
    process.exit(1);
  } else {
    // Browser environment or other runtime
    throw new Error('Failed to update package.json');
  }
}
