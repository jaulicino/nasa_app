/*
		This script contains  functionality of site
*/

let canvas = document.getElementById("main_canvas");

//assorted variables needed to maintain functionality
var scene_number = 1;
var width = canvas.width
var height = canvas.height
var mouse_is_down = false;
var shift_down = false;
var esc_down = false;

//gravity scales, main star radius
var ship_g = 1;
var planet_g = 1;
var time_scale = 1;
var star_radius = 1;
var true_sun_radius = 696340000  //meters
var cycle_planet = 0;

//variables to handle dragging/dropping
var drag_start_x = 0;
var drag_start_y = 0;

//variables to handle main solar system map
var x = width/2;
var y = height/2;
var zoom = 1;

//array to making planets
var planet_exists_array = []
var fill = false
var planets = []

//side bar variables
var sb_height = height
var cell_height = sb_height/5
var sb_width = cell_height
var cell = Math.floor(mouse_y/cell_height)
var side_bar_texts = ["blank","blank","new planet","+","-"]

var num_cells = 150;

//images
var background_img = new Image(4032, 3024)
background_img.src = "images/background.png"
var star_img = new Image(660,660)
star_img.src = "images/star_2.png"
var planet_img = new Image()
planet_img.src = "images/planet.png"

//context
var ctx = canvas.getContext("2d");

//font
ctx.font =  (height/16).toString()+"px silkscreen";

//to actively change font, as website loads
ctx.fillText("", 0,0)

var mouse_x = -10;
var mouse_y = -10;


init();
gameLoop();

function draw_circle(x, y, r, color, width_scale){
	/*ctx.save()
	ctx.scale(width_scale, 1)
	ctx.fillStyle = color
	ctx.beginPath()
	ctx.arc(x, y, r, 0, Math.PI*2)
	ctx.fill()
	ctx.closePath()
	ctx.restore()*/
	ctx.drawImage(star_img, x-r*width_scale, y-r, 2*r*width_scale, 2*r)
}

function draw_sidebar(which){
	sb_height = height
	cell_height = sb_height/5
	sb_width = cell_height
	cell = Math.floor(mouse_y/cell_height)
	var main_texts = [["Teleport","home","new planet","+","-"], ["fill", "erase", "save","",""], ["draw", "erase", "save","",""]]
	side_bar_texts = main_texts[which]
	ctx.fillStyle = "#333333"
	ctx.fillRect(width-sb_width, 0, sb_width, sb_height)
	ctx.fillStyle = "#FFFF00"
	if(mouse_x > width-sb_width){
		ctx.fillRect(width-sb_width, cell_height*cell, cell_height, cell_height)
	}
	else{
		cell = -1
	}
	ctx.fillStyle="#FFFF00"
	ctx.textAlign = "center"
	for(var i = 0; i < 5; i++){
		if(i === cell){
			ctx.fillStyle="#000000"
			ctx.fillText(side_bar_texts[i], width-sb_width + cell_height/2, cell_height*i + cell_height/2, cell_height)
			ctx.fillStyle = "#FFFF00"
		}
		else{
			ctx.fillText(side_bar_texts[i], width-sb_width+ cell_height/2, cell_height*i+ + cell_height/2, cell_height)
		}
	}
	ctx.textAlign = "left"
}

function arr_equal(arr1, arr2){
	if(arr1.length !== arr2.length){
		return false
	}
	for(var i = 0; i < arr1.length; i++){
		if(arr1[i] !== arr2[i]){
			return false
		}
	}
	return true
	//return arr1.every(a => arr2.includes(a)) && arr2.every(a => arr1.includes(a)) 
}

function flood_fill(node, xdimension, ydimension){
	//dirty includes for array within array

	if(planet_exists_array.some(a => arr_equal(a, node))){
		return;
	}
	else{
		planet_exists_array.push(node);
	}

	if(node[0]+1 < xdimension){
		flood_fill([node[0]+1, node[1]], xdimension, ydimension)
	}
	if(node[1]+1 < ydimension){
		flood_fill([node[0], node[1]+1], xdimension, ydimension)
	}
	if(node[0]-1 > 0){
		flood_fill([node[0]-1, node[1]], xdimension, ydimension)
	}
	if(node[1]-1 > 0){
		flood_fill([node[0], node[1]-1], xdimension, ydimension)
	}
	return;

}

