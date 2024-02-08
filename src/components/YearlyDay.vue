<template>
    <div class="yearly-day mono" :class="{ 'is-off': day.off }">
        {{ day.date }}
        <span>({{ day.day }})</span>
        - {{ formatTime(day.seconds) }}
    </div>
</template>

<script>
import { formatTime } from "@/functions";

export default {
    props: ["day"],
    methods: {
        formatTime,
    },
};
</script>

<style lang="scss">
.yearly-day {
    &.is-off {
        opacity: 0.3;
    }

    span {
        display: inline-block;
        text-align: center;
        width: 32px;
    }
}
</style>
