function init() {

	// load the external data
	d3.csv("data/data.csv")
		.then((data) => {
			donutChart(data);
			createGlobal(data);
		})
		.catch((error) => {
			console.log(error);
		});
}

/**
 * 
 * Global function -> call all the create idioms
 * 
 */
function createGlobal(data) {

	createRadarChart(data);
	createHeatMap(data);
}

/**
 * 
 * Global function -> call all the update idioms
 * @param filter
 * @param chart - name (class format) of the chart that called this function
 * 
 */
function updateGlobal(data, filter, fromChart) {
	
	if(fromChart != "radarChart") {
		updateRadarChart(data, filter);
	}

	// if(fromChart != "heatMap")
	// 	updateHeatMap(data, filter);

	// if(fromChart != "parallelSet")
	// 	updateParallelSet(data, filter);

	// if(fromChart != "individualValuePlot")
	// 	updateIndividualValuePlot(data, filter);
}

/**
 * 
 * Create Donut Chart Idiom
 * @params	array of objects	data 
 * 
 */
function donutChart(data) {

	var callUpdate = function(data, filter) {
		updateGlobal(data, filter, "donutChart");
	}

	var callCreate = function(data) {
		createGlobal(data);
	}		

    var width = 105;
    var height = 100;
    var radius = (Math.min(width, height) / 2) - 2;
    var donutWidth = 15;

    var svg = d3.select('div#donutChart')
     	.append('svg')
      	.attr('width', width)
      	.attr('height', height)
      	.append('g')
      	.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

	svg.append("text")
	   .attr("text-anchor", "middle")
	   .attr("class", "stats-small__label text-uppercase")
	   .attr("fill", "#818ea3")
	   .text("Roles");

	// create a tooltip
	var tooltip = d3.select("div#donutChart")
		.append("div")
		.attr("class", "donutToolTip")
		.style("visibility", "hidden");

    var arc = d3.arc()
    	.innerRadius(radius - donutWidth)             
    	.outerRadius(radius)
    	.padAngle(0.015);
      
    var pie = d3.pie()
    	.value(function(d) { return d.count; })   	
    	.sort(null);

    var path = svg.selectAll('path')
    	.data(pie(roles_count))
    	.enter()
    	.append('path')
    	.attr('d', arc)
    	.attr("role", function(e) {
    		return e.data.label;
    	})
    	// .style("stroke-width", "1px")
    	// .style("stroke", "#000")
    	.style("cursor", "pointer")
    	.on("mouseover", function(event, d) {

	        var elements = svg.selectAll("path").filter(function(el) {	        		
		            return d3.select(this).attr("selected");
		        });

	       	if(!elements.size()) { // check if didn't find any elements selected

		        var current = this;
		        var others = svg.selectAll("path").filter(function(el) {
		            return this != current;
		        });
		        others.style('opacity', 0.6);

	       	}    		

    		var tooltip = d3.select("div.donutToolTip")

    		// console.log("pageX = " + event.offsetX);
    		// console.log("pageY = " + event.offsetY);
    		// console.log(d.index);

    		tooltip
    			.text(d.data.label)
				.style("visibility", "visible");

			if(d.index < 5)
				//.style("top", (event.offsetY)+"px").style("left", (event.offsetX*2.2 + width)+"px");
				tooltip
					.style("top", (event.offsetY)+"px").style("left", (event.offsetX + width + 90)+"px");
			else
				tooltip
					.style("top", (event.offsetY)+"px").style("left", (event.offsetX + 110)+"px");
    	})
    	.on("mouseleave", function(event, d) {

	        //var elements = svg.selectAll("path").style('opacity', 1);

	        var elements = svg.selectAll("path").filter(function(el) {	        		
		            return d3.select(this).attr("selected");
		        });

	       	if(!elements.size()) { // check if didn't find any elements selected
	       		svg.selectAll("path").style('opacity', 1); // change opacity of all slices
	       	}

    		var tooltip = d3.select("div.donutToolTip").style("visibility", "hidden");
    	})
    	.on("click", function(event, d) {

    		console.log(this);

    		var slice = d3.select(this);

            var heatmap_squares = d3.select("div#heatmap").select("svg").select("g").selectAll("rect").filter(function(e) {
                return e.role === d.data.label;
            });

            var heatmap_squaresNotsSelected = d3.select("div#heatmap").select("svg").select("g").selectAll("rect").filter(function(e) {
                return e.role !== d.data.label;
            });

    		if(slice.attr("selected")) {

    			slice.attr("selected", null);
    			d3.selectAll("path").style("opacity", 1);

    			/* ******* heatmap ******* */

    			heatmap_squares
                   .style("stroke", null)
                   .attr("selected", null);

    			/* ******* end heatmap ******* */    			

    			// call create to draw default radar chart
				callCreate(data);

    		} else {

    			var current = this;
		        var others = svg.selectAll("path").filter(function(el) {
		            return this != slice
		        });
		        others.attr("selected", null) // remove selected from all the previous selected slices that weren't deselected
		        others.style('opacity', 0.3);

		        slice
		        	.style("opacity", 1)
		        	.attr("selected", true);

    			// slice
    			// 	.style("stroke-width", "2px")
    			// 	.style("stroke", "black")
    			// 	.attr("selected", true);


    			/* ******* heatmap ******* */

    			// desable preavious selected elements
                heatmap_squaresNotsSelected
                    .style("stroke", null)
                    .attr("selected", null);

    			// enable elements of the type of role selected
                heatmap_squares
                    .style("stroke", roles_colors[d.data.label])
                    .style("stroke-width", "2px")
                    .attr("selected", true);

    			/* ******* end heatmap ******* */

				var filter = [
					{"filter": "roles", "value": d.data.label}
				];

				callUpdate(data, filter);

    		}
    	})
    	.attr('fill', function(d, i) {
        	return roles_colors[d.data.label];
    	});

}
