/**
 * 
 * Create Radar Chart Idiom
 * @params	array of objects	data 
 * 
 */
function createRadarChart(data) {

	/* ************* Data Processing ************* */

	// legth of the data
	var size = data.length;

	var radarData = [];
	var objs = [];


	// iterate over activities_columns objects and for each column calculates the percentage of the activity
	activities_columns.forEach((element, index) => {
		
		label = activities_columns.find(activity => activity.column == element.column)['label'];	// get label from activities_columns array of objects from the current column
		// radarData[index] = {"axis": label, "value": d3.sum(data, d => d[element.column]) / size};	// create object with axis label and percentage of that activity
		var obj = {"axis": label, "value": d3.sum(data, d => d[element.column]) / size};	// create object with axis label and percentage of that activity
		objs.push(obj);
	});

	radarData.push(objs);

	//console.log(radarData);

	/* ************* End Data Processing ************* */

	/* ************* create Chart ************* */

	var margin = {top: 20, right: 10, bottom: 10, left: 10},

	width = 300;
	height = 300;
	// width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
	// height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	var radarChartOptions = {
		w: width,
	 	h: height,
	  	margin: margin,
	  	maxValue: 0.5,
	  	levels: 5,
	  	roundStrokes: true,
	};

	var cfg = {
		w: 850,				//Width of the circle
	 	h: 430,				//Height of the circle
	 	margin: {top: 80, right: 5, bottom: 60, left: 58}, // 55 The margins of the SVG
	 	levels: 5,				//How many levels or inner circles should there be drawn
		maxValue: 0, 			//What is the value that the biggest circle will represent
		labelFactor: 1.45, 	//How much farther than the radius of the outer circle should the labels be placed
		wrapWidth: 200, 		//The number of pixels after which a label needs to be given a new line
		opacityArea: 0.35, 	//The opacity of the area of the blob
		dotRadius: 4, 			//The size of the colored circles of each blog
		opacityCircles: 0.1, 	//The opacity of the circles of each blob
		strokeWidth: 2, 		//The width of the stroke around each blob
		roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	};

	// put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(radarData, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (radarData[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('.0%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);


	/* ************* create the container svg and g ************* */

	// remove whatever chart with the same id/class was present before
	d3.select(".radarChart").select("svg").remove();

	// initiate the radar chart SVG
	var svg = d3.select(".radarChart").append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar.radarChart");

	// append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");


	/* ************* glow filter ************* */

	// filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');			


	/* ************* draw the circular grid ************* */

	// wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	// draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	// text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/* ************* draw axis ************* */

	// create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	// append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");


	// append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.style("fill", "#5a6169")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ 
			if(i == 2) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) + 40;
			} else if(i == 6) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) - 50;
			} if(i == 7) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) + 20;
			} else {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2);
			} 
		})
		.attr("y", function(d, i){ 
			if(i == 0) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) + 40
			} else if(i == 4) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) - 70;
			} 
			else if(i == 7) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) + 10
			}			
			else {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2);
			} 
		})
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);


	/* ************* draw the radar chart blobs ************* */

	// the radial line function
	var radarLine = d3.lineRadial()
		.curve(d3.curveLinearClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(radarData)
		.enter().append("g")
		.attr("class", "radarWrapper");

	// append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.attr("index", function(d,i) { return i; })
		// .style("fill", function(d,i) { return colors_roles[0]; })
		.style("fill", function(d,i) { return roles_colors['Default']; })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		})
		
	// create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.attr("index", function(d,i) { return i; })
		.style("stroke-width", cfg.strokeWidth + "px")
		//.style("stroke", function(d,i) { return colors_roles[0]; })
		.style("stroke", function(d,i) { return roles_colors['Default']; })
		.style("fill", "none")
		.style("filter" , "url(#glow)")				
	
	// append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		//.style("fill", function(d,i,j) { return colors_roles[0]; })
		.style("fill", function(d,i,j) { return roles_colors['Default']; })
		.style("fill-opacity", 0.8);

	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(radarData)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(event, d) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);		

}

