import React, { useRef, useEffect } from "react";
import * as topojson from "topojson-client";
import * as d3 from "d3";
import "./App.css";

function App() {
  const svgRef = useRef();
  const width = 900;
  const height = 450;

  useEffect(() => {
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const projection = d3
      .geoMercator()
      .scale(140)
      .translate([width / 1.4, height / 1.4]);
    const path = d3.geoPath(projection);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .on("zoom", (event, d) => {
        svg.selectAll("path").attr("transform", event.transform);
        svg.selectAll("circle")
          .attr("transform", event.transform)
          .attr("r", function (d) {
            if (d.properties.mass) {
              return Math.pow(parseInt(d.properties.mass), 1 / 9) / event.transform.k;
            }
          });
      });

    svg.call(zoom);

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((data) => {
      const countries = topojson.feature(data, data.objects.countries);

      svg.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);
    });

    d3.json(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"
    ).then((data) => {
      if (data) {
        const locations = data.features;

        svg.selectAll("circle")
          .data(locations)
          .enter()
          .append("circle")
          .attr("cx", function (d) {
            if (d.geometry) {
              return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
            }
          })
          .attr("cy", function (d) {
            if (d.geometry) {
              return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
            }
          })
          .attr("r", function (d) {
            if (d.properties.mass) {
              return Math.pow(parseInt(d.properties.mass), 1 / 9);
            }
          })
          .style("fill", "#3498db")
          .style("stroke", "#000000")
          .style("stroke-width", ".1");
      }
    });
  }, []);

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;
