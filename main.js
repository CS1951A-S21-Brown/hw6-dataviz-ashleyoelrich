// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 150;

let titles1 = ["Top 10 Video Games Of All Time", "Top 10 Video Games Of 2006"]

let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width+margin.left+margin.right)     // HINT: width
    .attr("height", graph_1_height+margin.top+margin.bottom)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform


let x = d3.scaleLinear().range([0, graph_1_width - margin.left - margin.right]);

let y = d3.scaleBand().range([margin.top, graph_1_height - margin.bottom - margin.top])
    .padding(0.1);  // Improves readability

// Set up reference to count SVG group
let countRef = svg.append("g");

// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g");

// TODO: Add x-axis label
svg.append("text")
    .attr("transform", `translate( ${(graph_1_width / 2)}, ${graph_1_height - margin.top})`)       // bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Global Sales");

// TODO: Add y-axis label
let y_axis_text = svg.append("text")
    .attr("transform", `translate( ${0}, ${graph_1_height / 2})`)       // center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width / 2)}, ${0})`)       // top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setYear(index, attr) {
//  Load the CSV file into D3 by using the d3.csv() method
    d3.csv("video_games.csv").then(function (data) {
        // Clean and strip desired amount of data for barplot
        if(attr != "All") {
            data = filterData(data, "Year", attr)
        }
        data = cleanData(data, function (a, b) {
            return parseInt(b.Global_Sales) - parseInt(a.Global_Sales)
        }, `${10}`);

        // linear scale for the x axis (number of occurrences)
        x.domain([0, d3.max(data, function (d) {
                return d['Global_Sales']})]);

        // scale band for the y axis (game)
        y.domain(data.map(function (d) {
                return d['Name']
            }));

        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10)).attr("transform", `translate(${margin.left})`);

        let bars = svg.selectAll("rect").data(data);

        // Define color scale
        let color = d3.scaleOrdinal()
            .domain(data.map(function (d) {
                return d['Name']
            }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), `${10}`));

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function (d) {
                return color(d['Name'])
            })
            .attr("x", 0)
            .attr("y", function (d) {
                return y(d['Name']);
            })
            .attr("width", function (d) {
                return x(d['Global_Sales']);
            })
            .attr("height", 5)
            .attr("transform", `translate(${margin.left})`);

        let counts = countRef.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return x(d['Global_Sales']);
            })
            .attr("y", function (d) {
                return y(d['Name']);
            })
            .style("text-anchor", "start")
            .text(function (d) {
                return d['Global_Sales'];
            })
            .attr("transform", `translate(${margin.left})`);


        // TODO: Add y-axis label

        y_axis_text.text("Video Game");

        // TODO: Add chart title

        title.text(`${titles1[index]}`);

        bars.exit().remove();
        counts.exit().remove();
    });
}


function filterData(data, attr, value){
    if (attr === "Year") {
        return data.filter(function (d) {
            return d.Year === value;
        })
    }
    else if (attr === "Genre") {
        return data.filter(function (d) {
            return d.Genre === value;
        })
    }
    }
let scat = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width+margin.left+margin.right)     // HINT: width
    .attr("height", graph_3_height+margin.top+margin.bottom)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("video_games.csv").then(function (data) {

    let nestedData = d3.nest()
        .key(function(d) { return d.Genre})
        .entries(data);


    let x2 = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d['NA_Sales']})])
        .range([0, graph_2_width - margin.left - margin.right]);

    // TODO: Add x-axis label
    scat.append("g")
        .attr("transform", `translate(0, ${graph_2_height - margin.top - margin.bottom})`)       // HINT: Position this at the bottom of the graph. Make the x shift 0 and the y shift the height (adjusting for the margin)
        .call(d3.axisBottom(x2));
    // HINT: Use the d3.axisBottom() to create your axis


    // // TODO: Create a linear scale for the y axis
    // let y2 = d3.scaleLinear()
    //     .domain([0, d3.max(data, function(d) { return d.NA_Sales;})])
    //     .range([0, graph_2_height - margin.top - margin.bottom]);
    /*
        HINT: The domain should be an interval from 0 to the highest position a song has been on the Billboard
        The range should be the same as previous examples.
     */

    // TODO: Add y-axis label
    // scat.append("g")
    //     .call(d3.axisLeft(y2));



    // OPTIONAL: Adding color
    let color2 = d3.scaleOrdinal()
        .domain(data.map(function (d) {
            return d['Genre']
        }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#ff5c7a"), 11));

    // Mouseover function to display the tooltip on hover
    let mouseover = function(d) {
        let color_span = `<span style="color: ${color2(d.Genre)};">`;
        let html = `${d.NA_Sales}<br/>
                        ${color_span}${d.Genre}</span><br/>`;

        tooltip.html(html)
            .style("left", `${(d3.event.pageX) - 220}px`)
            .style("top", `${(d3.event.pageY) - 30}px`)
            .style("box-shadow", `2px 2px 5px ${color2(d.Genre)}`)    // OPTIONAL for students
            .transition()
            .duration(200)
            .style("opacity", 0.9)
    };

    // Mouseout function to hide the tool on exit
    let mouseout = function(d) {
        // Set opacity back to 0 to hide
        tooltip.transition()
            .duration(200)
            .style("opacity", 0);
    };

    let dots = scat.selectAll("dot").data(data);

    dots.enter()
        .append("circle")
        .attr("cx", function (d) { return x2(d.NA_Sales); })      // HINT: Get x position by parsing the data point's date field
        // .attr("cy", function (d) { return y2(d.Genre); })      // HINT: Get y position with the data point's position field
        .attr("r", 4)       // HINT: Define your own radius here
        .style("fill",  function(d){ return color2(d.Genre); })
        .on("mouseover", mouseover) // HINT: Pass in the mouseover and mouseout functions here
        .on("mouseout", mouseout)
        .attr("transform", `translate(${0}, ${margin.top})`);

    scat.append("text")
        .attr("transform", `translate(${(graph_2_width / 2)}, ${graph_2_height - margin.top})`)       // HINT: Place this at the bottom middle edge of the graph
        .style("text-anchor", "middle")
        .text("NA Sales");

    // // Add y-axis label
    // scat.append("text")
    //     .attr("transform", `translate( ${0}, ${graph_2_height / 2})`)       // HINT: Place this at the center left edge of the graph
    //     .style("text-anchor", "middle")
    //     .text("Genre");

    // Add chart title
    scat.append("text")
        .attr("transform", `translate(${(graph_2_width / 2)}, ${0})`)       // HINT: Place this at the top middle edge of the graph
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text(`NA Sales By Genre`);
});

