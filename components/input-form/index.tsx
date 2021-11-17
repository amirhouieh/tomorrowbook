import React, { ChangeEvent, FormEvent, useState } from "react";

import styles from "./styles.module.css";
import { IReaderDataBase } from "../../types";
import { readTextFile } from "../../utils";


interface IProps{
    onSubmit: (output: IReaderDataBase) => void
}

export const InputForm: React.FC<IProps> = (props) => {
    const [readerTitle, setReaderTitle] = useState<string|null>(null);
    const [wikiTitle, setWikiTitle] = useState<string|null>(null);
    const [bookTitle, setBookTitle] = useState<string|null>(null);
    const [selectedFile, setSelectedFile] = useState<null|File>(null);

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        try{
            const file = e.target.files![0];
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
                wikiTitle: wikiTitle? wikiTitle.trim(): null,
                readerTitle: readerTitle.trim(),
                inputText: inputText.trim(),
                bookTitle: bookTitle? bookTitle.trim(): null,
                tags: []
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
                <input type={"text"}
                       value={bookTitle||""}
                       placeholder={"book title"}
                       required={false}
                       onInput={(e) => {
                           setBookTitle(e.currentTarget.value)
                       }}
                />
                <small>if the text file is from a book</small>
            </div>
            <div className={styles.inputGroup}>
                <input type={"file"}
                       placeholder={"txt file"}
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