
function truncateText(text, width) {
	return function(d, i) {

    	var t = this.textContent = text(d, i),
        	w = width - 100;
    	if (this.getComputedTextLength() < w) return capitalize(t);
    	this.textContent = "…" + t;
    	var lo = 0,
        	hi = t.length + 1,
        	x;
    	while (lo < hi) {
      		var mid = lo + hi >> 1;
      		if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
      		else hi = mid;
    	}
    	return lo > 1 ? capitalize(t.substr(0, lo - 2)) + " …" : "";
	};
}

/**
 * 
 * Draw Radar Chart Idiom
 * @params	array of objects	data 
 * 
 */
function drawRadarChart(data) {

    // create function that calls createGlobal function - triggers creates
    var callCreate = function(data) {
        createGlobal(data, "heatMap");
    }

    // create function that calls createGlobal function - triggers creates
    var callUpdate = function(data) {
        updateGlobal(data, "heatMap");
    }	    

	/* ************* Data Processing ************* */   

    var radarData = [];
    var roles = filtersArray[0].value;


    /* ***** Formats filtered data to the right format for this idiom ***** */

    // caso tenha roles selecionados
    if (roles.length > 0) {

		var newData = new Map();

		var groupedData = d3.group(data, d => d.q5);	// grouped data by column Q5

		roles.forEach((role, index) => {

			var objs = [];

			activities_columns.forEach((element, index) => {
				
				newData = groupedData.get(role);

				var data_activity = newData.filter(d => d[element.column] == 1);	// get all elements from filtered data that have that specific column set to 1
				var percentage = data_activity.length / newData.length;
				var obj = {"role": role, "axis": element.label, "value": percentage};
				objs.push(obj);
			});

			radarData.push(objs);

		});

    } else {

		var objs = [];

		// iterate over activities_columns objects and for each column calculates the percentage of the activity
		activities_columns.forEach((element, index) => {
			
			label = activities_columns.find(activity => activity.column == element.column)['label'];	// get label from activities_columns array of objects from the current column
			// radarData[index] = {"axis": label, "value": d3.sum(data, d => d[element.column]) / size};	// create object with axis label and percentage of that activity
			var obj = {"role": "Default", "axis": label, "value": d3.sum(data, d => d[element.column]) / data.length};	// create object with axis label and percentage of that activity
			objs.push(obj);
		});

		radarData.push(objs);
    }

    /* ***** end formatting ***** */

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
		//w: 850,				//Width of the circle
	 	//h: 430,				//Height of the circle
	 	w: 800,
	 	h: 300,
	 	// margin: {top: 80, right: 5, bottom: 60, left: 58}, // 55 The margins of the SVG
	 	margin: {top: 90, right: 25, bottom: 40, left: 5},
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
	// var maxValue = Math.max(cfg.maxValue, d3.max(radarData, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var maxValue = 1;
		
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
	d3.select(".tooltip_activities").remove();

	// initiate the radar chart SVG
	var svg = d3.select(".radarChart").append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar.radarChart");

	// append a g element		
	var g = svg.append("g")
			//.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
			.attr("transform", "translate(420, 190)");


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

    // create a tooltip
    const tooltip_activities = d3.select("div.radarChart")
        .append("div")
        .style("visibility", "hidden")
        // .style("width", "max-content")
		// .style("width", "-webkit-fit-content")
		// .style("width", "-moz-fit-content")
		// .style("width", "fit-content")
		.style("width", "20%")
		.style("text-align", "center")
        .attr("class", "tooltip_activities")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")


	// append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.style("fill", "#5a6169")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ 
			if(i == 2) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); //10
			} else if(i == 6) {
				return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2) - 7;
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
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) - 45;
			} 
			else if(i == 7) {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2) + 10
			}			
			else {
				return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2);
			} 
		})
		// .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		// .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		// .text(function(d){return d})
		// .call(wrap, cfg.wrapWidth);
		.text(truncateText(function(d) { return d }, cfg.wrapWidth))
	    .on("mouseover", function (event, d) {

	    	var element = d3.select(this);

	    	element.style("cursor", "pointer");

	        tooltip_activities
	            .style("visibility", "visible");
		})		
		.on("mousemove", function(event, d) {

	        tooltip_activities
	            .html(d)
	            // .style("left", ((event.pageX - event.offsetX) / 2)+ "px")
	            // .style("top", (event.pageY - event.offsetY - 18) + "px")
	            .style("left", (event.offsetX + 30) + "px")
	            .style("top", (event.offsetY) + "px")
	            .style("position", "absolute");

		})
		.on("mouseleave", function(event, d) {

	        tooltip_activities
	            .style("visibility", "hidden");

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
		.data(radarData, function(d, i) {
			return d[i].role;
		})
		.enter().append("g")
		.attr("class", "radarWrapper");

	var check_filter_role = filtersArray.filter(function(f) {
		return f.filter === "role";
	});

	// append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.attr("index", function(d,i) { return i; })
		.style("fill", function(d,i) { return roles_colors[d[i].role]; })
		.style("fill-opacity", cfg.opacityArea)
		.on("mouseover", function(event, d) {

			//Dim all blobs
			var radarArea = d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);

			if(check_filter_role[0].value.length > 0) {
				radarArea.style("cursor", "pointer");
			}

			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);

		})
		.on("mouseout", function(event, d) {

			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});

		if(check_filter_role[0].value.length > 0) {

			blobWrapper.on("click", function(event, d) {

				/* ****** update array of filters ****** */

				removeElementFromFilter("role", d[0].role);

				// get all donut slices
				var slices = d3.select("div#donutChart").select("svg").select("g").selectAll("path");

				// get donut slice by role
				var selected_slice = slices
					.filter(function(e) {
						return e.data.label == d[0].role;
				});

				selected_slice
					.attr("selected", null);

				selected_slice.style("opacity", 0.3);


				//get selected squares from heatmap
				var squares_from_role = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function() {
					return d3.select(this).attr("role") == d[0].role;
				});

				squares_from_role
					.attr("selected", null)
					.style("stroke", null);

				var selected_axis_label = d3.select("div#heatmap").select("svg.chart").select("g").select(".g_roles").selectAll("g.tick").select("text").filter(function() {
					return d3.select(this).attr("role") === d[0].role;
				})

				selected_axis_label
					.attr("selected", null);

				var selected_slices = slices.filter(function(e) {
					return d3.select(this).attr("selected") === "true";
				});

				/* **** parallel set **** */
		
				var role_color = d3.select(this).style("fill");

				// get category rect by role and its parent
				var category_rect = d3.select("div.parallelSet").selectAll("rect").filter(function(d) {
				    return d3.select(this).style("fill") === role_color
				});


				ribbons = d3.select(".ribbon").selectAll("path").filter(function(p) {
				    return d3.select(this).style("fill") === category_rect.style("fill");
				});

				var selected_category = category_rect.select(function() { return this.parentNode; });				

				// unhighlight and desselect category
	            selected_category.attr("selected", null);
	            category_rect.style("fill-opacity", 0);

	            ribbons.style("fill-opacity", 0.5);

	            var selected_categories = d3.select("div.parallelSet").select("g.dimension").selectAll("g.category").filter(function(d) {
	                return d3.select(this).attr("selected") === "true";
	            });                

				/* **** end parallel set **** */						

				role_filter_updated = true;

				drawGlobal(original_data);
			});
		}
		
	// create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.attr("index", function(d,i) { return i; })
		.style("stroke-width", cfg.strokeWidth + "px")
		//.style("stroke", function(d,i) { return colors_roles[0]; })
		.style("stroke", function(d,i) { return roles_colors[d[i].role]; })
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
		.style("fill", function(d,i) { return roles_colors[d.role]; })
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

			if(d3.select(this).attr('cx') > 0) {
				newX = parseFloat(d3.select(this).attr('cx')) + 5;
			} else if(d3.select(this).attr('cx') < 0) {
				newX = parseFloat(d3.select(this).attr('cx')) - 30;
			} else {
				newX = parseFloat(d3.select(this).attr('cx') + 10);
			}

			if(d3.select(this).attr('cy') < 0) {
				newY = parseFloat(d3.select(this).attr('cy')) - 10;
			} else if(d3.select(this).attr('cy') > 0) {
				newY = parseFloat(d3.select(this).attr('cy')) + 15;
			} else {
				newY = parseFloat(d3.select(this).attr('cy'));
			}
					
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

