/// <reference path="common.ts" />

interface KnockoutBindingHandlers {
    fadeVisible: KnockoutBindingHandler;
    slideVisible: KnockoutBindingHandler;
    appendText: KnockoutBindingHandler;
    tabBinding: KnockoutBindingHandler;
}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: (element, valueAccessor) => {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        jQuery(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: (element, valueAccessor) => {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? jQuery(element).fadeIn() : jQuery(element).fadeOut();
    }
};

ko.bindingHandlers.slideVisible = {
    //init: (element, valueAccessor) => {
    //    // Initially set the element to be instantly visible/hidden depending on the value
    //    var value = valueAccessor();
    //    setTimeout(() => {
    //        jQuery(element).toggle();
    //    }, 0);
    //},
    update: (element, valueAccessor) => {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? jQuery(element).slideDown() : jQuery(element).slideUp();
    }
};

ko.bindingHandlers.appendText = {
    update: (element, valueAccessor) => {
        var value: string = <string>ko.utils.unwrapObservable(valueAccessor());
        setTimeout(() => {
            jQuery(element).append(document.createTextNode(value));
        }, 0);
    }
};

ko.bindingHandlers.tabBinding = {
    update: (element, valueAccessor) => {
        var options = valueAccessor() || {};
        setTimeout(() => {
            jQuery(element).tabs(options);
            jQuery(element).tabs('refresh');
            jQuery(element).tabs({ active: -1 });
        }, 0);
    }
};