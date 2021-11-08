import React, { useState } from "react";

import { Entity } from "../../../libs/entity-extractor/class.entity";
import { WikiPage } from "../../../libs/entity-extractor/class.page";
import { IActiveEntity } from "../reader";
import { getEntityReferences, groupEntities } from "../../../libs/entity-extractor/utils.extractor";
import { EntityGroup } from "../entity-group";

import styles from "./styles.module.css";

interface IProps{
    entities: Entity[];
    referencePages: WikiPage[];
}

export const ReaderContent: React.FC<IProps> = (props) => {
    const {entities, referencePages} = props;
    const [openEntity, setOpenEntity] = useState<IActiveEntity | null>(null);

    const onEntityOpen = (entity: Entity) => {
        setOpenEntity({
            entity,
            references: getEntityReferences(entity, referencePages)
        })
    }

    const onEntityClose = (entity: Entity) => {
        setOpenEntity(null)
    }

    return (
        <article className={`${styles.content}`}>
            {
                groupEntities(entities)
                    .map((entityGroup, i) => (
                        <EntityGroup
                            key={entityGroup.score}
                            {...entityGroup}
                            onEntityOpen={onEntityOpen}
                            onEntityClose={onEntityClose}
                            openEntity={openEntity}
                        />
                    ))
            }
        </article>
    )
}