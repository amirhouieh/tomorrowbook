import { TEntityReference } from "../../types";

export interface IWikiAPI_Continue {
    sroffset: number;
    continue: string;
}

export interface IWikiAPI_SearchInfo {
    totalhits: number;
}

export interface IWikiAPI_SearchPage {
    ns: number;
    title: string;
    pageid: string;
    size: number;
    wordcount: number;
    snippet: string;
    timestamp: Date;
}


export interface IWikiAPI_Query<Q>{
    batchcomplete: string;
    query: Q
}
export interface IWikiAPI_QueryPageList {
    searchinfo: IWikiAPI_SearchInfo;
    search: IWikiAPI_SearchPage[];
}

export interface IWikiAPI_QueryPageExtract {
    pageids: string[];
    pages:   IWikiAPI_pages;
}

export interface IWikiAPI_pages {
    [key: string]: IWikiAPI_page;
}

export interface IWikiAPI_page {
    pageid:  string;
    ns:      number;
    title:   string;
    extract: string;
}

export interface IWikiAPI_pageListResponse extends IWikiAPI_Query<IWikiAPI_QueryPageList>{
    continue: IWikiAPI_Continue;
}

export interface IWikiAPI_pageExtractResponse extends IWikiAPI_Query<IWikiAPI_QueryPageExtract>{
}

export type TEntityData = {
    score: number;
    key: string;
    isPhrase: boolean;
    wikiRefs: TEntityReference[];
}


export type TWikiPageData = {
    paragraphs: string[];
    isReference: boolean;
    frequencyOfFirstPageTitleInThePage: number;
    isMain: boolean;
    metadata: IWikiAPI_SearchPage;
    index: number;
}