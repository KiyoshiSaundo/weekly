<template>
    <div class="app-filter">
        <InputUsers
            class="app-filter__item"
            :value="$store.state.weeklyUserId"
            @changeUser="changeUser"
        />
        <InputWeeklyCalendar
            class="app-filter__item"
            :value="[
                this.$store.state.weeklyStart,
                this.$store.state.weeklyEnd,
            ]"
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
import InputWeeklyCalendar from "@/components/InputWeeklyCalendar.vue";

export default {
    components: {
        SvgIcon,
        InputUsers,
        InputWeeklyCalendar,
    },
    methods: {
        changeUser(userId) {
            this.$store.dispatch("weeklyFilterChange", {
                weeklyUserId: userId,
            });
        },
        changeDate(dates) {
            this.$store.dispatch("weeklyFilterChange", {
                weeklyStart: dates[0].getTime(),
                weeklyEnd: dates[1].getTime() || dates[0].getTime(),
            });
        },
        refreshData() {
            this.$store.dispatch("weeklyFilterChange", {});
        },
    },
};
</script>
