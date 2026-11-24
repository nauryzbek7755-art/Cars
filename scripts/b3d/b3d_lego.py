import bpy,bmesh,math,sys,random
OUT=sys.argv[sys.argv.index('--out')+1]; FR=[int(x) for x in sys.argv[sys.argv.index('--frames')+1].split(',')] if '--frames' in sys.argv else None
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene; R=random.Random(3)
P=0.8  # stud pitch (cm-ish units -> we use 1 unit = 1 cm, stud pitch 0.8)
def mat(name,col,rough=0.22,coat=0.6):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*col,1); b.inputs['Roughness'].default_value=rough
    try: b.inputs['Coat Weight'].default_value=coat; b.inputs['Coat Roughness'].default_value=0.08
    except Exception: pass
    return m
MATS={}
def M(col):
    if col not in MATS: MATS[col]=mat(str(col),col)
    return MATS[col]
STUD=None
def stud_proto():
    global STUD
    bpy.ops.mesh.primitive_cylinder_add(radius=0.24,depth=0.18,vertices=20,location=(0,0,-100)); STUD=bpy.context.object; bpy.ops.object.shade_smooth()
stud_proto()
def brick(x,y,z,nx,ny,col,h=0.96,studs=True):
    bpy.ops.mesh.primitive_cube_add(location=(x+nx*P/2,y+ny*P/2,z+h/2)); o=bpy.context.object; o.scale=(nx*P/2-0.005,ny*P/2-0.005,h/2); bpy.ops.object.transform_apply(scale=True)
    bv=o.modifiers.new('b','BEVEL'); bv.width=0.03; bv.segments=2; o.data.materials.append(M(col))
    if studs:
        for i in range(nx):
            for j in range(ny):
                s=bpy.data.objects.new('st',STUD.data); sc.collection.objects.link(s); s.location=(x+P/2+i*P,y+P/2+j*P,z+h+0.09); s.data.materials.clear() if False else None; s.active_material=M(col)
    return o
# share stud mesh but per-object material: use object-linked material slot
STUD.data.materials.append(M((1,1,1)))
STUD.material_slots[0].link='OBJECT'
def link_obj_mat(o,col): o.material_slots[0].link='OBJECT'; o.material_slots[0].material=M(col)
_brick=brick
def brick(x,y,z,nx,ny,col,h=0.96,studs=True):
    o=_brick(x,y,z,nx,ny,col,h,False)
    if studs:
        for i in range(nx):
            for j in range(ny):
                s=bpy.data.objects.new('st',STUD.data); sc.collection.objects.link(s); s.location=(x+P/2+i*P,y+P/2+j*P,z+h+0.09)
                s.material_slots[0].link='OBJECT'; s.material_slots[0].material=M(col)
    return o
# ---- baseplate ----
G=(0.12,0.55,0.15)
brick(-16,-8,-0.32,40,40,G,h=0.32,studs=False)
for i in range(-12,14):
    for j in range(-6,16):
        s=bpy.data.objects.new('st',STUD.data); sc.collection.objects.link(s); s.location=(i*P+P/2,j*P+P/2,0.09); s.material_slots[0].link='OBJECT'; s.material_slots[0].material=M(G)
