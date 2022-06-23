<template>
    <div>
        <SettingsWeekly />
        <Weekly />
    </div>
</template>

<script>
import SettingsWeekly from '@/components/SettingsWeekly.vue';
import Weekly from '@/components/Weekly.vue';

export default {
    components: {
        SettingsWeekly,
        Weekly,
    },
};
</script>
