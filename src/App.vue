<template>
    <div class="weekly">
        <Header />
        <Settings />
        <Times />
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Settings from '@/components/Settings.vue';
import Times from '@/components/Times.vue';

import 'normalize.css';

export default {
    name: 'App',
    components: {
        Header,
        Settings,
        Times,
    }
};
</script>

<style lang="scss">
.weekly {
    width: 100%;
    max-width: 900px;
    margin: 20px auto;
    border: 1px solid $color-divide;
    padding: 20px;
}
</style>
