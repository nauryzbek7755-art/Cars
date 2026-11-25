import json,sys,base64,subprocess,re,time
D=sys.argv[1]; L=json.load(open(f'{D}/lines.json'))
V={"N":"JBFqnCBsd6RMkjVDRZzb","G":"bIHbv24MWmeRgasZH58o","B":"pNInz6obpgDQGcFmaJgB","D":"TX3LPaxmHKxFdv7VOQHJ","E":"cgSgspJ2msm6clMCkdW9"}
only=[int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else None
for i,(who,txt) in enumerate(L):
    if only and i not in only: continue
    if who=='F': continue
    body=json.dumps({"text":txt,"model_id":"eleven_v3","language_code":"fr"})
    for k in range(3):
        r=subprocess.run(['curl','-s','--cacert','/root/.ccr/ca-bundle.crt','-H','xi-api-key: proxy-injected','-H','Content-Type: application/json',
            '-X','POST',f'https://api.elevenlabs.io/v1/text-to-speech/{V[who]}/with-timestamps?output_format=mp3_44100_128','-d',body],capture_output=True,text=True)
        try: d=json.loads(r.stdout); a=d['alignment']; break
        except Exception: print('retry',i,r.stdout[:200]); time.sleep(3)
    open(f'{D}/vo/l{i:02d}.mp3','wb').write(base64.b64decode(d['audio_base64']))
    ch=a['characters']; st=a['character_start_times_seconds']; en=a['character_end_times_seconds']
    words=[];cur='';s0=None;intag=False
    for c,s,e in zip(ch,st,en):
        if c=='[': intag=True; continue
        if c==']': intag=False; continue
        if intag: continue
        if c.isspace():
            if cur.strip(): words.append(dict(t=s0,d=last-s0,w=cur.strip()))
            cur='';s0=None; continue
        if s0 is None: s0=s
        cur+=c; last=e
    if cur.strip(): words.append(dict(t=s0,d=last-s0,w=cur.strip()))
    words=[w for w in words if re.search(r'\w',w['w'])]
    json.dump(words,open(f'{D}/vo/l{i:02d}.json','w'),ensure_ascii=False); print(i,who,len(words),round(words[-1]['t'],2))
