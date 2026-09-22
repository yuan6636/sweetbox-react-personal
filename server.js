import { execSync } from 'child_process';

const port = process.env.PORT || 3000;

execSync(`json-server db.json --port ${port} --host 0.0.0.0 `, { stdio: 'inherit' });
