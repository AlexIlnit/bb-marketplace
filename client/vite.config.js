import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
//   server: {
//     watch: {
//       usePolling: true,
//     },
//     hmr: {
//       overlay: true,
//     },
//     host: "localhost",
//     port: 5173,
    // allowedHosts: [
    //   "alexbox.pro",
    //   "www.alexbox.pro",
    //   "api.alexbox.pro",
    // ],
//   },
// })

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: "localhost",
    port: 5173,

    watch: {
      usePolling: true,
      interval: 100,
      ignored:[
        "**/node_modules/**"
      ]
    },

    hmr: {
      overlay: true,
    },
  },
});