var disco;
(function (disco) {
    var core;
    (function (core) {
        var CollectionQuery = (function () {
            function CollectionQuery() {
            }
            CollectionQuery.contains = function (collection, predicate) {
                var result = jQuery.grep(collection, predicate);
                return result.length > 0;
            };
            CollectionQuery.where = function (collection, predicate) {
                var result = jQuery.grep(collection, predicate);
                return result;
            };
            CollectionQuery.single = function (collection, predicate) {
                var result = jQuery.grep(collection, predicate);
                if (result.length == 1) {
                    return result[0];
                }
                else {
                    throw new Error('The given predicate did not match one single item!');
                }
            };
            CollectionQuery.select = function (collection, selector) {
                var result = [];
                for (var item in collection) {
                    result.push(selector(collection[item]));
                }
                return result;
            };
            return CollectionQuery;
        }());
        core.CollectionQuery = CollectionQuery;
    })(core = disco.core || (disco.core = {}));
})(disco || (disco = {}));
