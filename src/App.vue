<template>
    <div class="weekly" :class="{'is-loading': this.$store.state.isLoading}">
        <Header />
        <Settings />
        <Groups />
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Settings from '@/components/Settings.vue';
import Groups from '@/components/Groups.vue';

import 'normalize.css';

export default {
    name: 'App',
    components: {
        Header,
        Settings,
        Groups,
    },
};
</script>

<style lang="scss">
.weekly {
    width: 100%;
    max-width: 900px;
    margin: 20px auto;
    border: 1px solid $color-divide;
    padding: 20px;
    position: relative;

    &.is-loading {
        pointer-events: none;
        opacity: 0.5;
    }
}
</style>
