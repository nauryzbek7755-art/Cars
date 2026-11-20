cd "$1"
ffmpeg -y -v error -i voice.wav -i music.wav -i sfx.wav -filter_complex "[0:a]asplit=2[vo][sc];[1:a]volume=0.36[m];[m][sc]sidechaincompress=threshold=0.025:ratio=7:attack=30:release=500:makeup=1[md];[2:a]volume=0.5[fx];[vo][md][fx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 -c:a pcm_s16le mix.wav
