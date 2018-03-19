import React from 'react';
import Head from 'next/head';

const Layout = ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>Bitcoin Private Profile Pic</title>
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css?family=Ubuntu:400,700" rel="stylesheet" />
      {/* Favicon */}
      <link rel="icon" type="image/png" href="static/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="static/favicon-16x16.png" sizes="16x16" />
    </Head>
    {children}
  </div>
);

export default Layout;
