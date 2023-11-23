<template>
    <div class="instruction">
        <ul>
            <li>
                Получаем код для "Строка API":
                <ul>
                    <li>
                        <span
                            class="instruction__name"
                            @click="toggleInstruction(0)"
                        >
                            Если делаем первый раз
                            <IconArrow
                                class="instruction__arrow"
                                title="Свернуть/развернуть"
                            />
                        </span>
                    </li>
                    <li>
                        <span
                            class="instruction__name"
                            @click="toggleInstruction(1)"
                        >
                            Если уже делали ранее
                            <IconArrow
                                class="instruction__arrow"
                                title="Свернуть/развернуть"
                            />
                        </span>
                    </li>
                </ul>
            </li>
        </ul>

        <div class="instruction__steps">
            <div class="instruction__step">
                <div class="instruction__text">
                    1. Заходим в bitrix24 в левом меню в раздел
                    <b>"Разработчикам"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-1.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    2. Выбираем пункт
                    <b>"Другое"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-2.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    3. Выбираем пункт
                    <b>"Входящий вебхук"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-3.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    4. Указываем какое-нибудь понятное название для вебхука
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-4.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    5. В блоке
                    <b>"Настройка прав"</b>
                    выбираем:
                    <br />
                    <i>Задачи (task)</i>
                    <br />
                    <i>Рабочие группы (sonet_group)</i>
                    <br />
                    <i>Пользователи (user)</i>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-5.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    6. Нажимаем
                    <b>"Сохранить"</b>
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    7. Копируем строчку из поля
                    <b>"Вебхук для вызова rest api"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-7.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    8. Скопированную строчку вставляем в поле
                    <b>"Строка API"</b>
                    и нажимаем
                    <b>"Применить"</b>
                    <br />
                    <br />
                    Делаем это на вкладках
                    <b>"Неделька"</b>
                    и
                    <b>"Годик"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-8.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__finish">Готово. Вы великолепны!</div>
            </div>
        </div>
        <div class="instruction__steps">
            <div class="instruction__step">
                <div class="instruction__text">
                    1. Заходим в bitrix24 в левом меню в раздел
                    <b>"Разработчикам"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-1.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    2. Выбираем пункт
                    <b>"Интеграции"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/2-2.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    3. Находим нужную интеграцию и нажимаем
                    <b>"Редактировать"</b>
                    <br />
                    <br />
                    <i>Или просто двойной щелчок по нужной строке</i>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/2-3.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    4. Копируем строчку из поля
                    <b>"Вебхук для вызова rest api"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-7.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__text">
                    5. Скопированную строчку вставляем в поле
                    <b>"Строка API"</b>
                    и нажимаем
                    <b>"Применить"</b>
                    <br />
                    <br />
                    Делаем это на вкладках
                    <b>"Неделька"</b>
                    и
                    <b>"Годик"</b>
                </div>
                <div class="instruction__img">
                    <img src="@/assets/images/1-8.png" data-fancybox />
                </div>
            </div>
            <div class="instruction__step">
                <div class="instruction__finish">Готово. Вы великолепны!</div>
            </div>
        </div>
    </div>
</template>

<script>
import IconArrow from "@/components/IconArrow.vue";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default {
    components: {
        IconArrow,
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
            // Toolbar: {
            //     display: ["close"],
            // },
        });
    },
    methods: {
        toggleInstruction(num) {
            let names = document.querySelectorAll(".instruction__name");
            let texts = document.querySelectorAll(".instruction__steps");

            names.forEach((item) => {
                item.classList.remove("is-open");
            });
            names[num].classList.add("is-open");

            texts.forEach((item) => {
                item.classList.remove("is-open");
            });
            texts[num].classList.add("is-open");
        },
    },
};
</script>

<style lang="scss">
.instruction {
    ul {
        margin: 0;
    }

    &__item {
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__name {
        display: inline-block;

        &:hover {
            cursor: pointer;
            text-decoration: underline;
        }

        &.is-open {
            font-weight: 500;
        }
    }

    &__arrow {
        width: 12px;
        height: 12px;
        margin-left: 5px;
        user-select: none;
        display: none;

        .is-open & {
            display: inline-block;
            transform: rotate(90deg);
            font-weight: 500;
        }
    }

    &__steps {
        display: none;
        margin-top: 20px;

        &.is-open {
            display: block;
        }
    }

    &__step {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid $color-divide;
    }

    &__text {
        width: 50%;
        padding-right: 50px;
    }

    &__img {
        width: 50%;
        line-height: 0;

        img {
            outline: 1px solid $color-divide;
            max-width: 100%;
            cursor: pointer;
        }
    }

    &__finish {
        text-align: center;
        font-weight: 500;
        font-size: 110%;
        width: 100%;
    }
}

[data-fancybox-toggle-fullscreen],
[data-panzoom-action="iterateZoom"] {
    display: none !important;
}

.fancybox__backdrop {
    background: rgba(#fff, 0.85) !important;
}

.fancybox-image {
    outline: 1px solid $color-divide !important;
}

</style>
