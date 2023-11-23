<template>
    <div class="yearly" :class="{ 'is-loading': isLoading }">
        <IconRefresh
            class="yearly__refresh"
            title="Обновить данные"
            @click="getResult"
        />
        <table class="yearly__table">
            <thead>
                <tr>
                    <th></th>
                    <th>Месяц</th>
                    <th>Рабочее время</th>
                    <th>Рабочие дни</th>
                    <th>Выработка</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in result" :key="item.k">
                    <tr>
                        <td class="is-collapse">
                            <IconArrow
                                class="yearly__collapse"
                                title="Свернуть/развернуть"
                                @click="openReport"
                            />
                        </td>
                        <td class="is-name">{{ item.name }}</td>
                        <td class="is-seconds">
                            <span>{{ formatTime(item.seconds) }}</span>
                            -
                            <span>
                                <input
                                    v-model="item.deltaSeconds"
                                    v-mask="{
                                        regex: '[0-9]*:[0-5][0-9]:[0-5][0-9]',
                                    }"
                                    type="text"
                                    @change="
                                        changeSeconds(item.k, item.deltaSeconds)
                                    "
                                    @keyup="
                                        changeSeconds(item.k, item.deltaSeconds)
                                    "
                                />
                            </span>
                            =
                            <span>
                                <b>
                                    {{
                                        formatTime(
                                            item.seconds -
                                                unformatTime(item.deltaSeconds)
                                        )
                                    }}
                                </b>
                            </span>
                        </td>
                        <td class="is-days">
                            <span>{{ item.days }}</span>
                            -
                            <span>
                                <input
                                    v-model="item.deltaDays"
                                    v-mask="{ regex: '[0-9]*[.,]?[0-9]*' }"
                                    type="text"
                                    @change="changeDays(item.k, item.deltaDays)"
                                    @keyup="changeDays(item.k, item.deltaDays)"
                                />
                            </span>
                            =
                            <span>
                                <b>
                                    {{ item.days - getFloat(item.deltaDays) }}
                                </b>
                            </span>
                        </td>
                        <td class="is-result">
                            <b>{{ item.result }}</b>
                        </td>
                    </tr>
                    <tr class="yearly__reports">
                        <td colspan="5" class="is-report">
                            <div
                                v-for="day in reports[item.k]['days']"
                                :key="day.i"
                            >
                                {{ day.date }} - {{ day.day }} -
                                {{ formatTime(day.seconds) }}
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td></td>
                    <td class="is-seconds-result">
                        <span>{{ formatTime(totalSeconds) }}</span>
                        -
                        <span>{{ formatTime(totalDeltaSeconds) }}</span>
                        =
                        <span>
                            {{ formatTime(totalSeconds - totalDeltaSeconds) }}
                        </span>
                    </td>
                    <td class="is-days-result">
                        <span>{{ totalDays }}</span>
                        -
                        <span>{{ totalDeltaDays }}</span>
                        =
                        <span>{{ totalDays - totalDeltaDays }}</span>
                    </td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import IconRefresh from "@/components/IconRefresh.vue";
import IconArrow from "@/components/IconArrow.vue";

import { formatDate, formatTime, unformatTime } from "@/functions";
import { getApiTimes, isMonthOff } from "@/api";

