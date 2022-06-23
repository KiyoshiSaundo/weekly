<template>
    <div class="weekly" :class="{'is-loading': isLoading}">
        <div class="weekly__refresh" @click="getResult" title="Обновить данные">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"
                />
            </svg>
        </div>
        <div class="weekly__items" v-if="result.length">
            <div class="weekly__item" v-for="group in result" :key="group.id">
                <label class="weekly__label">
                    <input class="weekly__checkbox" type="checkbox" value="group.id" v-model="group.selected" />
                    <b>{{ group.name }}</b> ({{ formatTime(group.seconds) }})
                </label>
                <div class="weekly__tasks">
                    <div class="weekly__task" v-for="task in group.tasks" :key="task.id">
                        {{ task.id }} - {{ task.name }} ({{ formatTime(task.seconds) }})
                    </div>
                </div>
            </div>
        </div>
        <div class="weekly__footer" v-if="result.length">
            <div class="weekly__checked">Сумма выбранных: {{ formatTime(summChecked) }}</div>
            <div class="weekly__total">Всего затрачено: {{ formatTime(summTotal) }}</div>
        </div>
        <div class="weekly__empty" v-if="!result.length">Данных нет</div>
    </div>
</template>

<script>
import {formatDate, formatTime} from '@/functions';
import {getApiTimes, getApiTasks, getApiGroups} from '@/api';

export default {
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
                let gr = result[task.groupId],
                    grId = gr ? gr.id : 0;
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
            let itemsTime = [];
            let filter = {
                USER_ID: this.settings.userId,
                '>=CREATED_DATE': formatDate(this.settings.dateFrom) + ' 00:00:00',
                '<=CREATED_DATE': formatDate(this.settings.dateTo) + ' 23:59:59',
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
