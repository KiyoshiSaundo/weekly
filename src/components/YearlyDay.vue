<template>
    <div class="yearly-day mono" :class="dayClasses">
        {{ day.date }}
        <span>({{ day.day }})</span>
        - {{ formatTime(day.seconds) }}
    </div>
</template>

<script>
import { usersGroups } from "@/settings";
import { formatTime, getFloat } from "@/functions";

export default {
    props: ["day", "settings"],
    data() {
        return {
            averageMin: getFloat(this.settings.averageMin),
            averageNorm: getFloat(this.settings.averageNorm),
            averageMax: getFloat(this.settings.averageMax),
        };
    },
    computed: {
        isDeveloper() {
            const userGroups = usersGroups[this.$store.state.appUserId] || [];
            return (
                userGroups.includes("developer") &&
                this.$store.state.yearlyUserId == this.$store.state.appUserId
            );
        },
        average() {
            return this.day.seconds / 3600;
        },
        averageRounded() {
            return this.average.toFixed(2);
        },
        dayClasses() {
            const result = [];

            if (this.day.off) result.push("is-off");

            if (this.isDeveloper) {
                result.push("is-developer");

                if (this.average > 0 && this.averageRounded < this.averageMin) {
                    result.push("is-crit");
                }

                if (
                    this.average > 0 &&
                    this.averageRounded >= this.averageMin &&
                    this.averageRounded < this.averageNorm
                ) {
                    result.push("is-min");
                }

                if (
                    this.average > 0 &&
                    this.averageRounded >= this.averageNorm &&
                    this.averageRounded < this.averageMax
                ) {
                    result.push("is-norm");
                }

                if (
                    this.average > 0 &&
                    this.averageRounded >= this.averageMax
                ) {
                    result.push("is-max");
                }
            }

            return result;
        },
    },
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

    &::after {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: $average-color-default;
        vertical-align: middle;
        margin-left: 5px;
    }

    &.is-crit::after {
        background: $average-color-crit;
    }

    &.is-min::after {
        background: $average-color-min;
    }

    &.is-norm::after {
        background: $average-color-norm;
    }

    &.is-max::after {
        background: $average-color-max;
    }

    span {
        display: inline-block;
        text-align: center;
        width: 32px;
    }
}
</style>
