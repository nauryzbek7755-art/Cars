import json,sys
S=sys.argv[1]; TEMPO=1.07
lines=json.load(open(f'{S}/fv/narration.json'))
words=[json.load(open(f'{S}/fvo3/l{i:02d}.json')) for i in range(len(lines))]
gap={0:0.15,2:0.12,4:0.12,6:0.12,8:0.15}
t=0.10; L=[]
for i,w in enumerate(words):
    ws=[dict(s=t+x['t']/TEMPO,e=t+(x['t']+x['d'])/TEMPO,w=x['w']) for x in w]
    end=ws[-1]['e']
    L.append(dict(i=i,start=t,end=end,words=ws))
    t=end+gap.get(i,0.06)
total=L[-1]['end']+0.9
json.dump(dict(lines=L,total=total,tempo=TEMPO),open(f'{S}/fv/tl.json','w'),indent=1,ensure_ascii=False)
for l in L: print(l['i'],round(l['start'],2),round(l['end'],2),' '.join(f"{x['w']}@{x['s']:.2f}" for x in l['words']))
print('total',total)
