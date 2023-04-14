function timestampToMs (str) {
    const arr = str.split(/[\s:]+/)
    const hour = Number(arr[0])
    const min = Number(arr[1])
    const sec = Number(arr[2])
    const ms = Number(arr[3])
    return ms + (sec * 1000) + (min * 60 * 1000) + (hour * 60 * 60 * 1000)
}

function timestamp () {
    const str = arrayfromargs(arguments)
    const startEnd = str[0].split(' --> ')
    outlet(0, timestampToMs(startEnd[0]))
}