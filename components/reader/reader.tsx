import React, { useEffect, useState } from "react";

import { IReaderDataFromClient } from "../../types";

import styles from "./styles.module.css";
import { EntityExtractor } from "../../libs/entity-extractor/class.extractor";
import { ReaderContent } from "./reader-content";
import { publishReader } from "../../firebase/db";


interface IProps{
    data: IReaderDataFromClient;
    create: boolean;
}

let extractor:EntityExtractor;

export const Reader: React.FC<IProps> = (props) => {
    const {create, data} = props;
    const [isReady, setIsReady] = useState<boolean>(false);
    const [published, setPublished] = useState<boolean>(false);
    const [titleBeingProcessed, setTitleBeingProcessed] = useState<string|null>(null);

    useEffect(() => {
        extractor = new EntityExtractor({
            numberOfPages: 50
        });

        extractor.hooks.onPagePopulated = (page) => {
            setTitleBeingProcessed(page.metadata.title);
        }

        if(extractor.entities.length === 0){
            extractor
                .extract(data)
                .then(() => setIsReady(true))
        }
    }, [data])

    const publishHandler = () => {
        publishReader({
            ...extractor.inputData,
            tags: extractor.entities.slice(0, 10).map(e => e.key),
        })
            .then(() => setPublished(true))
            .catch(e => {
                console.log("error", e);
                alert("something went wrong:/");
            })
    }

    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.header} upper`}>
                <h3>{data.readerTitle}</h3>
                {
                    (isReady&&create&&!published)&&
                    <button onClick={publishHandler}>PUBLISH</button>
                }
            </div>
            <div className={styles.content}>
                {
                    isReady&&extractor?
                        <ReaderContent
                            entities= {extractor.entities.slice(0, 200)}
                            pages= {extractor.pages}
                            inputText= {data.inputText}
                        />
                        :
                        <div className={styles.status}>
                            <span>Building reader ...</span>
                            <br/>
                            {
                                titleBeingProcessed?
                                    <span>{titleBeingProcessed}</span>
                                    :
                                    <span>Analysing text</span>
                            }
                        </div>
                }
            </div>
        </div>
    )
}