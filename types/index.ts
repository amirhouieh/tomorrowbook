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
    text: string;
    pageid: string;
}