export default {
    components: {
        IconRefresh,
        IconArrow,
    },
    data() {
        return {
            result: [],
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
            isLoading: false,
            reports: {},
            openedReport: false,
        };
    },
    computed: {
        settings() {
            return {
                apiUrl: this.$store.state.yearlyApiUrl,
                userId: this.$store.state.yearlyUserId,
                date: this.$store.state.yearlyDate,
                deltaSeconds: this.$store.state.yearlyDeltaSeconds,
                deltaDays: this.$store.state.yearlyDeltaDays,
            };
        },
        totalSeconds() {
            return this.result.reduce((prev, curr) => {
                return (prev += curr.seconds);
            }, 0);
        },
        totalDeltaSeconds() {
            return this.result.reduce((prev, curr) => {
                return (prev += this.unformatTime(curr.deltaSeconds));
            }, 0);
        },
        totalDays() {
            return this.result.reduce((prev, curr) => {
                return (prev += this.getFloat(curr.days));
            }, 0);
        },
        totalDeltaDays() {
            return this.result.reduce((prev, curr) => {
                return (prev += this.getFloat(curr.deltaDays));
            }, 0);
        },
    },
    mounted() {
        this.getResult();
    },
    watch: {
        settings() {
            this.getResult();
        },
        result() {
            this.isLoading = false;
        },
    },
    methods: {
        formatDate,
        formatTime,
        unformatTime,

        async getResult() {
            let result = [],
                userId = this.settings.userId,
                year = this.settings.date.getFullYear(),
                deltaSeconds = this.settings.deltaSeconds,
                deltaDays = this.settings.deltaDays;

            this.isLoading = true;

            // *** старая корректировка дней (для совместимости)
            let oldDays = JSON.parse(localStorage.getItem("yearlyDays"));
            // *** end

            // массив результата
            this.months.forEach((item, i) => {
                result[i] = {
                    k: i,
                    name: item,
                    seconds: 0,
                    deltaSeconds: null,
                    days: 0,
                    deltaDays: null,
                    result: 0,
                    reports: {},
                };
            });

            // рабочие дни
            for (const item of result) {
                let workDays = await this.getMonthWorkDays(year, item.k + 1);
                result[item.k].days = workDays;

                // корректировка времени
                if (deltaSeconds?.[userId]?.[year]?.[item.k]) {
                    result[item.k].deltaSeconds = formatTime(
                        deltaSeconds[userId][year][item.k]
                    );
                }

                // *** старая корректировка дней (для совместимости)
                if (
                    oldDays?.[userId]?.[year]?.[item.k] &&
                    !deltaDays?.[userId]?.[year]?.[item.k]
                ) {
                    if (!deltaDays[userId]) deltaDays[userId] = {};
                    if (!deltaDays[userId][year]) deltaDays[userId][year] = {};

                    deltaDays[userId][year][item.k] =
                        workDays - oldDays[userId][year][item.k];
                    localStorage.setItem(
                        "yearlyDeltaDays",
                        JSON.stringify(deltaDays)
                    );

                    delete oldDays[userId][year][item.k];
                    localStorage.setItem("yearlyDays", JSON.stringify(oldDays));
                }
                // *** end

                // корректировка дней
                if (deltaDays?.[userId]?.[year]?.[item.k]) {
                    result[item.k].deltaDays = deltaDays[userId][year][item.k];
                }
            }

            // затраченное время
            let times = [];
            let filter = {
                USER_ID: userId,
                ">=CREATED_DATE": "01.01." + year + " 00:00:00",
                "<=CREATED_DATE": "31.12." + year + " 23:59:59",
            };
            if (filter.USER_ID) {
                times = await getApiTimes(this.settings.apiUrl, filter);
            }
            times.forEach((item) => {
                let date = new Date(item.CREATED_DATE);
                result[date.getMonth()].seconds += parseInt(item.SECONDS);
            });

            this.fillReports(times);

            this.result = result;
            this.recalcResult();
        },

        changeSeconds(month, delta) {
            let storeDelta = this.settings.deltaSeconds,
                user = this.settings.userId,
                year = this.settings.date.getFullYear();

            delta = this.unformatTime(delta);
            if (storeDelta[user]?.[year]?.[month] == delta) return;

            if (!storeDelta[user]) storeDelta[user] = {};
            if (!storeDelta[user][year]) storeDelta[user][year] = {};

            if (delta) {
                storeDelta[user][year][month] = delta;
            } else {
                delete storeDelta[user][year][month];
            }

            this.$store.commit("yearlyDeltaSecondsChange", {
                yearlyDeltaSeconds: storeDelta,
            });

            this.recalcResult();
        },
        changeDays(month, delta) {
            let storeDelta = this.settings.deltaDays,
                user = this.settings.userId,
                year = this.settings.date.getFullYear();

            delta = this.getFloat(delta);

            if (storeDelta[user]?.[year]?.[month] == delta) return;

            if (!storeDelta[user]) storeDelta[user] = {};
            if (!storeDelta[user][year]) storeDelta[user][year] = {};

            if (delta) {
                storeDelta[user][year][month] = delta;
            } else {
                delete storeDelta[user][year][month];
            }

            this.$store.commit("yearlyDeltaDaysChange", {
                yearlyDeltaDays: storeDelta,
            });

            this.recalcResult();
        },

        recalcResult() {
            this.result = this.result.map((item) => {
                let seconds =
                    this.getFloat(item.seconds) -
                    this.getFloat(this.unformatTime(item.deltaSeconds));
                let days =
                    this.getFloat(item.days) - this.getFloat(item.deltaDays);

                item.result = (
                    Math.ceil((seconds / 60 / 60 / days) * 100) / 100
                ).toFixed(1);
                return item;
            });
        },

        fillReports(times) {
            let result = {};
            let year = this.settings.date.getFullYear();

            for (let i = 0, ii = 11; i <= ii; i++) {
                result[i] = {
                    i: i,
                    days: {},
                };
                let maxDays = 33 - new Date(year, i, 33).getDate();
                for (let j = 1; j <= maxDays; j++) {
                    let date = new Date(year, i, j);
                    result[i]["days"][j] = {
                        i: j,
                        date: formatDate(date),
                        day: this.getDayName(date.getDay()),
                        seconds: 0,
                    };
                }
            }

            times.forEach((item) => {
                let date = new Date(item.CREATED_DATE);
                result[date.getMonth()]["days"][date.getDate()]["seconds"] +=
                    parseInt(item.SECONDS);
            });

            this.reports = result;
        },

        async getMonthWorkDays(year, month) {
            let result = 0,
                days = await isMonthOff(year, month);

            result = days.split("|").reduce((prev, curr) => {
                return curr != 1 ? ++prev : prev;
            }, 0);

            return result;
        },

        getFloat(str) {
            return parseFloat(String(str || 0).replace(",", "."));
        },

        getDayName(i) {
            switch (i) {
                case 0:
                    return "вс";
                case 1:
                    return "пн";
                case 2:
                    return "вт";
                case 3:
                    return "ср";
                case 4:
                    return "чт";
                case 5:
                    return "пт";
                case 6:
                    return "сб";
            }
        },

        openReport(e) {
            e.target.closest("tr").classList.toggle("is-open");
        },
    },
};
</script>

