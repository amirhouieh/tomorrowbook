import React from "react";
import { TEntityReference } from "../../../types";
import { wrapKeyInText } from "../../../utils";


interface IProps extends TEntityReference{
    entityKey: string;
}

import styles from "./styles.module.css";

export const EntityReferenceComponent: React.FC<IProps> = (props) => {
    return (
        <div className={styles.container}>
            <strong>
                <a href={"wikipedia.org"}>{props.title}</a>
            </strong>
            <p
                dangerouslySetInnerHTML={{
                    __html: wrapKeyInText(props.entityKey, props.text)+"\n\n"
                }}
            />
        </div>
    )
}