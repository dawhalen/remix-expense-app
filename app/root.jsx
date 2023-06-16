import { cssBundleHref } from "@remix-run/css-bundle";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import sharedStyles from '~/styles/shared.css';
import Error from '~/components/util/Error';

export function meta(){
  return [{
    charset: 'utf-8',
    title: 'Remix Expenses App',
    viewport: 'width=device-width,initial-scale=1'
  }];
}

function Document({ title, children }) {
  return (
    <html lang="en">
      <head>
        {title && <title>{title}</title>}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap" rel="stylesheet" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: sharedStyles }];
}

export function CatchBoundary() {
  const caughtResp = useCatch();

  return (
    <Document title={caughtResp.statusText}>
      <main>
        <Error>
          <p>{caughtResp.data?.message || "Something went wrong... please try again later."}</p>
          <p>Back to <Link to="/">safety</Link>.</p>
        </Error>
      </main>
    </Document>
  );
}

export function ErrorBoundary({error}) {

  return (
    <Document title="An error occurred">
      <main>
        <Error>
          <p>{error.message || "Something went wrong... please try again later."}</p>
          <p>Back to <Link to="/">safety</Link>.</p>
        </Error>
      </main>
    </Document>
  );
}