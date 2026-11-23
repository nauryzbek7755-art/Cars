import bpy,bmesh,math,sys,random
from mathutils import Vector
OUT=sys.argv[sys.argv.index('--out')+1] if '--out' in sys.argv else 'p3d/f_'
FR=[int(x) for x in sys.argv[sys.argv.index('--frames')+1].split(',')] if '--frames' in sys.argv else None
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; R=random.Random(4)
def mat(name,col,rough=0.6,metal=0.0,emit=None,es=0):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*col,1); b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
    if emit: b.inputs['Emission Color'].default_value=(*emit,1); b.inputs['Emission Strength'].default_value=es
    return m
def nodes(m): return m.node_tree.nodes,m.node_tree.links
def link_obj(o,m):
    o.data.materials.clear(); o.data.materials.append(m)
def box(name,loc,size,m,bevel=0.0,seg=2):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.name=name; o.scale=(size[0]/2,size[1]/2,size[2]/2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel>0: md=o.modifiers.new('b','BEVEL'); md.width=bevel; md.segments=seg
    link_obj(o,m); return o
def sph(name,loc,r,m,sc_=(1,1,1),seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r,location=loc,segments=seg,ring_count=seg//2); o=bpy.context.object; o.name=name; o.scale=sc_
    bpy.ops.object.shade_smooth(); link_obj(o,m); return o
def cyl(name,loc,r,d,m,rot=(0,0,0),v=24):
    bpy.ops.mesh.primitive_cylinder_add(radius=r,depth=d,location=loc,rotation=rot,vertices=v); o=bpy.context.object; o.name=name
    bpy.ops.object.shade_smooth(); link_obj(o,m); return o
# ---------------- materials ----------------
# cobblestones (procedural voronoi)
cob=bpy.data.materials.new('cobble'); cob.use_nodes=True; N,L=nodes(cob); b=N['Principled BSDF']
tc=N.new('ShaderNodeTexCoord'); mp=N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value=(3.2,4.6,3.2)
vo=N.new('ShaderNodeTexVoronoi'); vo.feature='DISTANCE_TO_EDGE'; vo2=N.new('ShaderNodeTexVoronoi')
L.new(tc.outputs['Object'],mp.inputs['Vector']); L.new(mp.outputs['Vector'],vo.inputs['Vector']); L.new(mp.outputs['Vector'],vo2.inputs['Vector'])
cr=N.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position=0.0; cr.color_ramp.elements[1].position=0.08
L.new(vo.outputs['Distance'],cr.inputs['Fac'])
cv=N.new('ShaderNodeValToRGB'); cv.color_ramp.elements[0].color=(0.45,0.4,0.42,1); cv.color_ramp.elements[1].color=(0.75,0.68,0.62,1)
L.new(vo2.outputs['Color'],cv.inputs['Fac'])
mx=N.new('ShaderNodeMix'); mx.data_type='RGBA'; mx.inputs[7].default_value=(0.08,0.07,0.07,1)
L.new(cr.outputs['Color'],mx.inputs['Factor']); L.new(cv.outputs['Color'],mx.inputs[6]); 
# swap so gaps dark: factor=edge mask(0 at gap)->use A=gap, B=stone
mx.inputs[6].default_value=(0.08,0.07,0.07,1); L.new(cv.outputs['Color'],mx.inputs[7])
L.new(mx.outputs['Result'],b.inputs['Base Color']); b.inputs['Roughness'].default_value=0.55
bp=N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value=1.0; L.new(cr.outputs['Color'],bp.inputs['Height']); L.new(bp.outputs['Normal'],b.inputs['Normal'])
# facade with procedural windows (brick texture used as window grid)
def facade_mat(name,wall,seed):
    m=bpy.data.materials.new(name); m.use_nodes=True; N,L=nodes(m); b=N['Principled BSDF']
    tc=N.new('ShaderNodeTexCoord'); br=N.new('ShaderNodeTexBrick'); br.offset=0; br.squash_frequency=1
    br.inputs['Scale'].default_value=1.0; br.inputs['Mortar Size'].default_value=0.0; br.inputs['Brick Width'].default_value=2.2; br.inputs['Row Height'].default_value=3.3
    sep=N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'],sep.inputs['Vector'])
    comb=N.new('ShaderNodeCombineXYZ'); mth=N.new('ShaderNodeMath'); mth.operation='ADD'
    L.new(sep.outputs['X'],mth.inputs[0]); L.new(sep.outputs['Y'],mth.inputs[1]); L.new(mth.outputs[0],comb.inputs['X']); L.new(sep.outputs['Z'],comb.inputs['Y'])
    L.new(comb.outputs['Vector'],br.inputs['Vector'])
    # window mask: fract-based rectangles
    def frac_mask(src,period,lo,hi):
        a=N.new('ShaderNodeMath'); a.operation='DIVIDE'; a.inputs[1].default_value=period; L.new(src,a.inputs[0])
        f=N.new('ShaderNodeMath'); f.operation='FRACT'; L.new(a.outputs[0],f.inputs[0])
        g1=N.new('ShaderNodeMath'); g1.operation='GREATER_THAN'; g1.inputs[1].default_value=lo; L.new(f.outputs[0],g1.inputs[0])
        g2=N.new('ShaderNodeMath'); g2.operation='LESS_THAN'; g2.inputs[1].default_value=hi; L.new(f.outputs[0],g2.inputs[0])
        m_=N.new('ShaderNodeMath'); m_.operation='MULTIPLY'; L.new(g1.outputs[0],m_.inputs[0]); L.new(g2.outputs[0],m_.inputs[1]); return m_.outputs[0],a.outputs[0]
    mx_,cellx=frac_mask(mth.outputs[0],2.2,0.3,0.7); mz_,cellz=frac_mask(sep.outputs['Z'],3.3,0.25,0.8)
    win=N.new('ShaderNodeMath'); win.operation='MULTIPLY'; L.new(mx_,win.inputs[0]); L.new(mz_,win.inputs[1])
    gz=N.new('ShaderNodeMath'); gz.operation='GREATER_THAN'; gz.inputs[1].default_value=3.4; L.new(sep.outputs['Z'],gz.inputs[0])
    win2=N.new('ShaderNodeMath'); win2.operation='MULTIPLY'; L.new(win.outputs[0],win2.inputs[0]); L.new(gz.outputs[0],win2.inputs[1])
    # random lit windows
    fl1=N.new('ShaderNodeMath'); fl1.operation='FLOOR'; L.new(cellx,fl1.inputs[0]); fl2=N.new('ShaderNodeMath'); fl2.operation='FLOOR'; L.new(cellz,fl2.inputs[0])
    cc=N.new('ShaderNodeCombineXYZ'); L.new(fl1.outputs[0],cc.inputs['X']); L.new(fl2.outputs[0],cc.inputs['Y']); cc.inputs['Z'].default_value=seed
    wn=N.new('ShaderNodeTexWhiteNoise'); wn.noise_dimensions='3D'; L.new(cc.outputs['Vector'],wn.inputs['Vector'])
    lit=N.new('ShaderNodeMath'); lit.operation='GREATER_THAN'; lit.inputs[1].default_value=0.6; L.new(wn.outputs['Value'],lit.inputs[0])
    litw=N.new('ShaderNodeMath'); litw.operation='MULTIPLY'; L.new(lit.outputs[0],litw.inputs[0]); L.new(win2.outputs[0],litw.inputs[1])
    # stone noise on wall
    nz=N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value=3; L.new(tc.outputs['Object'],nz.inputs['Vector'])
    wc=N.new('ShaderNodeMix'); wc.data_type='RGBA'; wc.inputs[6].default_value=(*wall,1); wc.inputs[7].default_value=(wall[0]*0.82,wall[1]*0.8,wall[2]*0.78,1); L.new(nz.outputs['Fac'],wc.inputs['Factor'])
    col=N.new('ShaderNodeMix'); col.data_type='RGBA'; L.new(win2.outputs[0],col.inputs['Factor']); L.new(wc.outputs['Result'],col.inputs[6]); col.inputs[7].default_value=(0.05,0.07,0.12,1)
    L.new(col.outputs['Result'],b.inputs['Base Color'])
    rg=N.new('ShaderNodeMapRange'); rg.inputs['To Min'].default_value=0.75; rg.inputs['To Max'].default_value=0.08; L.new(win2.outputs[0],rg.inputs['Value']); L.new(rg.outputs['Result'],b.inputs['Roughness'])
    b.inputs['Emission Color'].default_value=(1.0,0.62,0.25,1); L.new(litw.outputs[0],b.inputs['Emission Strength'])
    em=N.new('ShaderNodeMath'); em.operation='MULTIPLY'; em.inputs[1].default_value=1.6; L.new(litw.outputs[0],em.inputs[0]); L.new(em.outputs[0],b.inputs['Emission Strength'])
    bp=N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value=0.5; bp.invert=True; L.new(win2.outputs[0],bp.inputs['Height']); L.new(bp.outputs['Normal'],b.inputs['Normal'])
    return m
WALLS=[facade_mat('w%d'%i,c,i*3.1) for i,c in enumerate([(1.0,0.78,0.45),(0.95,0.62,0.5),(1.0,0.88,0.6)])]
roof=mat('roof',(0.08,0.16,0.55),0.6); iron=mat('iron',(0.02,0.02,0.025),0.4,0.8)
stone=mat('stone',(1.0,0.95,0.85),0.8); chim=mat('chim',(0.45,0.2,0.14),0.8)
shopc=[mat('shop%d'%i,c,0.6) for i,c in enumerate([(0.8,0.05,0.08),(0.05,0.3,0.8),(0.1,0.6,0.2)])]
glass=mat('glasslit',(0.1,0.1,0.1),0.05,0,(1.0,0.7,0.35),3.0)
walk=mat('walk',(0.75,0.68,0.62),0.85); curb=mat('curb',(0.6,0.58,0.55),0.6)
tower=mat('tower',(0.5,0.22,0.08),0.6,0.2)
skin=mat('skin',(1.0,0.66,0.48),0.6); hood=mat('hood',(0.06,0.1,0.42),0.85); jeans=mat('jeans',(0.12,0.35,0.9),0.85)
white=mat('white',(0.92,0.92,0.95),0.45); dark=mat('dark',(0.01,0.01,0.012),0.3); hair=mat('hair',(0.09,0.05,0.03),0.7)
wood=mat('wood',(0.3,0.18,0.08),0.6); leaf=mat('leaf',(0.15,0.65,0.1),0.85); bark=mat('bark',(0.45,0.25,0.1),0.9)
lamp=mat('lampglass',(1,1,1),0.2,0,(1.0,0.8,0.45),12)
flagm=bpy.data.materials.new('flag'); flagm.use_nodes=True; N,L=nodes(flagm); b=N['Principled BSDF']
tc=N.new('ShaderNodeTexCoord'); sp=N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['UV'],sp.inputs['Vector'])
crr=N.new('ShaderNodeValToRGB'); crr.color_ramp.interpolation='CONSTANT'; e=crr.color_ramp.elements
e[0].position=0; e[0].color=(0.0,0.08,0.45,1); e[1].position=1/3; e[1].color=(0.95,0.95,0.95,1); e.new(2/3).color=(0.85,0.05,0.06,1)
L.new(sp.outputs['X'],crr.inputs['Fac']); L.new(crr.outputs['Color'],b.inputs['Base Color']); b.inputs['Roughness'].default_value=0.7
b.inputs['Sheen Weight'].default_value=0.4
# ---------------- ground ----------------
bpy.ops.mesh.primitive_plane_add(size=1,location=(0,40,0)); g=bpy.context.object; g.scale=(9,120,1); bpy.ops.object.transform_apply(scale=True); link_obj(g,cob)
for sd in (-1,1):
    box('walk',(sd*6.75,40,0.09),(4.5,120,0.18),walk); box('curb',(sd*4.55,40,0.09),(0.2,120,0.2),curb)
# ---------------- buildings both sides ----------------
def building(x0,y0,w,side,i):
    h=17+R.random()*3; d=12; cx=x0+side*(d/2)
    o=box('b',(cx,y0+w/2,h/2),(d,w-0.15,h),WALLS[i%3])
    # shop floor
    box('shop',(x0-side*0.02,y0+w/2,2.1),(0.3,w-0.4,3.6),shopc[i%3])
    box('vitr',(x0-side*0.12,y0+w/2-w*0.12,2.0),(0.12,w*0.5,2.4),glass)
    # cornices + balconies
    box('cor',(x0-side*0.25,y0+w/2,h),(0.7,w,0.35),stone)
    for zz in (7.8,14.4):
        box('balc',(x0-side*0.45,y0+w/2,zz),(0.9,w-0.4,0.12),stone); box('rail',(x0-side*0.88,y0+w/2,zz+0.5),(0.04,w-0.4,0.06),iron)
        for k in range(int(w/0.25)): box('bar',(x0-side*0.88,y0+0.3+k*0.25,zz+0.27),(0.03,0.03,0.5),iron)
    box('cor2',(x0-side*0.12,y0+w/2,4.0),(0.3,w,0.25),stone)
    # mansard roof
    bpy.ops.mesh.primitive_cube_add(location=(cx,y0+w/2,h+1.6)); r=bpy.context.object; r.scale=(d/2,(w-0.15)/2,1.6)
    bpy.ops.object.mode_set(mode='EDIT'); bm=bmesh.from_edit_mesh(r.data)
    for v in bm.verts:
        if v.co.z>0: v.co.x*=0.65
    bmesh.update_edit_mesh(r.data); bpy.ops.object.mode_set(mode='OBJECT'); link_obj(r,roof)
    for k in range(int(w/2.2)):
        box('dorm',(x0+side*1.4,y0+1.1+k*2.2,h+1.4),(0.6,0.9,1.4),stone); box('dwin',(x0+side*1.08,y0+1.1+k*2.2,h+1.35),(0.06,0.6,0.9),glass if R.random()>0.5 else dark)
    for k in range(2): box('ch',(cx+side*R.uniform(-1,2),y0+w*(0.25+0.5*k),h+3.6),(0.8,1.4,2.0),chim)
y=-6; i=0
while y<70:
    w=13+R.random()*5
    building(-4.5-4.5,y,w,-1,i); building(4.5+4.5,y,w,1,i+1); y+=w; i+=1
# ---------------- Eiffel tower (lattice via wireframe) ----------------
def eiffel(base,H):
    bm=bmesh.new(); rings=[]
    for k in range(37):
        yy=k/36*0.92; hw=max(0.012,0.19*math.exp(-3.25*yy)-0.004*yy)*H
        rings.append([bm.verts.new((base[0]+sx*hw,base[1]+sy*hw,yy*H)) for sx,sy in ((-1,-1),(1,-1),(1,1),(-1,1))])
    for a,b_ in zip(rings,rings[1:]):
        for j in range(4): bm.faces.new((a[j],a[(j+1)%4],b_[(j+1)%4],b_[j]))
    bmesh.ops.poke(bm,faces=bm.faces[:])
    me=bpy.data.meshes.new('eiffel'); bm.to_mesh(me); o=bpy.data.objects.new('eiffel',me); sc.collection.objects.link(o)
    md=o.modifiers.new('sub','SUBDIVIDE') if False else None
    w=o.modifiers.new('w','WIREFRAME'); w.thickness=0.0035*H; w.use_replace=True
    link_obj(o,tower)
    # inner solid core to read as dense lattice
    for (yy,ext,th) in ((0.17,0.012,0.02),(0.345,0.008,0.014),(0.835,0.004,0.012)):
        hw=(max(0.012,0.19*math.exp(-3.25*yy))+ext)*H; box('plat',(base[0],base[1],yy*H),(2*hw,2*hw,th*H),tower)
    cyl('ant',(base[0],base[1],0.97*H),0.003*H,0.12*H,tower)
eiffel((0,135),130)
NOL=bpy.data.collections.new('NoLine'); sc.collection.children.link(NOL)
for o in [o for o in sc.objects if o.data and o.data.materials and o.data.materials[0].name=='tower']:
    for c in o.users_collection: c.objects.unlink(o)
    NOL.objects.link(o)
# second lattice layer diagonal (rotated 45) for density
# ---------------- street furniture ----------------
for yy in range(0,60,12):
    for sd in (-1,1):
        x=sd*5.2; cyl('lp',(x,yy,2.2),0.07,4.4,iron); sph('lg',(x,yy,4.55),0.22,lamp)
        if yy%24==0:
            cyl('tr',(sd*6.2,yy+6,1.6),0.18,3.2,bark)
            for k in range(7): sph('lf',(sd*6.2+R.uniform(-1,1),yy+6+R.uniform(-1,1),3.6+R.uniform(0,1.6)),R.uniform(0.9,1.4),leaf,seg=16)
# a few cars
def car(x,y,col):
    m=mat('car',col,0.25,0.5); box('cb',(x,y,0.6),(1.8,4.4,0.7),m,0.2,3); box('ct',(x,y-0.2,1.15),(1.6,2.3,0.6),m,0.25,3)
    box('cw',(x,y-0.2,1.17),(1.62,2.0,0.45),dark,0.15,2)
    for dx in (-0.85,0.85):
        for dy in (-1.4,1.4): cyl('wh',(x+dx,y+dy,0.35),0.35,0.3,dark,rot=(0,math.pi/2,0))
car(-3.2,8,(0.7,0.05,0.05)); car(3.0,20,(0.05,0.2,0.6)); car(-3.0,30,(0.9,0.75,0.1))
# ---------------- hero ----------------
HX,HY=0.6,6.0
hero=[]
def H(o): hero.append(o); return o
H(box('shoeL',(HX-0.1,HY-0.04,0.06),(0.12,0.29,0.12),white,0.05,4)); H(box('shoeR',(HX+0.1,HY-0.04,0.06),(0.12,0.29,0.12),white,0.05,4))
H(cyl('legL',(HX-0.1,HY,0.5),0.088,0.82,jeans)); H(cyl('legR',(HX+0.1,HY,0.5),0.088,0.82,jeans))
torso=H(box('torso',(HX,HY,1.16),(0.48,0.28,0.62),hood,0.12,6)); torso.modifiers.new('ss','SUBSURF').levels=2
H(box('cuff',(HX,HY,0.88),(0.47,0.27,0.07),hood,0.03,3))
H(box('pocket',(HX,HY-0.145,1.0),(0.28,0.02,0.15),mat('pk',(0.03,0.035,0.08),0.9),0.02,2))
H(cyl('zip',(HX,HY-0.145,1.2),0.006,0.5,mat('zp',(0.7,0.7,0.75),0.3,0.8)))
for sd in (-1,1): H(cyl('str',(HX+sd*0.05,HY-0.15,1.32),0.008,0.2,white))
for sd in (-1,1):
    H(cyl('arm',(HX+sd*0.29,HY,1.14),0.065,0.56,hood,rot=(0,-sd*0.06,0)))
    H(sph('hand',(HX+sd*0.31,HY-0.01,0.84),0.055,skin))
H(cyl('neck',(HX,HY,1.49),0.055,0.1,skin))
H(sph('hood',(HX,HY+0.035,1.63),0.17,hood,(1.05,1,1.08)))
head=H(sph('head',(HX,HY-0.03,1.63),0.128,skin,(0.95,0.92,1.08)))
H(sph('hair',(HX,HY-0.035,1.71),0.122,hair,(1,0.98,0.5)))
for sd in (-1,1):
    H(sph('eye',(HX+sd*0.045,HY-0.142,1.64),0.024,white,(1,0.45,1.25))); H(sph('pup',(HX+sd*0.045,HY-0.153,1.635),0.013,dark))
    H(box('brow',(HX+sd*0.047,HY-0.14,1.69),(0.05,0.01,0.012),hair))
    H(sph('cheek',(HX+sd*0.08,HY-0.12,1.59),0.02,mat('ck',(0.95,0.4,0.4),0.6),(1,0.3,0.6)))
bpy.ops.mesh.primitive_torus_add(major_radius=0.03,minor_radius=0.006,location=(HX,HY-0.145,1.585),rotation=(math.pi/2,0,0)); mo=bpy.context.object; link_obj(mo,mat('mouth',(0.35,0.05,0.05),0.5))
bpy.ops.object.mode_set(mode='EDIT'); bm=bmesh.from_edit_mesh(mo.data); bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.y>0.0],context='VERTS'); bmesh.update_edit_mesh(mo.data); bpy.ops.object.mode_set(mode='OBJECT')
H(cyl('pole',(HX-0.31,HY-0.06,1.3),0.013,1.05,wood))
bpy.ops.mesh.primitive_grid_add(x_subdivisions=24,y_subdivisions=14,size=1,location=(0,0,0)); fl=bpy.context.object; fl.name='flag'
fl.scale=(0.45,0.3,1); bpy.ops.object.transform_apply(scale=True)
fl.rotation_euler=(math.pi/2,0,0); fl.location=(HX-0.31-0.225-0.012,HY-0.06,1.64); link_obj(fl,flagm)
bpy.ops.object.shade_smooth()
vg=fl.vertex_groups.new(name='free')
for v in fl.data.vertices: vg.add([v.index],(0.225-v.co.x)/0.45,'REPLACE')   # 0 at pole (x=+0.225), 1 at free end
wv=fl.modifiers.new('wave','WAVE'); wv.use_x=True; wv.use_y=False; wv.height=0.035; wv.width=0.18; wv.speed=0.045; wv.narrowness=1.2; wv.vertex_group='free'; wv.use_normal=True; wv.start_position_x=0.3
fl.modifiers.new('sol','SOLIDIFY').thickness=0.004
# idle breathing
for f in (1,45,90,135,180):
    torso.scale=(1,1,1+0.015*math.sin(f/45*math.pi)); torso.keyframe_insert('scale',frame=f)
    head.rotation_euler=(0,0,0.12*math.sin(f/70)); head.keyframe_insert('rotation_euler',frame=f)
