<template>
    <div
        class="report-yearly"
        :class="{ 'is-loading': !isAppLoading && isLoading }"
    >
        <div v-if="isAppLoading">Загрузка</div>
        <div v-if="!isAppLoading" class="report-yearly__body">
            <YearlyMonth v-for="item in result" :key="item.i" :month="item" />
        </div>
        <div v-if="!isAppLoading" class="report-yearly__aside">
            <div v-if="!isFirstLoading" class="report-yearly__summary">
                Рабочее время:
                <span class="mono">
                    {{ formatTime(totalSeconds - totalDeltaSeconds) }}
                </span>
                <span v-if="totalDeltaSeconds > 0" class="mono">
                    ({{ formatTime(totalSeconds) }})
                </span>
            </div>
            <div v-if="!isFirstLoading" class="report-yearly__summary">
                Рабочие дни:
                <span class="mono">{{ totalDays - totalDeltaDays }}</span>
                <span v-if="totalDeltaDays > 0" class="mono">
                    ({{ totalDays }})
                </span>
            </div>
            <p>
                Количество рабочих дней⁠/⁠часов можно сократить кликнув по
                дням⁠/⁠часам в нужном месяце
            </p>
        </div>
    </div>
</template>

<script>
import { formatDate, formatTime, unformatTime, getFloat } from "@/functions";
import { getApiTimes, isYearOff } from "@/api";

import YearlyMonth from "@/components/YearlyMonth.vue";

export default {
    components: {
        YearlyMonth,
    },
    data() {
        return {
            isLoading: true,
            isFirstLoading: true,
            apiUrl: this.$store.state.appApiUrl,
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
        };
    },
    computed: {
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
        deltaSeconds() {
            return (
                this.$store.state.b24FileData.yearlyDeltaSeconds ||
                this.$store.state.yearlyDeltaSeconds ||
                {}
            );
        },
        deltaDays() {
            return (
                this.$store.state.b24FileData.yearlyDeltaDays ||
                this.$store.state.yearlyDeltaDays ||
                {}
            );
        },
        totalSeconds() {
            return Object.values(this.result).reduce((prev, curr) => {
                return (prev += curr.seconds);
            }, 0);
        },
        totalDeltaSeconds() {
            let delta =
                this.deltaSeconds?.[this.filter.userId]?.[
                    this.filter.year.getFullYear()
                ] || {};
            return Object.values(delta).reduce((prev, curr) => {
                return (prev += getFloat(curr));
            }, 0);
        },
        totalDays() {
            return Object.values(this.result).reduce((prev, curr) => {
                return (prev += getFloat(curr.days));
            }, 0);
        },
        totalDeltaDays() {
            let delta =
                this.deltaDays?.[this.filter.userId]?.[
                    this.filter.year.getFullYear()
                ] || {};
            return Object.values(delta).reduce((prev, curr) => {
                return (prev += getFloat(curr));
            }, 0);
        },
    },
    async mounted() {
        if (!this.isAppLoading) {
            this.result = await this.getResult();
        }
    },
    watch: {
        async isAppLoading() {
            this.result = await this.getResult();
        },
        async filter() {
            this.result = await this.getResult();
        },
        result() {
            this.isLoading = false;
            this.isFirstLoading = false;
        },
    },
    methods: {
        formatDate,
        formatTime,
        unformatTime,

        async getResult() {
            if (!this.apiUrl || !this.filter.userId) return {};
            this.isLoading = true;

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
                    days: monthOff.filter((d) => d == 0).length,
                    daysDelta:
                        parseFloat(
                            this.deltaDays?.[this.filter.userId]?.[year]?.[i]
                        ) || 0,
                    seconds: 0,
                    secondsDelta:
                        parseFloat(
                            this.deltaSeconds?.[this.filter.userId]?.[year]?.[i]
                        ) || 0,
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

        span:nth-of-type(2) {
            font-weight: 400;
        }
    }
}
</style>
