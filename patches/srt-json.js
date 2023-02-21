// SRT to JSON in Node4Max by Hou Lam Wu (Eagle) 2023
const path = require('path');
const Max = require('max-api');
const fs = require('fs/promises')
let outDir = ''
let inDir = ''
// This will be printed directly to the Max console
Max.post(`Loaded the ${path.basename(__filename)} script`);

// Default Parameters

Max.addHandler("inputDir", (string) => {
    if (!string) return
    inDir = string
})

Max.addHandler("outputDir", (string) => {
    if (!string) return
    outDir = string
})

Max.addHandler("dictToSrt", (string, out) => {
    if (!string) return
    dictToSrt(string, out)
})

Max.addHandler("batchConvert", () => {
    if (inDir === '') return
    ls(inDir)
})


Max.addHandler("srtToLine", (...str) => {
    if (!str) return
    const out = []
    out.push(0)
    out.push(timestampToMs(str[0].split(' --> ')[0]))
    str.forEach((line, i) => {
        const startEnd = line.split(' --> ')
        out.push(i + 1)
        out.push(timestampToMs(startEnd[1]) - timestampToMs(startEnd[0]))
    })
    Max.outlet(out)
})

// This is not needed actually
// Max.addHandler("subtitles", (...str) => {
//     if (!str) return
//     subtitles = str
// })

async function ls(path) {
    const dir = await fs.opendir(path)
    for await (const dirent of dir) {
        if (dirent.name.search('.json') >= 0)
        fs.readFile(inDir + dirent.name)
            .then((response) => JSON.parse(response))
            .then((json) => pipelineToSrt(json, dirent.name.split('.json')[0]))
            .then(console.log('File Converted: ' + dirent.name))
    }
  }
  

// Not exactly same timestamp format as below, as MaxMSP changes commas
const timestampToMs = (str) => {
    const arr = str.split(/[\s:]+/)
    const hour = Number(arr[0])
    const min = Number(arr[1])
    const sec = Number(arr[2])
    const ms = Number(arr[3])
    return ms + (sec * 1000) + (min * 60 * 1000) + (hour * 60 * 60 * 1000)
}

const secToTimestamp = (num) => {
    const t = (n) => {
        if (n < 10) return '0' + n
        return n
    }
    const hour = Math.floor(num / 60 / 60)
    const min = Math.floor(num / 60) % 60
    const sec = Math.floor(num % 60)
    const ms = Math.floor((num - Math.floor(num)) * 1000)
    const msStr = (ms < 10) ? ('00' + ms) : (ms < 100) ? ('0' + ms) : ms
    return `${t(hour)}:${t(min)}:${t(sec)},${msStr}`
}

const pipelineToSrt = (v, out) => {
    let str = ''
    v.chunks.forEach((obj, i) => {
        const num = i + 1
        const startTime = secToTimestamp(obj.timestamp[0])
        const endTime = secToTimestamp(obj.timestamp[1])
        str += num + '\r\n' + `${startTime} --> ${endTime}` + '\r\n' + obj.text + '\r\n' + '\r\n'
    })  
    const filename = outDir + (out || 'output') + '.srt'
    // Write data
    fs.writeFile((filename), str).then(console.log('FIle written: ' + filename)).catch((err) => {
        // In case of a error throw err.
        if (err) throw err
    })  
}

const dictToSrt = (dict, out) => {
    Max.getDict(dict).then((d) => pipelineToSrt(d, out))
}
