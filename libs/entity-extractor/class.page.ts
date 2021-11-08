import { WikiApi } from "./wikiapi";
import { IWikiAPI_SearchPage } from "./types.extractor";
import { sanitizeExtract } from "./utils.extractor";
import { Entity } from "./class.entity";

export class WikiPage{
    private api: WikiApi;
    public text!: string;
    public paragraphs: string[] = [];
    public isReference: boolean = false;
    public frequencyOfFirstPageTitleInThePage: number = 0;
    public isMain: boolean = false

    constructor(
        public metadata: IWikiAPI_SearchPage,
        public index: number,
    ) {
        this.isMain = this.index===0;
        this.api = new WikiApi();
    }

    async populateContent(){
        try{
            const {metadata:{title, pageid}} = this;

            const extract = await this.api.getPageExtract(title, pageid);

            this.text = sanitizeExtract(extract);
            this.paragraphs = this.text.split('.\n');

        }catch (e){
            console.log("error", this.metadata);
            console.log(e);
            console.log("")
        }
    }

    checkIfReference(firstPageTitle: string){
        this.frequencyOfFirstPageTitleInThePage = this.getEntityFrequency(new Entity(firstPageTitle));
        this.isReference = this.frequencyOfFirstPageTitleInThePage > 0;
    }

    getEntityFrequency(entity: Entity): number{
        const matches = this.text.match(new RegExp(' ' + entity.key + ' ', 'gi'));
        return matches? matches.length: 0;
    }
}

