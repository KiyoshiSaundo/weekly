<template>
    <div
        class="report-yearly"
        :class="{
            'is-loading': !isAppLoading && isLoading,
        }"
    >
        <div v-if="isAppLoading">Загрузка</div>
        <div v-if="!isAppLoading" class="report-yearly__body">
            <YearlyMonth
                v-for="item in result"
                :key="item.i"
                :month="item"
                @changeDelta="changeDelta"
            />
        </div>
        <div
            v-if="!isAppLoading && !isFirstLoading"
            class="report-yearly__aside"
        >
            <div class="report-yearly__summary">
                Рабочее время:
                <span class="mono">
                    {{ formatTime(totalSeconds - totalDeltaSeconds) }}
                </span>
                <span v-if="totalDeltaSeconds > 0" class="mono">
                    ({{ formatTime(totalSeconds) }} -
                    {{ formatTime(totalDeltaSeconds) }})
                </span>
            </div>
            <div class="report-yearly__summary">
                Рабочие дни:
                <span class="mono">{{ totalDays - totalDeltaDays }}</span>
                <span v-if="totalDeltaDays > 0" class="mono">
                    ({{ totalDays }} - {{ totalDeltaDays }})
                </span>
            </div>
            <div class="report-yearly__notes attention-text">
                Количество рабочих дней⁠ (⁠часов) можно сократить кликнув по ним
                в нужном месяце (в левой части отчета)
            </div>
        </div>
    </div>
</template>

<script>
import {
    formatDate,
    formatTime,
    unformatTime,
    getFloat,
    getWeeklyFile,
} from "@/functions";
import { getApiTimes, isYearOff, updateB24File } from "@/api";

import YearlyMonth from "@/components/YearlyMonth.vue";

