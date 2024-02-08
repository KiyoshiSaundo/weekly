<template>
    <input ref="calendar" type="text" readonly />
</template>

<script>
import AirDatepicker from "air-datepicker";

export default {
    props: ["value"],
    emits: ["changeDate"],
    data() {
        return {
            year: this.value || this.$store.state.yearlyYear,
        };
    },
    mounted() {
        const vueThis = this;
        new AirDatepicker(this.$refs.calendar, {
            view: "years",
            minView: "years",
            dateFormat: "yyyy",
            range: false,
            selectedDates: this.year,
            toggleSelected: false,
            onSelect(fields) {
                fields.datepicker.hide();
                vueThis.$emit("changeDate", fields.date);
            },
        });
    },
};
</script>
