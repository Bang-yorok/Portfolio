import { copyFileSync, cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = (...parts) => resolve(root, ...parts);

mkdirSync(fromRoot('dist'), { recursive: true });
mkdirSync(fromRoot('assets'), { recursive: true });

copyFileSync(fromRoot('index.html'), fromRoot('dist', 'index.html'));
copyFileSync(fromRoot('dist', 'profile-cv-1-1.png'), fromRoot('profile-cv-1-1.png'));
cpSync(fromRoot('dist', 'assets'), fromRoot('assets'), { recursive: true });
