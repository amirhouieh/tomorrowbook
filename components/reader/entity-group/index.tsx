import React from "react";
import { IEntityWithReferences, TEntityEventFn, TEntityGroup } from "../../../types";
import { Entity } from "../../../libs/entity-extractor/class.entity";

import { EntityComponent } from "../entity-component";

interface IProps extends TEntityGroup {
    onTransitionDone: TEntityEventFn;
    onEntityClicked: (e: Entity) => void;
    openEntities: IEntityWithReferences[];
    visibleEntity: Entity|null;
    spaceAfter: number;
    index: number;
}

import styles from "./styles.module.css";



export const EntityGroup: React.FC<IProps> = (props) => {
    const {
        entities,
        score,
        openEntities,
        onTransitionDone,
        onEntityClicked,
        index,
        spaceAfter,
        visibleEntity
    } = props;

    return (
        <div className={`${styles.container} spaceAfter`}
                 id={score.toString()}
                 data-content_after={new Array(spaceAfter).fill(null).map(_ => `\n`).join("")}
        >
            {
                entities.map((entity, ei) => (
                    <EntityComponent
                        key={entity.key}
                        groupIndex={index}
                        selfIndex={ei}
                        entity={entity}
                        onTransitionDone={onTransitionDone}
                        onClick={onEntityClicked}
                        openEntities={openEntities}
                        open={visibleEntity?visibleEntity.key===entity.key: false}
                    />
                ))
            }
        </div>
    )
}