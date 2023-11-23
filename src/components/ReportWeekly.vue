<template>
    <div class="weekly" :class="{ 'is-loading': isLoading }">
        <div class="weekly__header">
            <span class="weekly__collapse-all" @click="collapseAll">
                <IconArrow />
                <span>Свернуть все</span>
            </span>
        </div>
        <IconRefresh
            class="weekly__refresh"
            title="Обновить данные"
            @click="getResult"
        />
        <div v-if="result.length" class="weekly__items">
            <div v-for="group in result" :key="group.id" class="weekly__item">
                <div class="weekly__label">
                    <IconArrow
                        class="weekly__collapse"
                        title="Свернуть/развернуть"
                        @click="collapseItems"
                    />
                    <b>{{ group.name }}</b>
                    ({{ formatTime(group.seconds) }})
                    <input
                        v-model="group.selected"
                        class="weekly__checkbox"
                        type="checkbox"
                        value="group.id"
                    />
                </div>
                <div class="weekly__tasks">
                    <div
                        v-for="task in group.tasks"
                        :key="task.id"
                        class="weekly__task"
                    >
                        <a :href="task.link" target="_blank">
                            {{ task.id }}
                        </a>
                        - {{ task.name }} ({{ formatTime(task.seconds) }})
                    </div>
                </div>
            </div>
        </div>
        <div v-if="result.length" class="weekly__footer">
            <div class="weekly__checked">
                Сумма выбранных: {{ formatTime(summChecked) }}
            </div>
            <div class="weekly__total">
                Всего затрачено: {{ formatTime(summTotal) }}
            </div>
        </div>
        <div v-if="!result.length" class="weekly__empty">Данных нет</div>
    </div>
</template>

<script>
import IconRefresh from "@/components/IconRefresh.vue";
import IconArrow from "@/components/IconArrow.vue";

import { formatDate, formatTime } from "@/functions";
import { getApiTimes, getApiTasks, getApiGroups } from "@/api";

