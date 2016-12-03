/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

/// <reference path="../core/data.viewmodel.ts" />

module disco.viewmodel {

    export interface VersionData {
        ProductName: string;
        ProductVersion: string;
        AssemblyName: string;
        AssemblyVersion: string;
    }

    export class About extends disco.core.viewmodel.Base {

        public core: any = ko.observableArray();
        public dependencies: any = ko.observableArray();

        constructor() {
            super();

            this.context.getData({
                uri: '/api/version/info?$filter=startswith(AssemblyName,\'Disco\')',
                done: this.core
            });
            this.context.getData({
                uri: '/api/version/info?$filter=not(startswith(AssemblyName,\'Disco\'))',
                done: this.dependencies
            });
        }
    }
}

module disco.views.home {

    export class about {
        public init(): void {
            var viewmodel = new disco.viewmodel.About();
            ko.applyBindings(viewmodel);
        }
    }
}

jQuery(document).ready(() => {
    var view = new disco.views.home.about();
    view.init();
});