<template>
    <div class="reports">
        <AppHeader />
        <Tabs />
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import Tabs from "@/components/Tabs.vue";

import "normalize.css";

export default {
    name: "App",
    components: {
        AppHeader,
        Tabs,
    },
};
</script>

<style lang="scss">
.reports {
    width: 100%;
    max-width: 900px;
    margin: $padding-base auto;
    border: 1px solid $color-divide;
    padding: $padding-base;
    position: relative;
}
</style>
