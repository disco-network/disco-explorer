var disco;
(function (disco) {
    var core;
    (function (core) {
        var data;
        (function (data) {
            var odata;
            (function (odata) {
                var Error = (function () {
                    function Error(error) {
                        this.innererror = null;
                        var odataError = error['odata.error'];
                        if (odataError != undefined) {
                            this.code = odataError.message.code;
                            this.message = odataError.message.value;
                            if (odataError.innererror != undefined) {
                                this.innererror = new Exception(odataError.innererror);
                            }
                        }
                        else {
                            this.code = undefined;
                            if (error.Message) {
                                this.message = error.Message;
                                this.innererror = new Exception({ message: error.MessageDetail });
                            }
                            else {
                                this.message = error.message;
                                this.innererror = undefined;
                            }
                        }
                    }
                    return Error;
                }());
                odata.Error = Error;
                var Exception = (function () {
                    function Exception(innererror) {
                        this.exception = null;
                        this.message = innererror.message;
                        this.type = innererror.type;
                        this.stacktrace = innererror.stacktrace;
                        if (innererror.internalexception != undefined) {
                            this.exception = new Exception(innererror.internalexception);
                        }
                    }
                    return Exception;
                }());
                odata.Exception = Exception;
            })(odata = data.odata || (data.odata = {}));
        })(data = core.data || (core.data = {}));
    })(core = disco.core || (disco.core = {}));
})(disco || (disco = {}));
