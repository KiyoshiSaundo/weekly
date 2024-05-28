<template>
    <div class="app-settings">
        <!-- <div class="app-settings__heading">Настройки</div> -->
        <div class="app-settings__block">
            <div class="app-settings__subheading">Выработка</div>
            <div class="app-settings__items">
                <div class="app-settings__item">
                    <label class="app-settings__label">Минимальная:</label>
                    <input class="app-settings__input" type="text" />
                </div>
                <div class="app-settings__item">
                    <label class="app-settings__label">Норма:</label>
                    <input class="app-settings__input" type="text" />
                </div>
                <div class="app-settings__item">
                    <label class="app-settings__label">Премия:</label>
                    <input class="app-settings__input" type="text" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            apiUrl: this.$store.state.appApiUrl,
        };
    },
    async created() {
        //
    },
    methods: {},
};
</script>

<style lang="scss">
.app-settings {
    padding: calc($gap / 2) $gap;

    &__block {
        margin-bottom: calc($gap / 2);

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__heading {
        font-size: 22px;
        font-weight: 600;
        color: $color-heading;
        line-height: 1.2;
        margin-bottom: $gap;
    }

    &__subheading {
        font-size: 18px;
        font-weight: 600;
        color: $color-heading;
        line-height: 1.2;
        margin-bottom: calc($gap / 2);
        text-align: center;
    }

    &__item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: calc($gap / 2);
        // opacity: 0.5;
        // pointer-events: none;
    }

    &__label {
        width: 30%;
        margin-left: 20%;
        text-align: right;
        padding-right: calc($gap / 4);
    }

    &__input {
        width: 30%;
        margin-right: 20%;
    }
}
</style>
