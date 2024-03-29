import { Entity } from "./class.entity";
import { WikiPage } from "./class.page";
import { prepareInputText } from "./utils.extractor";
import { WikiApi } from "./wikiapi";
import { IReaderDataBase } from "../../types";

export type TEntityExtractorOptions = {
    numberOfPages: number;
}
export type TEntityExtractorHooks = {
    onPagePopulated?: (page: WikiPage) => void;
    onError?: (e: Error|unknown) => void;
}


export class EntityExtractor{
    private entitiesAsText: string = "";
    private api: WikiApi;
    public entities: Entity[] = [];
    public pages: WikiPage[] = [];
    public maxEntityScore: number = 0;

    public inputData!: IReaderDataBase;

    options: TEntityExtractorOptions = {
        numberOfPages: 10,
    }

    hooks: TEntityExtractorHooks = {
        onError: console.log,
        onPagePopulated: () => {}
    };

    constructor(
        options?: TEntityExtractorOptions,
        hooks: TEntityExtractorHooks = {}
    ) {
        this.options = {...this.options, ...(options || {})};
        this.hooks.onError = hooks.onError||this.hooks.onError;
        this.hooks.onPagePopulated = hooks.onPagePopulated||this.hooks.onPagePopulated;

        this.api = new WikiApi();
    }

    extractEntities() {

        prepareInputText(this.inputData.inputText)
            .forEach((item) => {
                const entity = new Entity(item);
                if (entity.valid()) {
                    entity.cleanUp();
                    if (entity.secondValidation()) {
                        this.entitiesAsText += `${entity.key} &`;
                        if (!this.findEntity(entity)) {
                            this.entities.push(entity)
                        }
                    }
                }
            })

        this.entities.forEach((entity) => {
            const frequencyInText = this.entitiesAsText.match(new RegExp("&" + entity.key + " &", 'g'));
            entity.frqInInputText = frequencyInText ? frequencyInText.length : 0;
        });
    }

    findEntity(entity: Entity): Entity | undefined {
        return this.entities.find((e) => e.key === entity.key);
    }

    get firstPage(): WikiPage{
        return this.pages[0];
    }

    async fetchContextData() {
        try {
            const {options: {numberOfPages}} = this;
            const wikiTitle = this.inputData.wikiTitle||this.inputData.readerTitle;

            const pagesMetadata = await this.api.listPages(wikiTitle, numberOfPages);
            this.pages = pagesMetadata.map((meta, i) => new WikiPage(meta, i))

            await Promise.all(
                this.pages.map(async(page) => {
                    try {
                        await page.populateContent();
                        page.checkIfReference(this.firstPage.metadata.title);
                        this.hooks.onPagePopulated!(page);
                    } catch (e) {
                        console.log("Error", page.metadata);
                        this.hooks.onError!(e);
                    }
                })
            )
        } catch (e) {
            console.log("error");
            this.hooks.onError!(e);
        }
    }

    scoreEntities() {
        this.pages.forEach((page) => {
            this.entities = this.entities.map((entity) => {
                entity.calcInitialScore(page);
                this.maxEntityScore = Math.max(entity.score, this.maxEntityScore);
                return entity;
            })
        })

        this.entities.forEach((entity) => {
            entity.calcFinalScore(this.maxEntityScore);
        })
    }

    postProcessEntities() {
        this.entities = this.entities
            .filter((entity) => {
                return entity.score > this.maxEntityScore / 35;
            })
            .sort((a, b) => b.score- a.score);
    }

    async extract(inputData: IReaderDataBase) {
        this.inputData = inputData
        //extract most frequented keyword entities
        this.extractEntities()

        //Get the list of most relevant Wiki articles
        await this.fetchContextData()

        //calculate the score of each entity
        this.scoreEntities()

        //filter low score entities and sort them by score
        this.postProcessEntities();
    }
}