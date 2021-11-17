import { Entity } from "../libs/entity-extractor/class.entity";
import { TEntityData } from "../libs/entity-extractor/types.extractor";


export interface IReaderDataBase {
    readerTitle: string;
    wikiTitle?: string|null;
    inputText: string;
    bookTitle?: string|null;
    tags: string[];
}

export interface IReaderDataFromClient extends IReaderDataBase{
}

export interface IReaderDataFromServer extends IReaderDataBase{
    createdAt: {
        seconds: number;
        milliseconds: number
    };
    id: string;
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