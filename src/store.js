import {createStore} from 'vuex';
import {getCurrWeek, getCurrYear} from '@/functions';

const [weeklyDateFrom, weeklyDateTo] = getCurrWeek();

const yearlyDate = getCurrYear();

export default createStore({
    state() {
        return {
            weeklyApiUrl: localStorage.getItem('weeklyApiUrl') || '',
            weeklyUserId: localStorage.getItem('weeklyUserId') || '',
            weeklyDateFrom: weeklyDateFrom,
            weeklyDateTo: weeklyDateTo,

            yearlyApiUrl: localStorage.getItem('yearlyApiUrl') || '',
            yearlyUserId: localStorage.getItem('yearlyUserId') || '',
            yearlyDate: yearlyDate,
            yearlyDays: JSON.parse(localStorage.getItem('yearlyDays')) || {},
        };
    },
    mutations: {
        weeklyApiChange(state, payload) {
            // console.log('weeklyApiChange');
            state.weeklyApiUrl = payload.weeklyApiUrl;
            localStorage.setItem('weeklyApiUrl', payload.weeklyApiUrl);
        },
        weeklyUserChange(state, payload) {
            // console.log('weeklyUserChange');
            state.weeklyUserId = payload.weeklyUserId;
            localStorage.setItem('weeklyUserId', payload.weeklyUserId);
        },
        weeklyDateChange(state, payload) {
            // console.log('weeklyDateChange');
            state.weeklyDateFrom = payload.weeklyDateFrom;
            state.weeklyDateTo = payload.weeklyDateTo;
        },

        yearlyApiChange(state, payload) {
            // console.log('yearlyApiChange');
            state.yearlyApiUrl = payload.yearlyApiUrl;
            localStorage.setItem('yearlyApiUrl', payload.yearlyApiUrl);
        },
        yearlyUserChange(state, payload) {
            // console.log('yearlyUserChange');
            state.yearlyUserId = payload.yearlyUserId;
            localStorage.setItem('yearlyUserId', payload.yearlyUserId);
        },
        yearlyDateChange(state, payload) {
            // console.log('yearlyDateChange');
            state.yearlyDate = payload.yearlyDate;
            localStorage.setItem('yearlyDate', payload.yearlyDate);
        },
        yearlyDaysChange(state, payload) {
            // console.log('yearlyDaysChange');
            state.yearlyDays = payload.yearlyDays;
            localStorage.setItem('yearlyDays', JSON.stringify(payload.yearlyDays));
        },
    },
});
