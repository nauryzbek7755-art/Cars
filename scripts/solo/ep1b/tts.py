import asyncio,json,os,edge_tts
L=json.load(open('ep1b/dialog.json'))
async def main():
    for i,l in enumerate(L):
        c=edge_tts.Communicate(l['text'],l['voice'],rate=l['rate'],pitch=l['pitch'],proxy=os.environ['HTTPS_PROXY'])
        await c.save(f'ep1b/dl/{i:02d}.mp3')
asyncio.run(main())
