var disco;
(function (disco) {
    var core;
    (function (core) {
        var data;
        (function (data_1) {
            var Context = (function () {
                function Context() {
                }
                Context.prototype.getData = function (options) {
                    var result = this.ajaxRequest('get', options.uri, options.async);
                    if (options.fail) {
                        result.fail(function (response) { options.fail(response.responseJSON); });
                    }
                    if (options.pipe) {
                        result.pipe(function (data) { return options.pipe(data); });
                    }
                    if (options.done) {
                        result.done(function (data) { return options.done(data); });
                    }
                    if (options.always) {
                        result.always(function (data) { return options.always(data); });
                    }
                    return result;
                };
                Context.prototype.ajaxRequest = function (type, url, async, data, dataType) {
                    var options = {
                        dataType: dataType || 'json',
                        contentType: 'application/json',
                        headers: { accept: 'application/json;odata=light' },
                        cache: false,
                        type: type || 'GET',
                        data: data ? data.toJson() : null,
                        beforeSend: Context.setHeader,
                        async: async ? async : true
                    };
                    return jQuery.ajax(url, options);
                };
                Context.setHeader = function (xhr) {
                    xhr.setRequestHeader('Accept', 'application/json;odata=' + metadataflow.Maximal);
                };
                Context.prototype.getMetadata = function (metadataUrl, model, success, error) {
                    OData.read(metadataUrl, function (data, response) { model(data); success(response); }, error, OData.metadataHandler);
                };
                return Context;
            }());
            data_1.Context = Context;
            var metadataflow = (function () {
                function metadataflow() {
                }
                metadataflow.Maximal = 'fullmetadata';
                metadataflow.Minimal = 'minimalmetadata';
                metadataflow.None = 'nometadata';
                return metadataflow;
            }());
            data_1.metadataflow = metadataflow;
        })(data = core.data || (core.data = {}));
    })(core = disco.core || (disco.core = {}));
})(disco || (disco = {}));