//function to draw scene_1 
function scene_1(){
	ctx.font =  (height/16).toString()+"px silkscreen";
	ctx.fillStyle = "#000000"
	ctx.fillRect(0,0, width, height)

	if(mouse_y >= height/2){
		ctx.fillStyle = "#FFFF00"
		ctx.fillRect(0,height/2, width, height/2);

		ctx.fillStyle = "#000000"
		ctx.fillText("Click here to play...",canvas.width/80, 3*canvas.height/4)
		ctx.fillStyle = "#FFFF00"
		ctx.fillText("Welcome to Gravity Sandbox",canvas.width/80, canvas.height/4)

	}	 
	else if(mouse_y > 0){
		ctx.fillStyle = "#FFFF00"
		ctx.fillRect(0,0, width, height/2);

		ctx.fillStyle = "#FFFF00"
		ctx.fillText("Click here to play",canvas.width/80, 3*canvas.height/4)
		ctx.fillStyle = "#000000"
		ctx.fillText("Welcome to Gravity Sandbox!",canvas.width/80, canvas.height/4)
	}

}

//function to draw scene_2
function scene_2(){
	var width_scale = 1.875*canvas.clientHeight/canvas.clientWidth
	
	//clear screen
	if((canvas.clientWidth/canvas.clientHeight) < (4/3)){
		ctx.drawImage(background_img,0,0,3024/canvas.clientHeight * canvas.clientWidth, 3024, 0, 0, width, height)
	}
	else{
		ctx.drawImage(background_img,0,0, 4032, 4032/canvas.clientWidth * canvas.clientHeight, 0, 0, width, height)
	}

	//do math
	var x_dist = mouse_x - (width/2)
	var y_dist = mouse_y - (height/2)
	var dist_from_origin = Math.sqrt(x_dist*x_dist + y_dist*y_dist)
	var diagonal = Math.sqrt(width*width + height*height)

	var relative_sun_radius =  diagonal / 20
	star_radius = dist_from_origin / relative_sun_radius

	//draw star (circle) with proper scaling etc
	draw_circle(width/2, height/2, dist_from_origin/width_scale, "#FFFF00", width_scale)

	//draw sun's relative size
	var dash_length = Math.PI * 2 * relative_sun_radius / 100
	ctx.save()
	ctx.setLineDash([dash_length])
	if(dist_from_origin > relative_sun_radius){
		ctx.strokeStyle="#000000"
	}
	else{
		ctx.strokeStyle="#FFFFFF"
	}
	ctx.lineWidth = height/200
	ctx.scale(width_scale, 1)
	ctx.beginPath()
	ctx.arc(width/2/width_scale, height/2, relative_sun_radius/width_scale, 0, Math.PI*2)
	ctx.stroke()
	ctx.closePath()
	ctx.restore()
	
	//write text with borders that help with seeing it
	ctx.font =  (height/24).toString()+"px silkscreen";
	ctx.lineWidth = 1
	ctx.fillStyle ="#FFFFFF"
	ctx.strokeStyle = "blue"

	//explanation
	ctx.fillText("First, let's make your star! Click when you are ready...", width/72, height/24)
	ctx.strokeText("First, let's make your star! Click when you are ready...", width/72, height/24)
	//numerical explanation of radius
	ctx.fillText(((Math.round(100*star_radius))/100).toString()  + " times our Sun's radius", width/72, 22*height/24)
	ctx.strokeText(((Math.round(100*star_radius))/100).toString()  + " times our Sun's radius", width/72, 22*height/24)
	//tagline
	ctx.fillText("<-Our Sun's radius", width/2 + 1.05*relative_sun_radius, height/2)
	ctx.strokeText("<-Our Sun's radius", width/2 + 1.05*relative_sun_radius, height/2)

}


