import { stop_words } from "./stopword";
import { Entity } from "./class.entity";
import { TEntityGroup, TEntityReference } from "../../types";
import { groupBy } from "../../utils";
import { WikiPage } from "./class.page";

export const isStop = (s: string): boolean => stop_words.indexOf(s.toLowerCase()) > -1;

export const isPhrase = (s: string): boolean => s.match(/\s/g) !== null;

export const processPhrase = (p: string) => {
    let phrase = p.split(/\s/g);
    if (isStop(phrase[0]) || phrase[0].length < 2) {
        return phrase.slice(1).join(' ').replace(/-/g, "").trim();
    }
    return phrase.join(' ').replace(/-/g, "").trim();
}

export const isAlphabeticOnly = (s: string) => {
    return /[a-zA-Z]{2,}/.test(s)
}

export const prepareInputText = (text: string): string[] => {
    return text
        .replace(/([A-Z][\w-]*(?:[^\S\t][A-Z][\w-]*)+)/g, '#$1#')
        .replace(/(\w+(?: - \w+)+)/g, '#$1#')
        .replace(/ppaarraaff/g, '')
        .replace(/ccaapptteerr/g, '')
        .replace(/[,|.|?|:|!|;]|\(|\)|’|‘|”|“]/g, "")
        .toLowerCase()
        .split(/(#.*?#|[^#\w]+)/)
}

export const isValidKeyword = (e: string|undefined): boolean => {
    return (
        typeof e === "string"
        && e.trim().length > 2
        && !stop_words.includes(e.toLowerCase())
        && (e.charAt(0).match(/\s/g) === null)
        && isAlphabeticOnly(e.replace(/#/g, "").trim())
    );
}


export const sanitizeExtract = (extract: string): string => {
    return extract
        .replace(/(==.+?==)|(===.+?===)|(=)/g, '')
        .replace(/\n\s*\n/g, '\n');
}


export const groupEntities = (entities: Entity[] ): TEntityGroup[] => {
    return Object.entries<Entity[]>(
        groupBy<Entity>(entities, (entity) => {
            return entity.score > 100 ? ~~(entity.score / 100) * 100 : ~~(entity.score / 5);
        })
    )
        .map(([score, entities]) => {
            return {score: parseInt(score), entities}
        })
        .sort((a, b) =>
                b.score - a.score
        );
}

export const getEntityReferences = (entity: Entity, pages: WikiPage[]): TEntityReference[] => {
    return entity.inRefsText
        .map((ref) => {
            const [refIndex, paragraphIndex] = ref;
            const refPage = pages.find((p) => p.index===refIndex);
            return {
                title: refPage!.metadata.title,
                pageid: refPage!.metadata.pageid,
                text: refPage!.paragraphs[paragraphIndex]
            }
        })
}
