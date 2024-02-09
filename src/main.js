import { createApp } from "vue";
import store from "./store";
import VueInputMask from "./plugins/inputmask";
import "virtual:svg-icons-register";

import "./assets/scss/styles.scss";

import App from "./App.vue";

createApp(App)
    .directive("click-outside", {
        mounted: function (el, binding) {
            el.clickOutsideEvent = function (event) {
                if (!(el == event.target || el.contains(event.target))) {
                    binding.value(event);
                }
            };
            document.body.addEventListener("click", el.clickOutsideEvent);
        },
        unmounted: function (el) {
            document.body.removeEventListener("click", el.clickOutsideEvent);
        },
    })
    .use(store)
    .use(VueInputMask)
    .mount("#app");
