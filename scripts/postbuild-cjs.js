import { writeFileSync } from 'fs';
import { join } from 'path';

// Create package.json for CommonJS build
const cjsPackageJson = {
  type: 'commonjs'
};

writeFileSync(
  join(process.cwd(), 'dist-cjs', 'package.json'),
  JSON.stringify(cjsPackageJson, null, 2)
);

console.log('✅ Created CommonJS package.json');