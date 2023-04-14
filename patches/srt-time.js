// Timestamp to Line Format by Hou Lam Wu (Eagle) 2023
function list () {
    const str = arrayfromargs(arguments)
    const out = []
    out.push(0)
    out.push(timestampToMs(str[0].split(' --> ')[0]))
    str.forEach(function (line, i) {
        const startEnd = line.split(' --> ')
        if (i > 0) {
            const lastStartEnd = str[i - 1].split(' --> ')
            out.push(i + 1)
            out.push(timestampToMs(startEnd[0]) - timestampToMs(lastStartEnd[1]))
        }
        out.push(i + 1)
        out.push(timestampToMs(startEnd[1]) - timestampToMs(startEnd[0]))
    })
    outlet(0, out)
}


function timestampToMs (str) {
    const arr = str.split(/[\s:]+/)
    const hour = Number(arr[0])
    const min = Number(arr[1])
    const sec = Number(arr[2])
    const ms = Number(arr[3])
    return ms + (sec * 1000) + (min * 60 * 1000) + (hour * 60 * 60 * 1000)
}