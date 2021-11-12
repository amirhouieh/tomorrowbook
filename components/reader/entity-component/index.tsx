import React, { useEffect, useRef, useState } from "react";
import { IEntityWithReferences, TEntityEventFn } from "../../../types";
import { Entity } from "../../../libs/entity-extractor/class.entity";
import { EntityReferences } from "../entity-references";

interface IProps {
    entity: Entity;
    openEntities: IEntityWithReferences[];
    onClick: (e: Entity) => void;
    onTransitionDone: TEntityEventFn;
    selfIndex: number;
    groupIndex: number;
    open: boolean;
}

import styles from "./styles.module.css";

export const EntityComponent: React.FC<IProps> = (props) => {
    const {entity, openEntities, onTransitionDone, groupIndex, open} = props;
    const [appear, setAppear] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            setAppear(true);
        }, groupIndex * 100)
    })

    const onClick = () => {
        props.onClick(entity);
    }

    return (
        <>
            <span onClick={onClick}
                  className={`cap ${styles.entity} ${appear ? styles.appear : ""} ${openEntities.length>0&&!open? styles.blue: ""}`}
                  ref={ref}
            >
                {entity.key}
            </span>
            <EntityReferences
                show={open}
                openEntity={openEntities.find(o => o.key===entity.key)}
                entity={entity}
                onTransitionDone={onTransitionDone}
            />
        </>
    )
}