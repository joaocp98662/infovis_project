function init() {

	// load the external data
	d3.csv("data/data.csv")
		.then((data) => {

			original_data = data;
			original_data_size = data.length;			

			drawGlobal(original_data);
		})
		.catch((error) => {
			console.log(error);
		});
}

function filterData(data, to = "") {


    var filters_attributes = [];
    var filters_values = [];
    var filteredData = [];

    // map filters keys to the same name as the attributes
    filtersArray.forEach((filter) => {


	    if(filter.filter === "role" && to === "heatMap") {
    		return;
    	}

        if(filter["value"].length > 0 ) {
            filters_values.push(filter.value);

            if(filter.filter === "language") {
            	filters_attributes.push({ "name": filter.filter, "value": filter.value});
            } else {
            	filters_attributes.push({ "name": map_filters_attributes[filter.filter], "value": filter.value});
            }
        }
    });

    var eval_query_string = '';

    //constructs query string to filter grouped data - e.g. (d[2] === "Data Engineer" || d[2] === "Data Scientist") && (d[3] === "0-49")
    filters_attributes.forEach((filter, index) => {

        if(index == 0) {

        	if(filter.name === "language") {

	            filter["value"].forEach((value, i, array) => {
	                eval_query_string += i == (array.length - 1) && array.length > 1 ? ` d.${value} == 1)` : i == 0 && array.length > 1 ? `(d.${value} == 1 ||` : array.length > 1 && i != (array.length - 1) ? ` d.${value} == 1 ||` : array.length == 1 ? `(d.${value} == 1)` : `d.${value} == 1`;
	            });        		


        	} else {
	            filter["value"].forEach((value, i, array) => {
	                eval_query_string += i == (array.length - 1) && array.length > 1 ? ` d.${filter.name} === "${value}")` : i == 0 && array.length > 1 ? `(d.${filter.name} === "${value}" ||` : array.length > 1 && i != (array.length - 1) ? ` d.${filter.name} === "${value}" ||` : array.length == 1 ? `(d.${filter.name} === "${value}")` : `d.${filter.name} === "${value}"`;
	            });
        	}

        } else {

        	if(filter.name === "language") {

	            filter["value"].forEach((value, i, array) => {
	                eval_query_string += i == (array.length - 1) && array.length > 1 ? ` d.${value} == 1)` : i == 0 && array.length > 1 ? ` && (d.${value} == 1 ||` : array.length > 1 && i != (array.length - 1) ? ` d.${value} == 1 ||` : array.length == 1 ? ` && (d.${value} == 1)` : `d.${value} == 1`;
	            });        		

        	} else {
	            filter["value"].forEach((value, i, array) => {
	                eval_query_string += i == (array.length - 1) && array.length > 1 ? ` d.${filter.name} === "${value}")` : i == 0 && array.length > 1 ? ` && (d.${filter.name} === "${value}" ||` : array.length > 1 && i != (array.length - 1) ? ` d.${filter.name} === "${value}" ||` : array.length == 1 ? ` && (d.${filter.name} === "${value}")` : `d.${filter.name} === "${value}"`;
	            });
        	}
        }
    });

    if(!eval_query_string.length) {
    	return data;
    }

    filteredData = data.filter(function(d) {
        return eval(eval_query_string);
    });

    return filteredData;
}

function drawGlobal(original_data, fromChart = "") {

	var filteredData = filterData(original_data);

	drawRadarChart(filteredData, original_data_size);

	if(fromChart !== 'heatMap') {

		var heatmapdData = filterData(original_data, "heatMap");

		drawHeatMap(heatmapdData, original_data_size);
	}

	drawIndividualValuePlot(filteredData, original_data_size);

	drawParallelSet(filteredData, original_data_size);
}

/**
 * 
 * Global function -> call all the create idioms
 * 
 */
function createGlobal(filteredData, original_data_size, fromChart = "") {

	if(fromChart !== 'radarChart') {
		drawRadarChart(filteredData, original_data_size);
	}

	if(fromChart !== 'heatMap') {
		drawHeatMap(filteredData, original_data_size);
	}

	if(fromChart != "individualValuePlot") {
		drawIndividualValuePlot(filteredData, original_data_size);
	}

	drawParallelSet(filteredData, original_data_size);
}

/**
 * 
 * Global function -> call all the update idioms
 * @param chart - name (class format) of the chart that called this function
 * 
 */
function updateGlobal(data, fromChart) {

	console.log("UPDATE");
	
	if(fromChart != "radarChart") {
		updateRadarChart(data);
	}

	// if(fromChart != "heatMap")
	// 	updateHeatMap(data);

	// if(fromChart != "parallelSet")
	// 	updateParallelSet(data);

	if(fromChart != "individualValuePlot") {
		updateIndividualValuePlot(data);
	}

	updateParallelSet(data);
}
