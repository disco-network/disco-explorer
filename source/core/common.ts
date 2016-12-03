/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

module disco.core {

    export class CollectionQuery {

        public static contains(collection: any[], predicate: (item, index) => boolean): boolean {
            var result: any[] = jQuery.grep(collection, predicate);
            return result.length > 0;
        }

        public static where(collection: any[], predicate: (item, index) => boolean): any[] {
            var result: any[] = jQuery.grep(collection, predicate);
            return result;
        }

        public static single(collection: any[], predicate: (item, index) => boolean): any {
            var result: any[] = jQuery.grep(collection, predicate);
            if (result.length == 1) {
                return result[0];
            } else {
                throw new Error('The given predicate did not match one single item!');
            }
        }

        public static select(collection: any[], selector: (item: any) => any[]): any[]{
            var result: any[] = [];

            for (var item in collection) {
                result.push(selector(collection[item]));
            }

            return result;
        }
    }
}