import axios from 'axios';

// затраченное время по фильтру
export const getApiTimes = async (url, filter) => {
    // return fetch(url + '/task.elapseditem.getlist', {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         order: {ID: 'asc'},
    //         filter: filter,
    //         select: ['ID', 'TASK_ID', 'SECONDS'],
    //         params: {
    //             NAV_PARAMS: {nPageSize: 0},
    //         },
    //     }),
    // }).then((response) => response.json());
    return axios.post(url + '/task.elapseditem.getlist', {
        order: {ID: 'asc'},
        filter: filter,
        select: ['ID', 'TASK_ID', 'SECONDS'],
        params: {
            NAV_PARAMS: {nPageSize: 0},
        },
    });
};

// список задач по фильтру
export const getApiTasks = async (url, filter) => {
    return axios.post(url + '/tasks.task.list', {
        order: {ID: 'asc'},
        filter: filter,
        select: ['ID', 'TITLE', 'GROUP_ID', 'TIME_ESTIMATE'],
        params: {NAV_PARAMS: {nPageSize: 0}},
    });
};

// список групп по фильтруs
export const getApiGroups = async (url, filter) => {
    return axios.post(url + '/sonet_group.get', {
        ORDER: {ID: 'asc'},
        FILTER: filter,
    });
};
