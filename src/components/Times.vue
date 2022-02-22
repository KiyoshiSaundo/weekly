<template>
    <ul>
        <li v-for="group in result" :key="group.id">
            <b>{{ group.name }} - {{ timeFormat(group.seconds) }}</b>
            <ul>
                <li v-for="task in group.tasks" :key="task.id">
                    {{ task.name }} - {{ timeFormat(task.seconds) }}
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import {getTimes, getTasks, getGroups} from '@/api';

export default {
    name: 'Tasks',
    data() {
        return {
            userId: 59,
            dateStart: '21.02.2022',
            dateEnd: '27.02.2022',
            result: {},
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            let groups = {},
                tasks = {},
                times = {};

            let url = new URL(window.location.href);
            this.dateStart = url.searchParams.get('start') || this.dateStart;
            this.dateEnd = url.searchParams.get('end') || this.dateEnd;

            // записи о затраченном времени
            getTimes({
                USER_ID: this.userId,
                '>=CREATED_DATE': this.dateStart,
                '<=CREATED_DATE': this.dateEnd,
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
                    return getTasks({
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
                    return getGroups({
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
        timeFormat(seconds) {
            let h, m, s;

            h = Math.floor(seconds / 3600);
            m = Math.floor(seconds / 60) - h * 60;
            s = seconds % 60;

            return [
                h.toString().padStart(2, '0'),
                m.toString().padStart(2, '0'),
                s.toString().padStart(2, '0'),
            ].join(':');
        },
    },
};
</script>