/**
 * 
 * Updates Radar Chart Idiom
 * @params	array of objects	data 
 * 
 */
function updateRadarChart(data, filter) {

	/* ************* Data Processing ************* */

	// legth of the data
	var size = data.length;

	var radarData = [];
	var objs = [];

	// console.log(filter);

	var role = filter.find(f => f.filter === "roles")["value"];

	var groupedData = d3.group(data, d => d.q5);	// grouped data by column Q5
	var filteredData = groupedData.get(role);	// get all elements, from the grouped data, of the specific role filtered
	// console.log(filteredData);

	// iterate over activities_columns objects and for each column calculates the percentage of the activity
	activities_columns.forEach((element, index) => {
		
		var data_activity = filteredData.filter(d => d[element.column] == 1);	// get all elements from filtered data that have that specific column set to 1
		var percentage = data_activity.length / filteredData.length;
		var obj = {"role": role, "axis": element.label, "value": percentage};
		objs.push(obj);
	});

	radarData.push(objs);

	// console.log(radarData);


	var margin = {top: 20, right: 10, bottom: 10, left: 10},

	width = 300;
	height = 300;

	var cfg = {
		w: 850,				//Width of the circle
	 	h: 430,				//Height of the circle
	 	margin: {top: 80, right: 5, bottom: 60, left: 58}, // 55 The margins of the SVG
	 	levels: 5,				//How many levels or inner circles should there be drawn
		maxValue: 0, 			//What is the value that the biggest circle will represent
		labelFactor: 1.45, 	//How much farther than the radius of the outer circle should the labels be placed
		wrapWidth: 200, 		//The number of pixels after which a label needs to be given a new line
		opacityArea: 0.35, 	//The opacity of the area of the blob
		dotRadius: 4, 			//The size of the colored circles of each blog
		opacityCircles: 0.1, 	//The opacity of the circles of each blob
		strokeWidth: 2, 		//The width of the stroke around each blob
		roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	};

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(radarData, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (radarData[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('.0%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);


	/* ************* create the container svg and g ************* */

	// remove whatever chart with the same id/class was present before
	//d3.select(".radarChart").select("svg").remove();	

	// select the radar chart SVG
	var svg = d3.select(".radar.radarChart")

	// select g element
	var g = d3.select(".radarChart").select("svg").select("g");


	/* ************* draw the circular grid ************* */

	// wrapper for the grid & axes
	var axisGrid = g.select(".axisWrapper");

	// text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/* ************* draw axis ************* */

	// create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis);

	// append the lines
	axis.select("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); });

	// append the labels at each axis
	axis.select("text")
		.attr("x", function(d, i){ 
			if(i == 2) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) + 40;
			} else if(i == 6) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) - 50;
			} if(i == 7) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) + 20;
			} else {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2);
			} 
		})
		.attr("y", function(d, i){ 
			if(i == 0) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) + 40
			} else if(i == 4) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) - 70;
			} 
			else if(i == 7) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) + 10
			}			
			else {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2);
			} 
		});


	/* ************* draw the radar chart blobs ************* */

	// the radial line function
	var radarLine = d3.lineRadial()
		.curve(d3.curveLinearClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}

	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(radarData);	

	// // append the backgrounds
	blobWrapper
		.select(".radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.attr("index", function(d,i) { return i; })
		// .style("fill", function(d,i) { return colors_roles[0]; })
		.style("fill", function(d,i) { return roles_colors[d[0].role]; })
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	// create the outlines
	blobWrapper.select(".radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.attr("index", function(d,i) { return i; })
		.style("stroke-width", cfg.strokeWidth + "px")
		// .style("stroke", function(d,i) { return colors_roles[0]; })
		.style("stroke", function(d,i) { return roles_colors[d[0].role]; })				
	
	// append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		//.style("fill", function(d,i,j) { return colors_roles[0]; })
		.style("fill", function(d,i,j) { return roles_colors[d.role]; })
		.style("fill-opacity", 0.8);

	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(radarData);
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(event, d) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});

	g.select("text").remove();

	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
}

