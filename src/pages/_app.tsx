import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import type { AppProps } from "next/app";

import theme from "common/config/theme";
import createEmotionCache from "common/utils/createEmotionCache";
import Header from "common/components/Header";
import "common/styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & { emotionCache: any }) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Fractal Flows - Putting scientific knowledge at the service of society
        </title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <script
          src="https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-58df20a78b820ad8"
          async
          defer
        ></script>
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
