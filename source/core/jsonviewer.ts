/// <reference path="../../typings/jquery/jquery.d.ts" />

module disco.core {

    export class JsonViewer {

        public static createTree(container: JQuery, json: {}): void {
            container.html('');
            this.traverseJson(container, json);
        }

        public static getHtmlTree(json: {}): string {
            var container: JQuery = jQuery('<div class="json-tree">');
            
            this.traverseJson(container, json);
            return container.html();
        }

        public static traverseJson(container: JQuery, json: {}) {
            var ul: JQuery = jQuery('<ul>');
            ul.addClass('json-node');

            if (jQuery.isArray(json)) {
                container.append('<span>[</span>');
            } else {
                container.append('<span>{</span>');
            }

            var expand: JQuery = jQuery('<span>');
            expand.appendTo(container);

            if (!jQuery.isEmptyObject(json)) {
                expand.addClass('json-expand');
                expand.text('...');
                expand.click((eventObject: JQueryEventObject) => {
                    //jQuery(eventObject.target).toggle();
                    jQuery(eventObject.target).next('ul.json-node').toggle();
                });

                for (var property in json) {

                    var jsonKey: JQuery = jQuery('<span>');
                    jsonKey.addClass('json-key');
                    jsonKey.text(property + ': ');
                    //jsonKey.click((eventObject: JQueryEventObject) => {
                    //    jQuery(eventObject.target).next('span.json-expand').toggle();
                    //    jQuery(eventObject.target).next('ul.json-node').toggle();
                    //});
                    //jsonKey.addClass('json-expand');

                    var li: JQuery = jQuery('<li>');
                    li.append(jsonKey);

                    if (typeof json[property] === 'object') {
                        if (jQuery.isArray(json[property])) {
                            li.addClass('json-array');
                        } else {
                            li.addClass('json-object');
                        }
                        this.traverseJson(li, json[property]);
                    } else {
                        li.addClass('json-prop');

                        var jsonValue: JQuery = jQuery('<span>');
                        jsonValue.addClass('json-value');
                        jsonValue.text(json[property]);

                        li.append(jsonValue);
                    }
                    ul.append(li);
                }

                container.append(ul);
            }

            if (jQuery.isArray(json)) {
                container.append('<span>]</span>');
            } else {
                container.append('<span>}</span>');
            }
        }
    }
}