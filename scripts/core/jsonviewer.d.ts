/// <reference path="../typings/jquery/jquery.d.ts" />
declare module disco.core {
    class JsonViewer {
        static createTree(container: JQuery, json: {}): void;
        static getHtmlTree(json: {}): string;
        static traverseJson(container: JQuery, json: {}): void;
    }
}