export default {
    components: {
        IconRefresh,
        IconArrow,
    },
    data() {
        return {
            result: [],
            isLoading: false,
        };
    },
    computed: {
        settings() {
            return {
                apiUrl: this.$store.state.weeklyApiUrl,
                userId: this.$store.state.weeklyUserId,
                dateFrom: this.$store.state.weeklyDateFrom,
                dateTo: this.$store.state.weeklyDateTo,
            };
        },
        summChecked() {
            return this.result.reduce((prev, curr) => {
                return (prev += curr.selected ? curr.seconds : 0);
            }, 0);
        },
        summTotal() {
            return this.result.reduce((prev, curr) => {
                return (prev += curr.seconds);
            }, 0);
        },
    },
    created() {
        this.getResult();
    },
    watch: {
        settings() {
            this.getResult();
        },
        result() {
            this.isLoading = false;
        },
    },
    methods: {
        formatDate,
        formatTime,

        async getResult() {
            if (!this.settings.apiUrl || !this.settings.userId) return false;

            this.isLoading = true;

            const [itemsTime, itemsTask, itemsGroup] =
                await this.getResultData();

            let result = {
                0: {
                    id: 0,
                    name: "Нет доступа к группе",
                    seconds: 0,
                    selected: this.result[0] ? this.result[0].selected : false,
                    tasks: {
                        0: {
                            id: 0,
                            name: "Нет доступа к задаче или задача удалена",
                            seconds: 0,
                        },
                    },
                },
            };

            // группы
            itemsGroup.forEach((group) => {
                result[group.ID] = {
                    id: group.ID,
                    name: group.NAME,
                    seconds: 0,
                    selected: this.result[group.ID]
                        ? this.result[group.ID].selected
                        : false,
                    tasks: {},
                };
            });

            // задачи
            let domain = this.settings.apiUrl.split(/\/+/);
            domain = domain[0] + "//" + domain[1];
            let task2group = { 0: 0 }; // задача => группа
            itemsTask.forEach((task) => {
                let gr = result[task.groupId],
                    grId = gr ? gr.id : 0;
                task2group[task.id] = grId;
                result[grId].tasks[task.id] = {
                    id: task.id,
                    name: task.title,
                    seconds: 0,
                    link:
                        domain +
                        "/company/personal/user/" +
                        this.settings.userId +
                        "/tasks/task/view/" +
                        task.id +
                        "/",
                };
            });

            // время
            itemsTime.forEach((time) => {
                let gr = result[task2group[time.TASK_ID]],
                    grId = gr ? gr.id : 0,
                    ts = result[grId].tasks[time.TASK_ID],
                    tsId = ts ? ts.id : 0;

                result[grId].seconds += parseInt(time.SECONDS);
                result[grId].tasks[tsId].seconds += parseInt(time.SECONDS);
            });

            // итог
            this.result = Object.values(result).filter((group) => {
                group.tasks = Object.values(group.tasks).filter((task) => {
                    return task.seconds;
                });
                return group.seconds;
            });
        },
        async getResultData() {
            // записи о потраченном времени
            let itemsTime = [];
            let filter = {
                USER_ID: this.settings.userId,
                ">=CREATED_DATE":
                    formatDate(this.settings.dateFrom) + " 00:00:00",
                "<=CREATED_DATE":
                    formatDate(this.settings.dateTo) + " 23:59:59",
            };
            if (filter.USER_ID) {
                itemsTime = await getApiTimes(this.settings.apiUrl, filter);
            }

            // записи о задачах
            let itemsTask = [];
            filter = {
                ID: itemsTime.map((item) => {
                    return item.TASK_ID;
                }),
            };
            if (filter.ID.length) {
                itemsTask = await getApiTasks(this.settings.apiUrl, filter);
            }

            // информация по группам
            let itemsGroup = [];
            filter = {
                ID: itemsTask.map((item) => {
                    return item.groupId;
                }),
            };
            if (filter.ID.length) {
                itemsGroup = await getApiGroups(this.settings.apiUrl, filter);
            }

            return [itemsTime, itemsTask, itemsGroup];
        },

        collapseItems(e) {
            e.target.closest(".weekly__item").classList.toggle("is-collapse");
        },

        collapseAll(e) {
            let btnAll = e.target.closest(".weekly__collapse-all");
            let needOpen = btnAll.classList.contains("is-collapse");

            if (needOpen) {
                btnAll.classList.remove("is-collapse");
                btnAll.querySelector("span").innerText = "Свернуть все";
            } else {
                btnAll.classList.add("is-collapse");
                btnAll.querySelector("span").innerText = "Развернуть все";
            }
            document.querySelectorAll(".weekly__item").forEach((item) => {
                if (needOpen) {
                    item.classList.remove("is-collapse");
                } else {
                    item.classList.add("is-collapse");
                }
            });
        },
    },
};
</script>

<style lang="scss">
.weekly {
    position: relative;

    &__refresh {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin: 0;
        padding: 0;
        color: $color;

        &:hover {
            cursor: pointer;
            color: rgba($color, 0.5);
        }
    }

    &__header {
        margin-bottom: 20px;
    }

    &__item {
        margin-bottom: 15px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__label {
        line-height: 1;

        input {
            margin-left: 5px;
        }
    }

    &__checkbox {
        margin-right: 10px;
    }

    &__collapse {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 5px;
        cursor: pointer;
        transform: rotate(90deg);
        user-select: none;

        .is-collapse & {
            transform: rotate(0);
        }
    }

    &__collapse-all {
        cursor: pointer;
        user-select: none;

        svg {
            width: 12px;
            height: 12px;
            margin-right: 5px;
            transform: rotate(90deg);
        }

        &.is-collapse svg {
            transform: rotate(0);
        }
    }

    &__tasks {
        margin-top: 5px;
        padding-left: 17px;
        display: block;

        .is-collapse & {
            display: none;
        }
    }

    &__task {
        a {
            color: $color;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    &__footer {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid $color-divide;
    }

    &__checked {
        margin-bottom: 5px;
    }

    &__total {
        font-weight: 500;
    }

    &__empty {
        text-align: center;
        font-weight: 500;
    }
}
</style>
