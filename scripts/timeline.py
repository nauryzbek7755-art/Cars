import json,sys
S=sys.argv[1]
lines=json.load(open(f'{S}/scripts/narration.json'))
words=[json.load(open(f'{S}/vo2/l{i:02d}.json')) for i in range(len(lines))]
gap={1:0.55,3:0.45,4:0.3,7:0.3,8:0.75,10:0.55,11:0.4,12:0.7}
t=0.15; L=[]
for i,w in enumerate(words):
    end=w[-1]['t']+w[-1]['d']
    L.append(dict(i=i,start=t,end=t+end,words=[dict(s=t+x['t'],e=t+x['t']+x['d'],w=x['w']) for x in w]))
    t+=end+gap.get(i,0.3)
total=L[-1]['end']+3.0
# shots: line -> list of (img, split word index, params)
plan={0:[('070',0),('082',4)],1:[('V:mul',0)],2:[('008',0),('037',4)],3:[('040',0),('V:gsfront',5)],4:[('006',0)],
5:[('V:gseng',0),('013',2),('024',4)],6:[('V:gsrad',0)],7:[('056',0),('149',4)],8:[('071',0),('069',4)],
9:[('085',0),('051',5),('050',8)],10:[('089',0)],11:[('101',0),('043',6)],12:[('133',0),('148',2),('V:gsside',6)],13:[('108',0)]}
shots=[]
for i,ln in enumerate(L):
    for img,wi in plan[i]:
        st=ln['words'][wi]['s']-0.12 if wi>0 else (0 if i==0 else ln['start']-0.18)
        shots.append(dict(img=img,start=round(st,3),line=i))
for k,s in enumerate(shots):
    s['end']=shots[k+1]['start'] if k+1<len(shots) else total
shots[-1]['end']=L[-1]['end']+0.6
shots.append(dict(img='END',start=shots[-1]['end'],end=total,line=13))
json.dump(dict(lines=L,shots=shots,total=total),open(f'{S}/timeline.json','w'),indent=1,ensure_ascii=False)
for s in shots: print(s['img'],s['start'],round(s['end']-s['start'],2))
print('total',total)
