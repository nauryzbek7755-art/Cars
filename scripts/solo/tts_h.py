import asyncio,json,os,sys,edge_tts
out=sys.argv[2]; lines=json.load(open(sys.argv[1]))
async def one(i,t):
    c=edge_tts.Communicate(t,os.environ.get("TTS_VOICE","fr-FR-RemyMultilingualNeural"),rate=os.environ.get("TTS_RATE","-6%"),pitch=os.environ.get("TTS_PITCH","-14Hz"),proxy=os.environ['HTTPS_PROXY'],boundary="WordBoundary")
    words=[];audio=bytearray()
    async for ch in c.stream():
        if ch["type"]=="audio": audio+=ch["data"]
        elif ch["type"]=="WordBoundary": words.append(dict(t=ch["offset"]/1e7,d=ch["duration"]/1e7,w=ch["text"]))
    open(f"{out}/l{i:02d}.mp3","wb").write(audio); json.dump(words,open(f"{out}/l{i:02d}.json","w"),ensure_ascii=False)
async def main():
    for i,t in enumerate(lines):
        for k in range(8):
            try: await one(i,t); break
            except Exception as e: print('retry',i,e,flush=True); await asyncio.sleep(3)
asyncio.run(main())
