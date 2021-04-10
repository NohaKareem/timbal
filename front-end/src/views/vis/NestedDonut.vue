<template>
  <div class="donutCon">
    <div id="donut"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'NestedDonut',
  computed: {
    colors() {
      return this.$store.state.colors
    }
  },
  props: ['logs'],
  methods: {
    // nested donut method https://embed.plnkr.co/plunk/2p0zmp
    renderNestedDonut() {
      console.log('in donut')
      var dataset1 = [
        { count: 10 },
        { count: 20 },
        { count: 30 },
        { count: 40 }
      ]
      var dataset2 = [
        { count: 5 },
        { count: 15 },
        { count: 25 },
        { count: 35 },
        { count: 45 }
      ]

      var width = 400
      var height = 400
      var donutWidth = 75
      var radius1 = Math.min(width, height) / 2
      var radius2 = radius1 - donutWidth

      //   var color1 = d3.scale.category20()

      // var color1 = d3.scaleOrdinal().range(['#ff0000', '#00ff00', '#ffff00'])//~

      // var color1 = d3.scaleOrdinal(d3.schemeCategory10)

      // var color2 = d3.scaleOrdinal().range(['#ff0000', '#00ff00', '#ffff00'])//~

      //   var color2 = d3.scale.category20c()

      var svg = d3
        .select('#donut')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      var svg1 = svg
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      var svg2 = svg
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

      var arc1 = d3
        .arc()
        .innerRadius(radius1 - donutWidth)
        .outerRadius(radius1)

      var arc2 = d3
        .arc()
        .innerRadius(radius2 - donutWidth)
        .outerRadius(radius2)

      var pie = d3
        .pie()
        .value(function(d) {
          return d.count
        })
        .sort(null)

      //   var path1 = svg1
      // outer
      svg1
        .selectAll('path')
        .data(pie(dataset1))
        .enter()
        .append('path')
        .attr('d', arc1)
        // .attr('fill', function(d, i) {
        //   return color1(i)
        // })
        .attr('fill', '#ffff00')
      //   var path2 = svg2
      svg2
        .selectAll('path')
        .data(pie(dataset2))
        .enter()
        .append('path')
        .attr('d', arc2)
        // .attr('fill', function(d, i) {
        //   return color2(i)
        // })
        .attr('fill', '#ff0000')
      console.log('d', arc2)
    }
  },
  created() {
    this.renderNestedDonut()
  },
  mounted() {}
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
