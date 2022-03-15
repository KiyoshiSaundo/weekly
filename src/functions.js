export const formatDate = (date) => {
    let d, m, y;

    d = date.getDate();
    if (d < 10) d = '0' + d;

    m = date.getMonth() + 1;
    if (m < 10) m = '0' + m;

    y = date.getFullYear();

    return d + '.' + m + '.' + y;
}

export const formatTime = (seconds) => {
    let h, m, s;

    h = Math.floor(seconds / 3600);
    m = Math.floor(seconds / 60) - h * 60;
    s = seconds % 60;

    return [
        h.toString().padStart(2, '0'),
        m.toString().padStart(2, '0'),
        s.toString().padStart(2, '0'),
    ].join(':');
}