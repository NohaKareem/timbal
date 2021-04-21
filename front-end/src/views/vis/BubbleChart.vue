<template>
  <div class=" Con">
    <div class="bubbleChart" ref="bubbleChart"></div>
  </div>
</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
export default {
  name: 'BubbleChart',
  data() {
    return {
      day_data: {},
      dataToDisplay: [],
      point: {},
      simulation: {}
    }
  },
  props: {
    systemCategories: Array
  },
  computed: {
    isSystem() {
      return this.systemCategories ? true : false
    }
  },
  method: {
    ticked() {
      this.point
        .attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        })
    },
    dragstarted(d) {
      this.simulation.restart()
      this.simulation.alpha(0.7)
      d.fx = d.x
      d.fy = d.y
    },
    dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    dragended(d) {
      d.fx = null
      d.fy = null
      this.simulation.alphaTarget(0.1)
    }
  },
  mounted() {
    let self = this
    let dataToDisplay = []
    axios
      .get(
        `http://localhost:3000/day/5e611877b705711710a1b28d/var/${this.$store.state.variable}/details`
      )
      // axios.get('http://localhost:3000/day/5e611877b705711710a1b28d/var/5e3316671c71657e18823380/details')
      .then(function(response) {
        self.day_data = response.data
        if (response.data === null || response.data == '') {
          self.$refs.bubbleChart.innerHTML =
            'Nothing logged in here to visualize yet!'
          return
        }
        // details route passes only needed variable, at index 0
        let logEntries = response.data.variables[0].log_data

        logEntries.forEach((logEntry) => {
          // map time spent to each top-level category (at the top of the log hierarchy. hierarchy nesting is delimited by '.')
          // top level element is always the first element
          let systemTitle = null
          let systemColor = null
          if (self.systemCategories) {
            let systemCat = self.systemCategories.filter((c) => {
              return c.values.includes(logEntry.full_category[0]._id)
            })
            if (systemCat.length > 0) {
              systemTitle = systemCat[0].name
              systemColor = systemCat[0].color
            }
          }
          let topLevelCategory = self.isSystem
            ? ''
            : logEntry.full_category[0].code
          let categroyDescription = self.isSystem
            ? systemTitle
            : logEntry.full_category[0].description

          // check if cateogry already exists
          let existingCategory = dataToDisplay.find(
            (category) => category.code === topLevelCategory
          )
          let categoryColor = systemColor
            ? systemColor
            : logEntry.full_category[0].color
          let mins =
            Math.abs(
              new Date(logEntry.end_time).getHours() -
                new Date(logEntry.start_time).getHours()
            ) *
              60 +
            new Date(logEntry.end_time).getMinutes() +
            (60 - new Date(logEntry.start_time).getMinutes())

          // reduce visual surface area
          let duration = mins / 3

          // add new duration if category doesn't exist
          if (!existingCategory) {
            dataToDisplay.push({
              code: topLevelCategory,
              text: `${topLevelCategory}
                ${self.isSystem ? '' : ': '}
                ${categroyDescription}`, //${mins} mins
              color: categoryColor,
              // update text colors for higher contrast with light backgrounds
              lightColor:
                categoryColor === '5e8b9ee84b8d5674645b32be' ||
                categoryColor === '5e8b9f134b8d5674645b32bf' ||
                categoryColor === '5e8b9ead4b8d5674645b32ba'
                  ? true
                  : false,
              cx: Math.floor(Math.random() * 300 + 1),
              cy: Math.floor(Math.random() * 300 + 1),
              r: duration
            })
          } else {
            // increment duration
            dataToDisplay.find(
              (category) => category.code === topLevelCategory
            ).r += duration
          }
        })

        // bubble chart
        //create the SVG container
        var svg = d3
          .select('.bubbleChart')
          .append('svg')
          .attr('width', 900)
          .attr('height', 500)

        //Put D3 create/update code in a function that can be re-called
        function circles(svg) {
          var data = dataToDisplay

          self.point = svg.selectAll('circle').data(data)

          // Enter loop, creates any new circles/things needed
          self.point
            .enter()
            .append('circle')
            .attr('class', 'circ')
            .attr('cx', function(d) {
              return d.cx
            })
            .attr('cy', function(d) {
              return d.cy
            })
            .attr('r', function(d) {
              return d.r
            })
            .attr('fill', function(d) {
              let categoryColorId = d.color

              // filter array by attribute value https://stackoverflow.com/a/2722213
              // get color from vuex store, returned color object (with color property) is an array of 1 object
              return self.$store.state.colors.filter((color) => {
                return color._id == categoryColorId
              })[0].color
            })

          // // Update loop will loop through any existing shapes, and change their values any time the data changes
          // point.transition().duration(500)
          // .attr('cx', function(d){ return d.cx })
          // .attr('cy', function(d){ return d.cy })
          // .attr('r', function(d){ return d.r });

          // collision detection from https://bl.ocks.org/rsk2327/0645d1629cf74424010351a50f2ade84
          var attractForce = d3
            .forceManyBody()
            .strength(80)
            .distanceMax(400)
            .distanceMin(80)

          var collisionForce = d3
            .forceCollide(12)
            .strength(1)
            .iterations(100)

          self.simulation = d3
            .forceSimulation(data)
            .alphaDecay(0.01)
            .force('attractForce', attractForce)
            .force('collisionForce', collisionForce)

          self.point.call(
            d3
              .drag()
              .on('start', self.dragstarted)
              .on('drag', self.dragged)
              .on('end', self.dragended)
          )

          self.simulation.on('tick', self.ticked)

          // adding text labels https://stackoverflow.com/a/46138457/1446598
          var label = svg.selectAll('text').data(data)

          label
            .enter()
            .append('text')
            .attr('x', function(d) {
              return d.cx
            })
            .attr('y', function(d) {
              return d.cy + 6
            })
            .text(function(d) {
              return d.text
            })
            .attr('text-anchor', 'middle')

            // text styling https://stackoverflow.com/a/41452514/1446598
            .attr('fill', function(d) {
              return d.lightColor ? '#707070' : '#F0F0F0'
            })
        }
        circles(svg)

        // setInterval(function() {
        //     circles(svg);
        //     }, 1000);
      })
      .catch(function(error) {
        console.error(error)
      })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/globalStyles.scss';
// deep selectors for styling dynamically-generated html  https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
// ::v-deep circle {
//   @include softUiShadow_SVG();
//   // @extend .softUiShadow;
// }
</style>
