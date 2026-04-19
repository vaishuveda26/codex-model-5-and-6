import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to IPv4 localhost to avoid Windows IPv6 (::1) permission issues.
    host: '127.0.0.1',
    // Use 5180 by default and allow Vite to move to the next free port if needed.
    port: Number(process.env.VITE_PORT) || 5180,
    strictPort: false
  }
});