function scene_3(){
	var width_scale = 1.875*canvas.clientHeight/canvas.clientWidth
	//clear screen
	if((canvas.clientWidth/canvas.clientHeight) < (4/3)){
		ctx.drawImage(background_img,0,0,3024/canvas.clientHeight * canvas.clientWidth, 3024, 0, 0, width, height)
	}
	else{
		ctx.drawImage(background_img,0,0, 4032, 4032/canvas.clientWidth * canvas.clientHeight, 0, 0, width, height)
	}

	ctx.fillStyle = "#FFFF00"
	ctx.fillText("Solar System Map", width/72, height/24)
	ctx.fillStyle = "#FFFF00"

	var relative_x = (x-width/2)* zoom + width/2
	var relative_y = (y-height/2)* zoom + height/2
	draw_circle(relative_x, relative_y, zoom*star_radius*24, "#FFFF00", width_scale)

	//draw side bar
	draw_sidebar(0);
	console.log(planets)
	for(var i = 0; i < planets.length; i++){
		planets[i].draw(x,y,canvas, ctx, zoom, width_scale,  "#5a4d41")
		planets[i].update_position(i, planets, planet_g)
	}


}

function scene_4(){
	//define relative earth size and width scale
	var width_scale = 1.875*canvas.clientHeight/canvas.clientWidth
	var x_dist = mouse_x - (width/2)
	var y_dist = mouse_y - (height/2)
	var dist_from_origin = Math.sqrt(x_dist*x_dist + y_dist*y_dist)
	var diagonal = Math.sqrt(width*width + height*height)

	var relative_earth_radius =  diagonal / 20


	//clear screen
	if((canvas.clientWidth/canvas.clientHeight) < (4/3)){
		ctx.drawImage(background_img,0,0,3024/canvas.clientHeight * canvas.clientWidth, 3024, 0, 0, width, height)
	}
	else{
		ctx.drawImage(background_img,0,0, 4032, 4032/canvas.clientWidth * canvas.clientHeight, 0, 0, width, height)
	}
	ctx.fillText("New Planet: Left Click to Draw", width/72, height/24)
	ctx.save()
	ctx.fillStyle = "#5a4d41"

	var block_width = width / num_cells;
	var block_height = height / num_cells * 1.875;

	for(var i = 0; i < planet_exists_array.length; i++){
		ctx.fillRect(planet_exists_array[i][0] * block_width, planet_exists_array[i][1] * block_height, block_width, block_height)
	}
	ctx.restore()

	//draw earth's relative size (same size as sun relatively)
	var dash_length = Math.PI * 2 * relative_earth_radius / 100
	ctx.save()
	ctx.setLineDash([dash_length])
	ctx.lineWidth = height/200
	ctx.scale(width_scale, 1)
	ctx.beginPath()
	ctx.arc(width/2/width_scale, height/2, relative_earth_radius/width_scale, 0, Math.PI*2)
	ctx.stroke()
	ctx.closePath()
	ctx.restore()
	ctx.fillText("<-Earth's radius", width/2 + 1.05*relative_earth_radius, height/2)

	if(fill) draw_sidebar(1)
	else draw_sidebar(2)


}

//handles the logic of which scene to draw
function scene(scene_i){
	switch(scene_i){
		case 1:
			scene_1();
			break;
		case 2:
			scene_2();
			break;
		case 3:
			scene_3();
			break;
		case 4:
			scene_4();
			break;
		default:
			scene_1();
			scene_number = 1
			break;
	}

}


//get mouse position after event
function getMousePosition(canvas, event){
	var rect = canvas.getBoundingClientRect();
	var scaleX = width/rect.width;
	var scaleY = height/rect.height;

	return{
		//scale x,y return to caller
		x: (event.clientX - rect.left) * scaleX,
		y: (event.clientY - rect.top) * scaleY
	}

}

