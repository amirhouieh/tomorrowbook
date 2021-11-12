import React, { useEffect, useRef, useState } from "react";

import { Entity } from "../../../libs/entity-extractor/class.entity";
import { WikiPage } from "../../../libs/entity-extractor/class.page";
import { IActiveEntity } from "../reader";
import {
    getEntityInTextReferences,
    getEntityReferences,
    groupEntities
} from "../../../libs/entity-extractor/utils.extractor";
import { EntityGroup } from "../entity-group";

import styles from "./styles.module.css";
import { IEntityWithReferences, IOpenEntityState, TEntityGroup } from "../../../types";

interface IProps{
    entities: Entity[];
    pages: WikiPage[];
    inputText: string[]
}

interface IEntityGroup{
    group: TEntityGroup;
    spaceAfter: number
}

export const ReaderContent: React.FC<IProps> = (props) => {
    const {entities, pages, inputText} = props;
    const [openEntities, setOpenEntities] = useState<IEntityWithReferences[]>([]);
    const [visibleEntity, setVisibleEntity] = useState<Entity|null>(null);
    const [inTransition, setInTransition] = useState(false);

    const [groups, setGroups] = useState<IEntityGroup[]>([])

    useEffect(() => {
        setGroups(
            groupEntities(entities).map(group => ({
                group,
                spaceAfter: (~~(Math.random()*10)+2)
            }))
        )
    }, [])

    const isAlready = (e: IEntityWithReferences|Entity): boolean => {
        return !!openEntities.find(o => o.key===e.key)
    }

    const removeEntityFromOpenEntities = (e: Entity) => {
        setOpenEntities(
            openEntities.filter(o => o.key!==e.key)
        )
    }

    const openEntity = (e: Entity) => {
        setVisibleEntity(e);
        setOpenEntities([
            ...openEntities,
            {
                ...e,
                references: getEntityReferences(e, pages),
                inText: getEntityInTextReferences(e, inputText)
            } as IEntityWithReferences
        ])
    }

    const onEntityClicked = (e: Entity) => {
        if(inTransition) return;

        setInTransition(true);
        if(openEntities.length===0||!isAlready(e)){
            openEntity(e);
            console.log("show")
        }else{
            console.log("hide")
            setVisibleEntity(null);
        }
    }

    const onEntityTransitionDone = (e: IEntityWithReferences|Entity, close: boolean = false) => {
        if(close){
            console.log("remove", e.key)
            removeEntityFromOpenEntities(e);
        }
        setInTransition(false);
    }

    return (
        <article className={`${styles.content}`}>
            {
                groups
                    .map(({group, spaceAfter}, i) => (
                        <EntityGroup
                            key={group.score}
                            {...group}
                            spaceAfter={spaceAfter}
                            openEntities={openEntities}
                            visibleEntity={visibleEntity}
                            onTransitionDone={onEntityTransitionDone}
                            onEntityClicked={onEntityClicked}
                            index={i}
                        />
                    ))
            }
        </article>
    )
}