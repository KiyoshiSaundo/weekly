<template>
    <div class="yearly" :class="{ 'is-loading': isLoading }">
        <div class="yearly__refresh" @click="getResult" title="Обновить данные">
            <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
            >
                <path
                    d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"
                />
            </svg>
        </div>
        <table class="yearly__table">
            <tr>
                <th>Месяц</th>
                <th>Рабочее время</th>
                <th>Рабочие дни</th>
                <th>Выработка</th>
            </tr>
            <tr v-for="item in result" :key="item.k">
                <td class="is-name">{{ item.name }}</td>
                <td class="is-seconds">
                    <span>{{ formatTime(item.seconds) }}</span>
                    -
                    <span>
                        <input
                            type="text"
                            v-model="item.deltaSeconds"
                            @change="changeSeconds(item.k, item.deltaSeconds)"
                            @keyup="changeSeconds(item.k, item.deltaSeconds)"
                            v-mask="{ regex: '[0-9]*:[0-5][0-9]:[0-5][0-9]' }"
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
                            type="text"
                            v-model="item.deltaDays"
                            @change="changeDays(item.k, item.deltaDays)"
                            @keyup="changeDays(item.k, item.deltaDays)"
                            v-mask="{ regex: '[0-9]*[.,]?[0-9]*' }"
                        />
                    </span>
                    =
                    <span>
                        <b>{{ item.days - getFloat(item.deltaDays) }}</b>
                    </span>
                </td>
                <td class="is-result">
                    <b>{{ item.result }}</b>
                </td>
            </tr>
            <tr>
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
        </table>
    </div>
</template>

<script>
import { formatTime, unformatTime } from "@/functions";
import { getApiTimes, isMonthOff } from "@/api";

export default {
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

    &__item {
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
    }
}
</style>
