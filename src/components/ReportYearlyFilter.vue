<template>
    <div class="app-filter" :class="{ 'is-loading': isLoading }">
        <select
            v-if="users.length > 1"
            v-model="userId"
            class="app-filter__item"
            @change="setSettings"
        >
            <option v-for="user in users" :key="user.ID" :value="user.ID">
                {{ user.LAST_NAME }} {{ user.NAME }} ({{ user.ID }})
            </option>
        </select>
        <input class="app-filter__item" type="text" name="year" readonly />
        <div class="app-filter__spacer"></div>
        <SvgIcon
            name="refresh"
            class="app-filter__btn"
            title="Обновить"
            @click="setSettings"
        ></SvgIcon>
    </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon.vue";

import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";

import { getApiUsers } from "@/api";

export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            apiUrl: this.$store.state.appApiUrl,
            userId:
                this.$store.state.yearlyUserId || this.$store.state.appUserId,
            year: this.$store.state.yearlyYear,
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
        this.datePickerInst = new AirDatepicker("[name=year]", {
            view: "years",
            minView: "years",
            dateFormat: "yyyy",
            range: false,
            selectedDates: this.year,
            toggleSelected: false,
            onSelect(fields) {
                fields.datepicker.hide();
                vue.setSettings();
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
            this.$store.dispatch("yearlyFilterChange", {
                yearlyUserId: this.userId,
                yearlyYear: this.datePickerInst.selectedDates[0].getTime(),
            });
        },
    },
};
</script>

<style lang="scss">
/* .app-filter {
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
        height: 43px;
        width: 43px;
        margin-right: calc($gap / 2);

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
} */
</style>
