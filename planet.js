class Planet{
	//density calculated in kg / block
	constructor(blocks, canvas, ctx, relative_star_radius, planet_g, sun_density = 1410 /*kg/m^3*/, sun_radius= 696340000/*m*/, density = 2.0649669e22,  ){
		this.canvas = canvas;
		this.ctx = ctx
		this.blocks = uniq(blocks)
		//help from SO
		this.mass = this.blocks.length * density
		var top = [0,0]
		var bottom = 0
		for(var i = 0; i < blocks.length; i++){
			top[0] += blocks[i][0] * density
			top[1] += blocks[i][1] * density
			bottom += density
		}
		this.center_of_mass = [top[0]/bottom, top[1]/bottom]
		do{
		    var selection = parseInt(prompt("Please enter orbit radius in meters (note: the radius of your star is " + (1e4*Math.floor(relative_star_radius*sun_radius / 1e4)/1e6).toString() + " * 10^6 m)" , ""), 10);
		}while(isNaN(selection));
		this.radius = selection
		this.star_mass =  (sun_density * Math.pow(sun_radius,3) * Math.pow(relative_star_radius,3) * 4/3 * Math.PI)
		top = planet_g*(6.67430e-11)*(this.star_mass + this.mass)
		do{
		    selection = parseInt(prompt("Please enter Y velocity in meters (note: for a perfectly circular clockwise orbit, yvel =  -" + (Math.floor(100*Math.sqrt(top/this.radius))/100).toString() + " m/s)" , ""), 10);
		}while(isNaN(selection));
		this.vel_y = selection
		do{
		    selection = parseInt(prompt("Please enter Y velocity in meters (note: for a perfectly circular clockwise orbit, xvel =  0 m/s)" , ""), 10);
		}while(isNaN(selection));
		this.vel_x = selection
		this.x = -this.radius;
		this.y = 0;
	}
	draw(x,y,canvas, ctx, zoom, width_scale, color){
		/*for(var i = 0; i < this.blocks.length(); i++){
			for(var j = 0; j < this.blocks[i].length(); j++){
				if(this.blocks[i][j] === 1){
					ctx.fillStyle = color
					ctx.fillRect(this.x,y, zoom, zoom)
				}
			}
		}*/

		var relative_x = (x-canvas.width/2)* zoom + canvas.width/2
		var relative_y = (y-canvas.height/2)* zoom + canvas.height/2
		ctx.fillStyle = color

		ctx.fillStyle = "#000000"
		ctx.drawImage(planet_img, this.x/(696.34e7)*zoom*width_scale + relative_x -this.mass*8*zoom*width_scale/5.95e24/2, this.y/(696.34e7)*zoom +relative_y-this.mass*8*zoom*width_scale/5.95e24/2, this.mass*8*zoom*width_scale/5.95e24, this.mass*8*zoom/5.95e24)

		/*for(var i = 0; i < this.blocks.length; i++){

			ctx.fillStyle = color
			ctx.fillRect(this.x/(696.34e7)*zoom*width_scale + relative_x + (this.blocks[i][0] - this.center_of_mass[0]), 
				this.y/(696.34e7)*zoom +relative_y + (this.blocks[i][1] - this.center_of_mass[1]), 2*zoom*width_scale,2*zoom)
		}*/

	}
	update_position(iterator, planets, planet_g){
		var fx = 0;
		var fy = 0;
		var mag = planet_g*(6.67430e-11)*this.mass*this.star_mass/(this.x*this.x + this.y*this.y)
		
		var fhype = Math.sqrt(this.x*this.x+this.y*this.y)

		fx += mag*this.x/fhype
		fy += mag*this.y/fhype

		for(var i = 0; i < planets.length; i++){
			//if not itself
			if(iterator != i){

				mag = planet_g*(6.67430e-11)*this.mass*planets[i].mass/(Math.pow(this.x-planets[i].x,2) + Math.pow(this.y-planets[i].y,2))
				fhype = Math.sqrt(Math.pow(this.x-planets[i].x,2) + Math.pow(this.y-planets[i].y,2))
				fx += mag*(this.x-planets[i].x)/fhype
				fy += mag*(this.y-planets[i].y)/fhype
				console.log("fx force")
				console.log(mag*this.x/fhype)
			}
		}
		this.vel_x -= 1e6*fx / this.mass
		this.vel_y -= 1e6*fy / this.mass
		this.x += this.vel_x *1000000
		this.y += this.vel_y *1000000

	}



}

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}