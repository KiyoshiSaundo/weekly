<template>
    <div v-if="result" class="app-user">
        <div class="app-user__label" :title="result.ID">
            {{ result.NAME }}
        </div>
        <!-- <SvgIcon
            name="settings"
            class="app-user__button"
            title="Настройки"
            @click="settings"
        /> -->
        <SvgIcon
            name="logout"
            class="app-user__button"
            title="Выйти"
            @click="logout"
        />
    </div>
</template>

<script>
import { getUserInfo as apiGetUserInfo } from "@/api";

import SvgIcon from "@/components/SvgIcon.vue";

export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            result: false,
        };
    },
    computed: {
        apiUrl() {
            return this.$store.state.appApiUrl;
        },
    },
    async mounted() {
        this.result = await this.getResult();
    },
    watch: {
        async apiUrl() {
            this.result = await this.getResult();
        },
    },
    methods: {
        settings() {
            this.$store.dispatch("menuChange", "PageAppSettings");
        },
        logout() {
            this.$store.dispatch("appLogout");
        },
        async getResult() {
            if (!this.apiUrl) return false;
            return await apiGetUserInfo(this.apiUrl);
        },
    },
};
</script>

<style lang="scss">
.app-user {
    display: flex;
    justify-content: start;
    align-content: center;

    &__label {
        cursor: default;
    }

    &__button {
        width: 24px;
        height: 24px;
        margin-left: calc($gap / 4);
        cursor: pointer;

        &:hover {
            color: $color-accent;
        }
    }
}
</style>
