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
        day_data: {}, 
        dataToDisplay: []
      }
    },
    mounted() {
      //~~variables
      // ~ todo consider force
      let self = this;
      let dataToDisplay = [];
      axios.get('http://localhost:3000/day/5e611877b705711710a1b28d/var/5e3316671c71657e18823380/details')
      .then(function(response) {
          self.day_data = response.data;
          let logEntries = response.data.variables[0].log_data;
          logEntries.forEach(logEntry => {
              // ~todo: add to readme
              // map time spent to each top-level category (at the top of the log hierarchy. hierarchy nesting is delimited by '.')
              // top level element is always the first element
              let topLevelCategory = logEntry.full_category[0].code;
              let existingCategory = dataToDisplay.find(category => category.code === topLevelCategory);
              // console.log(!existingCategory)

              // compute duration, in minutes, as difference between start and end time
              let duration = Math.abs(
                          ((new Date(logEntry.start_time)).getHours() * 60 + (new Date(logEntry.start_time)).getMinutes())
                          - (new Date(logEntry.end_time).getHours() * 60 + new Date(logEntry.end_time).getMinutes())
                          );
              // add new duration if category doesn't exist
              if (!existingCategory) {
                  dataToDisplay.push({
                    code: topLevelCategory, 
                    // duration: duration, 


                    cx: Math.floor((Math.random() * 300) + 1),
                    cy: Math.floor((Math.random() * 300) + 1),
                    r: duration//Math.floor((Math.random() * 30) + 1)
                  });
              } else {
                // increment duration
                dataToDisplay.find(category => category.code === topLevelCategory).duration += duration;
              }
          });
       
          // bubble chart
          //create the SVG container
          var svg = d3.select(".bubbleChart")
              .append("svg")
              .attr("width", 400)
              .attr("height", 400);

          //Put D3 create/update code in a function that can be re-called
          function circles(svg) {
              var data = dataToDisplay;

              var point = svg.selectAll('circle')
                  // .attr('class', 'bubbleCircle')//~
                  // .style('box-shadow', `
                                  // -5px -5px 15px 0 white, 
                                  // 5px 5px 15px 0 transparentize(black, 0.9);`)
                  // .attr('fill', 'red')
                  .data(data);

              // Enter loop, creates any new circles/things needed
              point.enter()
                  .append('circle') 
                  .attr('cx', function(d){ return d.cx })
                  .attr('cy', function(d){ return d.cy })
                  .attr('r', function(d){ return d.r })
                  .attr('fill', 'pink')
                        
                    // // Update loop will loop through any existing shapes, and change their values any time the data changes
                    // point.transition().duration(500)
                    // .attr('cx', function(d){ return d.cx })
                    // .attr('cy', function(d){ return d.cy })
                    // .attr('r', function(d){ return d.r });

              // adding text labels https://stackoverflow.com/a/46138457/1446598
              var label = svg.selectAll('text')
                    .data(data);
              
              label.enter()
                    .append('text')
                    .attr("x", function(d) { return d.cx })
                    .attr("y", function(d) { return d.cy + 6 })
                    .text(function(d) { return d.code })
                    .attr("text-anchor", "middle")

                      // text styling https://stackoverflow.com/a/41452514/1446598
                    .attr("fill", "#F0F0F0");
          }
          circles(svg);


          // setInterval(function() {
          //     circles(svg);
          //     }, 1000);
      }).catch(function(error) {
          console.error(error);
      }); 
      }, 
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/globalStyles.scss';
  // deep selectors for styling dynamically-generated html  https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
  ::v-deep circle {
    // fill: red;
    // stroke: red;
    // stroke-width: 5px;
    @include softUiShadow_SVG();
  }
</style>
