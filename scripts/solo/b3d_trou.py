"""Blender (bpy) renderer for 'Et si tu sautais dans un trou…'. usage: python3 b3d_trou.py <shot> <nframes> <outdir> [preview]"""
import bpy,sys,math,os
from mathutils import Vector
shot=int(sys.argv[1]); NF=int(sys.argv[2]); OUT=sys.argv[3]; PREV=len(sys.argv)>4
os.makedirs(OUT,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=8 if not PREV else 6; sc.cycles.use_denoising=True
sc.cycles.max_bounces=4; sc.cycles.diffuse_bounces=2; sc.cycles.glossy_bounces=1; sc.cycles.transmission_bounces=2
sc.render.resolution_x=540; sc.render.resolution_y=960; sc.render.film_transparent=False
sc.view_settings.view_transform='AgX' if 'AgX' in [i.identifier for i in sc.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
M={}
def mat(name,col,emit=0.0,rough=0.6,ecol=None):
    if name in M: return M[name]
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*col,1); b.inputs['Roughness'].default_value=rough
    if emit>0:
        b.inputs['Emission Color'].default_value=(*(ecol or col),1); b.inputs['Emission Strength'].default_value=emit
    M[name]=m; return m
def box(loc,size,m,rot=(0,0,0),parent=None,name='b'):
    bpy.ops.mesh.primitive_cube_add(location=loc,rotation=rot); o=bpy.context.object; o.scale=(size[0]/2,size[1]/2,size[2]/2); o.data.materials.append(m)
    if parent: o.parent=parent
    return o
def cyl(loc,r,d,m,verts=48,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=d,location=loc,rotation=rot); o=bpy.context.object; o.data.materials.append(m); return o
def sphere(loc,r,m,seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=seg//2,radius=r,location=loc); o=bpy.context.object; o.data.materials.append(m)
    bpy.ops.object.shade_smooth(); return o
def empty(loc):
    bpy.ops.object.empty_add(location=loc); return bpy.context.object
def hero(loc,arms_up=False,s=1.0):
    root=empty(loc); root.scale=(s,s,s)
    navy=mat('navy',(0.03,0.04,0.12)); skin=mat('skin',(0.75,0.45,0.3)); hair=mat('hair',(0.05,0.03,0.02)); jeans=mat('jeans',(0.04,0.06,0.15)); white=mat('white',(0.9,0.9,0.9)); black=mat('black',(0.01,0.01,0.01))
    for sx in (-0.13,0.13):
        box((sx,0,0.35),(0.22,0.25,0.7),jeans,parent=root); box((sx,0.04,0.05),(0.24,0.36,0.12),white,parent=root)
    box((0,0,1.05),(0.62,0.38,0.75),navy,parent=root)
    box((0,0,1.7),(0.56,0.52,0.56),skin,parent=root); box((0,0,2.0),(0.6,0.56,0.14),hair,parent=root); box((0,0.22,1.9),(0.6,0.12,0.26),hair,parent=root)
    for sx in (-0.13,0.13):
        box((sx,-0.265,1.72),(0.12,0.02,0.14),white,parent=root); box((sx+0.02,-0.275,1.71),(0.06,0.02,0.08),black,parent=root)
    box((0,-0.27,1.55),(0.16,0.02,0.04),mat('mouth',(0.3,0.05,0.05)),parent=root)
    red=mat('fr_red',(0.8,0.05,0.07)); blu=mat('fr_blue',(0.0,0.12,0.5)); wht=mat('fr_white',(0.95,0.95,0.95)); wood=mat('wood',(0.3,0.18,0.08))
    for sx in (-0.42,0.42):
        z=1.55 if arms_up else 1.05; dz=0.75 if arms_up else 0.0
        box((sx,0,z+0.15 if arms_up else z),(0.2,0.2,0.7),navy,parent=root)
    hx=-0.42; hz=(2.05 if arms_up else 0.7)
    box((hx,-0.05,hz+0.45),(0.04,0.04,0.95),wood,parent=root)
    for j,m_ in enumerate((blu,wht,red)):
        box((hx-0.12-j*0.12,-0.05,hz+0.78),(0.12,0.02,0.26),m_,parent=root)
    return root
def light(loc,energy=3.0,kind='SUN',rot=(0.6,0.2,0.5),col=(1,0.95,0.9)):
    bpy.ops.object.light_add(type=kind,location=loc,rotation=rot); l=bpy.context.object; l.data.energy=energy; l.data.color=col
    if kind=='SUN': l.data.angle=0.2
    return l
def world(col,strength=1.0):
    w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; bg=w.node_tree.nodes['Background']; bg.inputs[0].default_value=(*col,1); bg.inputs[1].default_value=strength
def camera(loc,target,lens=35):
    bpy.ops.object.camera_add(location=loc); c=bpy.context.object; c.data.lens=lens; sc.camera=c
    d=Vector(target)-Vector(loc); c.rotation_euler=d.to_track_quat('-Z','Y').to_euler(); return c
def aim(c,loc,target):
    c.location=loc; d=Vector(target)-Vector(loc); c.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
# ---------------- scenes ----------------
def city():
    world((0.55,0.7,0.95),0.8); light((5,-5,10),3.5)
    asph=mat('asph',(0.08,0.08,0.09)); side=mat('side',(0.45,0.43,0.4)); hole=mat('hole',(0.0,0.0,0.0)); rim=mat('rim',(0.25,0.18,0.12))
    box((0,0,-0.05),(60,60,0.1),asph)
    for x in (-7,7): box((x,0,0.05),(4,60,0.2),side)
    cyl((0,2,-0.0),1.6,0.2,rim); cyl((0,2,0.02),1.4,0.2,hole)
    import random; random.seed(3)
    cols=[(0.85,0.75,0.6),(0.7,0.4,0.3),(0.4,0.5,0.65),(0.9,0.85,0.75),(0.55,0.35,0.3)]
    for side_x in (-12,12):
        y=-20
        while y<40:
            w=random.uniform(4,7); h=random.uniform(5,16); m=mat(f'bld{int(y)}{side_x}',random.choice(cols))
            box((side_x,y,h/2),(8,w,h),m)
            for wz in range(2,int(h)-1,2):
                for wy in (-w/4,w/4): box((side_x-4.02*(1 if side_x>0 else -1),y+wy,wz),(0.05,0.9,1.0),mat('win',(0.15,0.25,0.4),rough=0.1))
            y+=w+0.3
    # taxi + cones
    car=mat('car',(0.9,0.6,0.05)); box((-4,8,0.6),(1.8,4,1.0),car); box((-4,8,1.4),(1.6,2.2,0.7),car)
    for a in range(6):
        ang=a/6*2*math.pi; x,y=math.cos(ang)*2.1,2+math.sin(ang)*2.1; cyl((x,y,0.35),0.18,0.7,mat('cone',(0.95,0.35,0.05)),verts=12)
def tunnel(hot=0.0):
    world((0.0,0.0,0.0),0.0)
    for k in range(40):
        z=-k*1.0; t=k%3
        col=[(0.35,0.25,0.18),(0.28,0.2,0.15),(0.4,0.3,0.2)][t]
        if hot>0: col=(1.0,0.35,0.05)
        m=mat(f'ring{t}{hot}',col,emit=(0.8+0.5*t if hot>0 else 0.0),ecol=(1.0,0.25+0.1*t,0.02))
        bpy.ops.mesh.primitive_cylinder_add(vertices=40,radius=2.0,depth=1.0,location=(0,0,z),end_fill_type='NOTHING'); o=bpy.context.object; o.data.materials.append(m)
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.flip_normals(); bpy.ops.object.mode_set(mode='OBJECT')
    light((0,-1.2,-2.5),160 if hot==0 else 60,kind='POINT',col=(1,0.9,0.8)); light((0,0,-9.0),300 if hot==0 else 0.1,kind='POINT',col=(1,0.85,0.7))
def earth_cut():
    world((0.005,0.006,0.02),1.0); light((6,-8,6),4.0)
    crust=mat('crust',(0.1,0.35,0.8)); mantle=mat('mantle',(0.8,0.3,0.05),emit=0.5); outer=mat('outer',(1.0,0.55,0.1),emit=2.0); inner=mat('inner',(1.0,0.9,0.5),emit=4.0)
    layers=[(3.0,crust),(2.85,mantle),(1.6,outer),(0.75,inner)]
    for r,m in layers:
        s=sphere((0,0,0),r,m)
        bpy.ops.mesh.primitive_cube_add(size=8,location=(0,-4,0)); cut=bpy.context.object
        mod=s.modifiers.new('cut','BOOLEAN'); mod.operation='DIFFERENCE'; mod.object=cut
        bpy.context.view_layer.objects.active=s; bpy.ops.object.modifier_apply(modifier='cut'); bpy.data.objects.remove(cut)
    # land patches on crust (simple)
    cyl((0,0,0),0.12,6.3,mat('tun',(0.02,0.02,0.02)),verts=16)
def ocean():
    world((0.5,0.7,0.95),1.0); light((4,-6,8),4.0)
    sea=mat('sea',(0.02,0.18,0.35),rough=0.15)
    bpy.ops.mesh.primitive_plane_add(size=80,location=(0,0,0)); p=bpy.context.object; p.data.materials.append(sea)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=60); bpy.ops.object.mode_set(mode='OBJECT')
    import random; random.seed(1)
    for v in p.data.vertices: v.co.z=0.12*math.sin(v.co.x*0.9)+0.08*math.cos(v.co.y*1.3)
    cyl((0,0,0.05),1.3,0.1,mat('hole',(0,0,0)))
# ---------------- shot setup ----------------
fps=12
if shot in (0,1,7):
    city(); H=hero((0.0,0.0,0.0)); c=camera((3,-7,3),(0,1,1.2),lens=32)
elif shot==2:
    tunnel(); H=hero((0,0.5,-4),arms_up=True); c=camera((0,-1.5,-2.2),(0,0.5,-3.2),lens=20)
elif shot==3:
    tunnel(hot=1.0); H=hero((0,0.5,-4),arms_up=True); c=camera((0,-1.5,-2.2),(0,0.5,-3.2),lens=20)
elif shot in (4,6):
    earth_cut(); dot=sphere((0,0,3.2),0.14,mat('dot',(1,1,1),emit=5.0)); c=camera((7,-9,3),(0,0,0),lens=40)
elif shot==5:
    ocean(); H=hero((0,0,-2.5),arms_up=True); c=camera((3.5,-6,2.5),(0,0,1.0),lens=30)
for f in range(NF):
    p=f/max(1,NF-1)
    if shot==0: aim(c,(3-1.5*p,-7+2.5*p,3-0.8*p),(0,1,1.2))
    elif shot==1: aim(c,(1.5,-4.5,2.2),(0,1,1.2)); H.location=(0,0,0.1*math.sin(p*6))
    elif shot==7: aim(c,(5*math.cos(-1.2+p*0.6),2+5*math.sin(-1.2+p*0.6)-2,3.5),(0,1.5,1.0))
    elif shot in (2,3):
        # walls move up past hero: move all rings by offset
        for o in bpy.data.objects:
            if o.type=='MESH' and o.parent is None and o.name.startswith('Cylinder'):
                base=o.get('z0');
                if base is None: o['z0']=o.location.z; base=o['z0']
                o.location.z=((base+p*(25 if shot==2 else 12)) % 40)-38
        H.rotation_euler=(0.08*math.sin(p*9),0.08*math.cos(p*7),0.15*math.sin(p*4))
    elif shot==4:
        z=3.2*math.cos(p*math.pi); dot.location=(0,0,z); aim(c,(7-1*p,-9+1*p,3),(0,0,0))
    elif shot==6:
        z=3.2*math.cos(p*math.pi*4); dot.location=(0,0,z); aim(c,(7*math.cos(-0.9+p*0.5),7*math.sin(-0.9+p*0.5),3),(0,0,0))
    elif shot==5:
        H.location=(0,0,-2.5+3.6*min(1,p*1.6)-max(0,p*1.6-1)*0.4); aim(c,(3.5,-6,2.5+p*0.5),(0,0,1.0))
    sc.render.filepath=f'{OUT}/{f:04d}.png'
    bpy.ops.render.render(write_still=True)
print('DONE',shot,NF)
