<template>
    <div class="groups">
        <div class="groups__refresh" @click="getResult">Обновить данные</div>
        <div class="groups__items" v-if="result.length">
            <div class="groups__item" v-for="group in result" :key="group.id">
                <label class="groups__label">
                    <input class="groups__checkbox" type="checkbox" value="group.id" v-model="group.selected" />
                    <b>{{ group.name }}</b> ({{ formatTime(group.seconds) }})
                </label>
                <div class="groups__tasks">
                    <div class="groups__task" v-for="task in group.tasks" :key="task.id">
                        <TaskItem :fields="task" />
                    </div>
                </div>
            </div>
        </div>
        <div class="groups__footer" v-if="result.length">
            <div class="groups__checked">Сумма выбранных: {{ formatTime(summChecked) }}</div>
            <div class="groups__total">Всего затрачено: {{ formatTime(summTotal) }}</div>
        </div>
        <div class="groups__empty" v-if="!result.length">Данных нет</div>
    </div>
</template>

<script>
import {formatDate, formatTime} from '@/functions';
import {getApiTimes, getApiTasks, getApiGroups} from '@/api';
import TaskItem from '@/components/TaskItem.vue';

export default {
    components: {
        TaskItem,
    },
    data() {
        return {
            result: [],
        };
    },
    computed: {
        settings() {
            return {
                apiUrl: this.$store.state.apiUrl,
                userId: this.$store.state.userId,
                dateFrom: this.$store.state.dateFrom,
                dateTo: this.$store.state.dateTo,
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
            this.setLoadingEnd();
        },
    },
    methods: {
        formatDate,
        formatTime,

        async getResult() {
            this.setLoadingStart();

            const [itemsTime, itemsTask, itemsGroup] = await this.getResultData();

            let result = {
                0: {
                    id: 0,
                    name: 'Нет доступа к группе',
                    seconds: 0,
                    selected: this.result[0] ? this.result[0].selected : false,
                    tasks: {
                        0: {
                            id: 0,
                            name: 'Нет доступа к задаче или задача удалена',
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
                    selected: this.result[group.ID] ? this.result[group.ID].selected : false,
                    tasks: {},
                };
            });

            // задачи
            let task2group = {0: 0}; // задача => группа
            itemsTask.forEach((task) => {
                let grId = result[task.groupId].id || 0;
                task2group[task.id] = grId;
                result[grId].tasks[task.id] = {
                    id: task.id,
                    name: task.title,
                    seconds: 0,
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
            let filter = {
                USER_ID: this.$store.state.userId,
                '>=CREATED_DATE': formatDate(this.$store.state.dateFrom) + ' 00:00:00',
                '<=CREATED_DATE': formatDate(this.$store.state.dateTo) + ' 23:59:59',
            };
            let itemsTime = await getApiTimes(this.$store.state.apiUrl, filter);

            // записи о задачах
            let itemsTask = [];
            filter = {
                ID: itemsTime.map((item) => {
                    return item.TASK_ID;
                }),
            };
            if (filter.ID.length) {
                itemsTask = await getApiTasks(this.$store.state.apiUrl, filter);
            }

            // информация по группам
            let itemsGroup = [];
            filter = {
                ID: itemsTask.map((item) => {
                    return item.groupId;
                }),
            };
            if (filter.ID.length) {
                itemsGroup = await getApiGroups(this.$store.state.apiUrl, filter);
            }

            return [itemsTime, itemsTask, itemsGroup];
        },

        setLoadingStart() {
            this.$store.commit('loadingChange', {
                isLoading: true,
            });
        },
        setLoadingEnd() {
            this.$store.commit('loadingChange', {
                isLoading: false,
            });
        },
    },
};
</script>

<style lang="scss">
.groups {
    position: relative;

    &__refresh {
        position: absolute;
        top: 0;
        right: 0;
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

    &__item {
        margin-bottom: 15px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__label {
        line-height: 1;
    }

    &__checkbox {
        margin-right: 10px;
    }

    &__tasks {
        margin-top: 5px;
        padding-left: 30px;
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
