<template>
    <div>
        <SettingsWeekly />
        <ReportWeekly />
    </div>
</template>

<script>
import SettingsWeekly from '@/components/SettingsWeekly.vue';
import ReportWeekly from '@/components/ReportWeekly.vue';

export default {
    components: {
        SettingsWeekly,
        ReportWeekly,
    },
};
</script>