# road
brick(-16,-1.6,0,40,4,(0.35,0.36,0.4),h=0.32,studs=False)
# ---- houses (walls of bricks, running bond) ----
def house(x0,y0,w,rows,col,roof,win=(0.55,0.8,0.95)):
    for r in range(rows):
        z=r*0.96; x=x0-(P if r%2 else 0); 
        while x<x0+w*P-0.01:
            n=2 if x+2*P<=x0+w*P+0.01 else 1
            xs=max(x,x0); nn=int(round((min(x+n*P,x0+w*P)-xs)/P))
            if nn>0:
                if 1<=r<=rows-2 and r%3!=0 and int((xs-x0)/P)%3==1: brick(xs,y0,z,nn,2,win,studs=False)
                else: brick(xs,y0,z,nn,2,col,studs=(r==rows-1))
            x+=n*P
    for k in range(w//2):
        brick(x0+k*P,y0,rows*0.96+k*0.96,w-2*k,2,roof)
house(-9,6,8,9,(0.95,0.78,0.42),(0.75,0.12,0.1))
house(2,7,7,11,(0.95,0.95,0.92),(0.12,0.35,0.8))
house(-1,12,5,14,(0.9,0.55,0.25),(0.3,0.2,0.15))
house(9,6,6,8,(0.6,0.8,0.45),(0.9,0.75,0.1))
# tower (stepped)
for r in range(26):
    w=max(1,int((26-r)*0.28)); brick(-5-w*P/2+4,20,r*0.96,w,w,(0.55,0.3,0.12) if r%4 else (0.4,0.2,0.08),studs=(r==25))
# trees
for (tx,ty) in ((-11,3),(7,3.5),(12,9)):
    brick(tx,ty,0,1,1,(0.4,0.25,0.12),h=2.9,studs=False)
    for k in range(3): brick(tx-P*(1-k*0.5),ty-P*(1-k*0.5),2.9+k*0.96,3-k,3-k,(0.1,0.5,0.15))
# car
def car(x,y,col):
    brick(x,y,0.32,5,2,(0.2,0.2,0.22),h=0.32,studs=False); brick(x,y,0.64,5,2,col,studs=False); brick(x+P,y,1.6,2,2,col)
    brick(x+3*P,y,1.6,1,2,(0.6,0.85,1.0),studs=False)
    for dx in (0.6,3.4):
        for dy in (-0.05,1.65):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.42,depth=0.3,location=(x+dx,y+dy,0.52),rotation=(math.pi/2,0,0),vertices=24); w=bpy.context.object; w.data.materials.append(M((0.05,0.05,0.05)))
car(-6,-1.2,(0.85,0.08,0.08))
# ---- minifig (approx real proportions, 1 unit ~ 1 cm) ----
FX,FY=1.2,0.6
fig=[]
def F(o): fig.append(o); return o
blue=(0.08,0.12,0.5); jean=(0.12,0.3,0.75); yel=(1.0,0.78,0.05); hair=(0.3,0.16,0.07)
def box(name,c,size,col,bev=0.03):
    bpy.ops.mesh.primitive_cube_add(location=c); o=F(bpy.context.object); o.scale=(size[0]/2,size[1]/2,size[2]/2); bpy.ops.object.transform_apply(scale=True)
    if bev: bd=o.modifiers.new('b','BEVEL'); bd.width=bev; bd.segments=3
    o.data.materials.append(M(col)); return o
# legs + feet
for sd in (-1,1):
    box('leg',(FX+sd*0.395,FY,0.32+0.6),(0.77,0.8,1.2),jean)
    box('foot',(FX+sd*0.395,FY-0.06,0.32+0.12),(0.79,0.92,0.24),(0.1,0.25,0.65))
box('hips',(FX,FY,1.52+0.16),(1.56,0.8,0.32),(0.1,0.25,0.65))
# torso: tapered (bottom 1.56 wide -> top 1.2), depth 0.8
bpy.ops.mesh.primitive_cube_add(location=(FX,FY,1.84+0.64)); tor=F(bpy.context.object); tor.scale=(0.78,0.4,0.64); bpy.ops.object.transform_apply(scale=True)
bpy.ops.object.mode_set(mode='EDIT'); bm=bmesh.from_edit_mesh(tor.data)
for v in bm.verts:
    if v.co.z>0: v.co.x*=0.77
