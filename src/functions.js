export const getDomain = (link) => {
    const regexp = new RegExp("(https?://[^\\/]+)/.*");
    const match = link.match(regexp) || [];
    return match[1] || false;
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
    h = parseInt(time[0]) || 0;
    m = parseInt(time[1]) || 0;
    s = parseInt(time[2]) || 0;

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
