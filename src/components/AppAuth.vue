<template>
    <div class="app-auth">
        <div class="app-auth__form">
            <label class="app-auth__label">Вебхук для вызова rest api:</label>
            <input
                v-model.trim="appApiUrl"
                class="app-auth__input"
                type="text"
            />
            <div class="app-auth__footer">
                <button class="app-auth__button" @click="login()">Войти</button>
            </div>
        </div>
        <div class="app-auth__links">
            <span
                class="app-auth__link"
                :class="{ 'is-active': activeInstruction == 1 }"
                @click="toggleInstruction(1)"
            >
                Получаем вебхук в первый раз
            </span>
            <br />
            <span
                class="app-auth__link"
                :class="{ 'is-active': activeInstruction == 2 }"
                @click="toggleInstruction(2)"
            >
                Ранее получали вебхук
            </span>
        </div>
        <div
            class="app-auth__instruction"
            :class="{ 'is-active': activeInstruction == 1 }"
        >
            <div class="app-auth__step">
                <div class="app-auth__text">
                    1. Переходим по
                    <a
                        href="https://utlab.bitrix24.ru/devops/section/standard/"
                        target="_blank"
                    >
                        ссылке
                    </a>
                </div>
                <div class="app-auth__img"></div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    2. Выбираем
                    <b>"Входящий вебхук"</b>
                </div>
                <div class="app-auth__img">
                    <img src="@/assets/images/1-2.png" data-fancybox />
                </div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    3. Указываем какое-нибудь понятное название
                </div>
                <div class="app-auth__img">
                    <img src="@/assets/images/1-3.png" data-fancybox />
                </div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    4. В блоке
                    <b>"Настройка прав"</b>
                    выбираем:
                    <br />
                    <i>
                        Задачи (task)
                        <span style="color: red">
                            именно "task", без "s" на конце
                        </span>
                    </i>
                    <br />
                    <i>Рабочие группы (sonet_group)</i>
                    <br />
                    <i>Пользователи (user)</i>
                </div>
                <div class="app-auth__img">
                    <img src="@/assets/images/1-4.png" data-fancybox />
                </div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    5. Нажимаем
                    <b>"Сохранить"</b>
                </div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    6. Копируем строчку из поля
                    <b>"Вебхук для вызова rest api"</b>
                </div>
                <div class="app-auth__img">
                    <img src="@/assets/images/1-6.png" data-fancybox />
                </div>
            </div>
        </div>
        <div
            class="app-auth__instruction"
            :class="{ 'is-active': activeInstruction == 2 }"
        >
            <div class="app-auth__step">
                <div class="app-auth__text">
                    1. Переходим по
                    <a
                        href="https://utlab.bitrix24.ru/devops/list/"
                        target="_blank"
                    >
                        ссылке
                    </a>
                </div>
                <div class="app-auth__img"></div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    2. Находим нужную интеграцию и нажимаем
                    <b>"Редактировать"</b>
                </div>
                <div class="app-auth__img">
                    <img src="@/assets/images/2-2.png" data-fancybox />
                </div>
            </div>
            <div class="app-auth__step">
                <div class="app-auth__text">
                    3. Копируем строчку из поля
                    <b>"Вебхук для вызова rest api"</b>
                </div>
                <div class="app-auth__img">
                    <img src="@/assets/images/2-3.png" data-fancybox />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Fancybox } from "@fancyapps/ui";

import { checkAccess as apiCheckAccess } from "@/api";

export default {
    data() {
        return {
            appApiUrl: this.$store.state.appApiUrl || "",
            activeInstruction: false,
        };
    },
    mounted() {
        Fancybox.bind(this.$refs.container, "[data-fancybox]", {
            Toolbar: {
                display: {
                    left: [],
                    middle: [],
                    right: ["close"],
                },
            },
        });
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

        toggleInstruction(index) {
            if (this.activeInstruction == index) {
                this.activeInstruction = false;
            } else {
                this.activeInstruction = index;
            }
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
    }

    &__label {
        display: block;
        margin-bottom: 10px;
    }

    &__input {
        width: 430px;
        text-align: center;
    }

    &__footer {
        margin-top: calc($gap / 2);
        text-align: center;
    }

    &__button {
        width: 100%;
    }

    &__links {
        font-size: 14px;
        margin-top: calc($gap / 4);
        text-align: center;
        user-select: none;
    }

    &__link {
        text-decoration: none;
        cursor: pointer;

        &:hover,
        &.is-active {
            color: $color-accent;
        }
    }

    &__instruction {
        padding: $gap;
        background: $color-white;
        width: 800px;
        margin-top: calc($gap / 1);
        display: none;

        &.is-active {
            display: block;
        }
    }

    &__step {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: calc($gap / 2);
        padding-top: calc($gap / 2);
        border-top: $border;

        &:first-child {
            border-top: 0;
            margin-top: 0;
            padding-top: 0;
        }
    }

    &__text {
        width: 60%;
        padding-right: calc($gap / 4);
    }

    &__img {
        width: 40%;
        line-height: 0;
        padding-left: calc($gap / 4);

        img {
            outline: $border;
            max-width: 100%;
            cursor: pointer;

            &:hover {
                outline-color: $color-accent;
            }
        }
    }
}
</style>
