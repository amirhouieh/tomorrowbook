import React, { useEffect, useState } from "react";

import { Entity } from "../../libs/entity-extractor/class.entity";
import { IEntityWithReferences, IReaderComponentInput, TEntityReference } from "../../types";

import styles from "./styles.module.css";
import { EntityExtractor } from "../../libs/entity-extractor/class.extractor";
import { ReaderContent } from "./reader-content";
import { getEntityInTextReferences, getEntityReferences } from "../../libs/entity-extractor/utils.extractor";

export interface IActiveEntity {
    references: TEntityReference[];
    entity: Entity;
}

interface IProps extends IReaderComponentInput {
}

const extractor = new EntityExtractor({
    numberOfPages: 50
});

export const Reader: React.FC<IProps> = (props) => {
    const {readerTitle, inputText, wikiTitle} = props;
    const [isReady, setIsReady] = useState<boolean>(false);
    const [titleBeingProcessed, setTitleBeingProcessed] = useState<string|null>(null);

    useEffect(() => {
        extractor.hooks.onPagePopulated = (page) => {
            setTitleBeingProcessed(page.metadata.title);
            console.log(page.index, page.metadata.title);
        }
        extractor
            .extract(wikiTitle || readerTitle, inputText)
            .then(() => {
                console.log(extractor.entities.find(e => e.key==="cubism"));
                setIsReady(true);
            })
    }, [])

    return (
        <div className={`${styles.container}`}>
            {
                <div className={`${styles.header} upper`}>
                    <h3>{readerTitle}</h3>
                </div>
            }
            <div className={styles.content}>
                {
                    isReady?
                        <ReaderContent entities={extractor.entities}
                                       pages={extractor.pages}
                                       inputText={extractor.inputText.split(".").filter(p => p&&p)}
                        />
                        :
                        <div className={styles.status}>
                            <span>Building reader ...</span>
                            <br/>
                            <span>{titleBeingProcessed}</span>
                        </div>
                }
            </div>
        </div>
    )
}