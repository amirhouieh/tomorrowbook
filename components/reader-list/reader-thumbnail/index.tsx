import React from "react";
import Link from "next/link";
import {IReaderDataFromServer} from "../../../types";

interface IProps {
    reader: IReaderDataFromServer;
}

import styles from "./styles.module.css"

export const ReaderThumbnail: React.FC<IProps> = ({reader}) => (
    <div key={reader.id}
         className={styles.container}
    >
        <div className={`${styles.cover} upper`}>
            <Link href={`/read/${reader.id}`}>
                <a>
                    <article>
                        <span>{reader.readerTitle}</span>
                        <br/>
                        <br/>
                        <p style={{
                            fontFamily: "serif",
                            textTransform: "capitalize",
                            // textAlign: "center"
                        }}>
                            <span>
                                <i>{reader.wikiTitle}</i>
                            </span>
                            <br/>
                            <span>&</span>
                            <br/>
                            <span>
                                <i>{reader.bookTitle}</i>
                            </span>
                        </p>
                    </article>
                </a>
            </Link>
            <div/>
        </div>
        {/*<time className={styles.date}>*/}
        {/*    {*/}
        {/*        new Date(reader.createdAt.seconds).getDate()*/}
        {/*    }*/}
        {/*</time>*/}
        {/*<div className={styles.tags}>*/}
        {/*    {*/}
        {/*        reader.tags.slice(0, 5).map((tag, i) => (*/}
        {/*            <Link href={`#${tag}`}*/}
        {/*                  key={i}*/}
        {/*            >*/}
        {/*                <small className={styles.tag}>*/}
        {/*                    {tag}{i===4? "": ", "}*/}
        {/*                </small>*/}
        {/*            </Link>*/}
        {/*        ))*/}
        {/*    }*/}
        {/*</div>*/}
    </div>
)