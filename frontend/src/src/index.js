import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const fontFaces = `
  @font-face {
    font-family: 'Highliner';
    src: url('/fonts/highliner.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Highliner Light';
    src: url('/fonts/highliner_light.otf') format('opentype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'TTTravels';
    src: url('/fonts/TTTravels-Black.ttf') format('truetype');
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: 'TTTravels';
    src: url('/fonts/TTTravels-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'TTTravels';
    src: url('/fonts/TTTravels-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'TTTravels';
    src: url('/fonts/TTTravels-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
  }
`

const style = document.createElement('style');
style.textContent = fontFaces;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

