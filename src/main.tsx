// Safe handling for environments where window.fetch has only a getter
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    let _fetch = originalFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return _fetch || originalFetch;
      },
      set(fn) {
        _fetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  } catch (_) {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
