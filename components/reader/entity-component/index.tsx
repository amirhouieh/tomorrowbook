import React, { useState } from "react";
import { Entity } from "../../../libs/entity-extractor/class.entity";
import { TEntityReference } from "../../../types";
import { EntityReferenceComponent } from "../entity-refrence";

interface IProps {
    entity: Entity;
    references: TEntityReference[]|null;
    open: boolean;
    onOpen: (e: Entity) => void
    onClose: (e: Entity) => void
}

import styles from "./styles.module.css";

export const EntityComponent: React.FC<IProps> = (props) => {
    const {entity, references, open, onOpen, onClose} = props;
    const [showRef, setShowRef] = useState<boolean>(false);

    const onClick = () => {
        if(open){
            setShowRef(false);
            setTimeout(() => {
                onClose(entity);
            }, 1000);
        }else{
            console.log("clicked", open, entity)
            onOpen(entity);
        }
    }

    return (
        <>
            <span onClick={onClick}
                  style={{color: "rgb(0, 0, 255);"}}
                  className={`${open ? "open-self" : ""} ${styles.entity}`}
            >
                {entity.key}
            </span>
            {
                references&&
                    <span className={`${showRef? styles.show: styles.hide} ${styles.entityRefs}`}>
                        {
                            references.map((ref) => (
                                <EntityReferenceComponent
                                    key={entity.key+ref.pageid}
                                    entityKey={entity.key}
                                    {...ref}
                                />
                            ))
                        }
                    </span>
            }
        </>
    )
}