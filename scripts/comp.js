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
        createGlobal(data);
    }

    // set svg dimension
    const margin = {top: 60, right: 50, bottom:140, left: 100},
    width = 450 - margin.left - margin.right,
    height = 570 - margin.top - margin.bottom;

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
                var donut_path_to_select = d3.select("div#donutChart").select("svg").select("g").selectAll("path").filter(function(e) {
                    return e.data.label === role;
                })

               // donut chart paths different from the specific role selected in the heatmap
                var donut_paths = d3.select("div#donutChart").select("svg").select("g").selectAll("path").filter(function(e) {
                    return e.role !== role;
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
                    console.log(donut_path_to_select);
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

        console.log(d3.select(element).attr("selected"));

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

    //create legend
    //var width = 150,
    // length = myColor.range().length
    length = 6
    //height = 6;
    var xLegend = d3.scaleLinear()
        .domain([1, length - 1])
        .rangeRound([width / length, width * (length - 1) / length]);

    svg_legend = d3.select("div#heatmap")
                    .append('svg')
                    .attr("transform", "translate(3,3)");

    svg_legend.selectAll("rect")
    .data(myColor.range())
    .join("rect")
    .attr("height", height)
    //.attr("x", (d, i) => x(i))
    .attr("width", 10)
    .attr("fill", d => d);

    // svg_legend.append("text")
    // .attr("x", width+2)
    // .attr("y", height+12)
    // .attr("fill", "black")
    // .attr("text-anchor", "start")
    // //.attr("font-weight", "bold")
    // .text("Number of Races")
    // .raise();

    svg_legend.call(d3.axisBottom(xLegend)
            .tickSize(8)
            .tickFormat("fill", function(d) { return myColor(d.count)})
            .tickValues(function(d) { return myColor(d.count)}))
            .select(".domain")
            .remove();
}

