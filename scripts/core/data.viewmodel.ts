/// <reference path="common.ts" />

/// <reference path="data.context.ts" />
/// <reference path="data.odata.ts" />

/// <reference path="../core/jsonviewer.ts" />

module disco.core.viewmodel {

    export interface requestContext {
        self?: any;
        data?: any;
        type?: any;
    }

    export interface requestOptions {
        uri: string;
        context?: requestContext;
        done?: any;
        pipe?: any;
        fail?: any;
        always?: any;
        async?: boolean;
    }

    export class Base {

        public context: disco.core.data.Context = new disco.core.data.Context();

        public isBusy: any;
        public errorCollection: any;

        public requestData: (options: requestOptions) => void;

        public onAjaxError: (error: any) => void;

        constructor() {
            this.isBusy = ko.observable(false);

            this.onAjaxError = (error: any): void => {
                var odataError = new disco.core.data.odata.Error(error);
                this.errorCollection.push(odataError);
            };

            this.requestData = (options: disco.core.viewmodel.requestOptions) => {
                this.isBusy(true);
                if (!options.fail) {
                    options.fail = this.onAjaxError;
                }
                if (options.context && !options.context.self) {
                    options.context.self = this;
                }
                this.context.getData(options).done(() => { this.isBusy(false) });
            }
        }

        //public getServiceUri(): string { return '/api/odata/' }
        public getServiceUri(): string { 
            // return 'http://dev.disco-network.local/api/odata/'; 
            return 'http://disco-node.local:3000/api/odata/'; 
        }

        public onCollapsableHeadlineClick(data: any, element: any) {
            jQuery(element.currentTarget).next().slideToggle();
        }

        public tableRowFadeIn(element: any, index: any, data: any) {
            jQuery(element).filter("tr").fadeIn();
        }

        public insertJsonTree(element, index, data) {
            disco.core.JsonViewer.traverseJson(jQuery(element), data);
        }
    }
}