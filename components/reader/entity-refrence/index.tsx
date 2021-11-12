import React from "react";
import { TEntityReference } from "../../../types";
import { mapNumberFn, randomInt, wrapKeyInText } from "../../../utils";


interface IProps extends TEntityReference{
    entityKey: string;
    isWiki: boolean;
}

import styles from "./styles.module.css";

const Paragraph: React.FC<{text: string}> = (props) => {
    return (
        <p dangerouslySetInnerHTML={{
            __html: props.text
        }}
           data-content_after={"\n\n"}
           className={`spaceAfter ${styles.refParagraph}`}
           style={{
               lineClamp: mapNumberFn(Math.max(props.text.length, 2000), 10, 2000, 10, randomInt(15, 25))
           }}
        />
    )
}

export const EntityReferenceComponent: React.FC<IProps> = (props) => {
    return (
        <>
            <strong
                className={`${styles.refTitle} spaceBefore`}
                data-content_before={`\n\n`}
            >
                {
                    props.isWiki?
                        <a href={`https://en.wikipedia.org/wiki/${props.title}`}
                           target={"_blank"}
                           rel="noreferrer"
                           title={`en.wikipedia.org/wiki/${props.title}`}
                        >
                            {props.title}
                        </a>
                        :
                        <span>{props.title}</span>
                }
            </strong>
            {
                props.paragraphs
                    .slice(0, 2)
                    .map((p, i) => (
                    <Paragraph text={wrapKeyInText(props.entityKey, p)}
                               key={i}
                    />
                ))
            }
        </>
    )
}