export default {
    components: {
        YearlyMonth,
    },
    data() {
        return {
            isResultLoading: true,
            isDeltaLoading: true,
            isFirstLoading: true,
            apiUrl: this.$store.state.appApiUrl,
            weeklyFile: false,
            result: {},
            months: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
            ],
            days: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            delta: {},
        };
    },
    computed: {
        isLoading() {
            return this.isDeltaLoading || this.isResultLoading;
        },
        isAppLoading() {
            return this.$store.state.appLoading;
        },
        filter() {
            return {
                userId:
                    this.$store.state.yearlyUserId ||
                    this.$store.state.appUserId,
                year: new Date(this.$store.state.yearlyYear),
                hash: this.$store.state.yearlyTimestamp,
            };
        },
        totalSeconds() {
            return Object.values(this.result).reduce((prev, curr) => {
                return (prev += curr.seconds);
            }, 0);
        },
        totalDeltaSeconds() {
            let delta =
                this.delta?.[this.filter.userId]?.[
                    this.filter.year.getFullYear()
                ] || {};
            return Object.values(delta).reduce((prev, curr) => {
                return (prev += getFloat(curr.seconds));
            }, 0);
        },
        totalDays() {
            return Object.values(this.result).reduce((prev, curr) => {
                return (prev += getFloat(curr.days));
            }, 0);
        },
        totalDeltaDays() {
            let delta =
                this.delta?.[this.filter.userId]?.[
                    this.filter.year.getFullYear()
                ] || {};
            return Object.values(delta).reduce((prev, curr) => {
                return (prev += getFloat(curr.days));
            }, 0);
        },
    },
    async created() {
        // данные из storage в новый формат
        // как нибудь потом удалить (добавлено 23/04/2024)
        const newDelta = JSON.parse(localStorage.yearlyDelta || "{}");
        if (Object.keys(newDelta).length == 0) {
            const oldSeconds = JSON.parse(
                localStorage.yearlyDeltaSeconds || "{}"
            );
            const oldDays = JSON.parse(localStorage.yearlyDeltaDays || "{}");

            if (Object.keys(oldDays).length) {
                for (const [userId, yearData] of Object.entries(oldDays)) {
                    newDelta[userId] = newDelta[userId] || {};
                    if (Object.keys(yearData).length) {
                        for (const [year, monthsData] of Object.entries(
                            yearData
                        )) {
                            newDelta[userId][year] =
                                newDelta[userId][year] || {};
                            if (Object.keys(monthsData).length) {
                                for (const [month, delta] of Object.entries(
                                    monthsData
                                )) {
                                    newDelta[userId][year][month] =
                                        newDelta[userId][year][month] || {};

                                    newDelta[userId][year][month].days = delta;
                                }
                            }
                        }
                    }
                }
            }

            if (Object.keys(oldSeconds).length) {
                for (const [userId, yearData] of Object.entries(oldSeconds)) {
                    newDelta[userId] = newDelta[userId] || {};
                    if (Object.keys(yearData).length) {
                        for (const [year, monthsData] of Object.entries(
                            yearData
                        )) {
                            newDelta[userId][year] =
                                newDelta[userId][year] || {};
                            if (Object.keys(monthsData).length) {
                                for (const [month, delta] of Object.entries(
                                    monthsData
                                )) {
                                    newDelta[userId][year][month] =
                                        newDelta[userId][year][month] || {};

                                    newDelta[userId][year][month].seconds =
                                        delta;
                                }
                            }
                        }
                    }
                }
            }

            // console.log(newDelta);
            localStorage.yearlyDelta = JSON.stringify(newDelta);

            // localStorage.removeItem("yearlyDeltaSeconds");
            // localStorage.removeItem("yearlyDeltaDays");
        }
    },
    async mounted() {
        if (!this.isAppLoading) {
            if (this.isFirstLoading) this.delta = await this.getDelta();
            this.result = await this.getResult();
        }
    },
    watch: {
        async isAppLoading() {
            if (this.isFirstLoading) this.delta = await this.getDelta();
            this.result = await this.getResult();
        },
        async filter() {
            if (this.isFirstLoading) this.delta = await this.getDelta();
            this.result = await this.getResult();
        },
        delta() {
            this.isDeltaLoading = false;
        },
        result() {
            this.isResultLoading = false;
            this.isFirstLoading = false;
        },
    },
    methods: {
        formatDate,
        formatTime,
        unformatTime,

        async getDelta() {
            if (!this.apiUrl) return {};

            let result = {};
            this.isDeltaLoading = true;

            this.weeklyFile = await getWeeklyFile(this.$store.state.appApiUrl);

            if (this.weeklyFile.message) {
                this.$store.dispatch("appMesageShow", this.weeklyFile.message);
            }

            const storageDelta = JSON.parse(localStorage.yearlyDelta || "{}");

            result =
                this.weeklyFile?.fileContent?.yearly?.delta ||
                storageDelta ||
                {};

            return result;
        },
        async getResult() {
            if (!this.apiUrl || !this.filter.userId) return {};
            this.isResultLoading = true;

            let result = {},
                year = this.filter.year.getFullYear(),
                daysOff = await isYearOff(year),
                offStart = 0,
                time = await getApiTimes(this.apiUrl, {
                    USER_ID: this.filter.userId,
                    ">=CREATED_DATE": "01.01." + year + " 00:00:00",
                    "<=CREATED_DATE": "31.12." + year + " 23:59:59",
                });

            for (let i = 0; i < 12; i++) {
                let monthDays = 32 - new Date(year, i, 32).getDate(),
                    monthOff = daysOff
                        .slice(offStart, (offStart += monthDays))
                        .split("");

                // месяц
                result[i] = {
                    i: i,
                    name: this.months[i],
                    year: year,
                    seconds: 0,
                    days: monthOff.filter((d) => d == 0).length,
                    delta: {
                        seconds:
                            parseFloat(
                                this.delta?.[this.filter.userId]?.[year]?.[i]
                                    ?.seconds
                            ) || 0,
                        days:
                            parseFloat(
                                this.delta?.[this.filter.userId]?.[year]?.[i]
                                    ?.days
                            ) || 0,
                    },
                    daily: {},
                };

                // дни
                for (let j = 1; j <= monthDays; j++) {
                    let date = new Date(year, i, j);
                    result[i].daily[j] = {
                        date: formatDate(date),
                        day: this.days[date.getDay()],
                        off: monthOff[j - 1] != 0,
                        seconds: 0,
                    };
                }
            }

            // затраченное время
            time.forEach((item) => {
                let date = new Date(item.CREATED_DATE);
                result[date.getMonth()].seconds += parseInt(item.SECONDS);
                result[date.getMonth()].daily[date.getDate()].seconds +=
                    parseInt(item.SECONDS);
            });

            return result;
        },

        async changeDelta(newData) {
            this.isDeltaLoading = true;

            if (!this.filter.userId || !this.filter.year.getFullYear()) {
                this.$store.dispatch("appMesageShow", {
                    type: "error",
                    text: "Не хватает данных для сохрания",
                });
                this.isDeltaLoading = false;
                return;
            }

            let userId = this.filter.userId,
                year = this.filter.year.getFullYear(),
                delta = JSON.parse(JSON.stringify(this.delta)),
                result = JSON.parse(JSON.stringify(this.result)),
                fileContent = JSON.parse(
                    JSON.stringify(this.weeklyFile.fileContent)
                );

            /* delta */

            // структура дельты
            delta[userId] = delta[userId] || {};
            delta[userId][year] = delta[userId][year] || {};
            delta[userId][year][newData.month] =
                delta[userId][year][newData.month] || {};

            // время
            if (newData.seconds > 0) {
                delta[userId][year][newData.month].seconds = newData.seconds;
            } else {
                delete delta[userId][year][newData.month].seconds;
            }

            // дни
            if (newData.days > 0) {
                delta[userId][year][newData.month].days = newData.days;
            } else {
                delete delta[userId][year][newData.month].days;
            }

            /* result (месяцы) */

            result[newData.month].delta.seconds = newData.seconds;
            result[newData.month].delta.days = newData.days;

            /* storage */

            localStorage.yearlyDelta = JSON.stringify(delta);

            /* b24 */

            if (this.apiUrl && this.weeklyFile.fileId) {
                fileContent.yearly.delta = delta;

                let updateRes = await updateB24File(this.apiUrl, {
                    fileId: this.weeklyFile.fileId,
                    fileContent: fileContent,
                });
                if (updateRes.status != 1) {
                    this.$store.dispatch("appMesageShow", {
                        type: "error",
                        text: "updateB24File():\r\n" + updateRes.result,
                    });
                }
            } else {
                this.$store.dispatch("appMesageShow", {
                    type: "error",
                    text: "Не хватает данных для сохрания в b24",
                });
            }

            /* обновляем данные компонента */

            this.isDeltaLoading = false;
            this.delta = delta;
            this.result = result;
            this.weeklyFile.fileContent = fileContent;
        },
    },
};
</script>

<style lang="scss">
.report-yearly {
    @include preloading($color-accent, $color-white);
    padding: calc($gap / 2) $gap;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    position: relative;
    z-index: 1;
    flex-wrap: wrap;

    @media print {
        align-items: start;
        flex-grow: 0;
    }

    &__body {
        margin: -#{calc($gap / 2)} 0;
        padding: calc($gap / 2) 0;
        width: 70%;
        padding-right: $gap;

        @media print {
            order: 2;
            width: 100%;
            margin: 0;
            margin-top: calc($gap / 2);
            padding-right: 0;
        }
    }

    &__aside {
        margin: -#{calc($gap / 2)} 0;
        padding: calc($gap / 2) 0;
        width: 30%;
        padding-left: $gap;
        border-left: $border;

        @media print {
            order: 1;
            width: 100%;
            border-left: 0;
            border-bottom: $border;
            padding-left: 0;
        }
    }

    &__summary {
        font-weight: 600;
        margin-bottom: calc($gap / 4);

        span:nth-of-type(2) {
            font-weight: 400;
            display: block;
            font-size: 80%;
        }
    }

    &__notes {
        margin-top: calc($gap / 2);
        font-weight: 400;

        @media print {
            display: none;
        }
    }
}
</style>