<style lang="scss" scoped>
.yearly {
    position: relative;

    &__refresh {
        width: 30px;
        position: absolute;
        top: 0;
        right: 0;
        height: 30px;
        line-height: 30px;
        margin: 0;
        padding: 0;
        color: $color;

        &:hover {
            cursor: pointer;
            color: rgba($color, 0.5);
        }
    }

    &__table {
        border: 0;
        border-spacing: 0;
        border-collapse: collapse;

        tr {
            border: 0;
        }

        tbody tr {
            &:hover {
                background: $color-divide;
            }
        }

        th {
            font-weight: 500;
            border: 0;
            border-bottom: 2px solid $color-divide;
            text-align: center;
            padding: 5px 15px;
        }

        td {
            border: 0;
            border-bottom: 1px solid $color-divide;
            padding: 5px 15px;
            text-align: right;

            &.is-collapse {
                width: 20px;
                padding: 5px;
            }

            &.is-name {
                text-align: left;
            }

            &.is-report {
                text-align: left;
                padding-left: 45px;
            }

            &.is-seconds {
                input {
                    text-align: right;
                }

                span {
                    display: inline-block;
                    width: 90px;
                    text-align: right;
                }
            }

            &.is-seconds-result {
                span {
                    display: inline-block;
                    width: 90px;
                    text-align: right;
                }
            }

            &.is-days {
                input {
                    text-align: right;
                }

                span {
                    display: inline-block;
                    width: 55px;
                    text-align: right;
                }
            }

            &.is-days-result {
                span {
                    display: inline-block;
                    width: 55px;
                    text-align: right;
                }
            }
        }
    }

    &__collapse {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
        cursor: pointer;
        user-select: none;
        transform: rotate(0);

        .is-open & {
            transform: rotate(90deg);
        }
    }

    &__reports {
        display: none;

        &:hover {
            background: transparent !important;
        }

        .is-open + & {
            display: table-row;
        }
    }
}
</style>
