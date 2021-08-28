## 0. install node environment and do npm install

## 1. dowload youtube video using node-ytdl 
ytdl "http://www.youtube.com/watch?v=_HSylqgVYQI" > myvideo.mp4

## 2. split video using ffmpeg (higher chance of failure when the video is long, split to <10 min is recommended)
ffmpeg -i source-file.mp4 -ss 0 -t 600 -c copy first-10-min.mp4

## 3.set google cloud api creditenal
export GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH" (ref: https://cloud.google.com/docs/authentication/getting-started)

## 4.npm run dev 
node index.js "video"

## Future enhancement
Crop video before ocr to reduce noise (ref: https://video.stackexchange.com/a/4571)