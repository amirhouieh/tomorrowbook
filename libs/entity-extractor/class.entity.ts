import { isPhrase, isStop, isValidKeyword, processPhrase } from "./utils.extractor";
import { WikiPage } from "./class.page";

export class Entity{
    public inRefsTitle: number[] = [];
    public inRefsText: [number, number][] = [];
    public frqInMainArticle: number= 0;
    public frqInInputText: number = 0;
    public isPhrase: boolean = false;
    public score: number = 0;

    constructor(public key: string) {
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
            let isInText = true;
            let j = 0;

            while (isInText && j < referencePage.paragraphs.length) {
                const paragraph = referencePage.paragraphs[j];
                if (paragraph.match(this.regexKey()) !== null) {
                    this.inRefsText.push([referencePage.index, j]);
                    isInText = false;
                }
                j++;
            }
        }

        if(referencePage.isMain){
            const matches = referencePage.text.match(this.regexKey("", " "));
            this.frqInMainArticle = matches? matches.length: 0;
        }

        this.score =
            (this.frqInInputText * 8)
            + (this.frqInMainArticle * 16)
            + (this.inRefsTitle.length * 2)
            + this.inRefsText.length
            ;
    }

    calcFinalScore(maxScore: number){
        this.score +=
            (this.inRefsText.length + 1)
            * (this.inRefsTitle.length + 1)
            * (this.isPhrase?1:0) * maxScore / 8;
    }
}