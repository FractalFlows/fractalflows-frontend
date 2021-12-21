import { FC } from "react";
import Head from "next/head";

export const Layout: FC = ({ children }) => {
  return (
    <>
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

      <main>{children}</main>
    </>
  );
};
