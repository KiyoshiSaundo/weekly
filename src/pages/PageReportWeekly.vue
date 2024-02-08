<template>
    <slot>
        <ReportWeeklyFilter />
        <ReportWeekly />
    </slot>
</template>

<script>
import ReportWeekly from "@/components/ReportWeekly.vue";
import ReportWeeklyFilter from "@/components/ReportWeeklyFilter.vue";

export default {
    components: {
        ReportWeekly,
        ReportWeeklyFilter,
    },
};
</script>
