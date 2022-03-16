<template>
    <div class="groups">
        <div class="groups__refresh" v-if="resultExist" @click="getTimes">
            Обновить данные
        </div>
        <div class="groups__items" v-if="resultExist">
            <div class="groups__item" v-for="group in result" :key="group.id">
                <label class="groups__label">
                    <input
                        class="groups__checkbox"
                        type="checkbox"
                        value="group.id"
                        v-model="group.selected"
                    />
                    <b>{{ group.name }}</b> ({{ formatTime(group.seconds) }})
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
        </div>
        <div class="groups__footer" v-if="resultExist">
            <div class="groups__checked">
                Сумма выбранных: {{ formatTime(checkedSumm) }}
            </div>
            <div class="groups__total">
                Всего затрачено: {{ formatTime(totalSumm) }}
            </div>
        </div>
        <div class="groups__empty" v-if="!resultExist">Данных нет</div>
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
            times: {},
            tasks: {},
            groups: {},
            result: {},
            resultExist: false,
            isLoading: true
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
                this.getTimes();
            },
            deep: true,
        },
        times: {
            handler(newValue, oldValue) {
                this.getTasks();
            },
            deep: true,
        },
        tasks: {
            handler(newValue, oldValue) {
                this.getGroups();
            },
            deep: true,
        },
        groups: {
            handler(newValue, oldValue) {
                this.getResult();
            },
            deep: true,
        },
    },
    created() {
        // this.getData();
        this.getTimes();
    },
    methods: {
        formatDate,
        formatTime,

        getTimes() {
            console.log('run getTimes()');
            this.setLoadingStart();
            let times = {};
            let filter = {
                USER_ID: this.$store.state.userId,
                '>=CREATED_DATE': formatDate(this.$store.state.dateFrom),
                '<=CREATED_DATE': formatDate(this.$store.state.dateTo),
            };
            if (
                filter['USER_ID'] &&
                filter['>=CREATED_DATE'] &&
                filter['<=CREATED_DATE']
            ) {
                getApiTimes(this.$store.state.apiUrl, filter).then((res) => {
                    res.data.result.forEach((item) => {
                        times[item.ID] = {
                            id: item.ID,
                            taskId: item.TASK_ID,
                            seconds: parseFloat(item.SECONDS),
                        };
                    });
                    this.times = times;
                });
            } else {
                this.times = times;
            }
        },
        getTasks() {
            console.log('run getTasks()');
            let tasks = {};
            let filter = [];
            for (const [id, el] of Object.entries(this.times)) {
                filter[filter.length] = el.taskId;
            }
            if (filter.length) {
                getApiTasks(this.$store.state.apiUrl, {
                    ID: filter,
                }).then((res) => {
                    res.data.result.tasks.forEach((item) => {
                        tasks[item.id] = {
                            id: item.id,
                            name: item.title,
                            groupId: item.groupId,
                            seconds: 0,
                        };
                    });
                    this.tasks = tasks;
                });
            } else {
                this.tasks = tasks;
            }
        },
        getGroups() {
            console.log('run getGroups()');
            let groups = {};
            let filter = [];
            for (const [id, el] of Object.entries(this.tasks)) {
                filter[filter.length] = el.groupId;
            }
            if (filter.length) {
                getApiGroups(this.$store.state.apiUrl, {
                    ID: filter,
                }).then((res) => {
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
                    this.groups = groups;
                });
            } else {
                this.groups = groups;
            }
        },

        getResult() {
            this.setLoadingEnd();

            if (Object.keys(this.times).length === 0) {
                this.resultExist = false;
                this.result = {};
            } else {
                let result = {};

                // группы
                result[0] = {
                    id: 0,
                    name: 'Нет доступа к группе',
                    tasks: {},
                    seconds: 0,
                };
                for (const [id, item] of Object.entries(this.groups)) {
                    result[item.id] = Object.assign({}, item);
                }

                // задачи
                for (const [id, item] of Object.entries(this.tasks)) {
                    if (result[item.groupId] === undefined) {
                        item.groupId = 0;
                    }
                    result[item.groupId].tasks[item.id] = Object.assign(
                        {},
                        item
                    );
                }

                // время
                for (const [id, item] of Object.entries(this.times)) {
                    let grId = this.tasks[item.taskId].groupId;
                    let tsId = item.taskId;

                    result[grId].seconds += item.seconds;
                    result[grId].tasks[tsId].seconds += item.seconds;
                }

                this.resultExist = true;
                this.result = result;
            }
        },

        setLoadingStart()
        {
            this.$store.commit('loadingChange', {
                isLoading: true
            });
        },
        setLoadingEnd()
        {
            this.$store.commit('loadingChange', {
                isLoading: false
            });
        },

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
