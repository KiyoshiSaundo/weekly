<template>
    <div>
        <SettingsYearly />
        <Yearly />
    </div>
</template>

<script>
import SettingsYearly from '@/components/SettingsYearly.vue';
import Yearly from '@/components/Yearly.vue';

export default {
    components: {
        SettingsYearly,
        Yearly,
    },
};
</script>
