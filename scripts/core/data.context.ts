/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />

module disco.core.data {

    declare var OData;

    export class Context {

        public getData(options: {
            uri: string;
            context?: any;
            done?: any;
            pipe?: any;
            fail?: any;
            always?: any;
            async?: boolean;
        }): JQueryXHR {

            var result: JQueryXHR = this.ajaxRequest('get', options.uri, options.async);

            if (options.fail) {
                result.fail((response) => { options.fail(response.responseJSON); });
            }
            if (options.pipe) {
                result.pipe((data) => { return options.pipe(data); })
            }
            if (options.done) {
                result.done((data) => { return options.done(data); })
            }
            if (options.always) {
                result.always((data) => { return options.always(data); })
            }

            return result;
        }

        private ajaxRequest(
            type: string,
            url: string,
            async?: boolean,
            data?: any,
            dataType?: string): JQueryXHR {
            var options: JQueryAjaxSettings = {
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
        }

        private static setHeader(xhr) {
            xhr.setRequestHeader('Accept', 'application/json;odata=' + metadataflow.Maximal);
        }

        public getMetadata(metadataUrl: string, model: any, success: any, error: any) {
            OData.read(metadataUrl,
                (data, response) => { model(data);  success(response); },
                error,
                OData.metadataHandler);
        }
    }

    export class metadataflow {
        public static Maximal: string = 'fullmetadata';
        public static Minimal: string = 'minimalmetadata';
        public static None: string = 'nometadata';
    }
}

