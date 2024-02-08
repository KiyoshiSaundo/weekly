<template>
    <div
        class="report-weekly"
        :class="{ 'is-loading': !isAppLoading && isLoading }"
    >
        <div v-if="isAppLoading">Загрузка</div>
        <div
            v-if="!isAppLoading && !isEmpty && !isFirstLoading"
            class="report-weekly__body"
        >
            <span
                class="report-weekly__toggle"
                :class="{ 'is-collapse': collapsedAll }"
                @click="toggleAll"
            >
                <SvgIcon
                    name="arrow"
                    class="report-weekly__toggle-arrow"
                ></SvgIcon>
                <span>
                    {{ collapsedAll ? "Развернуть все" : "Свернуть все" }}
                </span>
            </span>
            <WeeklyGroup
                v-for="group in result"
                :key="group.id"
                :group="group"
                :collapsedAll="collapsedAll"
                @checked="selectGroup"
            />
        </div>
        <div v-if="!isAppLoading && !isEmpty" class="report-weekly__aside">
            <div v-if="!isFirstLoading">
                <b>
                    Всего затрачено:
                    <span class="mono">{{ formatTime(summTotal) }}</span>
                </b>
            </div>
            <div v-if="!isFirstLoading && summChecked">
                Сумма выбранных:
                <span class="mono">{{ formatTime(summChecked) }}</span>
            </div>
        </div>
        <div
            v-if="!isAppLoading && isEmpty && !isFirstLoading"
            class="report-weekly__empty"
        >
            Данных нет
        </div>
    </div>
</template>

<script>
import { formatDate, formatTime, getObjectWithKey } from "@/functions";
import { getApiTimes, getApiTasks, getApiGroups } from "@/api";

import SvgIcon from "@/components/SvgIcon.vue";
import WeeklyGroup from "@/components/WeeklyGroup.vue";

export default {
    components: {
        SvgIcon,
        WeeklyGroup,
    },
    data() {
        return {
            isLoading: true,
            isFirstLoading: true,
            apiUrl: this.$store.state.appApiUrl,
            result: [],
            selectedGroups: [],
            collapsedAll: false,
        };
    },
    computed: {
        isAppLoading() {
            return this.$store.state.appLoading;
        },
        filter() {
            return {
                userId:
                    this.$store.state.weeklyUserId ||
                    this.$store.state.appUserId,
                start: new Date(this.$store.state.weeklyStart),
                end: new Date(this.$store.state.weeklyEnd),
                hash: this.$store.state.weeklyTimestamp,
            };
        },
        isEmpty() {
            return !Object.keys(this.result).length;
        },
        summChecked() {
            return Object.values(this.result).reduce((prev, curr) => {
                return (prev += this.selectedGroups[curr.id] ? curr.time : 0);
            }, 0);
        },
        summTotal() {
            return Object.values(this.result).reduce((prev, curr) => {
                return (prev += curr.time);
            }, 0);
        },
    },
    async mounted() {
        if (!this.isAppLoading) {
            this.result = await this.getResult();
        }
    },
    watch: {
        async isAppLoading() {
            this.result = await this.getResult();
        },
        async filter() {
            this.result = await this.getResult();
        },
        result() {
            this.isLoading = false;
            this.isFirstLoading = false;
        },
    },
    methods: {
        formatDate,
        formatTime,

        async getResult() {
            if (!this.apiUrl || !this.filter.userId) return {};
            this.isLoading = true;

            let [apiTime, apiTasks, apiGroups] = await this.getApiData();
            apiGroups = getObjectWithKey(apiGroups, "ID");
            apiTasks = getObjectWithKey(apiTasks, "id");

            let result = {};
            apiTime.forEach((item) => {
                let taskId = item.TASK_ID || 0,
                    apiTask = apiTasks[taskId] || false,
                    groupId = apiTask.groupId || 0,
                    apiGroup = apiGroups[groupId] || false;

                // группа
                let group = result[groupId] || {
                    id: groupId || 0,
                    id4user: apiGroup.ID || false,
                    name: apiGroup.NAME || "Нет доступа к группе",
                    time: 0,
                    tasks: {},
                };
                group.time += parseInt(item.SECONDS);

                // задача
                let task = group.tasks[taskId] || {
                    id: taskId || 0,
                    id4user: apiTask.id || false,
                    name: apiTask.title || "Нет доступа к задаче",
                    time: 0,
                };
                task.time += parseInt(item.SECONDS);

                result[groupId] = group;
                result[groupId].tasks[taskId] = task;
            });

            return result;
        },

        async getApiData() {
            let timeItems = [],
                taskItems = [],
                groupItems = [];

            // время
            timeItems = await getApiTimes(this.apiUrl, {
                USER_ID: this.filter.userId,
                ">=CREATED_DATE": formatDate(this.filter.start) + " 00:00:00",
                "<=CREATED_DATE": formatDate(this.filter.end) + " 23:59:59",
            });
            // задачи
            if (timeItems.length) {
                taskItems = await getApiTasks(this.apiUrl, {
                    ID: timeItems.map((item) => item.TASK_ID),
                });
            }
            // группы
            if (taskItems.length) {
                groupItems = await getApiGroups(this.apiUrl, {
                    ID: taskItems.map((item) => item.groupId),
                });
            }

            return [timeItems, taskItems, groupItems];
        },

        selectGroup(a, b) {
            this.selectedGroups[a] = b;
        },
        toggleAll() {
            this.collapsedAll = !this.collapsedAll;
        },
    },
};
</script>

<style lang="scss">
.report-weekly {
    @include preloading($color-accent, $color-white);
    padding: calc($gap / 2) $gap;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    flex-wrap: wrap;

    @media print {
        align-items: start;
        flex-grow: 0;
    }

    &__body {
        margin: -#{calc($gap / 2)} 0;
        padding: calc($gap / 2) 0;
        width: 70%;
        padding-right: $gap;

        @media print {
            order: 2;
            width: 100%;
            margin: 0;
            margin-top: calc($gap / 2);
            padding-right: 0;
        }
    }

    &__aside {
        margin: -#{calc($gap / 2)} 0;
        padding: calc($gap / 2) 0;
        width: 30%;
        padding-left: $gap;
        border-left: $border;

        @media print {
            order: 1;
            width: 100%;
            border-left: 0;
            border-bottom: $border;
            padding-left: 0;
        }
    }

    &__toggle {
        display: inline-block;
        cursor: pointer;
        margin-bottom: calc($gap / 4);
        user-select: none;
        padding-left: calc(22px + 5px);
        position: relative;

        &:hover {
            color: $color-accent;
        }

        @media print {
            display: none;
        }
    }

    &__toggle-arrow {
        width: 22px;
        height: 22px;
        transform: rotate(90deg);
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;

        &:hover {
            color: $color-accent;
        }

        .is-collapse & {
            transform: rotate(0);
        }

        @media print {
            display: none;
        }
    }
}
</style>
