import type { NextPage } from 'next'

import { Reader } from "../components/reader/reader";
import { useState } from "react";
import { InputForm } from "../components/input-form";
import { IReaderComponentInput } from "../types";

import styles from "../styles/Create.module.css";

const CreateReader: NextPage = () => {
    const [readerInput, setReaderInput] = useState<IReaderComponentInput|null>(null);

    return (
        <div className={styles.container}>
            {
                readerInput?
                    <Reader {...readerInput} />
                    :
                    <InputForm onSubmit={setReaderInput} />
            }
        </div>
    )
}

export default CreateReader
