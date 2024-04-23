import { createStore } from "vuex";
import { getCurrDay, getCurrYear } from "@/functions";
import { menuItems } from "@/settings";

// app
const appLoading = true;
const appMessages = [];
const appAuth = JSON.parse(localStorage.appAuth || false);
const appAuthTimestamp = JSON.parse(localStorage.appAuthTimestamp || false);
const appApiUrl = localStorage.appApiUrl || "";
const appUserId = JSON.parse(localStorage.appUserId || false);

// menu
const menuCurrent = localStorage.menuCurrent || menuItems[0].page;

// weekly
const weeklyUserId =
    localStorage.weeklyUserId || localStorage.apiUserId || false;

const [weeklyStart, weeklyEnd] = getCurrDay();

const weeklyTimestamp = false;

// yearly

const yearlyUserId =
    localStorage.yearlyUserId || localStorage.apiUserId || false;

const yearlyYear = getCurrYear();
if (localStorage.yearlyYear) yearlyYear.setTime(localStorage.yearlyYear);

const yearlyTimestamp = false;

/* store */

export default createStore({
    state() {
        return {
            appLoading,
            appMessages,
            appAuth,
            appAuthTimestamp,
            appApiUrl,
            appUserId,

            menuItems,
            menuCurrent,

            weeklyUserId,
            weeklyStart,
            weeklyEnd,
            weeklyTimestamp,

            yearlyUserId,
            yearlyYear,
            yearlyTimestamp,
        };
    },
    actions: {
        async appLoaded() {
            this.commit("appLoadingChange", false);
        },
        appLogin(context, payload) {
            this.commit("appMessagesClear");
            this.commit("appAuthChange", true);
            this.commit("appAuthTimestampChange", new Date().getTime());
            this.commit("appApiUrlChange", payload.appApiUrl);
            this.commit("appUserIdChange", payload.appUserId);
            this.commit("menuCurrentChange", context.state.menuItems[0].page);
        },
        appLogout(context, payload) {
            if (!payload?.skipClearMessages) this.commit("appMessagesClear");
            this.commit("appAuthChange", false);
            this.commit("appApiUrlChange", "");
            this.commit("appUserIdChange", false);
        },
        appMesageShow(context, payload) {
            this.commit("appMessagesAdd", payload);
        },
        appMesageClose(context, payload) {
            this.commit("appMessagesRemove", payload);
        },
        menuChange(context, payload) {
            this.commit("menuCurrentChange", payload);
        },
        weeklyFilterChange(context, payload) {
            context.state.weeklyTimestamp = Date.now();

            if (payload.weeklyUserId)
                this.commit("weeklyUserIdChange", payload.weeklyUserId);
            if (payload.weeklyStart)
                this.commit("weeklyStartChange", payload.weeklyStart);
            if (payload.weeklyEnd)
                this.commit("weeklyEndChange", payload.weeklyEnd);
        },
        yearlyFilterChange(context, payload) {
            context.state.yearlyTimestamp = Date.now();

            if (payload.yearlyUserId)
                this.commit("yearlyUserIdChange", payload.yearlyUserId);
            if (payload.yearlyYear)
                this.commit("yearlyYearChange", payload.yearlyYear);
        },
    },
    mutations: {
        // app
        appLoadingChange(state, payload) {
            state.appLoading = payload;
        },
        appMessagesAdd(state, payload) {
            state.appMessages.push(payload);
        },
        appMessagesRemove(state, payload) {
            state.appMessages.splice(payload, 1);
        },
        appMessagesClear(state) {
            state.appMessages = [];
        },
        appAuthChange(state, payload) {
            state.appAuth = payload;
            localStorage.appAuth = payload;
        },
        appAuthTimestampChange(state, payload) {
            state.appAuthTimestamp = payload;
            localStorage.appAuthTimestamp = payload;
        },
        appApiUrlChange(state, payload) {
            state.appApiUrl = payload;
            localStorage.appApiUrl = payload;
        },
        appUserIdChange(state, payload) {
            state.appUserId = payload;
            localStorage.appUserId = payload;
        },
        // menu
        menuCurrentChange(state, payload) {
            state.menuCurrent = payload;
            localStorage.menuCurrent = payload;
        },
        // weekly
        weeklyUserIdChange(state, payload) {
            state.weeklyUserId = payload;
            localStorage.weeklyUserId = payload;
        },
        weeklyStartChange(state, payload) {
            state.weeklyStart = payload;
            localStorage.weeklyStart = payload;
        },
        weeklyEndChange(state, payload) {
            state.weeklyEnd = payload;
            localStorage.weeklyEnd = payload;
        },
        // yearly
        yearlyUserIdChange(state, payload) {
            state.yearlyUserId = payload;
            localStorage.yearlyUserId = payload;
        },
        yearlyYearChange(state, payload) {
            state.yearlyYear = payload;
            localStorage.yearlyYear = payload;
        },
    },
});
