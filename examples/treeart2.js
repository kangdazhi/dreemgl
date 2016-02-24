define.class("$server/composition",function(require, $ui$, screen, view) {
	this.render = function() {
		return [screen(
			view({
				flex:1,
				init:function(){
					console.log(this.screen.size)
					console.log('here')
				},
				bgcolor:'red',
				hardrect:{
					color:function(){
						var len = min(pow(1.5-length(mesh.pos),8.),1.)
						if(mesh.depth>13.) return pal.pal5(0.1*colornoise+0.1*view.time)*len
						return mix('brown',pal.pal5(0.1*colornoise + mesh.pos.y+mesh.depth/14+0.1*view.time),mesh.depth/12)*sin(mesh.pos.y*PI)
					},
					// the geometry structure, position, path (a power of 2 float mask) and depth of the rect
					mesh:define.struct({
						pos:vec2,
						path:float,
						depth:float
					}).array(),
					position:function(){
						
						// the path is a set of float 'bits' that can be walked to go left or right
						var path = mesh.path
						// cumulative position of the tree branch or leaf
						var pos = vec2(0,0)
						// cumulative scale
						var scale = vec2(1,1)
						// the direction vector is rotated as we go
						var dir = vec2(0,-0.8)
						// the turbulence factor
						var turbulence = 3.
						// the depth of the rectangle we are processing
						var depth = int(mesh.depth)
						// run over the whole depth
						for(var i = 0; i < 14; i++){
							if(i >= depth) break
							// this is like path&1 binary arithmetic done using floats
							var right = mod(path, 2.)	
							// its the right branch
						    if(right>0.){
						    	dir = math.rotate2d(dir, 25.*math.DEG+0.01*turbulence*sin(view.time))
						    }
						    else{ // left
						    	dir = math.rotate2d(dir, -25.*math.DEG+0.01*turbulence*sin(view.time))
						    }
						    // accumulate position scale
						    pos += (dir * scale)*1.9
						    scale = scale * vec2(0.85,0.85)
						    // this is like path = path >>1 in float
							path = floor(path / 2.)
						}
						// our colornoise varying
						colornoise = 0.
						// the leaves have a different scale/center than the branches so make it tweakable
						var vscale = vec2(1.,.5)
						var vcen = vec2(-.8,-.4)
						// we are a leaf
						if(depth > 13){
							var noise = noise.noise3d(vec3(pos.x*.3,pos.y*.3,0.5*view.time)) * turbulence
							colornoise = noise
							dir = math.rotate2d(dir, -50.*math.DEG*noise)
							scale *= vec2(1,4.)
							vscale = vec2(3.,.5)
							vcen = vec2(0.8,0.)
						}
						// compute the final position
						var p = (math.rotate2d((mesh.pos*vscale+vcen)*scale, atan(dir.y,dir.x)) + pos)  * vec2(30,30) + vec2(300,400)

						return vec4(p, 0, 1) * view.totalmatrix * view.viewmatrix
					},
					update:function(){
						var mesh = this.mesh = this.mesh.struct.array()

						// first triangle
						function recur(path, depth){

							// we push plain rectangles in the geometry buffer with just the path + depth added
							mesh.pushQuad(
								-1,-1, path, depth,
								1,-1, path, depth,
								-1,1, path, depth,
								1,1, path, depth
							)
							// bail when at level 14
							if(depth>13)return
							// recur left and right, encode the 'right' with a power of 2 'flag' in the path boolean
							recur(path, depth+1)
							recur(path + Math.pow(2, depth), depth+1)
						}
						recur(0,0)
					}
				}
			})
		)]
	}
})