import {createStore} from 'vuex';

const now = new Date();

let dateFrom = new Date(now - (now.getDay() - 1) * 86400000);
let dateTo = new Date(now - (now.getDay() - 1) * 86400000 + 6 * 86400000);

// dateFrom = new Date(now - 3600 * 24 * 1000 * 60);

export default createStore({
    state() {
        return {
            apiUrl: localStorage.getItem('apiUrl') || '',
            userId: localStorage.getItem('userId') || '',
            dateFrom: dateFrom,
            dateTo: dateTo,
            isLoading: true,
        };
    },
    mutations: {
        apiChange(state, payload) {
            // console.log('apiChange');
            state.apiUrl = payload.apiUrl;
            localStorage.setItem('apiUrl', payload.apiUrl);
        },
        userChange(state, payload) {
            // console.log('userChange');
            state.userId = payload.userId;
            localStorage.setItem('userId', payload.userId);
        },
        dateChange(state, payload) {
            // console.log('dateChange');
            state.dateFrom = payload.dateFrom;
            state.dateTo = payload.dateTo;
        },
        loadingChange(state, payload) {
            // console.log('loadingChange');
            state.isLoading = payload.isLoading;
        },
    },
});
