<template>
    <div
        class="app-settings"
        :class="{
            'is-loading': !isAppLoading && isLoading,
        }"
    >
        <div
            v-for="(block, blockCode) in result"
            :key="blockCode"
            class="app-settings__block"
        >
            <div class="app-settings__subheading">{{ block.name }}</div>
            <div class="app-settings__items">
                <div
                    v-for="(item, itemCode) in block.items"
                    :key="itemCode"
                    class="app-settings__item"
                >
                    <label class="app-settings__label">{{ item.label }}:</label>
                    <input
                        v-model="values[itemCode]"
                        class="app-settings__input"
                        :type="item.type"
                        @change="changeValues"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getWeeklyFile } from "@/functions";
import { updateB24File } from "@/api";

export default {
    data() {
        return {
            apiUrl: this.$store.state.appApiUrl,
            userId: this.$store.state.appUserId,
            isLoading: true,
            result: {
                average: {
                    name: "Выработка",
                    items: {
                        averageMin: { label: "Минимум", type: "text" },
                        averageNorm: { label: "Норма", type: "text" },
                        averageMax: { label: "Премия", type: "text" },
                    },
                },
            },
            values: {},
        };
    },
    computed: {
        isAppLoading() {
            return this.$store.state.appLoading;
        },
    },
    async mounted() {
        if (!this.isAppLoading) {
            this.values = await this.getValues();
        }
    },
    watch: {
        async isAppLoading() {
            this.values = await this.getValues();
        },
        values() {
            this.isLoading = false;
        },
    },
    methods: {
        async getValues() {
            if (!this.apiUrl) return {};

            let result = {};
            this.isLoading = true;

            this.weeklyFile = await getWeeklyFile(this.$store.state.appApiUrl);

            if (this.weeklyFile.message) {
                this.$store.dispatch("appMesageShow", this.weeklyFile.message);
            }

            const storageSettings = JSON.parse(
                localStorage.appSettings || "{}"
            );

            result =
                this.weeklyFile?.fileContent?.settings || storageSettings || {};

            return result;
        },

        async changeValues() {
            this.isLoading = true;

            if (!this.userId) {
                this.$store.dispatch("appMesageShow", {
                    type: "error",
                    text: "Не хватает данных для сохрания",
                });
                this.isLoading = false;
                return;
            }

            let values = JSON.parse(JSON.stringify(this.values)),
                fileContent = JSON.parse(
                    JSON.stringify(this.weeklyFile.fileContent)
                );

            /* storage */

            localStorage.appSettings = JSON.stringify(values);

            /* b24 */

            if (this.apiUrl && this.weeklyFile.fileId) {
                fileContent.settings = values;

                let updateRes = await updateB24File(this.apiUrl, {
                    fileId: this.weeklyFile.fileId,
                    fileContent: fileContent,
                });
                if (updateRes.status != 1) {
                    this.$store.dispatch("appMesageShow", {
                        type: "error",
                        text: "updateB24File():\r\n" + updateRes.result,
                    });
                }
            } else {
                this.$store.dispatch("appMesageShow", {
                    type: "error",
                    text: "Не хватает данных для сохрания в b24",
                });
            }

            /* обновляем данные компонента */

            this.isLoading = false;
            this.values = values;
            this.weeklyFile.fileContent = fileContent;
        },
    },
};
</script>

<style lang="scss">
.app-settings {
    @include preloading($color-accent, $color-white);
    padding: calc($gap / 2) $gap;

    &__block {
        margin-bottom: calc($gap / 2);

        &:last-child {
            margin-bottom: 0;
        }
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
    }

    &__label {
        width: 30%;
        text-align: right;
        padding-right: calc($gap / 4);
    }

    &__input {
        width: 40%;
        margin-right: 30%;
    }
}
</style>
