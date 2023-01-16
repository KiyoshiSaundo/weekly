import Inputmask from "inputmask";

export default {
    install: (app) => {
        app.directive("mask", {
            mounted: (el, binding) => {
                Inputmask(binding.value).mask(el);
            },
        });
    },
};
