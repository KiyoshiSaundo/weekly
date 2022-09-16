import {createApp} from 'vue';
import App from './App.vue';
import store from './store';
import VueInputMask from './plugins/inputmask';

createApp(App).use(store).use(VueInputMask).mount('#app');
