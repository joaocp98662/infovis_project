function init() {
	teste();
	radarChart();
	heatmap();
	parallelSet();
}

function teste() {

    var margin = {top: 70, right: 180, bottom: 130, left: 135},
        width = 1100 - margin.left - margin.right,
        height = 1200 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, .3);

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, 1000]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .outerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .outerTickSize(0);

    var svg = d3.select("div#teste").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data/data.tsv", type, function(error, data) {
      x.domain(data.map(function(d) { return d.name; }));
      //y.domain(["0-999", "1,000-1,999", "2,000-2,999", "3,000-3,999", "4,000-4,999", "5,000-7,499"]);
      y.domain(["> $500,000","300,000-500,000","250,000-299,999","200,000-249,999","150,000-199,999","125,000-149,999","100,000-124,999","90,000-99,999","80,000-89,999","70,000-79,999","60,000-69,999","50,000-59,999","40,000-49,999","30,000-39,999","25,000-29,999","20,000-24,999","15,000-19,999","10,000-14,999","7,500-9,999","5,000-7,499", "4,000-4,999", "3,000-3,999", "2,000-2,999", "1,000-1,999", "0-999"]);

      // svg.append("text")
      //     .attr("class", "title")
      //     .attr("x", x(data[0].name))
      //     .attr("y", -26)
      //     .text("Data Professionals background and Yearly Compensation");

      svg.append("g")
          .attr("class", "x axis")
          //.style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'})
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll(".tick text")
          .call(wrap, x.rangeBand());

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      // svg.selectAll(".bar")
      //     .data(data)
      //   .enter().append("rect")
      //     .attr("class", "bar")
      //     .attr("x", function(d) { return x(d.name); })
      //     .attr("width", x.rangeBand())
      //     .attr("y", function(d) { return y(d.value); })
      //     .attr("height", function(d) { return height - y(d.value); });
    });
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function type(d) {
  d.value = +d.value;
  return d;
}

function radarChart() {

	var margin = {top: 100, right: 320, bottom: 100, left: 80},
		width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
			

	var data = [
			  [//iPhone
				{axis:"Battery Life",value:0.22},
				{axis:"Brand",value:0.28},
				{axis:"Contract Cost",value:0.29},
				{axis:"Design And Quality",value:0.17},
				{axis:"Have Internet Connectivity",value:0.22},
				{axis:"Large Screen",value:0.02},
				{axis:"Price Of Device",value:0.21},
				{axis:"To Be A Smartphone",value:0.50}			
			  ],[//Samsung
				{axis:"Battery Life",value:0.27},
				{axis:"Brand",value:0.16},
				{axis:"Contract Cost",value:0.35},
				{axis:"Design And Quality",value:0.13},
				{axis:"Have Internet Connectivity",value:0.20},
				{axis:"Large Screen",value:0.13},
				{axis:"Price Of Device",value:0.35},
				{axis:"To Be A Smartphone",value:0.38}
			  ],[//Nokia Smartphone
				{axis:"Battery Life",value:0.26},
				{axis:"Brand",value:0.10},
				{axis:"Contract Cost",value:0.30},
				{axis:"Design And Quality",value:0.14},
				{axis:"Have Internet Connectivity",value:0.22},
				{axis:"Large Screen",value:0.04},
				{axis:"Price Of Device",value:0.41},
				{axis:"To Be A Smartphone",value:0.30}
			  ]
			];


	var color = d3.scale.ordinal()
		.range(["#EDC951","#CC333F","#00A0B0"]);
		
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 0.5,
	  levels: 5,
	  roundStrokes: true,
	  color: color
	};

	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scale.category10()	//Color function
	};

	var id = ".radarChart";
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof radarChartOptions){
	  for(var i in radarChartOptions){
		if('undefined' !== typeof radarChartOptions[i]){ cfg[i] = radarChartOptions[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
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

	//Text indicating at what % each level is
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

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
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
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
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
		.on("mouseover", function(d,i) {
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
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}
}

function heatmap() {

	// set the dimensions and margins of the graph
	var margin = {top: 30, right: 30, bottom: 30, left: 40},
	  width = 450 - margin.left - margin.right,
	  height = 450 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#my_dataviz")
	.append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	.append("g")
	  .attr("transform",
	        "translate(" + margin.left + "," + margin.top + ")");

	// Labels of row and columns
	var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
	var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

	// Build X scales and axis:
	var x = d3.scale.ordinal()
	  .rangeRoundBands([ 0, width ])
	  .domain(myGroups);
	  //.padding(0.01);

	// Build X scales and axis:
	var y = d3.scale.ordinal()
	  .rangeRoundBands([ height, 0 ])
	  .domain(myVars);
	  //.padding(0.01);	  

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .outerTickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .outerTickSize(0);

	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	svg.append("g")
	  .call(yAxis);

	// Build color scale
	var myColor = d3.scale.linear()
	  .range(["white", "#69b3a2"])
	  .domain([1,100]);

	// Read the data
	d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {

	  svg.selectAll()
	      .data(data, function(d) {return d.group+':'+d.variable;})
	      .enter()
	      .append("rect")
	      .attr("x", function(d) { return x(d.group) })
	      .attr("y", function(d) { return y(d.variable) })
	      .attr("width", x.rangeBand() )
	      .attr("height", y.rangeBand() )
	      .style("fill", function(d) { return myColor(d.value)})
	});

}

function parallelSet() {


}
