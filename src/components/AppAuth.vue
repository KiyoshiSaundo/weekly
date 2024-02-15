<template>
    <div class="app-auth">
        <div class="app-auth__form">
            <label class="app-auth__label">Вебхук для вызова rest api:</label>
            <input
                v-model.trim="appApiUrl"
                class="app-auth__input"
                type="text"
            />
            <button class="app-auth__button" @click="login()">Войти</button>
        </div>
        <AuthInstructions />
    </div>
</template>

<script>
import { checkAccess as apiCheckAccess } from "@/api";
import AuthInstructions from "@/components/AuthInstructions.vue";

export default {
    components: {
        AuthInstructions,
    },
    data() {
        return {
            appApiUrl: this.$store.state.appApiUrl || "",
        };
    },
    methods: {
        async login() {
            let r1 = this.checkUrlFormat(this.appApiUrl);
            let r2 = await this.checkUrlAccess(this.appApiUrl);

            if (r1 && r2.status) {
                this.$store.dispatch("appLogin", {
                    appApiUrl: this.appApiUrl,
                    appUserId: this.getUserIdFromUrl(this.appApiUrl),
                });
            } else {
                if (!r1) {
                    this.$store.dispatch("appMesageShow", {
                        text: "Неверный формат строки api",
                        type: "error",
                    });
                }
                if (!r2.status) {
                    this.$store.dispatch("appMesageShow", {
                        text: "Ошибка проверки доступа " + r2.result,
                        type: "error",
                    });
                }
            }
        },

        checkUrlFormat(url) {
            return new RegExp(
                "https?:\\/\\/([^\\.\\/]+\\.)+[^\\.\\/]+\\/rest\\/\\d+\\/[A-z0-9]+\\/"
            ).test(url);
        },
        async checkUrlAccess(url) {
            return apiCheckAccess(url);
        },

        getUserIdFromUrl(url) {
            return (url.match(/rest\/(\d+)/) || [])[1] || false;
        },
    },
};
</script>

<style lang="scss">
.app-auth {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    margin: $gap;

    &__form {
        padding: $gap;
        background: $color-white;
        width: 540px;
    }

    &__label {
        display: block;
        margin-bottom: 10px;
    }

    &__input {
        width: 100%;
        text-align: center;
    }

    &__button {
        margin-top: calc($gap / 2);
        width: 100%;
    }
}
</style>
