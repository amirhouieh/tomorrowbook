type MapFunc<T = any> = (val: T, index?: number, arr?: T[]) => string|number;

const isString = <T = any>(str: string | T): str is string => {
    return typeof str === "string";
};

export const groupBy = <T = any>(arr: T[], fn: MapFunc<T> | string) =>
    arr.map(isString(fn) ? (val: any) => val[fn] : fn).reduce((acc, val, i) => {
        acc[val] = (acc[val] || []).concat(arr[i]);
        return acc;
    }, {});


export const wrapKeyInText = (key: string, text: string) => {
    const regex = "(\\b" + key.replace(/([{}()[\]\\.?*+^$|=!:~-])/g, "\\$1") + "\\b)";
    const r = new RegExp(regex, "igm")
    return text.replace(r, "<span class='hl'>$1</span>")
}

export const readTextFile = (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.readAsText(file, "utf-8");
        reader.onload = function() {
            //@ts-ignore
            resolve(reader.result)
        };
        reader.onerror = function(e) {
            reject(new Error("Error parsing file"));
        };
    })
}

export const mapNumberFn = (value: number, x1: number, y1: number, x2: number, y2: number): number =>
    (value - x1) * (y2 - x2) / (y1 - x1) + x2;


export const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}