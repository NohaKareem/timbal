<template>
  <div class="donutCon">
    <div id="donut"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Donut',
  props: { visColors: Array, logs: Array },
  methods: {
    // nested donut method https://embed.plnkr.co/plunk/2p0zmp
    renderNestedDonut() {
      var width = 900
      var height = 900
      let color = d3.scaleOrdinal().range(this.visColors)

      var pie = d3
        .pie()
        .value(function(d) {
          return d
        })
        .sort(null)

      // remove pre-existing svg, if any
      d3.select('.donut svg').remove()

      var svg = d3
        .select('#donut')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      let svgs = []
      let arcs = []

      let donutWid = 11 * this.logs.length
      let startRadius = 70 * this.logs.length
      this.logs.forEach((l, n) => {
        // svg
        svgs.push(
          svg
            .append('g')
            .attr(
              'transform',
              'translate(' + width / 2 + ',' + height / 2 + ')'
            )
        )

        // arc
        arcs.push(
          d3
            .arc()
            .innerRadius(startRadius - (n + 1) * donutWid)
            .outerRadius(startRadius - n * donutWid)
        )
      })

      arcs.forEach((arc, n) => {
        svgs[n]
          .selectAll('path')
          .data(pie(this.logs[n]))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(i)
          })
          .attr('class', 'circ')
      })
    }
  },
  created() {
    this.renderNestedDonut()
    this.$forceUpdate()
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
