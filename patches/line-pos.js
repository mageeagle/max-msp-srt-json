// Seeking in a Line Format by Hou Lam Wu (Eagle) 2023
// ES6 yokmu bu ne aq
var time = []
var normalizedTime = []
var startPoint = 0
var sumTime = 0
var len = 0

function msg_float(v)
{
    normalizedTime.forEach(function (val, i) {
        if (v >= val) 
        startPoint = i
        return
    })
    const out = []
    out.push(startPoint)
    out.push(0)
    out.push(startPoint + 1)
    out.push((normalizedTime[startPoint + 1] - v) * sumTime)
    for (var x = startPoint + 2; x < len; x++) {
            out.push(x)
            out.push(time[x])
        }
    outlet(0, out)
}

function list()
{
	const a = arrayfromargs(arguments)
    time = []
    a.forEach(function (val, i) {
        if (i % 2) {
            time.push(val)
        }
    })
    len = time.length
	sumTime = time.reduce(function (a, b) { 
        return a + b
    }, 0)
    normalizedTime = []
    time.forEach(function (val, i) {
        normalizedTime.push((val / sumTime) + (normalizedTime[i - 1] || 0))
    })
    // normalizedTime = time.reduce(function (a, b, i) {
    //     return [...a, (b / sumTime) + (a[i - 1] || 0)]
    // }, [])
	// outlet(0, normalizedTime)
}