<template>
    <input ref="calendar" type="text" readonly />
</template>

<script>
import AirDatepicker from "air-datepicker";

import { getCurrDay, getCurrWeek, getCurrMonth } from "@/functions";

export default {
    props: ["value"],
    emits: ["changeDate"],
    data() {
        return {
            start: this.value[0] || this.$store.state.weeklyStart,
            end: this.value[1] || this.$store.state.weeklyEnd,
        };
    },
    mounted() {
        const vueThis = this;
        new AirDatepicker(this.$refs.calendar, {
            range: true,
            multipleDatesSeparator: " - ",
            selectedDates: [this.start, this.end],
            buttons: this.getBtns(),
            toggleSelected: false,
            onSelect(fields) {
                if (fields.date.length == 2) {
                    fields.datepicker.hide();
                    vueThis.$emit("changeDate", fields.date);
                }
            },
        });
    },
    methods: {
        getBtns() {
            return [
                {
                    content: "День",
                    tagName: "span",
                    onClick: (dp) => {
                        let dates = getCurrDay();
                        dp.selectDate(dates);
                        dp.setViewDate(dates[0]);
                    },
                },
                {
                    content: "Неделя",
                    tagName: "span",
                    onClick: (dp) => {
                        let dates = getCurrWeek();
                        dp.selectDate(dates);
                        dp.setViewDate(dates[0]);
                    },
                },
                {
                    content: "Месяц",
                    tagName: "span",
                    onClick: (dp) => {
                        let dates = getCurrMonth();
                        dp.selectDate(dates);
                        dp.setViewDate(dates[0]);
                    },
                },
            ];
        },
    },
};
</script>
