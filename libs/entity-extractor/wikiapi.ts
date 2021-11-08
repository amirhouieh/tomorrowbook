import { queryParamsToString } from "../utils";
import { IWikiAPI_pageExtractResponse, IWikiAPI_pageListResponse, IWikiAPI_SearchPage } from "./types.extractor";

const WIKI_API_BASE_URL = `https://en.wikipedia.org/w/api.php`;

const wikiQueryParams = {
    getSubPages: (q: string, n: number) => queryParamsToString(({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: encodeURIComponent(q),
        srlimit: n+"",
        origin: "*",
    })),

    getPageText: (titles: string) => queryParamsToString({
        action: 'query',
        format: 'json',
        titles: titles,
        prop: 'extracts',
        explaintext: "",
        indexpageids: "",
        origin: "*",
    })
}

export class WikiApi {
    constructor() {
    }

    private request<T>(queries: string): Promise<T>{
        return fetch(`${WIKI_API_BASE_URL}?${queries}`)
            .then((res) => res.json());
    }

    listPages(q: string, n: number): Promise<IWikiAPI_SearchPage[]>{
        return this.request<IWikiAPI_pageListResponse>(wikiQueryParams.getSubPages(q, n))
            .then((res) => {
                return res.query.search;
            })
    }

    getPageExtract(title: string, pageid: string): Promise<string>{
        return this.request<IWikiAPI_pageExtractResponse>(wikiQueryParams.getPageText(title))
            .then((response) => {
                return response.query.pages[pageid].extract
            })
    }
}