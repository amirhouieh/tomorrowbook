import { isPhrase, isStop, isValidKeyword, processPhrase } from "./utils.extractor";
import { WikiPage } from "./class.page";
import { TEntityReference } from "../../types";

export class Entity{
    public inRefsTitle: number[] = [];
    public inRefsText: [number, number][] = [];
    public frqInMainArticle: number= 0;
    public frqInInputText: number = 0;
    public isPhrase: boolean = false;
    public score: number = 0;
    public wikiRefs: TEntityReference[] = [];

    constructor(public key: string) {
        this.key = key.toLowerCase().trim();
    }

    valid(): boolean{
        return isValidKeyword(this.key);
    }

    secondValidation(): boolean{
        return this.key.length > 1 && !isStop(this.key)
    }

    cleanUp(){
        this.key = this.key.replace(/#/g, "").trim();
        if (isPhrase(this.key)) {
            this.key = processPhrase(this.key);
            this.isPhrase = true;
        }
    }

    regexKey(prefix: string = "", postfix: string = "", flag="gi"){
        return new RegExp(prefix + this.key + postfix, flag);
    }

    calcInitialScore(referencePage: WikiPage){
        const appearInText = referencePage.text.match(this.regexKey("", " ")) !== null;
        const appearInTitle = referencePage.metadata.title.match(this.regexKey("", " ")) !== null;

        // if the keyword appears in references title
        if (appearInTitle) {
            this.inRefsTitle.push(referencePage.index);
        }

        // if the keyword appears in references text
        if (appearInText) {

            referencePage.paragraphs.forEach((paragraph, j) => {
                if (paragraph.match(this.regexKey()) !== null) {
                    this.inRefsText.push([referencePage.index, j]);
                }
            })

            // let isInText = true;
            // let j = 0;
            // while (isInText && j < referencePage.paragraphs.length) {
            //     const paragraph = referencePage.paragraphs[j];
            //     if (paragraph.match(this.regexKey()) !== null) {
            //         this.inRefsText.push([referencePage.index, j]);
            //         isInText = false;
            //     }
            //     j++;
            // }
        }

        if(referencePage.isMain){
            const matches = referencePage.text.match(this.regexKey("", " "));
            this.frqInMainArticle = matches? matches.length: 0;
        }


        // word.scor =
        // word.frq_InText * 8 +
        // word.frq_InMainArticle* 16 +
        // word.frq_InRfrncText  +
        // word.frq_InRfrncTitle*2;

        this.score =
            (this.frqInInputText * 8)
            + (this.frqInMainArticle * 16)
            + (this.inRefsTitle.length * 2)
            + this.inRefsText.length
            ;
    }

    calcFinalScore(maxScore: number){

        // _afterWiki[i].scor +=
        // (item.frq_InRfrncText+1)*
        // (item.frq_InRfrncTitle+1) *
        // item.isSpacial * _largestScor/8;

        this.score +=
            (this.inRefsText.length + 1)
            * (this.inRefsTitle.length + 1)
            * (this.isPhrase?1:0) * maxScore / 8;
    }

    populateWikiRefs = (pages: WikiPage[]): TEntityReference[] => {
        this.wikiRefs = this.inRefsText
            .map((ref) => {
                const [refIndex, paragraphIndex] = ref;
                const refPage = pages.find((p) => p.index===refIndex);
                return {
                    title: refPage!.metadata.title,
                    pageid: refPage!.metadata.pageid,
                    text: refPage!.paragraphs[paragraphIndex]
                }
            })
        return this.wikiRefs;
    }
}