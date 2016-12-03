var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var disco;
(function (disco) {
    var viewmodel;
    (function (viewmodel) {
        var About = (function (_super) {
            __extends(About, _super);
            function About() {
                _super.call(this);
                this.core = ko.observableArray();
                this.dependencies = ko.observableArray();
                this.context.getData({
                    uri: '/api/version/info?$filter=startswith(AssemblyName,\'Disco\')',
                    done: this.core
                });
                this.context.getData({
                    uri: '/api/version/info?$filter=not(startswith(AssemblyName,\'Disco\'))',
                    done: this.dependencies
                });
            }
            return About;
        }(disco.core.viewmodel.Base));
        viewmodel.About = About;
    })(viewmodel = disco.viewmodel || (disco.viewmodel = {}));
})(disco || (disco = {}));
var disco;
(function (disco) {
    var views;
    (function (views) {
        var home;
        (function (home) {
            var about = (function () {
                function about() {
                }
                about.prototype.init = function () {
                    var viewmodel = new disco.viewmodel.About();
                    ko.applyBindings(viewmodel);
                };
                return about;
            }());
            home.about = about;
        })(home = views.home || (views.home = {}));
    })(views = disco.views || (disco.views = {}));
})(disco || (disco = {}));
jQuery(document).ready(function () {
    var view = new disco.views.home.about();
    view.init();
});
