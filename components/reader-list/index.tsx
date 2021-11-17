import React from "react";

import { IReaderDataFromServer } from "../../types";
import { useReadersData } from "../../firebase/db";

import { ReaderThumbnail } from "./reader-thumbnail";
import { StatusComponent } from "../status";

import styles from "./styles.module.css";

export const ReaderList: React.FC<any> = (props) => {
    const [readers, error] = useReadersData();

    return (
        <div className={styles.container}>
            {
                !readers&&
                <StatusComponent error={error} loading={!readers}/>
            }
            <div className={styles.grid}>
                {
                    readers&&
                    readers.map((reader, i) => (
                        <ReaderThumbnail reader={reader}
                                         key={`rt-${i}`}
                        />
                    ))
                }
            </div>
        </div>
    )
}