/**
 * 
 * Create Heatmap Idiom
 * @params  array of objects    data 
 * 
 */
function createHeatMap(data) {

    // remove any previous heatmap
    d3.select("div#heatmap").select("svg").remove();

    // update function that calls updateGlobal function - triggers updates
    var callUpdate = function(data, filter) {
        updateGlobal(data, filter, "heatMap");
    }

    // create function that calls createGlobal function - triggers creates
    var callCreate = function(data) {
        createGlobal(data, "heatMap");
    }

    // set svg dimension
    const margin = {top: 60, right: 50, bottom:140, left: 100},
    width = 450 - margin.left - margin.right,
    height = 535 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("div#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    //roles = Object.keys(data[0]).splice(1)
   
   //Data Processing
    var roles = d3.group(data, d => d.q5).keys()
    var company_size = d3.group(data, d => d.q20).keys()
    var dataHeatMap = [];
    var obj = {};
    //process data
    groupData = d3.groups(data, d => d.q5, d => d.q20)
    groupData.forEach(element => {
       element[1].forEach(e =>{
           obj = {"role": element[0], "company_size": e[0], "count": e[1].length};
           dataHeatMap.push(obj);
       });
    });

    // Order by company size
    var company_size = Array.from(company_size).sort(d3.descending);
    function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }
    arraymove(company_size, 4, 0)
    

    // Build X scales and axis:
    const x = d3.scaleBand()
        .range([ 0, width + 50 ])
        .domain(company_size)
        .padding(0.04);

        svg.append("g")
            .attr("class", "g_company_size")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");  

    // Build Y scales and axis:
    const y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(roles)
        .padding(0.04);

        svg.append("g")
            .attr("class", "g_roles")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text")
            .call(wrap, 100)
            .attr("dy", "1.90em")
            .style("cursor", "pointer")
            .on('click', function(event, role) {

                var element = d3.select(this).node();

                var squares = d3.select("div#heatmap").select("svg").select("g").selectAll("rect").filter(function(e) {
                    return e.role === role;
                });

                var squaresNotsSelected = d3.select("div#heatmap").select("svg").select("g").selectAll("rect").filter(function(e) {
                    return e.role !== role;
                });

                // select donut chart path from the specific role selected in the heatmap that will be selected
                var donut_path_to_select = d3.select("div#donutChart").select("svg").select("g").selectAll("path").filter(function(d) {
                    return d.data.label === role;
                })

               // donut chart paths different from the specific role selected in the heatmap
                var donut_paths = d3.select("div#donutChart").select("svg").select("g").selectAll("path").filter(function(d) {
                    return d.data.label !== role;
                });

                if(d3.select(element).attr("selected")) {

                    d3.select(element).attr("selected", null); 

                    squares
                        .style("stroke", null)
                        .attr("selected", null);

                    /* ****** donut chart ***** */

                    donut_paths.attr("selected", null);
                    donut_paths.style("opacity", 1);

                    /* ****** end donut chart **** */  


                    callCreate(data);

                } else {

                    d3.select(element).attr("selected", true);

                    squaresNotsSelected
                        .style("stroke", null)
                        .attr("selected", null);              

                    squares
                        .style("stroke", roles_colors[role])
                        .style("stroke-width", "2px")
                        .attr("selected", true);


                    /* ****** donut chart ***** */
                    donut_paths.attr("selected", null) // remove selected from all the previous selected slices that weren't deselected
                    donut_paths.style('opacity', 0.3);

                    donut_path_to_select
                        .style("opacity", 1)
                        .attr("selected", true);

                    /* ****** end donut chart **** */                        

                    var filter = [
                        {"filter": "roles", "value": role}
                    ];

                    callUpdate(data, filter);
                }

            });

    // Build color scale
    const myColor = d3.scaleSequential()
     	.domain([0, d3.max(dataHeatMap, (d) => d.count)])
     	.interpolator(d3.interpolateGreys);
    

     // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event,d) {
        tooltip
            .style("opacity", 1)

        var element = d3.select(this).node();

        if(!d3.select(element).attr("selected")){
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }              
    }
    const mousemove = function(event,d) {
        tooltip
            .html("# Employees: " + d.count + " " + d.role + "s")
            .style("left", (event.offsetX)+ "px")
            .style("top", (event.offsetY) + "px")
            .style("position", "absolute")
    }
    const mouseleave = function(event,d) {
        tooltip
            .style("opacity", 0)
        
        var element = d3.select(this).node();

        if(!d3.select(element).attr("selected")) {
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        }
    }
    
    // create a tooltip
    const tooltip = d3.select("div#heatmap")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("width", "150px")


        svg.selectAll()
            .data(dataHeatMap, function(d) {return d.company_size+':'+d.roles;})
            .join("rect")
            .attr("count", function(d) {
                return d.count
            })
            .attr("x", function(d) { return x(d.company_size) })
            .attr("y", function(d) { return y(d.role) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .attr("role", function(d) { return d.role })
            .style("fill", function(d) { return myColor(d.count)})
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

 console.log(range(0, 800, 800 / 7));


  var color = d3.scaleThreshold()
                .domain(range(0, d3.max(dataHeatMap, d => d.count), d3.max(dataHeatMap, d => d.count) / 7))
                .range(d3.schemeGreys[7]);

  var width_legend = 300,
      length_legend = color.range().length,
      height_legend = 15;

  var x_legend = d3.scaleLinear()
      .domain([0, length_legend])
      .rangeRound([width_legend / length_legend, width_legend * (length_legend - 1) / length_legend]);

  svg_legend = d3.select("div#heatmap")
                  .attr("align","center")                  
                  .append('svg')
                  .attr("height", height_legend + 20)
                  .attr("width_legend", width_legend)
                  .attr("transform", `translate(${margin.left},${margin.top})`);

  svg_legend.selectAll("rect")
    .data(color.range())
    .join("rect")
    .attr("height", height_legend)
    .attr("x", (d, i) => x_legend(i))
    .attr("width", (d, i) => x_legend(i + 1) - x_legend(i))
    .attr("fill", d => d);

  svg_legend.append("text")
    .attr("x", width_legend+2)
    .attr("y", height_legend+12)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    //.attr("font-weight", "bold")
    .raise();

  svg_legend.call(d3.axisBottom(x_legend)
        .tickSize(height_legend + 5)
        .tickFormat(i => color.domain()[i])
        .tickValues(d3.range(0, length_legend + 1))
        .ticks(10))
        .select(".domain")
        .remove();

}