let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width+margin.left+margin.right)     // HINT: width
    .attr("height", graph_3_height+margin.top+margin.bottom)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform


let x3 = d3.scaleLinear().range([0, graph_3_width - margin.left - margin.right]);

let y3 = d3.scaleBand().range([margin.top, graph_3_height - margin.bottom - margin.top])
    .padding(0.1);  // Improves readability

// Set up reference to count SVG group
let countRef3 = svg3.append("g");

// Set up reference to y axis label to update text in setData
let y_axis_label3 = svg3.append("g");

// TODO: Add x-axis label
svg3.append("text")
    .attr("transform", `translate( ${(graph_3_width / 2)}, ${graph_3_height - margin.top})`)       // bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Global Sales");

// TODO: Add y-axis label
let y_axis_text3 = svg3.append("text")
    .attr("transform", `translate( ${0}, ${graph_3_height / 2})`)       // center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title3 = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width / 2)}, ${0})`)       // top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setGenre(attr) {
//  Load the CSV file into D3 by using the d3.csv() method
    d3.csv("video_games.csv").then(function (data) {
        // Clean and strip desired amount of data for barplot
        data = filterData(data, "Genre", attr)
        data = cleanData(data, function (a, b) {
            return parseInt(b.Global_Sales) - parseInt(a.Global_Sales)
        }, `${1}`);

        // linear scale for the x axis (number of occurrences)
        x3.domain([0, d3.max(data, function (d) {
            return d['Global_Sales']})]);

        // scale band for the y axis (game)
        y3.domain(data.map(function (d) {
            return d['Publisher']
        }));

        y_axis_label3.call(d3.axisLeft(y3).tickSize(0).tickPadding(10)).attr("transform", `translate(${margin.left})`);

        let bars3 = svg3.selectAll("rect").data(data);

        // Define color scale
        let color3 = d3.scaleOrdinal()
            .domain(data.map(function (d) {
                return d['Publisher']
            }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), `${1}`));

        bars3.enter()
            .append("rect")
            .merge(bars3)
            .transition()
            .duration(1000)
            .attr("fill", "#66a0e2")
            .attr("x", 0)
            .attr("y", function (d) {
                return y3(d['Publisher']);
            })
            .attr("width", function (d) {
                return x3(d['Global_Sales']);
            })
            .attr("height", 25)
            .attr("transform", `translate(${margin.left})`);

        let counts3 = countRef3.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts3.enter()
            .append("text")
            .merge(counts3)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return x3(d['Global_Sales']);
            })
            .attr("y", function (d) {
                return y3(d['Publisher']);
            })
            .style("text-anchor", "start")
            .text(function (d) {
                return d['Global_Sales'];
            })
            .attr("transform", `translate(${margin.left})`);


        // TODO: Add y-axis label

        y_axis_text3.text("Publisher");

        // TODO: Add chart title

        title3.text(`Top Publisher: ${attr}`);

        bars3.exit().remove();
        counts3.exit().remove();
    });
}


function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.sort(comparator);
    return data.slice(0,numExamples)
}

setYear(0, "All");
setGenre("Action");