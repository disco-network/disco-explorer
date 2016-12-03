ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        jQuery(element).toggle(ko.utils.unwrapObservable(value));
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? jQuery(element).fadeIn() : jQuery(element).fadeOut();
    }
};
ko.bindingHandlers.slideVisible = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? jQuery(element).slideDown() : jQuery(element).slideUp();
    }
};
ko.bindingHandlers.appendText = {
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        setTimeout(function () {
            jQuery(element).append(document.createTextNode(value));
        }, 0);
    }
};
ko.bindingHandlers.tabBinding = {
    update: function (element, valueAccessor) {
        var options = valueAccessor() || {};
        setTimeout(function () {
            jQuery(element).tabs(options);
            jQuery(element).tabs('refresh');
            jQuery(element).tabs({ active: -1 });
        }, 0);
    }
};
