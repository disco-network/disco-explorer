var disco;
(function (disco) {
    var core;
    (function (core) {
        var JsonViewer = (function () {
            function JsonViewer() {
            }
            JsonViewer.createTree = function (container, json) {
                container.html('');
                this.traverseJson(container, json);
            };
            JsonViewer.getHtmlTree = function (json) {
                var container = jQuery('<div class="json-tree">');
                this.traverseJson(container, json);
                return container.html();
            };
            JsonViewer.traverseJson = function (container, json) {
                var ul = jQuery('<ul>');
                ul.addClass('json-node');
                if (jQuery.isArray(json)) {
                    container.append('<span>[</span>');
                }
                else {
                    container.append('<span>{</span>');
                }
                var expand = jQuery('<span>');
                expand.appendTo(container);
                if (!jQuery.isEmptyObject(json)) {
                    expand.addClass('json-expand');
                    expand.text('...');
                    expand.click(function (eventObject) {
                        jQuery(eventObject.target).next('ul.json-node').toggle();
                    });
                    for (var property in json) {
                        var jsonKey = jQuery('<span>');
                        jsonKey.addClass('json-key');
                        jsonKey.text(property + ': ');
                        var li = jQuery('<li>');
                        li.append(jsonKey);
                        if (typeof json[property] === 'object') {
                            if (jQuery.isArray(json[property])) {
                                li.addClass('json-array');
                            }
                            else {
                                li.addClass('json-object');
                            }
                            this.traverseJson(li, json[property]);
                        }
                        else {
                            li.addClass('json-prop');
                            var jsonValue = jQuery('<span>');
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
                }
                else {
                    container.append('<span>}</span>');
                }
            };
            return JsonViewer;
        }());
        core.JsonViewer = JsonViewer;
    })(core = disco.core || (disco.core = {}));
})(disco || (disco = {}));
