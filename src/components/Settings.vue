<template>
    <div class="settings">
        <div class="settings__items">
            <div class="settings__item">
                <label class="settings__label">Строка API</label>
                <input class="settings__input" type="text" v-model="apiUrl" />
            </div>
            <div class="settings__item">
                <label class="settings__label">ID пользователя</label>
                <input class="settings__input" type="text" v-model="userId" />
            </div>
            <div class="settings__item">
                <label class="settings__label">Период</label>
                <input class="settings__input" type="text" name="dates" />
            </div>
            <div class="settings__item">
                <button class="settings__btn" @click="setSettings">Применить</button>
            </div>
        </div>
    </div>
</template>

<script>
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

export default {
    name: 'Settings',
    data() {
        return {
            apiUrl: this.$store.state.apiUrl,
            userId: this.$store.state.userId,
            start: this.$store.state.dateFrom,
            end: this.$store.state.dateTo,
            datePickerInst: false,
        };
    },
    mounted() {
        this.datePickerInst = new AirDatepicker('[name=dates]', {
            range: true,
            multipleDatesSeparator: ' - ',
            selectedDates: [this.start, this.end],
            onSelect(fields) {
                if (fields.date.length == 2) {
                    fields.datepicker.hide();
                }
            },
        });
    },
    methods: {
        setSettings() {
            this.$store.commit('apiChange', {
                apiUrl: this.apiUrl
            });
            this.$store.commit('userChange', {
                userId: this.userId
            });
            this.$store.commit('dateChange', {
                dateFrom: this.datePickerInst.selectedDates[0],
                dateTo: this.datePickerInst.selectedDates[1],
            });
        }
    }
};
</script>

<style lang="scss">
.settings {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid $color-divide;

    &__items {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        margin-left: -5px;
        margin-right: -5px;
    }

    &__item {
        width: 25%;
        padding-left: 5px;
        padding-right: 5px;
    }

    &__label {
        margin-bottom: 5px;
        display: block;
        line-height: 1;
    }

    &__input {
        appearance: none;
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid $color-divide;
        font-weight: 300;
        padding: 0 10px;
    }

    &__btn {
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid $color-divide;
        background: transparent;
        margin: 0;
        padding: 0 10px;
        font-weight: 300;

        &:hover {
            background: $color-divide;
            cursor: pointer;
        }
    }
}
</style>
