<template>
    <div class="app-filter">
        <InputUsers
            class="app-filter__item"
            :value="$store.state.yearlyUserId"
            @changeUser="changeUser"
        />
        <InputYearlyCalendar
            class="app-filter__item"
            :value="this.$store.state.yearlyYear"
            @changeDate="changeDate"
        />
        <div class="app-filter__spacer"></div>
        <SvgIcon
            name="refresh"
            class="app-filter__btn"
            title="Обновить"
            @click="refreshData"
        ></SvgIcon>
    </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon.vue";
import InputUsers from "@/components/InputUsers.vue";
import InputYearlyCalendar from "@/components/InputYearlyCalendar.vue";

export default {
    components: {
        SvgIcon,
        InputUsers,
        InputYearlyCalendar,
    },
    methods: {
        changeUser(userId) {
            this.$store.dispatch("yearlyFilterChange", {
                yearlyUserId: userId,
            });
        },
        changeDate(date) {
            this.$store.dispatch("yearlyFilterChange", {
                yearlyYear: date.getTime(),
            });
        },
        refreshData() {
            this.$store.dispatch("yearlyFilterChange", {});
        },
    },
};
</script>
