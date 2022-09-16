import Inputmask from 'inputmask';

export default {
    install: (app, options) => {
        app.directive('mask', {
            mounted: (el, binding) => {
                Inputmask(binding.value).mask(el);
            }
        });
    }
};