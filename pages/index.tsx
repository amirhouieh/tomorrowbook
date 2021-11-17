import React from "react";
import type { NextPage } from 'next'

import styles from '../styles/Home.module.css'
import { ReaderList } from "../components/reader-list";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <ReaderList />
        </div>
    )
}

export default Home
