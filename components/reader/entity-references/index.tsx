import React, { useEffect, useRef, useState } from "react";

import { EntityReferenceComponent } from "../entity-refrence";
import { IEntityWithReferences, TEntityEventFn } from "../../../types";

interface IProps {
    show: boolean;
    openEntity: IEntityWithReferences|undefined;
    entity: Entity;
    onTransitionDone: TEntityEventFn;
    transitionDuration?: number;
}

import styles from "./styles.module.css";
import { Entity } from "../../../libs/entity-extractor/class.entity";

export const EntityReferences: React.FC<IProps> = (props) => {
    const {
        show,
        entity,
        openEntity,
        onTransitionDone,
        transitionDuration = 1000
    } = props;

    const [h, setH] = useState(0);
    const ref = useRef<HTMLElement>(null);

    const calcH = (): number => {
        if (!ref.current) return 0;
        let _h = 0;
        for (let i = 0; i < ref.current.children.length; i++) {
            //@ts-ignore
            _h += ref.current.children.item(i)!.offsetHeight || 0;
        }
        return _h;
    }

    useEffect(() => {
        if(!openEntity) return;

        if (show && ref.current) {
            setH(calcH())
            setTimeout(() => onTransitionDone(entity), transitionDuration + 50);
        } else if (!show) {
            setH(0);
            setTimeout(() => onTransitionDone(entity, true), transitionDuration + 50);
        }
    }, [show])

    return (
        <section className={`${styles.references}`}
                 ref={ref}
                 style={{
                     height: h + "px",
                     overflow: "hidden",
                     // opacity: h>0? 1:0,
                     paddingBottom: h>0? "2em": ""
                 }}
        >
            {
                openEntity
                &&
                openEntity
                    .references
                    .sort((a,b) => b.paragraphs.length - a.paragraphs.length)
                    .slice(0, 3)
                    .map((ref, j) => (
                    <EntityReferenceComponent
                        key={j + "" + entity.key + ref.pageid + ref.title}
                        entityKey={entity.key}
                        {...ref}
                        isWiki={true}
                    />
                ))
            }
            {
                openEntity&&
                <EntityReferenceComponent key={4 + "intext"}
                                          entityKey={openEntity.key}
                                          pageid={""}
                                          paragraphs={openEntity.inText.slice(0,2).map(s => `${s}...`)}
                                          title={"In original text"}
                                          isWiki={false}
                />
            }
        </section>
    )
}