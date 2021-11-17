import type { AppProps } from 'next/app'

import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase/configs";

import { Layout } from "../components/layout";
import '../styles/globals.css'

export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  )
}

export default MyApp
