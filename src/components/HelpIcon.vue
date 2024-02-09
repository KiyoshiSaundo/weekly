<template>
    <span
        v-click-outside="close"
        class="help-icon"
        :class="{ 'is-open': isOpen }"
    >
        <span class="help-icon__icon" @click="toggle()">?</span>
        <span class="help-icon__text" v-html="text"></span>
    </span>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
        open: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isOpen: this.open || false,
        };
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen;
        },
        close() {
            this.isOpen = false;
        },
    },
};
</script>

<style lang="scss">
.help-icon {
    position: relative;

    &__icon {
        font-size: 12px;
        font-weight: 400;
        line-height: 1;
        border: 1px solid $color-text;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        color: $color-text;
        cursor: pointer;
        opacity: 0.6;

        &:hover {
            opacity: 1;
        }
    }

    &__text {
        display: none;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.2;
        position: absolute;
        z-index: 100;
        top: 100%;
        left: 100%;
        background: $color-white;
        border: $border;
        color: $color-text;
        padding: calc($gap / 4);
        width: 240px;
        text-align: left;

        .help-icon.is-open & {
            display: block;
        }
    }
}
</style>