# ---------------- camera ----------------
cd=bpy.data.cameras.new('cam'); cam=bpy.data.objects.new('cam',cd); sc.collection.objects.link(cam); sc.camera=cam
cd.lens=30; cd.dof.use_dof=True; cd.dof.aperture_fstop=2.2
tgt=bpy.data.objects.new('tgt',None); sc.collection.objects.link(tgt); tgt.location=(HX,HY,1.35)
cd.dof.focus_object=tgt
tr=cam.constraints.new('TRACK_TO'); tr.target=tgt; tr.track_axis='TRACK_NEGATIVE_Z'; tr.up_axis='UP_Y'
keys=[(1,(2.8,-6,0.25)),(150,(1.4,3.2,1.0))]
for f,p in keys: cam.location=p; cam.keyframe_insert('location',frame=f)
tgt.location=(HX,HY+8,4.0); tgt.keyframe_insert('location',frame=1); tgt.location=(HX,HY,1.45); tgt.keyframe_insert('location',frame=150)
for o in (cam,tgt):
    for fc in o.animation_data.action.layers[0].strips[0].channelbag(o.animation_data.action.slots[0]).fcurves if hasattr(o.animation_data.action,'layers') else o.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation='BEZIER'; kp.easing='EASE_IN_OUT'
# ---------------- world: physical sky, golden hour ----------------
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; N,L=nodes(w)
bg=N['Background']
lp=N.new('ShaderNodeLightPath'); tc=N.new('ShaderNodeTexCoord'); sep=N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Generated'],sep.inputs['Vector'])
grd=N.new('ShaderNodeValToRGB'); grd.color_ramp.elements[0].position=0.5; grd.color_ramp.elements[0].color=(0.55,0.78,1.0,1); grd.color_ramp.elements[1].position=0.75; grd.color_ramp.elements[1].color=(0.12,0.42,0.95,1)
L.new(sep.outputs['Z'],grd.inputs['Fac'])
amb=N.new('ShaderNodeMix'); amb.data_type='RGBA'; amb.inputs[6].default_value=(0.42,0.5,0.62,1)
L.new(lp.outputs['Is Camera Ray'],amb.inputs['Factor']); L.new(grd.outputs['Color'],amb.inputs[7])
L.new(amb.outputs['Result'],bg.inputs['Color']); bg.inputs['Strength'].default_value=1.0
sun=bpy.data.lights.new('sun','SUN'); sun.energy=2.6; sun.color=(1.0,0.93,0.82); sun.angle=math.radians(1.5)
so=bpy.data.objects.new('sun',sun); sc.collection.objects.link(so); so.rotation_euler=(math.radians(55),0,math.radians(215))
# ---------------- render ----------------
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=int(sys.argv[sys.argv.index('--spp')+1]) if '--spp' in sys.argv else 20
sc.cycles.use_denoising=True
try: sc.cycles.denoiser='OPENIMAGEDENOISE'
except Exception: pass
sc.cycles.max_bounces=4; sc.cycles.diffuse_bounces=2; sc.cycles.glossy_bounces=2; sc.cycles.transparent_max_bounces=4
sc.render.resolution_x=540; sc.render.resolution_y=960; sc.render.fps=30; sc.frame_start=1; sc.frame_end=150
sc.render.use_motion_blur=True; sc.render.motion_blur_shutter=0.5
sc.render.use_persistent_data=True
sc.view_settings.view_transform='Standard'; sc.view_settings.look='AgX - Punchy' if 'AgX - Punchy' in [x.name for x in []] else 'None'
sc.view_settings.exposure=0.0
sc.render.use_freestyle=True; sc.render.line_thickness_mode='ABSOLUTE'; sc.render.line_thickness=1.3
vl=sc.view_layers[0]; vl.use_freestyle=True; fs=vl.freestyle_settings; ls=fs.linesets[0] if len(fs.linesets) else fs.linesets.new('ls')
ls.select_by_visibility=True; ls.select_by_collection=True; ls.collection=NOL; ls.collection_negation='EXCLUSIVE'; ls.select_silhouette=True; ls.select_border=True; ls.select_crease=True
ls.linestyle=ls.linestyle or bpy.data.linestyles.new('LS'); ls.linestyle.color=(0.05,0.04,0.08); ls.linestyle.thickness=1.3
sc.render.image_settings.file_format='JPEG'; sc.render.image_settings.quality=95
frames=FR or range(1,151)
import time
for f in frames:
    t0=time.time(); sc.frame_set(f); sc.render.filepath=f'{OUT}{f:04d}.jpg'; bpy.ops.render.render(write_still=True); print('FRAME',f,round(time.time()-t0,1),flush=True)
