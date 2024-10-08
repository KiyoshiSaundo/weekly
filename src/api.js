import { usersToUser } from "@/settings.js";
import { getUserIdFromApiUrl, getBase64 } from "@/functions.js";

// проверка доступных прав
export const checkAccess = async (url) => {
    return fetch(url + "/scope", {})
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response.status);
            }
        })
        .then((response) => {
            return {
                status: 1,
                result: response.result,
            };
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// затраченное время по фильтру
export const getApiTimes = async (url, filter = []) => {
    return fetch(url + "/task.elapseditem.getlist", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            order: { ID: "asc" },
            filter: filter,
            select: ["ID", "TASK_ID", "SECONDS", "CREATED_DATE"],
            params: {
                NAV_PARAMS: { nPageSize: 0 },
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
    return getAll(url + "/tasks.task.list", {
        order: { ID: "asc" },
        filter: filter,
        select: ["ID", "TITLE", "GROUP_ID", "GROUP", "CREATED_BY"],
    }).then((result) => {
        return result.reduce((prev, curr) => {
            return prev.concat(curr.result.tasks);
        }, []);
    });
};

// список групп по фильтру
export const getApiGroups = async (url, filter) => {
    return fetch(url + "/sonet_group.get", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ORDER: { ID: "asc" },
            FILTER: filter,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            return response.result;
        });
};

// список комментариев к задаче по фильтру
export const getApiComments = async (url, taskId, filter) => {
    return fetch(url + "/task.commentitem.getlist", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            TASKID: taskId,
            ORDER: { ID: "asc" },
            FILTER: filter,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            return response.result;
        });
};

// отправить сообщение в ЛС в б24
export const sendMessage = async (url, userId, message) => {
    return fetch(url + "/im.message.add", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            DIALOG_ID: userId,
            MESSAGE: message,
            SYSTEM: "Y",
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            return response.result;
        });
};

// информация о текущем пользователе
export const getUserInfo = async (url) => {
    return fetch(url + "/user.current", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.error !== undefined) {
                return {
                    status: 0,
                    result: response.error_description,
                };
            } else {
                return {
                    status: 1,
                    result: response.result,
                };
            }
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// список пользователей
export const getApiUsers = async (url) => {
    const userId = parseUserId(url);

    let filter = {
        ACTIVE: "true",
        USER_TYPE: "employee",
    };

    if (
        usersToUser[userId] !== undefined &&
        !usersToUser[userId].includes("*")
    ) {
        filter.ID = usersToUser[userId];
    }

    if (usersToUser[userId] === undefined) {
        filter.ID = userId;
    }

    return getAll(url + "/user.get", {
        sort: "LAST_NAME",
        order: "asc",
        filter: filter,
    }).then((result) => {
        return result.reduce((prev, curr) => {
            return prev.concat(curr.result);
        }, []);
    });
};

// рабочие/выходные/праздничные дни в месяце - https://isdayoff.ru/api/getdata?year=2022&month=01&delimeter=|&covid=1
export const isMonthOff = async (year, month) => {
    if (localStorage.getItem("isMonthOff" + year + month)) {
        return localStorage.getItem("isMonthOff" + year + month);
    } else {
        const res = await fetch(
            "https://isdayoff.ru/api/getdata?year=" +
                year +
                "&month=" +
                month +
                "&delimeter=|&covid=1"
        ).then((response) => {
            return response.text();
        });
        localStorage.setItem("isMonthOff" + year + month, res);
        return res;
    }
};

// рабочие/выходные/праздничные дни в году -  https://isdayoff.ru/api/getdata?year=2022&delimeter=|&covid=1
export const isYearOff = async (year) => {
    if (localStorage.getItem("isYearOff" + year)) {
        return localStorage.getItem("isYearOff" + year);
    } else {
        const res = await fetch(
            "https://isdayoff.ru/api/getdata?year=" +
                year +
                "&delimeter=&covid=1"
        ).then((response) => {
            return response.text();
        });
        localStorage.setItem("isYearOff" + year, res);
        return res;
    }
};

// хранилище пользователя в b24
export const getB24UserStorage = async (url) => {
    return await fetch(url + "/disk.storage.getlist", {
        // delay: 10000,
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filter: {
                ENTITY_TYPE: "user",
                ENTITY_ID: getUserIdFromApiUrl(url),
            },
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.error !== undefined) {
                return {
                    status: 0,
                    result: response.error_description,
                };
            } else if (response.total == 0) {
                return {
                    status: 2,
                    result: "Не найдено хранилище",
                };
            } else {
                return {
                    status: 1,
                    result: response.result[0],
                };
            }
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// файл в хранилище b24
export const getB24File = async (url, data) => {
    return await fetch(url + "/disk.storage.getchildren", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: data.storageId,
            filter: {
                NAME: data.fileName,
                TYPE: "file",
            },
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.error !== undefined) {
                return {
                    status: 0,
                    result: response.error_description,
                };
            } else if (response.total == 0) {
                return {
                    status: 2,
                    result: "Не найден файл",
                };
            } else {
                return {
                    status: 1,
                    result: response.result[0],
                };
            }
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// содержимое файла в хранилище b24
export const getB24FileContent = async (url) => {
    return await fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            return {
                status: 1,
                result: response,
            };
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// создать файл в корне хранилища b24
export const createB24File = async (url, data) => {
    return await fetch(url + "/disk.storage.uploadfile", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: data.storageId,
            data: {
                NAME: data.fileName,
            },
            fileContent: data.fileContent,
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            return {
                status: 1,
                result: response,
            };
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// обновить файл в хранилище b24
export const updateB24File = async (url, data) => {
    return await fetch(url + "/disk.file.uploadversion", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: data.fileId,
            fileContent: getBase64(data.fileContent),
        }),
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.error !== undefined) {
                return {
                    status: 0,
                    result: response.error_description,
                };
            } else {
                return {
                    status: 1,
                    result: response.result,
                };
            }
        })
        .catch((response) => {
            return {
                status: 0,
                result: response,
            };
        });
};

// id пользователя из url
const parseUserId = (url) => {
    let match = url.match(/rest\/(\d+)/);

    return match[1] || false;
};

// все записи из постранички
const getAll = async (url, body) => {
    const get = (url, body, next) => {
        body.start = next;
        return fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
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

// fetch с возможностью задать задержку (delay: 2000)
export const fetchDelay = async (url, options) => {
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(fetch(url, options));
        }, options.delay);
    });
};
