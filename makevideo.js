const fs = require('fs')
const { exec } = require('child_process')
const { mkdirSync } = require('fs')
// const cmd = "ffmpeg -i movie_1_1.mp4 -b:v 1M -g 60 -hls_time 2 -hls_list_size 0 -hls_segment_size 500000 movie_1_1.m3u8"

const inputPath = "/Volumes/3TB-MAC/work/work-game/0.neocrew/0.hyundai-car/media"

const files = []
fs.readdirSync(inputPath).forEach(f=>{
    let idx
    if ((idx=f.indexOf(".mp4"))>0) files.push(f.substr(0,idx))
})

// console.log(files)
const outputPath = inputPath+'/output2'
try {
mkdirSync(outputPath)
} catch(e) {

}
function transcode(filename) {
    return new Promise((resolve,reject)=>{
        // exec(`ffmpeg -i ${inputPath+'/'+filename}.mp4 -b:v 1M -g 60 -hls_time 2 -hls_list_size 0 -hls_segment_size 1024000 ${outputPath+'/'+filename}.m3u8`)
        exec(`ffmpeg -i ${inputPath+'/'+filename}.mp4 -movflags faststart -b:v 1M -acodec copy ${outputPath+'/'+filename}.mp4`
        , (err,stdout,stderr)=>{
            if (err)  {
                reject(err)
            } else {
                console.log(filename,' done')
                resolve()
            }

        })
        // exec('ffmpeg -i $')
    })
}

files.forEach(async f=>await transcode(f))