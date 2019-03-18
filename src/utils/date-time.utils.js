
export function getCurrentMillis() {
    return Date.now();
}

export function formatEllapsedMillis(elapsedMillis, includeMillis = false) {
    let milliseconds = parseInt((elapsedMillis % 1000) / 100)
    let seconds = parseInt((elapsedMillis / 1000) % 60)
    let minutes = parseInt((elapsedMillis / (1000 * 60)) % 60);

    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return minutes + ':' + seconds + (includeMillis ? '.' + milliseconds : '');
}
