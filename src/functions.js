import {
    getB24UserStorage,
    getB24File,
    getB24FileContent,
    createB24File,
} from "@/api";

export const getDomain = (link) => {
    const regexp = new RegExp("(https?://[^\\/]+)/.*");
    const match = link.match(regexp) || [];
    return match[1] || false;
};

export const getUserIdFromApiUrl = (url) => {
    return (url.match(/rest\/(\d+)/) || [])[1] || false;
};

export const formatDate = (date) => {
    let d, m, y;

    d = date.getDate();
    if (d < 10) d = "0" + d;

    m = date.getMonth() + 1;
    if (m < 10) m = "0" + m;

    y = date.getFullYear();

    return d + "." + m + "." + y;
};

export const formatTime = (seconds) => {
    let h, m, s;

    h = Math.floor(seconds / 3600);
    m = Math.floor(seconds / 60) - h * 60;
    s = seconds % 60;

    return [
        h.toString().padStart(2, "0"),
        m.toString().padStart(2, "0"),
        s.toString().padStart(2, "0"),
    ].join(":");
};

export const unformatTime = (time) => {
    if (!time) return 0;

    let h, m, s;

    time = time.split(":");

    h = parseInt(time[0].replace("_", "")) || 0;
    m = parseInt(time[1].replace("_", "")) || 0;
    s = parseInt(time[2].replace("_", "")) || 0;

    return h * 3600 + m * 60 + s;
};

export const getCurrDay = () => {
    const now = new Date();

    return [now, now];
};

export const getCurrWeek = () => {
    const now = new Date();

    let start = new Date(now - ((now.getDay() + 6) % 7) * 86400000);
    let end = new Date(start.getTime() + 6 * 86400000);

    return [start, end];
};

export const getCurrMonth = () => {
    const now = new Date();

    let dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    let dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return [dateFrom, dateTo];
};

export const getCurrYear = () => {
    const now = new Date();

    let date = new Date(now.getFullYear(), now.getMonth(), 1);

    return date;
};

export const getObjectWithKey = (source, key = false) => {
    return Object.values(source).reduce((object, item, index) => {
        return { ...object, [key ? item[key] : index]: item };
    }, {});
};

export const getFloat = (str) => {
    return parseFloat(String(str || 0).replace(",", "."));
};

export const getWeeklyFile = async (url) => {
    let result = {
        status: 1,
        message: false,
        storageId: false,
        fileId: false,
        fileContent: {},
    };

    /* хранилище пользователя */
    let storage = await getB24UserStorage(url);

    if (storage.status != 1) {
        result.status = 0;
        result.message = {
            type: "error",
            text: "getB24UserStorage(): \r\n " + storage.result,
        };
        return result;
    }

    /* файл weekly.data в хранилище */
    let file = await getB24File(url, {
        storageId: storage.result.ID,
        fileName: "weekly.data",
    });
    // если файл не существует, пытаемся создать
    if (file.status == 2) {
        let createdFile = await createB24File(url, {
            storageId: storage.result.ID,
            fileName: "weekly.data",
            fileContent: getBase64({
                yearly: {
                    delta: JSON.parse(localStorage.yearlyDelta || "{}"),
                },
            }),
        });
        if (createdFile.status == 1) {
            result.message = {
                text: "Файл синхронизации б24 создан",
            };
            file = {
                status: createdFile.status,
                result: createdFile.result.result,
            };
        } else {
            result.status = 0;
            result.message = {
                type: "error",
                text: "createB24File(): \r\n" + createdFile.result,
            };
            return result;
        }
    } else if (file.status != 1) {
        result.status = 0;
        result.message = {
            type: "error",
            text: "getB24File(): \r\n" + file.result,
        };
        return result;
    }

    // данные из файла
    let fileContent = await getB24FileContent(file.result.DOWNLOAD_URL);
    if (fileContent.status != 1) {
        result.status = 0;
        result.message = {
            type: "error",
            text: "getB24FileContent(): \r\n" + fileContent.result,
        };
        return result;
    }

    // результат
    result.storageId = storage.result.ID;
    result.fileId = file.result.ID;
    result.fileContent = fileContent.result || {};

    return result;
};

export const getBase64 = (data) => {
    data = new TextEncoder().encode(JSON.stringify(data));
    data = Array.from(data, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(data);
};

export const intersect = (a, b) => {
    var setA = new Set(a);
    var setB = new Set(b);
    var intersection = new Set([...setA].filter((x) => setB.has(x)));
    return Array.from(intersection);
};