//address mouse_click, update x,y positions
function mouse_click(event){
	var width_scale = 1.875*canvas.clientHeight/canvas.clientWidth

	mouse_x = getMousePosition(canvas, event).x;
	mouse_y = getMousePosition(canvas, event).y;

	if(scene_number === 1 && mouse_y>=height/2){
		scene_number = 2
	}
	else if(scene_number === 2){
		scene_number = 3
	}
	else if(scene_number === 3){
		if(cell === 3 && zoom < 15){
			zoom *= 1.25
		}
		if(cell === 4 && zoom > 0.1){
			zoom /= 1.25
		}
		if(cell === 2){
			fill = false
			scene_number = 4;
		}
		if(cell === 1){
			x = width/2
			y = height/2
			zoom = 1
		}
		if(cell === 0 && planets.length > 0){
			x=-planets[cycle_planet].x/(696.34e7)*zoom*width_scale + width/2
			y=-planets[cycle_planet].y/(696.34e7)*zoom + height/2
			zoom = 1
			if(cycle_planet < planets.length -1) cycle_planet++
			else cycle_planet = 0
		}
	}
	else if(scene_number === 4 && cell == -1){
		console.log(fill)
		if(!shift_down && !fill){
				var block_width = width / num_cells;
				var block_height = height / num_cells * 1.875;
				planet_exists_array.push([Math.floor(mouse_x/block_width), Math.floor(mouse_y/block_height)])
		}
		else if(shift_down || fill){
			console.log("here")
			var block_width = width / num_cells;
			var block_height = height / num_cells * 1.875;
			flood_fill([Math.floor(mouse_x/block_width), Math.floor(mouse_y/block_height)], width/block_width, height/block_height)

		}
	}
	else if(scene_number === 4){
		if(cell === 0) fill = !fill
		if(cell === 1) planet_exists_array = [[]]
		if(cell === 2) console.log("new planet"),  console.log(star_radius), planets.push(new Planet(planet_exists_array, canvas, ctx, star_radius, 1)), scene_number = 3;
	}
}

function mouse_down(event){
	mouse_is_down = true;
	mouse_x = getMousePosition(canvas, event).x;
	mouse_y = getMousePosition(canvas, event).y;
	if(scene_number === 3){
		drag_start_x = mouse_x;
		drag_start_y = mouse_y;

	}
}

function mouse_up(event){
	mouse_is_down = false;
	mouse_x = getMousePosition(canvas, event).x;
	mouse_y = getMousePosition(canvas, event).y;
	if(scene_number === 3){
		var xdist = drag_start_x - mouse_x;
		var ydist = drag_start_y - mouse_y;
		x-=xdist/zoom
		y-=ydist/zoom
	}
}


//update mouse position if mouse has moved
function mouse_move(event){

	mouse_x = getMousePosition(canvas, event).x;
	mouse_y = getMousePosition(canvas, event).y;
	if(scene_number ===3 && mouse_is_down){
		var xdist = drag_start_x - mouse_x;
		var ydist = drag_start_y - mouse_y;
		x-=xdist/zoom
		y-=ydist/zoom
		drag_start_x = mouse_x
		drag_start_y = mouse_y
	}
	if(scene_number === 4 && mouse_is_down){
			var block_width = width / num_cells;
			var block_height = height / num_cells * 1.875;
			planet_exists_array.push([Math.floor(mouse_x/block_width), Math.floor(mouse_y/block_height)])
	}
	
}

function key_down(event){
	if(event.keyCode === 16){
		shift_down = true
	}
	if(event.keyCode === 27){
		esc_down = true
	}
}

function key_up(event){
	if(event.keyCode === 16){
		shift_down = false
	}
	if(event.keyCode === 27){
		esc_down = false
	}

}
//core game loop
function gameLoop(){
	var tbl = document.getElementById("ask_quantities")
	ship_g = tbl.rows[0].cells[1].children[0].value
	planet_g = tbl.rows[0].cells[0].children[0].value
	time_scale = tbl.rows[0].cells[2].children[0].value

	//prompt(document.getElementById("planet_g_form"))

	scene(scene_number);

	window.requestAnimationFrame(gameLoop);
}

//init
function init() {
	
	canvas.addEventListener("click", mouse_click);
	canvas.addEventListener("mousemove", mouse_move);
	canvas.addEventListener("mouseup", mouse_up);
	canvas.addEventListener("mousedown", mouse_down);
	window.addEventListener("keydown", key_down);
	window.addEventListener("keyup", key_up);

}


