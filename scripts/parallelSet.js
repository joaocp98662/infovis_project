function createParallelSet(data) {

    d3.select(".parallelSet").select("svg").remove();

    var formatedData = [];

    // var count_roles = {"Business Analyst": 0, "Data Analyst": 0, "Data Engineer": 0, "Data Scientist": 0, "DBA/Database Engineer": 0, "Machine Learning Engineer": 0, "Product/Project Manager": 0, "Research Scientist": 0, "Software Engineer": 0, "Statistician": 0}

    // data = data.slice(0, 100);
    // data = data.slice(0, 10);


    data.filter(function(d) { // multiplies the data items by the number of programming languages used. Also counts the number of items for each language

        if(d.q5 === "Business Analyst") count_roles["Business Analyst"] += 1;
        if(d.q5 === "Data Analyst") count_roles["Data Analyst"] += 1;
        if(d.q5 === "Data Engineer") count_roles["Data Engineer"] += 1;
        if(d.q5 === "Data Scientist") count_roles["Data Scientist"] += 1;
        if(d.q5 === "DBA/Database Engineer") count_roles["DBA/Database Engineer"] += 1;
        if(d.q5 === "Machine Learning Engineer") count_roles["Machine Learning Engineer"] += 1;
        if(d.q5 === "Product/Project Manager") count_roles["Product/Project Manager"] += 1;
        if(d.q5 === "Research Scientist") count_roles["Research Scientist"] += 1;
        if(d.q5 === "Software Engineer") count_roles["Software Engineer"] += 1;
        if(d.q5 === "Statistician") count_roles["Statistician"] += 1;


        if(Number(d.python) == 1) formatedData.push({"q5": d.q5, "q7": "python"});
        if(Number(d.r == 1)) formatedData.push({"q5": d.q5, "q7": "r"});
        if(Number(d.sql == 1)) formatedData.push({"q5": d.q5, "q7": "sql"});
        if(Number(d.c == 1)) formatedData.push({"q5": d.q5, "q7": "c"});
        if(Number(d["c++"] == 1)) formatedData.push({"q5": d.q5, "q7": "c++"});
        if(Number(d.java == 1)) formatedData.push({"q5": d.q5, "q7": "java"});
        if(Number(d.javascript == 1)) formatedData.push({"q5": d.q5, "q7": "javascript"});
        if(Number(d.julia == 1)) formatedData.push({"q5": d.q5, "q7": "julia"});
        if(Number(d.swift == 1)) formatedData.push({"q5": d.q5, "q7": "swift"});
        if(Number(d.bash == 1)) formatedData.push({"q5": d.q5, "q7": "bash"});
        if(Number(d.matlab == 1)) formatedData.push({"q5": d.q5, "q7": "matlab"});
        if(Number(d.none == 1)) formatedData.push({"q5": d.q5, "q7": "none"});
        if(Number(d.other == 1)) formatedData.push({"q5": d.q5, "q7": "other"});

    });

    count_roles.total = data.length;

   /*   */

    var chart = d3.parsets(data)
        .width(720)
        .height(100)
        .dimensions(["q5", "q7"]);
        // .dimensions(["q5", "q4"]);

    var vis = d3.select(".parallelSet").append("svg")
        .attr("width", chart.width()+70)
        .attr("height", chart.height()+70)
        .style("padding-top", 20)
        .style("padding-left", 30);


    vis.datum(formatedData).call(chart);
    // vis.datum(data).call(chart);
}

function drawParallelSet(data) {

    d3.select(".parallelSet").select("svg").remove();

    count_roles["Data Engineer"] = 0;
    count_roles["Software Engineer"] = 0;
    count_roles["Data Scientist"] = 0;
    count_roles["Research Scientist"] = 0;
    count_roles["Statistician"] = 0;
    count_roles["Product/Project Manager"] = 0;
    count_roles["Data Analyst"] = 0;
    count_roles["Machine Learning Engineer"] = 0;
    count_roles["Business Analyst"] = 0;
    count_roles["DBA/Database Engineer"] = 0;
    count_roles["total"] = 0;

    d3.select(".parallelSet").select("svg").remove();

    var formatedData = [];

    // groupedData = d3.flatRollup(data, v => v.length, d => d.q5);

    // console.log(groupedData);

    data.filter(function(d) { // multiplies the data items by the number of programming languages used. Also counts the number of items for each language

        if(d.q5 === "Business Analyst") count_roles["Business Analyst"] += 1;
        if(d.q5 === "Data Analyst") count_roles["Data Analyst"] += 1;
        if(d.q5 === "Data Engineer") count_roles["Data Engineer"] += 1;
        if(d.q5 === "Data Scientist") count_roles["Data Scientist"] += 1;
        if(d.q5 === "DBA/Database Engineer") count_roles["DBA/Database Engineer"] += 1;
        if(d.q5 === "Machine Learning Engineer") count_roles["Machine Learning Engineer"] += 1;
        if(d.q5 === "Product/Project Manager") count_roles["Product/Project Manager"] += 1;
        if(d.q5 === "Research Scientist") count_roles["Research Scientist"] += 1;
        if(d.q5 === "Software Engineer") count_roles["Software Engineer"] += 1;
        if(d.q5 === "Statistician") count_roles["Statistician"] += 1;


        if(Number(d.python) == 1) formatedData.push({"q5": d.q5, "q7": "python"});
        if(Number(d.r == 1)) formatedData.push({"q5": d.q5, "q7": "r"});
        if(Number(d.sql == 1)) formatedData.push({"q5": d.q5, "q7": "sql"});
        if(Number(d.c == 1)) formatedData.push({"q5": d.q5, "q7": "c"});
        if(Number(d["c++"] == 1)) formatedData.push({"q5": d.q5, "q7": "c++"});
        if(Number(d.java == 1)) formatedData.push({"q5": d.q5, "q7": "java"});
        if(Number(d.javascript == 1)) formatedData.push({"q5": d.q5, "q7": "javascript"});
        if(Number(d.julia == 1)) formatedData.push({"q5": d.q5, "q7": "julia"});
        if(Number(d.swift == 1)) formatedData.push({"q5": d.q5, "q7": "swift"});
        if(Number(d.bash == 1)) formatedData.push({"q5": d.q5, "q7": "bash"});
        if(Number(d.matlab == 1)) formatedData.push({"q5": d.q5, "q7": "matlab"});
        if(Number(d.none == 1)) formatedData.push({"q5": d.q5, "q7": "none"});
        if(Number(d.other == 1)) formatedData.push({"q5": d.q5, "q7": "other"});

    });

    count_roles.total = data.length;

    var chart = d3.parsets(data)
        .width(720)
        .height(300)
        .dimensions(["q5", "q7"]);

    var vis = d3.select(".parallelSet").append("svg")
        .attr("width", chart.width()+70)
        .attr("height", chart.height()+70)
        .style("padding-top", 5)
        .style("padding-bottom", 15)
        .style("padding-left", 30);


    vis.datum(formatedData).call(chart);
}