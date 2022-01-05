/**
 * 
 * Create Heatmap Idiom
 * @params  array of objects    data 
 * 
 */

function drawHeatMap(data, original_data_size) {

    // if(!role_filter_updated) {

        // remove any previous heatmap
        d3.select("div#heatmap").selectAll("svg").remove();

        // set svg dimension
        const margin = {top: 10, right: 50, bottom: 40, left: 150},
        width = 700 - margin.left - margin.right,
        height = 335 - margin.top - margin.bottom;
   
       //Data Processing
        // const roles = ["Business Analyst", "Data Analyst", "Data Engineer", "Data Scientist", "DBA/Database Engineer", "Machine Learning Engineer", "Product/Project Manager", "Research Scientist", "Software Engineer", "Statistician"]
        const roles = ["Data Engineer", "Software Engineer", "Data Scientist", "Research Scientist", "Statistician", "Product/Project Manager", "Data Analyst", "Machine Learning Engineer", "Business Analyst", "DBA/Database Engineer"];
        const company_size = ["0-49", "50-249", "250-999", "1,000-9,999", "10,000 or more"];
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

        const svg_legend = d3.select("div#heatmap")
            .append('svg')
            .attr("class", "legend")
            .style("margin-top", "10px")
            .style("margin-left", margin.left + 100);

        // append the svg object to the body of the page
        const svg = d3.select("div#heatmap")
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`); 

        // Build X scales and axis:
        const x = d3.scaleBand()
            .range([ 0, width + 50 ])
            .domain(company_size)
            .padding(0.02);

            svg.append("g")
                .attr("class", "g_company_size")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickSizeOuter(0));

        // Build Y scales and axis:
        const y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(roles)
            .padding(0.05);

            svg.append("g")
                .attr("class", "g_roles")
                .call(d3.axisLeft(y).tickSizeOuter(0))
                .selectAll("text")
                .attr("role", function(role) {
                    return role;
                })
                .call(wrap, 100)
                .attr("dy", "1.90em")
                .style("cursor", "pointer")
                .on('click', function(event, role) {

                    var element = d3.select(this).node();

                    var squares = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function(e) {
                        return e.role === role;
                    });                

                    var squaresNotsSelected = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function(e) {
                        return e.role !== role;
                    });

                    if(d3.select(element).attr("selected")) {

                        /* ****** update array of filters ****** */
                        removeElementFromFilter("role", role);

                        d3.select(element).attr("selected", null);

                        squares
                            .style("stroke", null)
                            .attr("selected", null);

                        role_filter_updated = true;

                        drawGlobal(original_data, "heatMap");

                    } else {

                        d3.select(element).attr("selected", true);

                        // squaresNotsSelected
                        //     .style("stroke", null)
                        //     .attr("selected", null);

                        squares
                            .style("stroke", roles_colors[role])
                            .style("stroke-width", "2px")
                            .attr("selected", true);
                       
                        updateFilter("role", role);

                        role_filter_updated = true;

                        drawGlobal(original_data, "heatMap");
                    }

                });

        // Build color scale
        const myColor = d3.scaleSequential()
            .domain([0, d3.max(dataHeatMap, (d) => d.count)])
            .interpolator(d3.interpolateGreys);
        

         // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event,d) {

            tooltip
                .style("opacity", 1);

            var element = d3.select(this).node();

            if(!d3.select(element).attr("selected")){
                d3.select(this)
                    .style("stroke", "black")
                    .style("visibility", "visible")
            }              
        }
        const mousemove = function(event,d) {
            tooltip
                .html("# Employees: " + d.count + " " + d.role + "s")
                .style("left", (event.offsetX)+ "px")
                .style("top", (event.offsetY + 30) + "px")
                .style("position", "absolute")
        }
        const mouseleave = function(event,d) {        
            tooltip
                .style("opacity", 0);
            
            var element = d3.select(this).node();

            if(!d3.select(element).attr("selected")) {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1)
            }
        }


        // text label for the x axis
        svg.append("g").append("text")
          .attr("x", width / 2 + 30)
          .attr("y", margin.top + height + 30)
          .style("text-anchor", "middle")
          .style("color", "#5a6169")
          .text("Size of companies");
        
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

        var color = d3.scaleThreshold()
            .domain(range(0, d3.max(dataHeatMap, d => d.count), d3.max(dataHeatMap, d => d.count) / 7))
            .range(d3.schemeGreys[7]);

        var width_legend = 300,
            length_legend = color.range().length,
            height_legend = 15;

        var x_legend = d3.scaleLinear()
            .domain([0, length_legend])
            .rangeRound([width_legend / length_legend, width_legend * (length_legend - 1) / length_legend]);

        svg_legend
          .attr("align","center")      
          .attr("height", height_legend + 20)
          .attr("width_legend", width_legend)
          // .attr("transform", `translate(${margin.left},${margin.top})`);

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


        var filter_role = filtersArray.filter(function(f) {
            return f.filter === "role";
        });

        if(filter_role[0].value.length > 0) {

            var selected_axis_label = d3.select("div#heatmap").select("svg.chart").select("g").select(".g_roles").selectAll("g.tick").select("text").filter(function(role) {
                return (filter_role[0].value.includes(role))
            });

            selected_axis_label
                .attr("selected", true);

            var squares_from_role = d3.select("div#heatmap").select("svg.chart").select("g").selectAll("rect").filter(function(d) {
                return (filter_role[0].value.includes(d.role));
            });

            squares_from_role
                .style("stroke", d => roles_colors[d.role])
                .style("stroke-width", "2px")
                .attr("selected", true);

        }       

    // }

}




