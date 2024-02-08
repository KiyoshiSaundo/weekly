<template>
    <div class="report-filter" :class="{ 'is-loading': isLoading }">
        <select
            v-if="users.length > 1"
            v-model="userId"
            class="report-filter__item"
            @change="setSettings"
        >
            <option v-for="user in users" :key="user.ID" :value="user.ID">
                {{ user.LAST_NAME }} {{ user.NAME }} ({{ user.ID }})
            </option>
        </select>
        <input class="report-filter__item" type="text" name="date" readonly />
        <div class="report-filter__spacer"></div>
        <SvgIcon
            name="refresh"
            class="report-filter__btn"
            title="Обновить"
            @click="setSettings"
        ></SvgIcon>
    </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon.vue";

import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";

import { getCurrDay, getCurrWeek, getCurrMonth } from "@/functions";
import { getApiUsers } from "@/api";

export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            apiUrl: this.$store.state.appApiUrl,
            userId:
                this.$store.state.weeklyUserId || this.$store.state.appUserId,
            start: this.$store.state.weeklyStart,
            end: this.$store.state.weeklyEnd,
            datePickerInst: false,
            users: [],
            isLoading: false,
        };
    },
    created() {
        this.getUsers();
    },
    mounted() {
        let vue = this;
        let btnDay = {
                content: "День",
                tagName: "span",
                onClick: (dp) => {
                    let dates = getCurrDay();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            },
            btnWeek = {
                content: "Неделя",
                tagName: "span",
                onClick: (dp) => {
                    let dates = getCurrWeek();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            },
            btnMonth = {
                content: "Месяц",
                tagName: "span",
                onClick: (dp) => {
                    let dates = getCurrMonth();
                    dp.selectDate(dates);
                    dp.setViewDate(dates[0]);
                },
            };

        this.datePickerInst = new AirDatepicker("[name=date]", {
            range: true,
            multipleDatesSeparator: " - ",
            selectedDates: [this.start, this.end],
            buttons: [btnDay, btnWeek, btnMonth],
            toggleSelected: false,
            onSelect(fields) {
                if (fields.date.length == 2) {
                    fields.datepicker.hide();
                    vue.setSettings();
                }
            },
        });
    },
    watch: {
        users() {
            this.isLoading = false;
        },
    },
    methods: {
        async getUsers() {
            if (!this.apiUrl) return [];
            this.isLoading = true;
            this.users = await getApiUsers(this.apiUrl);
        },
        setSettings() {
            this.$store.dispatch("weeklyFilterChange", {
                weeklyUserId: this.userId,
                weeklyStart: this.datePickerInst.selectedDates[0].getTime(),
                weeklyEnd:
                    this.datePickerInst.selectedDates[1].getTime() ||
                    this.datePickerInst.selectedDates[0].getTime(),
            });
        },
    },
};
</script>

<style lang="scss">
.report-filter {
    padding: calc($gap / 2) $gap;
    border-bottom: $border;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
        border: 0;
    }

    &__item {
        width: 240px;
        margin-right: calc($gap / 2);

        &:last-child {
            margin-right: 0;
        }
    }

    &__spacer {
        flex-grow: 1;
    }

    &__btn {
        cursor: pointer;
        height: 50px;
        aspect-ratio: 1 / 1;
        margin-right: calc($gap / 2);
        padding: 8px;

        &:hover {
            color: $color-accent;
        }

        &:last-child {
            margin-right: 0;
        }

        @media print {
            display: none;
        }
    }
}
</style>
