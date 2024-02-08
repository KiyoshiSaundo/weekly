<template>
    <div class="app-settings">
        <!-- <div class="app-settings__block">
            <div class="app-settings__heading">Сохранение на битрикс.диск</div>
            <div class="app-settings__items">
                <div class="app-settings__item">
                    <input type="checkbox">
                    <label class="app-settings__label">Данные о днях</label>
                </div>
            </div>
        </div> -->
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
        /*
        // хранилище
        const storage = await fetch(this.apiUrl + "/disk.storage.getlist", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: {
                    ENTITY_TYPE: "user",
                },
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                return response.result;
            });
        console.log("storage", storage);

        // файл недельки
        const storageFiles = await fetch(
            this.apiUrl + "/disk.storage.getchildren",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: storage[0].ID,
                    filter: {
                        NAME: "weekly.data",
                        TYPE: "file",
                    },
                }),
            }
        )
            .then((response) => response.json())
            .then((response) => {
                return response.result;
            });
        console.log("files", storageFiles);

        const fileContent = {
            param1: "test",
            param2: 123,
        };
        const fileContent2 = {
            param1: "test2",
            param2: 222,
        };

        let file = false;
        if (!storageFiles[0]) {
            console.log("create");
            file = await fetch(this.apiUrl + "/disk.storage.uploadfile", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: storage[0].ID,
                    fileContent: btoa(JSON.stringify(fileContent)),
                    data: {
                        NAME: "weekly.data",
                    },
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    return response.result;
                });
        } else {
            console.log("exist");
            file = await fetch(this.apiUrl + "/disk.file.uploadversion", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: storageFiles[0].ID,
                    fileContent: btoa(JSON.stringify(fileContent2)),
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    return response.result;
                });
        }
        console.log(file);

        const fileData = await fetch(file.DOWNLOAD_URL, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                return response;
            });

        console.log(fileData);
        */
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
        font-size: 20px;
        font-weight: 600;
        color: $color-heading;
        line-height: 1.2;
        margin-bottom: calc($gap / 2);
    }

    &__item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: calc($gap / 2);
        // opacity: 0.5;
        // pointer-events: none;
    }

    &__input {
        max-width: 400px;
    }
}
</style>
