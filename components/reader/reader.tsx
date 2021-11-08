import React, { useEffect, useState } from "react";

import { Entity } from "../../libs/entity-extractor/class.entity";

import { IReaderComponentInput, TEntityReference } from "../../types";

import styles from "./styles.module.css";
import { EntityExtractor } from "../../libs/entity-extractor/class.extractor";
import { ReaderContent } from "./reader-content";

export interface IActiveEntity {
    references: TEntityReference[];
    entity: Entity;
}


interface IProps extends IReaderComponentInput {
}

const extractor = new EntityExtractor();

export const Reader: React.FC<IProps> = (props) => {
    const {readerTitle, inputText, wikiTitle} = props;
    const [isReady, setIsReady] = useState<boolean>(false);
    const [titleBeingProcessed, setTitleBeingProcessed] = useState<string|null>(null);

    useEffect(() => {

        extractor.hooks.onPagePopulated = (page) => {
            setTitleBeingProcessed(page.metadata.title);
        }

        extractor
            .extract(wikiTitle || readerTitle, inputText)
            .then(() => {
                setIsReady(true);
            })

    }, [])

    return (
        <div className={`${styles.readerContainer} ${styles.col}`}>
            {
                <div className={styles.readerHeader}>
                    <h3>{readerTitle}</h3>
                </div>
            }
            {
                isReady?
                    <ReaderContent
                        entities={extractor.entities}
                        referencePages={extractor.pages}
                    />
                    :
                    <div className={styles.readerStatus}>
                        <span>Building reader ...</span>
                        <br/>
                        <span>{titleBeingProcessed}</span>
                    </div>
            }
        </div>
    )
}