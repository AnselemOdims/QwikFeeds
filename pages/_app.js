import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { theme } from '../styles/theme';
import { AuthProvider } from '../lib/auth';
import '../styles/globals.css';

const extendedTheme = extendTheme(theme)

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendedTheme} resetCSS>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
