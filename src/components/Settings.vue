<template>
    <div class="settings">
        <div class="settings__items">
            <div class="settings__item" :class="{'settings__item--2': !isAdmin}">
                <label class="settings__label">Строка API</label>
                <input class="settings__input" type="text" v-model="apiUrl" />
            </div>
            <div class="settings__item" v-if="isAdmin">
                <label class="settings__label">Пользователь</label>
                <select class="settings__input" v-model="userId">
                    <option v-for="user in users" :key="user.ID" :value="user.ID">
                        {{ user.LAST_NAME }} {{ user.NAME }} ({{ user.ID }})
                    </option>
                </select>
            </div>
            <div class="settings__item">
                <label class="settings__label">Период</label>
                <input class="settings__input" type="text" name="dates" />
            </div>
            <div class="settings__item">
                <button class="settings__btn" @click="setSettings">Применить</button>
            </div>
        </div>
    </div>
</template>

<script>
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

import {getCurrDay, getCurrWeek, getCurrMonth} from '@/functions';
import {getApiIsAdmin, getApiUsers} from '@/api';

export default {
    data() {
        return {
            apiUrl: this.$store.state.apiUrl,
            userId: this.$store.state.userId,
            start: this.$store.state.dateFrom,
            end: this.$store.state.dateTo,
            datePickerInst: false,
            users: [],
            isAdmin: false,
        };
    },
    created() {
        this.getUsers();
    },
    mounted() {
        let btnDay = {
                content: 'День',
                onClick: (dp) => {
                    let dates = getCurrDay();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            },
            btnWeek = {
                content: 'Неделя',
                onClick: (dp) => {
                    let dates = getCurrWeek();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            },
            btnMonth = {
                content: 'Месяц',
                onClick: (dp) => {
                    let dates = getCurrMonth();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            };

        this.datePickerInst = new AirDatepicker('[name=dates]', {
            range: true,
            multipleDatesSeparator: ' - ',
            selectedDates: [this.start, this.end],
            buttons: [btnDay, btnWeek, btnMonth],
            toggleSelected: false,
            onSelect(fields) {
                if (fields.date.length == 2) {
                    fields.datepicker.hide();
                }
            },
        });
    },
    watch: {
        apiUrl() {
            this.setUserId();
            this.getUsers();
        },
        users() {
            this.setLoadingEnd();
        }
    },
    methods: {
        async getUsers() {
            if (this.apiUrl) {
                this.setLoadingStart();
                this.isAdmin = await getApiIsAdmin(this.apiUrl);
                if (this.isAdmin) {
                    this.users = await getApiUsers(this.apiUrl);
                } else {
                    this.users = [];
                }
            }
        },
        setSettings() {
            this.$store.commit('apiChange', {
                apiUrl: this.apiUrl,
            });
            this.$store.commit('userChange', {
                userId: this.userId,
            });
            this.$store.commit('dateChange', {
                dateFrom: this.datePickerInst.selectedDates[0],
                dateTo: this.datePickerInst.selectedDates[1] || this.datePickerInst.selectedDates[0],
            });
        },
        setUserId() {
            if (this.apiUrl) {
                let match = false;
                if (match = this.apiUrl.match(/rest\/(\d+)/)) {
                    this.userId = match[1] || false;
                }
            } else {
                this.userId = false;
            }
        },

        setLoadingStart() {
            this.$store.commit('loadingChange', {
                isLoading: true,
            });
        },
        setLoadingEnd() {
            this.$store.commit('loadingChange', {
                isLoading: false,
            });
        },
    },
};
</script>

<style lang="scss">
.settings {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid $color-divide;

    &__items {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        margin-left: -5px;
        margin-right: -5px;
    }

    &__item {
        width: 25%;
        padding-left: 5px;
        padding-right: 5px;

        &--2 {
            width: 50%;
        }
    }

    &__label {
        margin-bottom: 5px;
        display: block;
        line-height: 1;
    }

    &__input {
        appearance: none;
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid $color-divide;
        font-weight: 300;
        padding: 0 10px;
    }

    &__btn {
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid $color-divide;
        background: transparent;
        margin: 0;
        padding: 0 10px;
        font-weight: 300;

        &:hover {
            background: $color-divide;
            cursor: pointer;
        }
    }
}
</style>
