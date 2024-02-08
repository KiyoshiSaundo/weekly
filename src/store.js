import { createStore } from "vuex";
import { getCurrWeek, getCurrYear } from "@/functions";
import { getB24Storage, getB24WeeklyFile, getB24FileData } from "@/api";
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

const [weeklyStart, weeklyEnd] = getCurrWeek();
if (localStorage.weeklyStart) weeklyStart.setTime(localStorage.weeklyStart);
if (localStorage.weeklyEnd) weeklyEnd.setTime(localStorage.weeklyEnd);

const weeklyTimestamp = false;

// yearly

const yearlyUserId =
    localStorage.yearlyUserId || localStorage.apiUserId || false;

const yearlyYear = getCurrYear();
if (localStorage.yearlyYear) yearlyYear.setTime(localStorage.yearlyYear);

const yearlyTimestamp = false;

const yearlyDeltaSeconds = JSON.parse(localStorage.yearlyDeltaSeconds || "{}");
const yearlyDeltaDays = JSON.parse(localStorage.yearlyDeltaDays || "{}");

// b24Data

const b24FileData = {};
const b24FileId = false;

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

            yearlyDeltaSeconds,
            yearlyDeltaDays,

            b24FileData,
            b24FileId,
        };
    },
    actions: {
        async appLoaded(context) {
            // if (appAuth && appApiUrl) {
            //     // хранилище пользователя
            //     let storages = await getB24Storage(context.state.appApiUrl);
            //     if (!storages.status) {
            //         this.commit("appMessagesAdd", {
            //             type: "error",
            //             text: "getB24Storage(): \r\n " + storages.result,
            //         });
            //         this.commit("appLoadingChange", false);
            //         return;
            //     }
            //     // файл weekly.data в хранилище
            //     let files = await getB24WeeklyFile(
            //         appApiUrl,
            //         storages.result[0].ID
            //     );
            //     if (!files.status) {
            //         this.commit("appMessagesAdd", {
            //             type: "error",
            //             text: "getB24WeeklyFile(): \r\n" + files.result,
            //         });
            //         this.commit("appLoadingChange", false);
            //         return;
            //     }
            //     // данные из файла
            //     let fileData = await getB24FileData(
            //         files.result[0].DOWNLOAD_URL
            //     );
            //     if (!fileData.status) {
            //         this.commit("appMessagesAdd", {
            //             type: "error",
            //             text: "getB24FileData(): \r\n" + fileData.result,
            //         });
            //         this.commit("appLoadingChange", false);
            //         return;
            //     }
            //     // данные в store
            //     this.commit("b24FileDataChange", fileData.result);
            //     this.commit("appLoadingChange", false);
            //     // console.log(files.result[0].ID);
            //     // this.commit("b24FileIdChange", files.result[0].ID);
            // } else {
                this.commit("appLoadingChange", false);
            // }
        },
        appLogin(context, payload) {
            this.commit("appMessagesClear");
            this.commit("appAuthChange", true);
            this.commit("appAuthTimestampChange", new Date().getTime());
            this.commit("appApiUrlChange", payload.appApiUrl);
            this.commit("appUserIdChange", payload.appUserId);
            this.commit("menuCurrentChange", context.state.menuItems[0].page);
        },
        appLogout() {
            this.commit("appMessagesClear");
            this.commit("appAuthChange", false);
            this.commit("appApiUrlChange", false);
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
        yearlyDeltaSecondsChange(context, payload) {
            let res = context.state.yearlyDeltaSeconds;

            res = res || {};
            res[payload.userId] = res[payload.userId] || {};
            res[payload.userId][payload.year] =
                res[payload.userId][payload.year] || {};

            if (payload.value) {
                res[payload.userId][payload.year][payload.month] =
                    payload.value;
            } else {
                delete res[payload.userId][payload.year][payload.month];
            }

            this.commit("yearlyDeltaSecondsChange", res);
        },
        yearlyDeltaDaysChange(context, payload) {
            let res = context.state.yearlyDeltaDays;

            res = res || {};
            res[payload.userId] = res[payload.userId] || {};
            res[payload.userId][payload.year] =
                res[payload.userId][payload.year] || {};

            if (payload.value) {
                res[payload.userId][payload.year][payload.month] =
                    payload.value;
            } else {
                delete res[payload.userId][payload.year][payload.month];
            }

            this.commit("yearlyDeltaDaysChange", res);
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
        yearlyDeltaSecondsChange(state, payload) {
            state.yearlyDeltaSeconds = payload;
            localStorage.yearlyDeltaSeconds = JSON.stringify(payload);
        },
        yearlyDeltaDaysChange(state, payload) {
            state.yearlyDeltaDays = payload;
            localStorage.yearlyDeltaDays = JSON.stringify(payload);
        },
        // b24
        b24FileDataChange(state, payload) {
            state.b24FileData = payload;
        },
    },
});
