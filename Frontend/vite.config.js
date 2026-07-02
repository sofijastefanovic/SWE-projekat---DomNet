import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
   port:5175,
   strictPort: true
  }
})

//zakomentarisi sve iznad i otkomentarisi sve ispod

//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//export default defineConfig({
   // plugins: [react()],
   // server: {
       // port: 5175,
      //  strictPort: true
   // }
//})
