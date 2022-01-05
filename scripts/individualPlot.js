
function drawIndividualValuePlot(data) {

	d3.select(".tooltipIndividualPlot").remove();

	/* ********* Data processing ********* */

	// legth of the data
	// var size = data.length;

	var filters_attributes = [];
	var groupedData = [];
	var filters_values = [];
	var filteredData = [];	

	// map filters keys to the same name as the attributes
	filtersArray.filter(function(filter) {
		if(filter["value"].length > 0) {
			filters_values.push(filter.value);
			filters_attributes.push({ "name": map_filters_attributes[filter.filter], "value": filter.value});
		}
	});

	var filters_names = result = filters_attributes.map(filter => filter.name); //get name of the filters -> ["q5", "q20", ...]

	// functions to use in the flatRollup
  	filters_functions = filters_names.map(filter_name => function(d) {
  		return d[filter_name]
  	});

  	// flatRollup grouping by q4 and q24 always. In case of any filter is selected it is added through filters_functions
	groupedData = d3.flatRollup(data, v => v.length, d => d.q4, d => d.q24, ...filters_functions);

	// rearrange data to be in a format with the name of the attributes (q4, etc)
	filteredData = groupedData.map(function(item) {

		var obj = { "q4": item[0], "q24": item[1] };

		filters_attributes.forEach((filter, index) => {
			obj[filter.name] = item[index + 2];
		});

		obj.count = item[filters_attributes.length + 2];

		return obj;
	});

	// set the dimensions and margins of the graph
	var margin = {top: 15, right: 30, bottom: 130, left: 110},
	    width = 730 - margin.left - margin.right,
	    height = 435 - margin.top - margin.bottom;


	d3.select(".individualValuePlot").select("svg").remove();

	// append the svg object to the body of the page
	var svg = d3.select(".individualValuePlot")
		.append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + (margin.left + 30) + "," + margin.top + ")");

	// data = data.slice(0, 500);

	// Show the X scale
	var x = d3.scaleBand()
	    .range([ 0, width ])
	    .domain(education_levels)
	    .paddingInner(1)
	    .paddingOuter(.5)

	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x).tickSizeOuter(0))
	    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-25)")
        .attr("cursor", "pointer")
	    .on("click", function(event, education) {

	    	var text = d3.select(this),
	    		bBox = text.node().getBBox();

	    	var tick = d3.select(this.parentNode);

    		var selected_squares = d3.select("div.individualValuePlot").select("svg").select("g").select("rect.squares").filter(function() {
    			return d3.select(this).attr("education") === education;
    		});

	    	if(text.attr("selected")) {

	    		/* *** update filter *** */
			    removeElementFromFilter("education", education);	    		

	    		text.attr("selected", null);

	    		tick.select("rect")
	    			.style("stroke", null);


		    	var selected_educations = d3.select("div.individualValuePlot").select("svg").select("g").selectAll("text").filter(function() {
	    			return d3.select(this).attr("selected") === "true";
	    		});

		    	
	    		if(selected_educations.size() > 0) {
	    			selected_squares.style("visibility", "hidden");
	    		} else { // in the case of none categories selected (default) show all squares
	    			d3.select("div.individualValuePlot").select("svg").select("g").selectAll("rect.squares").style("visibility", "visible");
	    		}

	    		role_filter_updated = false;

	    		drawGlobal(original_data, "individualValuePlot");

	    	} else {

	    		education_filter = filtersArray.find(filter => {
	    			return filter.filter === "education";
	    		});

	    		selected_squares.style("visibility", "visible");

	    		selected_squares.attr("selected", true);

	    		var squares_to_hide = d3.select("div.individualValuePlot").select("svg").select("g").selectAll("rect.squares").filter(function() {
	    			return d3.select(this).attr("selected") !== "true";
	    		});

	    		squares_to_hide.style("visibility", "hidden");

		    	tick.select("rect")
		    		.attr("transform", "rotate(-25)")
			    	.style("stroke-width", "3px")
			    	.style('stroke', "grey");

			    text.attr("selected", true);

			    /* *** update filter *** */
			    updateFilter("education", education);

			    role_filter_updated = false;

			    drawGlobal(original_data, "individualValuePlot");
			}
	    });     

	// Show the Y scale
	var y = d3.scaleBand()
	    .range([height, 0])
	    .domain(incomes)

	svg.append("g")
	    .call(d3.axisLeft(y).tickSizeOuter(0))
	    .selectAll("text")
	    .attr("cursor", "pointer")
	    .on("click", function(event, d) {

	    	var text = d3.select(this),
	    		bBox = text.node().getBBox();

	    	var tick = d3.select(this.parentNode);

	    	if(text.attr("selected")) {

	    		text.attr("selected", null);

	    		tick.select("rect")
	    			.style("stroke", null);


	    	} else {

		    	tick.select("rect")
			    	.style("stroke-width", "3px")
			    	.style('stroke', "grey");

			    text.attr("selected", true);
			}
	    });

		d3.select(".individualValuePlot").select("g").selectAll("g.tick").each(function(d,i) {

			var tick = d3.select(this),
		    	text = tick.select('text'),
		    	bBox = text.node().getBBox();
		      
			tick.append('rect', ':first-child')
		    	.attr('x', bBox.x - 3)
		    	.attr('y', bBox.y - 3)
		    	.attr('height', bBox.height + 6)
		    	.attr('width', bBox.width + 6);
		}); 	    

	/* Square grid */

	// var grid = d3.select(".individualValuePlot").select("svg")
	var grid = svg
		.append("g")
		.attr("stroke", "currentColor")
		.attr("stroke-opacity", 0.1)
		.attr("class", "grid");

	grid
		.append("g")
		.selectAll("line")
		.data(education_levels)
		.join("line")
		.attr("x1", (d) => 0.5 + x(d))
		.attr("x2", (d) => 0.5 + x(d))
		.attr("y1", 0)
		.attr("y2", height);

	grid
		.append("g")
		.selectAll("line")
		.data(incomes)
		.join("line")
		.attr("y1", (d) => y(d) + 24)
		.attr("y2", (d) => y(d) + 24)
		.attr("x1", 0)
		.attr("x2", width)

	/* end square grid */	    


	const size = d3.scaleSqrt()
		// .domain([0, d3.max(filteredData, (d) => d.count)])
		.domain([0, original_data_size])
		.range([10, 50]);

	var check_filter_role = filtersArray.filter(function(f) {
		return f.filter === "role";
	});

    // text label for the x axis
    svg.append("g").append("text")
      .attr("x", (width / 2) - 30)
      .attr("y", margin.top + height + 60)
      .style("text-anchor", "middle")
      .style("color", "#5a6169")
      .text("Levels of education");

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 15)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Yearly compensation ($)");

	svg.selectAll("dot")
	  	.data(filteredData)
	  	.enter()
	  	.append("rect")
	  	.attr("class", "squares")
	  	.attr("x", function(d) {return x(d.q4) - (size(d.count) / 2) })
	    .attr("y", function(d) { return y(d.q24) + (y.bandwidth() - size(d.count)) / 2; })
        .attr("width", d => size(d.count))
        .attr("height", d => size(d.count))
        .style("stroke-width", "1px")
        .style("stroke", "black")
		.style("cursor", function() {

			var filters = filtersArray.filter(function(f) {
				return f.value.length > 0;
			});

			if(filters.length > 0) {
				return "pointer";
			}

		})
        .style("fill", function(d) {

			if(check_filter_role[0].value.length > 0) {
				return roles_colors[d.q5];
			}

			return roles_colors["Default"];

        })
	    .attr("education", d => d.q4)
	    .attr("income", d => d.q24)
        .attr("role", function(d) {

			if(check_filter_role[0].value.length > 0) {
				return d.q5;
			}

        })	    
	    .attr("role", d => d.q5)
	    .attr("count", d => d.count)
	    .attr("area", d => size(d.count))
	    .on("mouseover", function (event, d) {

	    	var element = d3.select(this);

	        tooltip
	            .style("visibility", "visible");
		})
		.on("mousemove", function(event, d) {

			var text = '';

			if(filters_attributes.length > 0) {

				if(typeof d.q20 === "undefined") {
					 tooltip
			            .html("# " + d.q5 + "s: " + d.count)
			            .style("left", (event.offsetX)+ "px")
			            .style("top", (event.offsetY - 10) + "px")
			            .style("position", "absolute");
				} else {
			        tooltip
			            .html(`# ${d.q5}s: ${d.count}, size of company: ${d.q20}`)
			            .style("left", (event.offsetX)+ "px")
			            .style("top", (event.offsetY - 30) + "px")
			            .style("position", "absolute");
				}

			} else {

		        tooltip
		            .html("# Data Professionals: " + d.count)
		            .style("left", (event.offsetX)+ "px")
		            .style("top", (event.offsetY - 10) + "px")
		            .style("position", "absolute");
			}

		})
		.on("mouseleave", function(event, d) {

	        tooltip
	            .style("visibility", "hidden");

		})
		.on("click", function(event, d) {

			// Check if role exists
			if(typeof d.q5 !== "undefined") {

				/* ****** update array of filters ****** */

				removeElementFromFilter("role", d.q5);

				console.log(filtersArray);

				var selected_squares_heatmap = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function(d) {
					return d3.select(this).attr("selected") === "true";
				});

				//get selected squares from heatmap
				var squares_from_role = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function() {
					return d3.select(this).attr("role") == d.q5;
				});

				squares_from_role
					.attr("selected", null)
					.style("stroke", null);

				var selected_axis_label = d3.select("div#heatmap").select("svg.chart").select("g").select(".g_roles").selectAll("g.tick").select("text").filter(function() {
					return d3.select(this).attr("role") === d.q5;
				})

				selected_axis_label
					.attr("selected", null);

				role_filter_updated = true;

				drawGlobal(original_data);
			}
		});

		/* ************** */

		education_filter = filtersArray.find(filter => {
			return filter.filter === "education";
		});

	    var selected_educations = d3.select("div.individualValuePlot").select("svg").select("g").selectAll("text").filter(function(d) {
			// return d === "Doctoral degree";
			return education_filter["value"].includes(d);
		});

	    if(education_filter.value.length > 0 && selected_educations.size() > 0) {

	    	selected_educations.filter(function() {

	    		var tick = d3.select(this.parentNode);

		    	tick.select("rect")
		    		.attr("transform", "rotate(-25)")
			    	.style("stroke-width", "3px")
			    	.style('stroke', "grey");

			    selected_educations.attr("selected", true);
	    	});
	    }

		/* ************** */		

    // create a tooltip
    const tooltip = d3.select("div.individualValuePlot")
        .append("div")
        .style("visibility", "hidden")
        .attr("class", "tooltipIndividualPlot")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("width", "150px")
}
