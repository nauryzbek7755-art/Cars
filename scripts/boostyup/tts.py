import json,sys,base64,subprocess,re,time
D=sys.argv[1]; V=sys.argv[2]; L=json.load(open(f'{D}/lines.json'))
only=[int(x) for x in sys.argv[3].split(',')] if len(sys.argv)>3 else None
for i,txt in enumerate(L):
    if only and i not in only: continue
    body=json.dumps({"text":txt,"model_id":"eleven_v3","language_code":"ru"})
    for k in range(3):
        r=subprocess.run(['curl','-s','--cacert','/root/.ccr/ca-bundle.crt','-H','xi-api-key: proxy-injected','-H','Content-Type: application/json','-X','POST',f'https://api.elevenlabs.io/v1/text-to-speech/{V}/with-timestamps?output_format=mp3_44100_128','-d',body],capture_output=True,text=True)
        try: d=json.loads(r.stdout); a=d['alignment']; break
        except Exception: print('retry',i,r.stdout[:300]); time.sleep(3)
    open(f'{D}/vo/l{i}.mp3','wb').write(base64.b64decode(d['audio_base64']))
    words=[];cur='';s0=None;intag=False;last=0
    for c,s,e in zip(a['characters'],a['character_start_times_seconds'],a['character_end_times_seconds']):
        if c=='[': intag=True; continue
        if c==']': intag=False; continue
        if intag: continue
        if c.isspace():
            if cur.strip(): words.append(dict(t=s0,e=last,w=cur.strip()))
            cur='';s0=None; continue
        if s0 is None: s0=s
        cur+=c; last=e
    if cur.strip(): words.append(dict(t=s0,e=last,w=cur.strip()))
    words=[w for w in words if re.search(r'\w',w['w'])]
    json.dump(words,open(f'{D}/vo/l{i}.json','w'),ensure_ascii=False); print(i,len(words),round(words[0]['t'],2),round(words[-1]['e'],2))
