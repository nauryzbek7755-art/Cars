import json,subprocess
S='/tmp/claude-0/-home-user-Cars/0cb19e2b-dfce-5088-bc4f-214a882a9e67/scratchpad'
# (line, start, tempo)
plan=[(0,0.10,1.10),(1,8.70,1.0),(4,12.85,1.0),(5,15.60,1.0)]
lines=[]
for i,st,tp in plan:
    W=json.load(open(f'{S}/vo/l{i}.json'))
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'{S}/vo/l{i}.mp3','-af',f'atempo={tp}','-ar','48000','-ac','1',f'{S}/vo/p{i}.wav'])
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{S}/vo/p{i}.wav']))
    ws=[dict(w=w['w'],t=round(st+w['t']/tp,3),e=round(st+w['e']/tp,3)) for w in W]
    if i==5:  # merge phonetic spelling into brand name
        j=[k for k,w in enumerate(ws) if w['w']=='Бусти'][0]
        ws[j]=dict(w='BoostyUp',t=ws[j]['t'],e=ws[j+1]['e']); del ws[j+1]
    lines.append(dict(i=i,start=st,end=round(st+d,3),words=ws))
bw=[('А',0.44,0.54),('улучшить',0.56,0.98),('свои',1.0,1.24),('подарки',1.26,1.66),('ты',1.68,1.8),('можешь',1.82,2.1),('в',4.3,4.38),('BoostyUp',4.4,5.0)]
lines.insert(1,dict(i='b',start=4.04,end=8.6,words=[dict(w=w,t=round(3.6+a,3),e=round(3.6+b,3)) for w,a,b in bw]))
TL=dict(fps=60,total=18.8,B0=3.60,BDUR=6.65,C0=10.25,CH0=12.7,F0=15.4,TAP=14.85,cards=[10.25,10.85,11.45,12.05],lines=lines)
json.dump(TL,open(f'{S}/proj/tl.json','w'),ensure_ascii=False,indent=1)
for l in lines: print(l['i'],l['start'],l['end'],[ (w['w'],w['t']) for w in l['words']])
