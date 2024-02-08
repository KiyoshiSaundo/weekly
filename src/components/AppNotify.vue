<template>
    <div class="notify">
        <div
            v-for="(item, k) in items"
            :key="k"
            class="notify__item"
            :class="item.type ? 'is-' + item.type : ''"
            @click="close(k)"
        >
            <div class="notify__text">{{ item.text }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: this.$store.state.appMessages,
        };
    },
    methods: {
        close(index) {
            this.$store.dispatch("appMesageClose", index);
        },
    },
};
</script>

<style lang="scss">
.notify {
    position: fixed;
    top: calc($gap / 2);
    right: calc($gap / 2);

    &__item {
        width: 250px;
        background: rgba($color-green, 0.8);
        padding: calc($gap / 4);
        margin-bottom: calc($gap / 4);
        cursor: default;
        backdrop-filter: blur(10px);

        &:last-child {
            margin-bottom: 0;
        }

        &.is-error {
            background: rgba($color-red, 0.8);
        }
    }

    &__text {
        font-size: 12px;
        color: $color-white;
        line-height: 1.4;
        white-space: pre-line;
    }
}
</style>