bmesh.update_edit_mesh(tor.data); bpy.ops.object.mode_set(mode='OBJECT'); bd=tor.modifiers.new('b','BEVEL'); bd.width=0.04; bd.segments=3; tor.data.materials.append(M(blue))
box('pocket',(FX,FY-0.405,2.12),(0.72,0.02,0.26),(0.04,0.06,0.28),0)
box('zip',(FX,FY-0.406,2.55),(0.03,0.02,1.0),(0.03,0.04,0.2),0)
for sd in (-1,1): box('str',(FX+sd*0.12,FY-0.41,2.85),(0.035,0.02,0.4),(0.95,0.95,0.95),0)
box('fl1',(FX+0.36,FY-0.405,2.9),(0.08,0.02,0.16),(0,0.1,0.55),0); box('fl2',(FX+0.44,FY-0.405,2.9),(0.08,0.02,0.16),(0.95,0.95,0.95),0); box('fl3',(FX+0.52,FY-0.405,2.9),(0.08,0.02,0.16),(0.85,0.05,0.05),0)
# arms on shoulder pivots
arms=[]
for sd in (-1,1):
    px,pz=FX+sd*0.7,2.95
    piv=bpy.data.objects.new('piv',None); sc.collection.objects.link(piv); piv.location=(px,FY,pz)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.19,depth=0.8,location=(px,FY,pz-0.4)); a=F(bpy.context.object); bpy.ops.object.shade_smooth(); a.data.materials.append(M(blue))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2,location=(px,FY,pz)); sh=F(bpy.context.object); bpy.ops.object.shade_smooth(); sh.data.materials.append(M(blue))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.09,depth=0.16,location=(px,FY,pz-0.87)); w_=F(bpy.context.object); w_.data.materials.append(M(yel))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.16,minor_radius=0.07,location=(px,FY,pz-1.04),rotation=(math.pi/2,0,0)); h_=F(bpy.context.object); h_.data.materials.append(M(yel))
    for o in (a,sh,w_,h_): o.parent=piv; o.matrix_parent_inverse=piv.matrix_world.inverted()
    piv.rotation_euler=(0,-sd*0.12,0); arms.append(piv)
# neck + head + stud
bpy.ops.mesh.primitive_cylinder_add(radius=0.3,depth=0.14,location=(FX,FY,3.19)); F(bpy.context.object).data.materials.append(M(yel))
bpy.ops.mesh.primitive_cylinder_add(radius=0.48,depth=0.88,location=(FX,FY,3.26+0.44),vertices=48); head=F(bpy.context.object); bd=head.modifiers.new('b','BEVEL'); bd.width=0.12; bd.segments=4; bpy.ops.object.shade_smooth(); head.data.materials.append(M(yel))
bpy.ops.mesh.primitive_cylinder_add(radius=0.3,depth=0.17,location=(FX,FY,4.14+0.085),vertices=32); F(bpy.context.object).data.materials.append(M(yel))
# hair cap
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.56,location=(FX,FY+0.03,3.95),segments=48,ring_count=24); hr=F(bpy.context.object); hr.scale=(1,1,0.7); bpy.ops.object.shade_smooth(); hr.data.materials.append(M(hair))
bpy.ops.object.mode_set(mode='EDIT'); bm=bmesh.from_edit_mesh(hr.data); bmesh.ops.delete(bm,geom=[v for v in bm.verts if (v.co.z<0.05 and v.co.y<0.25) or v.co.z<-0.55],context='VERTS'); bmesh.update_edit_mesh(hr.data); bpy.ops.object.mode_set(mode='OBJECT')
hr.modifiers.new('sol','SOLIDIFY').thickness=0.05
# face print
blk=M((0.02,0.02,0.02))
for sd in (-1,1):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065,location=(FX+sd*0.16,FY-0.47,3.8)); e=F(bpy.context.object); e.scale=(1,0.35,1.3); e.data.materials.append(blk)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.02,location=(FX+sd*0.16-0.02,FY-0.495,3.83)); F(bpy.context.object).data.materials.append(M((1,1,1)))
bpy.ops.mesh.primitive_torus_add(major_radius=0.17,minor_radius=0.028,location=(FX,FY-0.465,3.63),rotation=(math.pi/2,0,0)); mo=F(bpy.context.object); mo.data.materials.append(blk)
bpy.ops.object.mode_set(mode='EDIT'); bm=bmesh.from_edit_mesh(mo.data); bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.y>-0.03],context='VERTS'); bmesh.update_edit_mesh(mo.data); bpy.ops.object.mode_set(mode='OBJECT')
# flag on pole in left hand
bpy.ops.mesh.primitive_cylinder_add(radius=0.05,depth=3.0,location=(FX-0.78,FY,3.0)); F(bpy.context.object).data.materials.append(M((0.45,0.3,0.15)))
fm=bpy.data.materials.new('flag'); fm.use_nodes=True; N=fm.node_tree.nodes; Lk=fm.node_tree.links; b=N['Principled BSDF']
tc=N.new('ShaderNodeTexCoord'); sp=N.new('ShaderNodeSeparateXYZ'); Lk.new(tc.outputs['UV'],sp.inputs['Vector']); cr=N.new('ShaderNodeValToRGB'); cr.color_ramp.interpolation='CONSTANT'
e=cr.color_ramp.elements; e[0].position=0; e[0].color=(0.85,0.03,0.05,1); e[1].position=1/3; e[1].color=(0.95,0.95,0.95,1); e.new(2/3).color=(0.0,0.08,0.5,1); Lk.new(sp.outputs['X'],cr.inputs['Fac']); Lk.new(cr.outputs['Color'],b.inputs['Base Color']); b.inputs['Roughness'].default_value=0.6
bpy.ops.mesh.primitive_grid_add(x_subdivisions=20,y_subdivisions=12,size=1); fl=bpy.context.object; fl.scale=(1.2,0.8,1); bpy.ops.object.transform_apply(scale=True); fl.rotation_euler=(math.pi/2,0,0); fl.location=(FX-0.78-0.6,FY,4.1); fl.data.materials.append(fm); bpy.ops.object.shade_smooth()
vg=fl.vertex_groups.new(name='w')
for v in fl.data.vertices: vg.add([v.index],(0.6-v.co.x)/1.2,'REPLACE')
wv=fl.modifiers.new('wave','WAVE'); wv.use_y=False; wv.height=0.08; wv.width=0.5; wv.speed=0.08; wv.vertex_group='w'; wv.use_normal=True
# arm wave animation (right arm) + head turn
ra=arms[1]
for f,ang in ((1,0.0),(18,-2.4),(28,-2.0),(38,-2.5),(48,-2.0),(58,-2.4),(75,-2.1)):
    ra.rotation_euler=(0,ang,0); ra.keyframe_insert('rotation_euler',frame=f)
