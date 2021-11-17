import React from "react";
import Link from 'next/link'

import styles from "./styles.module.css";

export const Navbar: React.FC<any> = (props) => (
    <header className={styles.container}>
        <nav>
            <Link href={"/create"}>CREATE+</Link>
            <span> | </span>
            <Link href={"/"}>
                <a>
                    TOOK
                    <small> v0.1</small>
                </a>
            </Link>
        </nav>
    </header>
)