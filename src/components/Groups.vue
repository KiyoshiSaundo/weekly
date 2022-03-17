<template>
    <div class="groups">
        <div class="groups__refresh" v-if="resultExist" @click="getData">
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
            result: {},
            resultExist: false,
            isLoading: true,
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
            handler() {
                this.getData();
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
            this.setLoadingStart();

            let allResult = {},
                allTimes = {},
                allTasks = {},
                allGroups = {};

            if (
                !this.$store.state.userId ||
                !this.$store.state.dateFrom ||
                !this.$store.state.dateTo
            ) {
                this.setLoadingEnd();
                return false;
            }

            let apiFilter = {
                USER_ID: this.$store.state.userId,
                '>=CREATED_DATE': formatDate(this.$store.state.dateFrom),
                '<=CREATED_DATE': formatDate(this.$store.state.dateTo),
                // '>=CREATED_DATE': '18.03.2022',
                // '<=CREATED_DATE': '18.03.2022',
            };

            // промис времени
            getApiTimes(this.$store.state.apiUrl, apiFilter)
                // данные по времени из промиса
                .then((res) => {
                    if (res != undefined) {
                        return res.result;
                    }
                })
                // обрабатываем данные по времени
                .then((times) => {
                    if (times != undefined && times.length) {
                        let apiFilter = {
                            ID: [],
                        };
                        times.forEach((item) => {
                            apiFilter.ID[apiFilter.ID.length] = item.TASK_ID;
                            allTimes[item.ID] = {
                                id: item.ID,
                                taskId: item.TASK_ID,
                                seconds: parseFloat(item.SECONDS),
                            };
                        });
                        apiFilter.ID = apiFilter.ID.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });
                        // промис задач
                        return getApiTasks(this.$store.state.apiUrl, apiFilter);
                    }
                })
                // данные по задачам из промиса
                .then((res) => {
                    if (res != undefined) {
                        return res.result.tasks;
                    }
                })
                // обрабатываем данные по задачам
                .then((tasks) => {
                    if (tasks != undefined && tasks.length) {
                        let apiFilter = {
                            ID: [],
                        };
                        tasks.forEach((item) => {
                            apiFilter.ID[apiFilter.ID.length] = item.groupId;
                            allTasks[item.id] = {
                                id: item.id,
                                name: item.title,
                                groupId: item.groupId,
                                seconds: 0,
                            };
                        });
                        apiFilter.ID = apiFilter.ID.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });
                        // промис групп
                        return getApiGroups(
                            this.$store.state.apiUrl,
                            apiFilter
                        );
                    }
                })
                // данные по группам из промиса
                .then((res) => {
                    if (res != undefined) {
                        return res.result;
                    }
                })
                // обрабатываем данные по группам
                .then((groups) => {
                    if (groups != undefined && groups.length) {
                        groups.forEach((item) => {
                            allGroups[item.ID] = {
                                id: item.ID,
                                name: item.NAME,
                                tasks: {},
                                seconds: 0,
                                selected: this.result[item.ID]
                                    ? this.result[item.ID].selected
                                    : false,
                            };
                        });
                    }
                })
                // собираем все вместе
                .then((res) => {
                    // группы
                    allResult[0] = {
                        id: 0,
                        name: 'Нет доступа к группе',
                        tasks: {},
                        seconds: 0,
                        selected: this.result[0]
                            ? this.result[0].selected
                            : false,
                    };
                    for (const [id, item] of Object.entries(allGroups)) {
                        allResult[item.id] = item;
                    }

                    // задачи
                    for (const [id, item] of Object.entries(allTasks)) {
                        let grId = allResult[item.groupId] ? allResult[item.groupId].id : 0;
                        allResult[grId].tasks[item.id] = item;

                        // если к группе из задачи нет доступа - заменяем на 0
                        allTasks[id].groupId = grId;
                    }

                    // время
                    for (const [id, item] of Object.entries(allTimes)) {
                        let grId = allTasks[item.taskId].groupId;
                        let tsId = item.taskId;

                        allResult[grId].seconds += item.seconds;
                        allResult[grId].tasks[tsId].seconds += item.seconds;
                    }

                    // удаляем пустую группу, если нет задач
                    if (Object.keys(allResult[0].tasks).length == 0) {
                        delete allResult[0];
                    }

                    this.result = allResult;
                    this.resultExist = Object.keys(allResult).length;

                    this.setLoadingEnd();
                });
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
