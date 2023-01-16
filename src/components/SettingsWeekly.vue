<template>
    <div class="settings" :class="{ 'is-loading': isLoading }">
        <div class="settings__items">
            <div
                class="settings__item"
                :class="{ 'settings__item--2': !isUserAdmin }"
            >
                <label class="settings__label">Строка API</label>
                <input v-model="apiUrl" class="settings__input" type="text" />
            </div>
            <div v-if="isUserAdmin" class="settings__item">
                <label class="settings__label">Пользователь</label>
                <select v-model="userId" class="settings__input">
                    <option
                        v-for="user in users"
                        :key="user.ID"
                        :value="user.ID"
                    >
                        {{ user.LAST_NAME }} {{ user.NAME }} ({{ user.ID }})
                    </option>
                </select>
            </div>
            <div class="settings__item">
                <label class="settings__label">Период</label>
                <input class="settings__input" type="text" name="dates" />
            </div>
            <div class="settings__item">
                <button class="settings__btn" @click="setSettings">
                    Применить
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";

import { getCurrDay, getCurrWeek, getCurrMonth } from "@/functions";
import { getApiIsAdmin, getApiUsers } from "@/api";

export default {
    data() {
        return {
            apiUrl: this.$store.state.weeklyApiUrl,
            userId: this.$store.state.weeklyUserId,
            start: this.$store.state.weeklyDateFrom,
            end: this.$store.state.weeklyDateTo,
            datePickerInst: false,
            users: [],
            isUserAdmin: false,
            isLoading: false,
        };
    },
    created() {
        this.getUsers();
    },
    mounted() {
        let btnDay = {
                content: "День",
                onClick: (dp) => {
                    let dates = getCurrDay();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            },
            btnWeek = {
                content: "Неделя",
                onClick: (dp) => {
                    let dates = getCurrWeek();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            },
            btnMonth = {
                content: "Месяц",
                onClick: (dp) => {
                    let dates = getCurrMonth();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            };

        this.datePickerInst = new AirDatepicker("[name=dates]", {
            range: true,
            multipleDatesSeparator: " - ",
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
            this.isLoading = false;
        },
    },
    methods: {
        async getUsers() {
            if (this.apiUrl) {
                this.isLoading = true;
                this.isUserAdmin = await getApiIsAdmin(this.apiUrl);
                if (this.isUserAdmin) {
                    this.users = await getApiUsers(this.apiUrl);
                } else {
                    this.users = [];
                }
            }
        },
        setSettings() {
            this.$store.commit("weeklyApiChange", {
                weeklyApiUrl: this.apiUrl,
            });
            this.$store.commit("weeklyUserChange", {
                weeklyUserId: this.userId,
            });
            this.$store.commit("weeklyDateChange", {
                weeklyDateFrom: this.datePickerInst.selectedDates[0],
                weeklyDateTo:
                    this.datePickerInst.selectedDates[1] ||
                    this.datePickerInst.selectedDates[0],
            });
        },
        setUserId() {
            if (this.apiUrl) {
                let match = false;
                if ((match = this.apiUrl.match(/rest\/(\d+)/))) {
                    this.userId = match[1] || false;
                }
            } else {
                this.userId = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.settings {
    margin-bottom: $padding-base;
    padding-bottom: $padding-base;
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
