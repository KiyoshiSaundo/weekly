<template>
    <div class="yearly-month" :class="{ 'is-open': opened }">
        <div class="yearly-month__name" @click="toggle">
            <SvgIcon name="arrow" class="yearly-month__toggle" />
            {{ month.name }}
        </div>
        <div class="yearly-month__result mono">
            <label class="yearly-month__time">
                {{ formatTime(month.seconds) }}
                <input
                    ref="inputSeconds"
                    v-mask="{
                        regex: '[0-9]*\:[0-5][0-9]\:[0-5][0-9]',
                        numericInput: true,
                    }"
                    class="yearly-month__delta"
                    type="text"
                    :value="delta.seconds > 0 ? formatTime(delta.seconds) : ''"
                    @change="changeDelta"
                />
            </label>
            /
            <label class="yearly-month__days">
                {{ month.days }}
                <input
                    ref="inputDays"
                    v-mask="{ regex: '[0-9]*[.,]?[0-9]*', numericInput: true }"
                    class="yearly-month__delta"
                    type="text"
                    :value="delta.days > 0 ? delta.days : ''"
                    @change="changeDelta"
                />
            </label>
            =
            <YearlyAverage :month="month" :delta="delta" :settings="settings" />
        </div>
        <div class="yearly-month__daily">
            <YearlyDay
                v-for="(day, k) in month.daily"
                :key="k"
                :day="day"
                :settings="settings"
            />
        </div>
    </div>
</template>

<script>
import { formatTime, unformatTime, getFloat } from "@/functions";

import SvgIcon from "@/components/SvgIcon.vue";
import YearlyDay from "@/components/YearlyDay.vue";
import YearlyAverage from "@/components/YearlyAverage.vue";

export default {
    components: {
        SvgIcon,
        YearlyDay,
        YearlyAverage,
    },
    props: ["month", "settings"],
    emits: ["changeDelta"],
    data() {
        return {
            opened: false,
            delta: {
                seconds: this.month.delta.seconds || 0,
                days: this.month.delta.days || 0,
            },
        };
    },
    watch: {
        month() {
            this.delta.seconds = this.month.delta.seconds || 0;
            this.delta.days = this.month.delta.days || 0;
        },
    },
    methods: {
        formatTime,
        unformatTime,

        toggle() {
            this.opened = !this.opened;
        },
        changeDelta() {
            let oldSeconds = this.month.delta.seconds,
                newSeconds =
                    getFloat(
                        this.unformatTime(this.$refs.inputSeconds.value)
                    ) || 0,
                oldDays = this.month.delta.days,
                newDays = getFloat(this.$refs.inputDays.value) || 0;

            if (oldSeconds != newSeconds || oldDays != newDays) {
                this.$emit("changeDelta", {
                    month: this.month.i,
                    seconds: newSeconds,
                    days: newDays,
                });
            }
        },
    },
};
</script>

<style lang="scss">
.yearly-month {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: calc($gap / 4) 0;
    border-bottom: $border;
    position: relative;

    &:last-child {
        border-bottom: 0;
    }

    &:hover::after {
        content: "";
        position: absolute;
        pointer-events: none;
        z-index: -1;
        top: 0;
        left: calc(0px - $gap);
        right: calc(0px - $gap);
        bottom: 0;
        background: rgba($color-grey, 0.5);
    }

    &__name {
        flex-shrink: 0;
        user-select: none;
        display: flex;
        justify-content: start;
        align-items: center;

        &:hover {
            cursor: pointer;
            color: $color-accent;
        }

        &:hover {
            cursor: pointer;
            color: $color-accent;
        }
    }

    &__toggle {
        width: 22px;
        height: 22px;
        margin: -5px 5px -5px 0;

        .yearly-month.is-open & {
            transform: rotate(90deg);
        }

        @media print {
            display: none;
        }
    }

    &__result {
        position: relative;
        font-size: 12px;
        display: inline-flex;
        align-items: baseline;
    }

    &__time,
    &__days {
        position: relative;
        cursor: pointer;
        margin: 0 5px;

        &:hover {
            color: $color-accent;
        }
    }

    &__delta {
        position: absolute;
        z-index: 5;
        top: 100%;
        right: 0;
        color: $color-red;
        font-size: 10px;
        border: 0;
        line-height: 1;
        padding: 0;
        background: transparent;
        text-align: right;
        display: inline-block;
        width: auto;

        &:focus {
            border: 1px solid $color-accent;
            padding: calc($gap / 4);
            background: $color-white;
            width: 100px;
        }
    }

    &__daily {
        display: none;
        width: 100%;
        margin-top: calc($gap / 4);
        padding-top: calc($gap / 4);
        border-top: $border;
        padding-left: 27px;

        .yearly-month.is-open & {
            display: block;
        }

        @media print {
            padding-left: 0;
        }
    }
}
</style>
