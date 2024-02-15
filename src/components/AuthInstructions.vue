<template>
    <div class="auth-instructions">
        <div class="auth-instructions__heading attention-text">Инструкции:</div>
        <div class="auth-instructions__links">
            <div
                class="auth-instructions__link"
                :class="{ 'is-active': activeIndex == 1 }"
                @click="toggle(1)"
            >
                <span class="mono">1.</span>
                Делаем вебхук в первый раз
            </div>
            <div
                class="auth-instructions__link"
                :class="{ 'is-active': activeIndex == 2 }"
                @click="toggle(2)"
            >
                <span class="mono">2.</span>
                Ранее делали вебхук
            </div>
            <div
                class="auth-instructions__link"
                :class="{ 'is-active': activeIndex == 3 }"
                @click="toggle(3)"
            >
                <span class="mono">3.</span>
                Поменять права доступа в вебхуке
            </div>
        </div>
        <div
            class="auth-instructions__item"
            :class="{ 'is-active': activeIndex == 1 }"
        >
            <div class="auth-instructions__step">
                <div class="auth-instructions__text attention-text">
                    1. Переходим по
                    <a
                        href="https://utlab.bitrix24.ru/devops/section/standard/"
                        target="_blank"
                    >
                        ссылке
                    </a>
                </div>
                <div class="auth-instructions__img"></div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    2. Выбираем
                    <b>"Входящий вебхук"</b>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/1-2.png" data-fancybox />
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    3. Указываем какое-нибудь понятное название
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/1-3.png" data-fancybox />
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    4. В блоке
                    <b>"Настройка прав"</b>
                    выбираем:
                    <br />
                    <br />
                    <i>
                        Задачи (task)
                        <span class="attention-text">
                            именно "task", без "s" на конце
                        </span>
                    </i>
                    <br />
                    <i>Рабочие группы (sonet_group)</i>
                    <br />
                    <i>Пользователи (user)</i>
                    <br />
                    <i>Чат и уведомления (im)</i>
                    <br />
                    <i>Диск (disk)</i>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/1-4.png" data-fancybox />
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text attention-text">
                    5. Нажимаем
                    <b>"Сохранить"</b>
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    6. Копируем строчку из поля
                    <b>"Вебхук для вызова rest api"</b>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/1-6.png" data-fancybox />
                </div>
            </div>
        </div>
        <div
            class="auth-instructions__item"
            :class="{ 'is-active': activeIndex == 2 }"
        >
            <div class="auth-instructions__step">
                <div class="auth-instructions__text attention-text">
                    1. Переходим по
                    <a
                        href="https://utlab.bitrix24.ru/devops/list/"
                        target="_blank"
                    >
                        ссылке
                    </a>
                </div>
                <div class="auth-instructions__img"></div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    2. Находим нужную интеграцию и нажимаем
                    <b>"Редактировать"</b>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/2-2.png" data-fancybox />
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    3. Копируем строчку из поля
                    <b>"Вебхук для вызова rest api"</b>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/2-3.png" data-fancybox />
                </div>
            </div>
        </div>
        <div
            class="auth-instructions__item"
            :class="{ 'is-active': activeIndex == 3 }"
        >
            <div class="auth-instructions__step">
                <div class="auth-instructions__text attention-text">
                    1. Переходим по
                    <a
                        href="https://utlab.bitrix24.ru/devops/list/"
                        target="_blank"
                    >
                        ссылке
                    </a>
                </div>
                <div class="auth-instructions__img"></div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    2. Находим нужную интеграцию и нажимаем
                    <b>"Редактировать"</b>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/3-2.png" data-fancybox />
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text">
                    3. В блоке
                    <b>"Настройка прав"</b>
                    выбираем:
                    <br />
                    <br />
                    <i>
                        Задачи (task)
                        <span class="attention-text">
                            именно "task", без "s" на конце
                        </span>
                    </i>
                    <br />
                    <i>Рабочие группы (sonet_group)</i>
                    <br />
                    <i>Пользователи (user)</i>
                    <br />
                    <i>Чат и уведомления (im)</i>
                    <br />
                    <i>Диск (disk)</i>
                </div>
                <div class="auth-instructions__img">
                    <img src="@/assets/images/3-3.png" data-fancybox />
                </div>
            </div>
            <div class="auth-instructions__step">
                <div class="auth-instructions__text attention-text">
                    4. Нажимаем
                    <b>"Сохранить"</b>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Fancybox } from "@fancyapps/ui";

export default {
    data() {
        return {
            activeIndex: false,
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
        toggle(index) {
            if (this.activeIndex == index) {
                this.activeIndex = false;
            } else {
                this.activeIndex = index;
            }
        },
    },
};
</script>

<style lang="scss">
.auth-instructions {
    margin-top: calc($gap / 2);

    &__heading {
        width: 540px;
        margin-bottom: calc($gap / 6);
        padding-left: $gap;
        padding-right: $gap;
        margin-left: auto;
        margin-right: auto;
    }

    &__links {
        width: 540px;
        padding-left: $gap;
        padding-right: $gap;
        margin-left: auto;
        margin-right: auto;
    }

    &__link {
        text-decoration: none;
        cursor: pointer;

        &:hover,
        &.is-active {
            color: $color-accent;
        }
    }

    &__item {
        padding: $gap;
        background: $color-white;
        width: 800px;
        margin-top: calc($gap / 2);
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

    &__num {
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
