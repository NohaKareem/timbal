<template>
    <div class="bubbleChartCon">
        <div class="bubbleChart"></div>
    </div>
</template>

<script>
  import axios from "axios";
  import * as d3 from 'd3';
  export default {
    name: "BubbleChart", 
    data() {
      return {
        // days: []
      }
    },
    mounted() {
        // bubble chart
        var makeData = function(n){
            var arr = [];

            for (var i=0; i<n; i++){
            arr.push({
                cx:Math.floor((Math.random() * 300) + 1),
                cy:Math.floor((Math.random() * 300) + 1),
                r:Math.floor((Math.random() * 30) + 1)
            })
            };
            return arr;
        }

        //create the SVG container
        var svg = d3.select("body")
            .append("svg")
            .attr("width", 400)
            .attr("height", 400);

        //Put D3 create/update code in a function that can be re-called
        function circles(svg) {
            var data = makeData(10);

            var point = svg.selectAll('circle')
            .data(data);

        // Enter loop, creates any new circles/things needed
        point.enter()
                .append('circle') 
                .attr('cx', function(d){ return d.cx })
                .attr('cy', function(d){ return d.cy })
                .attr('r', function(d){ return d.r });

            // Update loop will loop through any existing shapes, and change their values any time the data changes
            point.transition().duration(500)
            .attr('cx', function(d){ return d.cx })
            .attr('cy', function(d){ return d.cy })
            .attr('r', function(d){ return d.r });
        }

        setInterval(function() {
            circles(svg);
            }, 1000);
      }
  }
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  circle {
        background-color: red;
  }
</style>
