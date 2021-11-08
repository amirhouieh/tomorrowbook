import React from "react";
import { TEntityGroup } from "../../../types";
import { Entity } from "../../../libs/entity-extractor/class.entity";
import { IActiveEntity } from "../reader";
import { EntityComponent } from "../entity-component";


interface IProps extends TEntityGroup {
    onEntityOpen: (entity: Entity) => void
    onEntityClose: (entity: Entity) => void
    openEntity: IActiveEntity | null;
}

import styles from "./styles.module.css";

export const EntityGroup: React.FC<IProps> = (props) => {
    const {entities, score, openEntity, onEntityOpen, onEntityClose} = props;

    return (
        <p className={""} id={score.toString()}>
            {
                entities.map((entity) => (
                    <EntityComponent
                        key={entity.key}
                        entity={entity}
                        references={openEntity&&openEntity.entity.key===entity.key? openEntity.references: null}
                        onClose={onEntityClose}
                        onOpen={onEntityOpen}
                        open={openEntity!==null&&openEntity.entity.key===entity.key}
                    />
                ))
            }
        </p>
    )
}