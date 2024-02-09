<template>
    <div class="app-instruction">
        <div class="app-instruction__variants">
            <span class="app-instruction__variant">
                Получаем строку api в первый раз
            </span>
            <br />
            <span class="app-instruction__variant">
                Ранее полученная строка api
            </span>
        </div>

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
                    <br />
                    <br />
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

<style lang="scss">
.app-instruction {
    margin-top: calc($gap / 4);

    &__variants {
        font-size: 14px;
        text-align: center;
    }

    &__variant {
    }
}
</style>
