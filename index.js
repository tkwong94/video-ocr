const fs = require('fs');
const util = require('util');
const Video = require('@google-cloud/video-intelligence');

const fileName = process.argv[2];
if (!fileName) {
    console.error("missing file name")
}

(async () => {
    const path = `./videos/${fileName}.mp4`;
    // Imports the Google Cloud Video Intelligence library + Node's fs library

    // Creates a client
    const video = new Video.VideoIntelligenceServiceClient();

    // Reads a local video file and converts it to base64
    const file = await util.promisify(fs.readFile)(path);
    const inputContent = file.toString('base64');

    const request = {
        inputContent: inputContent,
        features: ['TEXT_DETECTION'],
        videoContext: {
            textDetectionConfig: {
                languageHints: ["zh"]
            }
        }
    };
    // Detects text in a video
    const [operation] = await video.annotateVideo(request);
    const results = await operation.promise();

    // Gets annotations for video
    let textAnnotations = results[0].annotationResults[0].textAnnotations;   
    textAnnotations = textAnnotations.filter(obj => Object.keys(obj.segments[0].segment.startTimeOffset).includes("seconds"));

     fs.writeFile(`./output/ta-${fileName}.json`, JSON.stringify(textAnnotations), { flag: 'wx' }, e=>{
        if(e) console.error(e)
    });

    textAnnotations = textAnnotations.sort(function(a, b){
        let r1,r2;

        let s1 = parseInt(a.segments[0].segment.startTimeOffset.seconds);
        let s2 = parseInt(b.segments[0].segment.startTimeOffset.seconds);

        if (s1 == s2){
            r1 = a.segments[0].segment.startTimeOffset.nanos;
            r2 = b.segments[0].segment.startTimeOffset.nanos;
        }else{
            r1=s1;
            r2=s2;
        }

        if (r1 > r2){
            return 1
        }else if(r2>r1){
            return -1
        }else{
            return 0
        }
    });

    let logStream = fs.createWriteStream(`./output/${fileName}.txt`, { flags: 'wx' });
    for (d of textAnnotations) {
        if (d.confidence == 1 || d.confidence == undefined){
            logStream.write(d.text+"\r\n");
        }
    }

    logStream.end('');

})().catch(e => {
    console.error(e);
});
