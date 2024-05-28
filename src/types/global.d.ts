// global.d.ts

import { Helia } from 'helia';

// Declare the global `Window` interface
declare global {
  interface Window {
    helia: Helia;
  }
}

// Ensure the file is treated as a module
export {};
