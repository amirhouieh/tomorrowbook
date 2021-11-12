import { Entity } from "../libs/entity-extractor/class.entity";

export interface IReaderComponentInput{
    readerTitle: string;
    wikiTitle: string | null;
    inputText: string;
}

export type TEntityGroup = {
    entities: Entity[]
    score: number
}

export type TEntityReference = {
    title: string;
    paragraphs: string[];
    pageid: string;
}

export interface IEntityWithReferences extends Entity{
    references: TEntityReference[];
    inText: string[];
}

export interface IOpenEntityState{
    current: IEntityWithReferences|null;
    prev: IEntityWithReferences|null
}

export type TEntityEventFn = (e: IEntityWithReferences|Entity, close?:boolean) => void;