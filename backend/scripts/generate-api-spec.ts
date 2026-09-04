import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../src/frameworks-drivers/config/swagger';

const output = path.join(__dirname, '../api-spec.json');
fs.writeFileSync(output, JSON.stringify(swaggerSpec, null, 2));
console.log('API spec generated at api-spec.json');