import { beforeEach } from 'vitest';

beforeEach(() => {
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset localStorage
  localStorage.clear();
  
  // Reset console
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
