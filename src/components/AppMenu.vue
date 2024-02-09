<template>
    <nav class="app-menu">
        <slot v-for="(item, k) in items" :key="k">
            <span
                v-if="item.name != `hr`"
                class="app-menu__item"
                :class="{ 'is-current': item.page == active }"
                @click="change(item)"
            >
                {{ item.name }}
            </span>
            <hr v-else />
        </slot>
    </nav>
</template>

<script>
export default {
    computed: {
        items() {
            return this.$store.state.menuItems;
        },
        active() {
            return this.$store.state.menuCurrent || this.items[0].page;
        },
    },
    methods: {
        change(item) {
            this.$store.dispatch("menuChange", item.page);
        },
    },
};
</script>

<style lang="scss">
.app-menu {
    flex-grow: 1;
    margin-bottom: $gap;

    &__item {
        color: $color-text;
        display: block;
        text-decoration: none;
        padding: calc($gap / 4) 0;
        cursor: pointer;

        &:hover {
            color: $color-accent;
        }

        &.is-current {
            font-weight: 600;
            color: $color-accent;
        }
    }

    hr {
        border: 0;
        margin: calc($gap / 2) 0;
        padding: 0;
        border-top: $border;
    }
}
</style>
