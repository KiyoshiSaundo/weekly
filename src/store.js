import {createStore} from 'vuex';
import {getCurrWeek} from '@/functions';

const [dateFrom, dateTo] = getCurrWeek();

export default createStore({
    state() {
        return {
            apiUrl: localStorage.getItem('apiUrl') || '',
            userId: localStorage.getItem('userId') || '',
            dateFrom: dateFrom,
            dateTo: dateTo,
            isLoading: false,
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
