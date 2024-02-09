<template>
    <slot>
        <ReportYearlyFilter />
        <ReportYearly />
    </slot>
</template>

<script>
import ReportYearly from "@/components/ReportYearly.vue";
import ReportYearlyFilter from "@/components/ReportYearlyFilter.vue";

export default {
    components: {
        ReportYearly,
        ReportYearlyFilter,
    },
};
</script>
