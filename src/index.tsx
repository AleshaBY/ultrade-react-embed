import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// import ngrok from 'ngrok';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// (async function() {
//   const url = await ngrok.connect(9000);
//   console.log(url);
// })();
