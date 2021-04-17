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
  // props: { visColors: Array, logs: Array, radius: Number, donutWidth: Number },
  methods: {
    // nested donut method https://embed.plnkr.co/plunk/2p0zmp
    renderNestedDonut() {
      var width = 400
      var height = 400
      let color = d3.scaleOrdinal().range(this.visColors)

      var pie = d3
        .pie()
        .value(function(d) {
          return d
        })
        .sort(null)

      var svg = d3
        .select('#donut')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      let svgs = []
      let arcs = []
      let donutWid = 55 //~
      let startRadius = 200
      this.logs.forEach((l, n) => {
        svgs.push(
          svg
            .append('g')
            .attr(
              'transform',
              'translate(' + width / 2 + ',' + height / 2 + ')'
            )
        )
        console.log('startRadius at start ', n, startRadius)

        arcs.push(
          d3
            .arc()
            .innerRadius(startRadius - (n + 1) * donutWid)
            .outerRadius(startRadius - n * donutWid)
        )
        // startRadius = startRadius - n * donutWid
        console.log('startRadius after', startRadius)
        console.log('arcs after', arcs)
      })
      // var arc2 = d3
      //   .arc()
      //   .innerRadius(radius2 - donutWidth)
      //   .outerRadius(radius2)

      arcs.forEach((arc, n) => {
        console.log(this.logs[n])
        svgs[n]
          .selectAll('path')
          .data(pie(this.logs[n]))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) {
            return color(i)
          })
      })

      // svg1
      //   .selectAll('path')
      //   .data(pie(this.logs[1]))
      //   .enter()
      //   .append('path')
      //   .attr('d', arcs[1])
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
