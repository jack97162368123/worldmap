import React, { useState, useRef, useEffect } from "react";
import * as topojson from "topojson-client";
import * as d3 from "d3"; 
import './App.css';

function App() {

  const svgRef = useRef();
  const width = 1000;
  const height = 500;

  useEffect(() => {
    //setting up the svg - giving d3 access to the dom over react
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const projection = d3.geoMercator()
      //Using scale to scale the SVG File down
      .scale(140)
      // translating the SVG to center
      .translate([width/3, height/2]);
    const path = d3.geoPath(projection);
    
    const g = svg.append("g");

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((data) => { 
      const countries = topojson.feature(data, data.objects.countries);

      g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        //This path is very important - we need to create the path useing the geo data const above
        .attr("d", path);
    });
  }, []);

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;
