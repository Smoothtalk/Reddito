import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider,extendTheme } from "@chakra-ui/react"
import { mode } from '@chakra-ui/theme-tools';


const root = ReactDOM.createRoot(document.getElementById('root'));

//new theme for dark mode and light mode colors
const theme = extendTheme({
  breakpoints: {
    sm: '480px',
    md: '912px',
    lg: '1280px',
    xl: '2304px',
    '2xl': '4096px'

  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('#FFFFFF','#050216')(props), //changes the dark mode and light mode colours
      }
    })
  },
})

root.render(
  <>
    {localStorage.setItem('chakra-ui-color-mode', 'dark') /* Sets the theme to light or dark mode*/}
    <ChakraProvider theme={theme /*Implements the dark mode and ligth mode colour changes as well as screen sizes*/}>
      <App />
    </ChakraProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