for f,ang in ((1,0.0),(30,0.25),(75,-0.1)):
    head.rotation_euler=(0,0,ang); head.keyframe_insert('rotation_euler',frame=f)
# ---- camera ----
cd=bpy.data.cameras.new('c'); cam=bpy.data.objects.new('c',cd); sc.collection.objects.link(cam); sc.camera=cam; cd.lens=36
cd.dof.use_dof=True; cd.dof.aperture_fstop=1.6
tg=bpy.data.objects.new('t',None); sc.collection.objects.link(tg); tg.location=(FX,FY,2.6); cd.dof.focus_object=tg
tr=cam.constraints.new('TRACK_TO'); tr.target=tg; tr.track_axis='TRACK_NEGATIVE_Z'; tr.up_axis='UP_Y'
for f,p in ((1,(5.5,-11,1.2)),(75,(2.6,-9.5,2.9))): cam.location=p; cam.keyframe_insert('location',frame=f)
# ---- light ----
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; bg=w.node_tree.nodes['Background']; bg.inputs['Color'].default_value=(0.45,0.7,1.0,1); bg.inputs['Strength'].default_value=0.9
sun=bpy.data.lights.new('s','SUN'); sun.energy=3.0; sun.angle=math.radians(8); so=bpy.data.objects.new('s',sun); sc.collection.objects.link(so); so.rotation_euler=(math.radians(50),math.radians(10),math.radians(-35))
ar=bpy.data.lights.new('a','AREA'); ar.energy=300; ar.size=8; ao=bpy.data.objects.new('a',ar); sc.collection.objects.link(ao); ao.location=(-4,-9,7); ao.rotation_euler=(math.radians(55),0,math.radians(-25))
# ---- render ----
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=12; sc.cycles.use_denoising=True
sc.cycles.max_bounces=3; sc.cycles.diffuse_bounces=2; sc.cycles.glossy_bounces=2
sc.render.resolution_x=432; sc.render.resolution_y=768; sc.render.fps=15; sc.frame_start=1; sc.frame_end=75
sc.render.use_motion_blur=True; sc.render.motion_blur_shutter=0.5; sc.render.use_persistent_data=True
sc.view_settings.view_transform='Standard'; sc.view_settings.exposure=-0.35
sc.render.image_settings.file_format='JPEG'; sc.render.image_settings.quality=95
import time
for f in (FR or range(1,76)):
    t0=time.time(); sc.frame_set(f); sc.render.filepath=f'{OUT}{f:04d}.jpg'; bpy.ops.render.render(write_still=True); print('FRAME',f,round(time.time()-t0,1),flush=True)
