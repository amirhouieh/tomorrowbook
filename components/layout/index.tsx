import React from "react";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import Head from "next/head";

export const Layout: React.FC<any> = ({children}) => (
    <>
        <Head>
            <title>TOOK</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="Took is an online reader generator that uses Wikipedia as its knowledge source."/>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
            <link
                href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=Roboto+Mono&family=Space+Mono&display=swap"
                rel="stylesheet"/>
        </Head>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
    </>
)