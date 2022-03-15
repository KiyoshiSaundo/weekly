<template>
    <div class="groups">
        <div class="groups__item" v-for="group in result" :key="group.id">
            <label class="groups__label">
                <input
                    class="groups__checkbox"
                    type="checkbox"
                    value="group.id"
                    v-model="group.selected"
                />
                <span class="groups__name">{{ group.name }}</span>
                <span class="groups__time"
                    >({{ formatTime(group.seconds) }})</span
                >
            </label>
            <div class="groups__tasks">
                <div
                    class="groups__task"
                    v-for="task in group.tasks"
                    :key="task.id"
                >
                    <TaskItem :fields="task" />
                </div>
            </div>
        </div>
        <div class="groups__footer">
            <div class="groups__checked">
                Сумма выбранных: {{ formatTime(checkedSumm) }}
            </div>
            <div class="groups__total">
                Всего затрачено: {{ formatTime(totalSumm) }}
            </div>
        </div>
    </div>
</template>

<script>
import {formatDate, formatTime} from '@/functions';
import {getApiTimes, getApiTasks, getApiGroups} from '@/api';
import TaskItem from '@/components/TaskItem.vue';

export default {
    name: 'Tasks',
    components: {
        TaskItem,
    },
    data() {
        return {
            result: {},
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
        checkedSumm() {
            let r = 0;
            for (const [id, item] of Object.entries(this.result)) {
                if (item.selected === true) r += item.seconds;
            }
            return r;
        },
        totalSumm() {
            let r = 0;
            for (const [id, item] of Object.entries(this.result)) {
                r += item.seconds;
            }
            return r;
        },
    },
    watch: {
        settings: {
            handler(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.getData();
                }
            },
            deep: true,
        },
    },
    created() {
        this.getData();
    },
    methods: {
        formatDate,
        formatTime,

        getData() {
            let groups = {},
                tasks = {},
                times = {};

            // записи о затраченном времени
            getApiTimes(this.$store.state.apiUrl, {
                USER_ID: this.$store.state.userId,
                '>=CREATED_DATE': formatDate(this.$store.state.dateFrom),
                '<=CREATED_DATE': formatDate(this.$store.state.dateTo),
            })
                .then((res) => {
                    let filter = [];
                    res.data.result.forEach((item) => {
                        times[item.ID] = {
                            id: item.ID,
                            taskId: item.TASK_ID,
                            seconds: parseFloat(item.SECONDS),
                        };
                        filter[filter.length] = item.TASK_ID;
                    });

                    // записи о задачах
                    return getApiTasks(this.$store.state.apiUrl, {
                        ID: filter,
                    });
                })
                .then((res) => {
                    let filter = [];
                    res.data.result.tasks.forEach((item) => {
                        tasks[item.id] = {
                            id: item.id,
                            name: item.title,
                            groupId: item.groupId,
                            seconds: 0,
                        };
                        filter[filter.length] = item.groupId;
                    });

                    // записи о группах
                    return getApiGroups(this.$store.state.apiUrl, {
                        ID: filter,
                    });
                })
                .then((res) => {
                    res.data.result.forEach((item) => {
                        groups[item.ID] = {
                            id: item.ID,
                            name: item.NAME,
                            tasks: {},
                            seconds: 0,
                            selected: this.result[item.ID]
                                ? this.result[item.ID].selected
                                : false,
                        };
                    });

                    // собираем все вместе
                    for (const [id, item] of Object.entries(times)) {
                        tasks[item.taskId].seconds += item.seconds;
                    }
                    for (const [id, item] of Object.entries(tasks)) {
                        if (groups[item.groupId] === undefined) {
                            groups[item.groupId] = {
                                id: item.groupId,
                                name: 'Нет доступа к группе',
                                tasks: {},
                                seconds: 0,
                            };
                        }
                        groups[item.groupId].seconds += item.seconds;
                        groups[item.groupId].tasks[id] = item;
                    }

                    this.result = groups;
                });
        },
    },
};
</script>

<style lang="scss">
.groups {
    &__item {
        margin-bottom: 15px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__label {
        line-height: 1;
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
    }

    &__checkbox {
        margin-right: 10px;
    }

    &__name {
        font-weight: 700;
    }

    &__time {
        margin-left: 5px;
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
        font-weight: 700;
    }
}
</style>
