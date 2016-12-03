var disco;
(function (disco) {
    var core;
    (function (core) {
        var viewmodel;
        (function (viewmodel) {
            var Base = (function () {
                function Base() {
                    var _this = this;
                    this.context = new disco.core.data.Context();
                    this.isBusy = ko.observable(false);
                    this.onAjaxError = function (error) {
                        var odataError = new disco.core.data.odata.Error(error);
                        _this.errorCollection.push(odataError);
                    };
                    this.requestData = function (options) {
                        _this.isBusy(true);
                        if (!options.fail) {
                            options.fail = _this.onAjaxError;
                        }
                        if (options.context && !options.context.self) {
                            options.context.self = _this;
                        }
                        _this.context.getData(options).done(function () { _this.isBusy(false); });
                    };
                }
                Base.prototype.getServiceUri = function () {
                    return 'http://disco-node.local:3000/api/odata/';
                };
                Base.prototype.onCollapsableHeadlineClick = function (data, element) {
                    jQuery(element.currentTarget).next().slideToggle();
                };
                Base.prototype.tableRowFadeIn = function (element, index, data) {
                    jQuery(element).filter("tr").fadeIn();
                };
                Base.prototype.insertJsonTree = function (element, index, data) {
                    disco.core.JsonViewer.traverseJson(jQuery(element), data);
                };
                return Base;
            }());
            viewmodel.Base = Base;
        })(viewmodel = core.viewmodel || (core.viewmodel = {}));
    })(core = disco.core || (disco.core = {}));
})(disco || (disco = {}));
