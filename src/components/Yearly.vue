<template>
    <div class="yearly" :class="{'is-loading': isLoading}">
        <div class="yearly__refresh" @click="getResult" title="Обновить данные">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"
                />
            </svg>
        </div>
        <table class="yearly__table">
            <tr>
                <th>Месяц</th>
                <th>Время</th>
                <th>Дни</th>
                <th>Выработка</th>
            </tr>
            <tr v-for="item in result" :key="item.k">
                <td class="is-name">{{ item.name }}</td>
                <td class="is-seconds">
                    {{ formatTime(item.seconds) }} -
                    <input
                        type="text"
                        step="0.5"
                        v-model="item.deltaSeconds"
                        @change="secondsChange(item.k, item.deltaSeconds)"
                        data-seconds
                    />
                </td>
                <td class="is-days">
                    <!-- <input
                        :class="{'is-custom': item.days != item.workDays}"
                        type="number"
                        v-model="item.days"
                        :title="'По умолчанию: ' + item.workDays"
                        step="0.5"
                        @keyup="daysChange(item.k, item.days)"
                        @change="daysChange(item.k, item.days)"
                    /> -->
                    {{ item.days }} -
                    <input type="number" step="0.5" v-model="item.deltaDays" />
                </td>
                <td class="is-result">{{ item.result }}</td>
            </tr>
            <tr>
                <td></td>
                <td>{{ formatTime(totalTime) }}</td>
                <td class="is-total-days"><input type="number" :value="totalDays" disabled /></td>
                <td></td>
            </tr>
        </table>
        <div class="yearly__notes"><b>*</b> - производственный календарь, не учитываются отпуска и отгулы</div>
    </div>
</template>

<script>
import Inputmask from 'inputmask';
import {formatTime} from '@/functions';

import {getApiTimes, isMonthOff} from '@/api';

export default {
    data() {
        return {
            result: [],
            months: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь',
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
        totalDays() {
            return this.result.reduce((prev, curr) => {
                return (prev += curr.days);
            }, 0);
        },
        totalTime() {
            return this.result.reduce((prev, curr) => {
                return (prev += curr.seconds);
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

        async getResult() {
            let result = [],
                userId = this.settings.userId,
                year = this.settings.date.getFullYear(),
                deltaSeconds = this.settings.deltaSeconds,
                deltaDays = this.settings.deltaDays;

            this.isLoading = true;

            // массив результата
            this.months.forEach((item, i) => {
                result[i] = {
                    k: i,
                    name: item,
                    seconds: 0,
                    deltaSeconds: '0:00:00',
                    days: 0,
                    deltaDays: 0,
                    result: 0,
                };
            });

            // рабочие дни
            for (const item of result) {
                let workDays = await this.getMonthWorkDays(year, item.k + 1);
                result[item.k].days = workDays;

                // корректировка времени
                if (deltaSeconds?.[userId]?.[year]?.[item.k]) {
                    result[item.k].deltaSeconds = deltaSeconds[userId][year][item.k];
                }
                // корректировка дней
                if (deltaDays?.[userId]?.[year]?.[item.k]) {
                    result[item.k].deltaDays = deltaDays[userId][year][item.k];
                }
            }

            // затраченное время
            let times = [];
            let filter = {
                USER_ID: userId,
                '>=CREATED_DATE': '01.01.' + year + ' 00:00:00',
                '<=CREATED_DATE': '31.12.' + year + ' 23:59:59',
            };
            if (filter.USER_ID) {
                times = await getApiTimes(this.settings.apiUrl, filter);
            }
            times.forEach((item) => {
                let date = new Date(item.CREATED_DATE);
                result[date.getMonth()].seconds += parseInt(item.SECONDS);
            });

            this.result = result;
            this.daysRecalc();
            this.secondsMask();
        },

        secondsChange(mounth, delta) {
            let storeDelta = this.settings.deltaSeconds,
                user = this.settings.userId,
                year = this.settings.date.getFullYear();

            delta = parseFloat(String(delta).replace(',', '.'));

            console.log(delta);
        },

        daysChange(month, delta) {
            let storeDays = this.settings.days,
                user = this.settings.userId,
                year = this.settings.date.getFullYear();

            delta = parseFloat(String(delta).replace(',', '.'));

            if (storeDays[user]?.[year]?.[month] == delta) return;

            if (!storeDays[user]) storeDays[user] = {};
            if (!storeDays[user][year]) storeDays[user][year] = {};

            if (delta) {
                storeDays[user][year][month] = delta;
            } else {
                delete storeDays[user][year][month];
                this.result[month].days = this.result[month].workDays;
            }

            this.$store.commit('yearlyDaysChange', {
                yearlyDays: storeDays,
            });

            this.daysRecalc();
        },
        daysRecalc() {
            this.result = this.result.map((item) => {
                if (item.seconds && item.days) {
                    item.result = parseFloat(item.seconds) / 60 / 60 / parseFloat(String(item.days).replace(',', '.'));
                    item.result = (Math.ceil(item.result * 100) / 100).toFixed(1);
                }
                return item;
            });
        },
        secondsMask() {
            const secondsDelta = document.querySelectorAll('[data-seconds]');
            console.log(secondsDelta);
            Inputmask({
                regex: "[0-9]*:[0-5][0-9]:[0-5][0-9]",
            }).mask(secondsDelta);
        },
        async getMonthWorkDays(year, month) {
            let result = 0,
                days = await isMonthOff(year, month);

            result = days.split('|').reduce((prev, curr) => {
                return curr != 1 ? ++prev : prev;
            }, 0);

            return result;
        },
    },
};
</script>

<style lang="scss" scoped>
.yearly {
    position: relative;

    &__refresh {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
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

        th {
            font-weight: 500;
            border: 0;
            border-bottom: 2px solid $color-divide;
            // text-align: right;
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
                    width: 90px;
                    text-align: right;
                }
            }

            &.is-days {
                input {
                    width: 75px;
                    text-align: right;

                    &.is-custom {
                        background: rgba($color-divide, 0.5);
                    }
                }
            }

            &.is-total-days {
                input {
                    width: 75px;
                    text-align: right;
                    background: transparent;
                    border-color: transparent;
                    color: $color;
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

    &__notes {
        margin-top: 10px;
        opacity: 0.8;
    }
}
</style>
