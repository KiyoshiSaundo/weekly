<template>
    <div class="yearly-month-average">
        <div
            class="yearly-month-average__result"
            :class="averageClasses"
            @click="togglePopup"
        >
            {{ averageRounded }}
        </div>
        <div
            v-if="popup.length"
            class="yearly-month-average__popup"
            :class="{ 'to-top': month.i >= 7 }"
        >
            <div
                v-for="(block, i) in popup"
                :key="i"
                class="yearly-month-average__block"
            >
                <div
                    class="yearly-month-average__title"
                    v-html="block.title"
                ></div>
                <div
                    v-for="(item, j) in block.items"
                    :key="j"
                    class="yearly-month-average__item"
                >
                    {{ item.label }}: {{ item.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usersGroups } from "@/settings";
import { formatTime, getFloat } from "@/functions";

export default {
    props: ["month", "delta", "settings"],
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
            return (
                (this.month.seconds - this.delta.seconds) /
                3600 /
                (this.month.days - this.delta.days)
            );
        },
        averageRounded() {
            return this.average.toFixed(2);
        },
        averageClasses() {
            const result = [];

            if (this.popup.length) result.push("is-extended");

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
        popup() {
            if (!this.month.seconds) return [];

            let result = [],
                secondsMinNeed = 0,
                secondsNormNeed = 0,
                secondsMaxNeed = 0;

            // часы
            result.push({
                title: "Время",
                items: [
                    {
                        label: "Затрачено",
                        value: formatTime(this.month.seconds),
                    },
                ],
            });

            // дни
            result.push({
                title: "Дни",
                items: [
                    {
                        label: "Рабочие",
                        value: this.month.days,
                    },
                    {
                        label: "Отгулы",
                        value: this.delta.days,
                    },
                    {
                        label: "Отработано",
                        value: this.month.days - this.delta.days,
                    },
                ],
            });

            // сколько не хватает до выработки суммарно
            if (
                this.isDeveloper &&
                this.average > 0 &&
                this.average < this.averageMax
            ) {
                let block = {
                    title: "Не хватает часов до",
                    items: [],
                };

                if (this.averageRounded < this.averageMin) {
                    secondsMinNeed =
                        (this.averageMin - this.average) *
                        3600 *
                        (this.month.days - this.delta.days);

                    block.items.push({
                        label: "минимума",
                        value: formatTime(Math.ceil(secondsMinNeed)),
                    });
                }

                if (this.averageRounded < this.averageNorm) {
                    secondsNormNeed =
                        (this.averageNorm - this.average) *
                        3600 *
                        (this.month.days - this.delta.days);

                    block.items.push({
                        label: "нормы",
                        value: formatTime(Math.ceil(secondsNormNeed)),
                    });
                }

                if (this.averageRounded < this.averageMax) {
                    secondsMaxNeed =
                        (this.averageMax - this.average) *
                        3600 *
                        (this.month.days - this.delta.days);

                    block.items.push({
                        label: "премии",
                        value: formatTime(Math.ceil(secondsMaxNeed)),
                    });
                }

                if (block.items.length) result.push(block);
            }

            // сколько надо закрывать в оставшиеся дни в текущем месяце для выработки
            const date = new Date();
            // const date = new Date("2024-03-30T03:24:00");
            if (
                this.isDeveloper &&
                this.average < this.averageMax &&
                this.month.year == date.getFullYear() &&
                this.month.i == date.getMonth()
            ) {
                // сколько рабочих дней осталось
                let stillWorkDays = 0;
                for (let [dayNum, dayData] of Object.entries(
                    this.month.daily
                )) {
                    if (dayNum >= date.getDate() && !dayData.off) {
                        stillWorkDays++;
                    }
                }

                if (stillWorkDays > 0) {
                    let block = {
                        title: "Сколько нужно закрывать часов<br /> каждый оставшийся рабочий день (не считая сегодня) для",
                        items: [],
                    };

                    if (this.averageRounded < this.averageMin) {
                        block.items.push({
                            label: "минимума",
                            value: formatTime(
                                Math.ceil(secondsMinNeed / (stillWorkDays - 1))
                            ),
                        });
                    }

                    if (this.averageRounded < this.averageNorm) {
                        block.items.push({
                            label: "нормы",
                            value: formatTime(
                                Math.ceil(secondsNormNeed / (stillWorkDays - 1))
                            ),
                        });
                    }

                    if (this.averageRounded < this.averageMax) {
                        block.items.push({
                            label: "премии",
                            value: formatTime(
                                Math.ceil(secondsMaxNeed / (stillWorkDays - 1))
                            ),
                        });
                    }

                    if (block.items.length) result.push(block);
                }
            }

            return result;
        },
    },
    mounted() {
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".yearly-month-average")) {
                document
                    .querySelectorAll(".yearly-month-average")
                    .forEach((item) => {
                        item.classList.remove("is-open");
                    });
            }
        });
    },
    methods: {
        togglePopup() {
            document
                .querySelectorAll(".yearly-month-average")
                .forEach((item) => {
                    if (item == this.$el) {
                        item.classList.toggle("is-open");
                    } else {
                        item.classList.remove("is-open");
                    }
                });
        },
    },
};
</script>

<style lang="scss">
.yearly-month-average {
    position: relative;
    margin-left: 5px;

    &__result {
        font-size: 16px;
        font-weight: 600;

        &.is-extended {
            cursor: pointer;

            &:hover {
                color: $color-accent;
            }
        }

        &.is-developer::after {
            content: "";
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: $average-color-default;
            vertical-align: middle;
            margin-left: 5px;
        }

        &.is-developer.is-crit::after {
            background: $average-color-crit;
        }

        &.is-developer.is-min::after {
            background: $average-color-min;
        }

        &.is-developer.is-norm::after {
            background: $average-color-norm;
        }

        &.is-developer.is-max::after {
            background: $average-color-max;
        }
    }

    &__popup {
        display: none;
        position: absolute;
        z-index: 10;
        font-size: 14px;
        top: 100%;
        right: 0;
        background: $color-white;
        border: $border;
        padding: calc($gap / 4);
        white-space: nowrap;

        &.to-top {
            top: auto;
            bottom: 100%;
        }

        .yearly-month-average.is-open & {
            display: block;
        }
    }

    &__block {
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__title {
        font-weight: 600;
    }
}
</style>
