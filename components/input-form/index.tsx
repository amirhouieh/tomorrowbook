import React, { ChangeEvent, FormEvent, useState } from "react";

import styles from "./styles.module.css";
import { IReaderComponentInput } from "../../types";
import { readTextFile } from "../../utils";


interface IProps{
    onSubmit: (output: IReaderComponentInput) => void
}

export const InputForm: React.FC<IProps> = (props) => {
    const [readerTitle, setReaderTitle] = useState<string|null>("futurism");
    const [wikiTitle, setWikiTitle] = useState<string|null>("futurism");
    const [selectedFile, setSelectedFile] = useState<null|File>(null);

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        try{
            const file = e.target.files![0];
            console.log(file)
            setSelectedFile(file);
        } catch (e){
            console.log(e)
            alert("invalid file :/");
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!readerTitle || (readerTitle||"").trim().length === 0){
            return alert(`Reader title is required`);
        }

        if(!selectedFile){
            return alert(`A .txt file is required`);
        }

        try{
            const inputText = await readTextFile(selectedFile);

            props.onSubmit({
                wikiTitle: wikiTitle? wikiTitle.trim():null,
                readerTitle: readerTitle.trim(),
                inputText: inputText.trim()
            });

        }catch (e){
            alert(e);
        }
    }

    return (
        <form className={styles.container}
              onSubmit={onSubmit}
        >
            <div className={styles.inputGroup}>
                <input type={"text"}
                       value={readerTitle||""}
                       placeholder={"Your reader title"}
                       required={true}
                       onInput={(e) => {
                           setReaderTitle(e.currentTarget.value)
                       }}
                />
            </div>
            <div className={styles.inputGroup}>
                <input type={"text"}
                       value={wikiTitle||""}
                       placeholder={"Wikipedia title"}
                       required={false}
                       onInput={(e) => {
                           setWikiTitle(e.currentTarget.value)
                       }}
                />
            </div>
            <div className={styles.inputGroup}>
                <input type={"file"}
                       placeholder={"Wikipedia title"}
                       required={true}
                       accept={".txt"}
                       onChange={handleFileInput}
                />
            </div>
            <button type={"submit"}>
                build
            </button>
        </form>
    )
}