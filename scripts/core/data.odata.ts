
module disco.core.data.odata {

    export class Error {
        public code: number;
        public message: string;
        public innererror: Exception = null;

        constructor(error: any) {
            var odataError = error['odata.error'];

            if (odataError != undefined) {
                this.code = odataError.message.code;
                this.message = odataError.message.value;
                if (odataError.innererror != undefined) {
                    this.innererror = new Exception(odataError.innererror);
                }
            } else {
                this.code = undefined;
                if (error.Message) {
                    this.message = error.Message;
                    this.innererror = new Exception({ message: error.MessageDetail });
                } else {
                    this.message = error.message;
                    this.innererror = undefined;
                }
            }
        }
    }

    export class Exception {
        public message: string;
        public type: string;
        public stacktrace: string;
        public exception: Exception = null;

        constructor(innererror: any) {
            this.message = innererror.message;
            this.type = innererror.type;
            this.stacktrace = innererror.stacktrace;
            if (innererror.internalexception != undefined) {
                this.exception = new Exception(innererror.internalexception);
            }
        }
    }

}