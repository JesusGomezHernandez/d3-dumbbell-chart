var svg = d3.select("svg"),
    margin = {top: 20, right: 0 , bottom: 0, left: 220},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// add scales
var x = d3.scaleLinear().rangeRound([-30, width - 60]),
    y = d3.scalePoint().rangeRound([height, 5]).padding(4);

var chart = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// import data from csv
d3.csv("https://gist.githubusercontent.com/JesusGomezHernandez/a99e73d590deea3c874dbbdbdc68db30/raw/af0f10b5ff5e45b1b38a01e99ebf4fcfb2fe98c9/D3_Viz_Dumbbells.csv", function(d) {
  d.Tasa_Enero = +d.Tasa_Enero; // coerce to number
  return d;
}, function(error, data) {

  if (error) throw error;

  // sort rates from highest to lowest inventory
  data.sort(function(a, b) {
    // range is flipped, so it ascends from bottom of chart
    return d3.ascending(+a.Tasa_Enero, +b.Tasa_Enero);
  });

  x.domain([0, d3.max(data, function(d) { return d.Tasa_Enero; })]);
  y.domain(data.map(function(d) { return d.Municipio; }));

  // x-axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("text-anchor", "end")
      .text("");

  // y-axis
  chart.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));

  var dumbbellGroup = chart.append("g")
      .attr("id", "dumbbellGroup");

  var dumbbell = dumbbellGroup.selectAll(".dumbbell")
      .data(data)
    .enter().append("g")
      .attr("class", "dumbbell")
      .attr("transform", function(d) { return "translate(0," + y(d.Municipio) + ")"; });

  // lines: between dots
  dumbbell.append("line")
      .attr("class", "line between")
      .attr("x1", function(d) { return x(d.Tasa_Diciembre); })
      .attr("x2", function(d) { return x(d.Tasa_Enero); })
      .attr("y1",0)
      .attr("y2",0);

  // lines: before dots
  dumbbell.append("line")
      .attr("class", "line before")
      .attr("x1", 0)
      .attr("x2", function(d) {return x(d.Tasa_Diciembre); })
      .attr("y1", 0)
      .attr("y2", 0);

  // dots: current inventory
  dumbbell.append("circle")
      .attr("class", "circle current")
      .attr("cx", function(d) { return x(d.Tasa_Enero); })
      .attr("cy", 0)
      .attr("r", 6);

  // data labels: current
  dumbbell.append("text")
      .attr("class", "text current")
      .attr("x", function(d) { return x(d.Tasa_Enero); })
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("dx", 10)
      .text(function(d) { return d.Tasa_Enero; });

  // data labels: future
  dumbbell.append("text")
      .attr("class", "text future")
      .attr("x", function(d) { return x(d.Tasa_Diciembre); })
      .attr("y", 0)
      .attr("dy", ".35em")
      .attr("dx", -10)
      .attr("text-anchor", "end")
      .text(function(d) { return d.Tasa_Diciembre; });

  d3.select(".dumbbell:last-child")
    .append("text")
      .attr("class", "label current")
      .attr("x", function(d) { return x(d.Tasa_Enero); })
      .attr("y", 0)
      .attr("dy", -20)
      .attr("text-anchor", "middle")
      .text("Enero");
  d3.select(".dumbbell:last-child")
    .append("text")
      .attr("class", "label future")
      .attr("x", function(d) { return x(d.Tasa_Diciembre); })
      .attr("y", 0)
      .attr("dy", -20)
      .attr("text-anchor", "middle")
      .text("Diciembre")

  // dots: future inventory
  dumbbell.append("circle")
      .attr("class", "circle future")
      .attr("cx", function(d) { return x(d.Tasa_Diciembre); })
      .attr("cy", 0)
      .attr("r", 6);

});
