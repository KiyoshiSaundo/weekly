// все записи из постранички
const getAll = async (url, body) => {
    const get = (url, body, next) => {
        body.start = next;
        return fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => response.json());
    };

    let result = [];
    let next = 0;
    let total = null;

    while (total === null || next < total) {
        let response = get(url, body, next);
        if (total === null) {
            let res = await response;
            total = parseInt(res.total);
        }
        result.push(response);
        next += 50;
    }

    return Promise.all(result);
};

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
            select: ['ID', 'TASK_ID', 'SECONDS', 'CREATED_DATE'],
            params: {
                NAV_PARAMS: {nPageSize: 0},
            },
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            return response.result;
        });
};

// список задач по фильтру
export const getApiTasks = async (url, filter) => {
    return getAll(url + '/tasks.task.list', {
        order: {ID: 'asc'},
        filter: filter,
        select: ['ID', 'TITLE', 'GROUP_ID'],
    }).then((result) => {
        return result.reduce((prev, curr) => {
            return prev.concat(curr.result.tasks);
        }, []);
    });
};

// список групп по фильтру
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
    })
        .then((response) => response.json())
        .then((response) => {
            return response.result;
        });
};

// админ текущий пользователь или нет
export const getApiIsAdmin = async (url) => {
    return fetch(url + '/user.admin.json', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((response) => {
            return response.result;
        })
        .catch((err) => {
            return false;
        });
};

// список пользователей
export const getApiUsers = async (url) => {
    return getAll(url + '/user.get', {
        sort: 'LAST_NAME',
        order: 'asc',
        filter: {
            ACTIVE: 'true',
        },
    }).then((result) => {
        return result.reduce((prev, curr) => {
            return prev.concat(curr.result);
        }, []);
    });
};

// https://isdayoff.ru/api/getdata?year=2022&month=01&delimeter=|&covid=1
export const isMonthOff = async (year, month) => {
    return fetch('https://isdayoff.ru/api/getdata?year=' + year + '&month=' + month + '&delimeter=|&covid=1').then(
        (response) => {
            return response.text();
        }
    );
};
