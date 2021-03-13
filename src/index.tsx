import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0a66c2',
      '100': '#f6fbff',
      '200': '#e8f3ff',
      '300': '#d0e8ff',
      '400': '#a8d4ff',
      '500': '#70b5f9',
      '600': '#378fe9',
      '700': '#0a66c2',
      '800': '#004182',
      '900': '#09223b',
      A200: '#rgba(112,181,249,0.2)',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
