/* eslint-disable max-len */
import {ThemeProvider} from '@aws-amplify/ui-react';
import Document, {
  Html,
  Head,
  Main,
  NextScript}
  from 'next/document';
import React from 'react';
import {AUTH_THEME} from '../AuthTheme';
// import {ThemeProvider} from '@aws-amplify/ui-react';
// import {AUTH_THEME} from '../AuthTheme';

/**
 * Custom Document for Next.js, used to augment the
 * application's <html> and <body> tags.
 * This is necessary for SSR (Server Side Rendering) with Next.js.
 *
 * @see {@link https://nextjs.org/docs/advanced-features/custom-document}
 *
 * @extends {Document}
 */
class MyDocument extends Document {
  /**
   * Render the custom Document.
   *
   * @return {JSX.Element} The rendered Document.
   */
  render() {
    return (
      <ThemeProvider theme={AUTH_THEME}>
        <Html>
          <Head>
            <meta charSet="utf-8" />
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta
              name="description"
              content="Web site created using create-react-app" />
            <link rel="apple-touch-icon" href="/logo192.png" />
            <link rel="manifest" href="/manifest.json" />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
              rel="stylesheet" />
            <script async
              src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
            </script>
            <script async
              src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
              integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p"
              crossOrigin="anonymous"></script>
            <script async
              src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
              integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
              crossOrigin="anonymous"></script>
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </ThemeProvider>
    );
  }
}

export default MyDocument;
