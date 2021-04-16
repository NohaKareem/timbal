<template>
  <div class="donutCon">
    <div id="donut"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Donut',
  // props: { visColors: { type: Array }, logs: { type: Array } },
  props: { visColors: Array, logs: Array },
  methods: {
    // nested donut method https://embed.plnkr.co/plunk/2p0zmp
    renderNestedDonut() {
      var dataset1 = [
        { count: 10 },
        { count: 20 },
        { count: 30 },
        { count: 40 }
      ]
      // var dataset2 = [
      //   { count: 5 },
      //   { count: 15 },
      //   { count: 25 },
      //   { count: 35 },
      //   { count: 45 }
      // ]

      var width = 400
      var height = 400
      var donutWidth = 75
      var radius1 = Math.min(width, height) / 2
      // var radius2 = radius1 - donutWidth
      let color = d3.scaleOrdinal().range(this.visColors)
      // let color = d3.scaleOrdinal().range(['#ff0000', '#CC33fF', '#00A0B0'])

      var svg = d3
        .select('#donut')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      var svg1 = svg
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      // var svg2 = svg
      //   .append('g')
      //   .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      var arc1 = d3
        .arc()
        .innerRadius(radius1 - donutWidth)
        .outerRadius(radius1)

      // var arc2 = d3
      //   .arc()
      //   .innerRadius(radius2 - donutWidth)
      //   .outerRadius(radius2)

      var pie = d3
        .pie()
        .value(function(d) {
          return d.count
        })
        .sort(null)

      // outer
      svg1
        .selectAll('path')
        .data(pie(dataset1))
        .enter()
        .append('path')
        .attr('d', arc1)
        .attr('fill', function(d, i) {
          return color(i)
        })

      // svg2
      //   .selectAll('path')
      //   .data(pie(dataset2))
      //   .enter()
      //   .append('path')
      //   .attr('d', arc2)
      //   .attr('fill', function(d, i) {
      //     return color(i)
      //   })
    }
  },
  created() {
    this.renderNestedDonut()
    this.$forceUpdate()
    console.log('at donut')
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
