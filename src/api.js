// затраченное время по фильтру
export const getApiTimes = async (url, filter) => {
    return fetch(url + '/task.elapseditem.getlist', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order: {ID: 'asc'},
            filter: filter,
            select: ['ID', 'TASK_ID', 'SECONDS'],
            params: {
                NAV_PARAMS: {nPageSize: 0},
            },
        }),
    }).then((response) => response.json());
};

// список задач по фильтру
export const getApiTasks = async (url, filter) => {
    return fetch(url + '/tasks.task.list', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order: {ID: 'asc'},
            filter: filter,
            select: ['ID', 'TITLE', 'GROUP_ID', 'TIME_ESTIMATE'],
            params: {NAV_PARAMS: {nPageSize: 0}},
        }),
    }).then((response) => response.json());
};

// список групп по фильтруs
export const getApiGroups = async (url, filter) => {
    return fetch(url + '/sonet_group.get', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ORDER: {ID: 'asc'},
            FILTER: filter,
        }),
    }).then((response) => response.json());
};
