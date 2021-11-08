import React from "react";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import Head from "next/head";

export const Layout: React.FC<any> = ({children}) => (
    <>
        <Head>
            <title>Tomorrow book</title>
            <meta name="description" content="tomorrow book" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main>{children}</main>
        <Footer />
    </>
)