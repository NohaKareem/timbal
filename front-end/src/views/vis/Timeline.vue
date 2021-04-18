<template>
  <div class="timelineCon">
    <div class="timeline"></div>
  </div>
</template>

<script>
// import axios from 'axios'
import * as d3 from 'd3'
import moment from 'moment'
import * as _ from 'lodash'

export default {
  name: 'Timeline',
  computed: {
    colors() {
      return this.$store.state.colors
    }
  },
  props: ['logs', 'isSystem'],
  methods: {
    // render timeseries
    timeseries(spaced, data) {
      /* TIMESERIES - A simple D3.js timeseries.
       *   [timeseries code + some styling + doc edited, original source: https://github.com/mlvl/timeseries]
       *   call timeseries(<classd>, <data>, <enableBrush>) with the following parameters
       *   classd - the class name of your container div for the timeseries to attach to
       */
      let classd = spaced.replace(new RegExp(' '), '.')
      render(classd, spaced, data, this.colors)

      function lessThanDay(d) {
        return d === 'hours' || d === 'minutes' || d === 'seconds'
          ? true
          : false
      }

      function getDate(d) {
        var date = moment(d)
        date.hour(1)
        date.minute(0)
        date.second(0)
        return date.valueOf()
      }

      /*
        Given a list of time stamps, compute the minimum and maxium dates. Return a padded
        version of the min and max dates based on the temporal distance between them.
        */
      function timeRangePad(dates) {
        var minDate, maxDate, pad
        if (dates.length > 1) {
          minDate = moment(_.min(dates))
          maxDate = moment(_.max(dates))
          pad = getDatePadding(minDate, maxDate)
          minDate.subtract(1, pad)
          maxDate.add(1, pad)
        } else {
          minDate = moment(dates[0]).subtract(1, 'hour')
          maxDate = moment(dates[0]).add(1, 'hour')
        }
        return {
          minDate: minDate,
          maxDate: maxDate,
          pad: pad
        }
      }
      function getDatePadding(minDate, maxDate) {
        if (maxDate.diff(minDate, 'years') > 0) return 'months'
        else if (maxDate.diff(minDate, 'months') > 0) return 'days'
        else if (maxDate.diff(minDate, 'days') > 0) return 'days'
        else if (maxDate.diff(minDate, 'hours') > 0) return 'hours'
        else if (maxDate.diff(minDate, 'minutes') > 0) return 'minutes'
        else return 'seconds'
      }

      // rendering method
      function render(classd, spaced, data, colors) {
        // using map instead of pluck https://stackoverflow.com/a/35136589
        var padding = timeRangePad(_.map(data, 'value'))

        var margin = {
          top: 10,
          right: 25,
          bottom: 15,
          left: 35
        }
        var width = window.innerWidth - 150
        var height = 100 - margin.top - margin.bottom // (this.lessThanDay(padding.pad)) ? (100 - margin.top - margin.bottom) : (100 - margin.top - margin.bottom);

        var x = d3.scaleTime().range([0 + margin.right, width - margin.left]),
          y = d3
            .scaleTime()
            .range([margin.top, height - margin.bottom - margin.top])

        var ticks = width > 800 ? 8 : 4

        x.domain(d3.extent([padding.minDate, padding.maxDate]))

        var xFormat, yFormat

        // date as y axis constantly ~todo
        yFormat = '%m/%d/%y'
        xFormat = '%H:%M'
        y.domain(d3.extent([padding.minDate]))

        var xAxis = d3
          .axisTop(x)
          // .orient("top")
          .ticks(ticks)
          .tickSize(-height, 0)
          .tickFormat(d3.timeFormat(xFormat))

        var yAxis = d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width + margin.right, margin.left)
          .tickFormat(d3.timeFormat(yFormat))

        var svg = d3
          .select('.' + classd)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)

        var context = svg
          .append('g')
          .attr('class', 'context')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
          )

        context
          .append('g')
          .attr('class', 'x axis')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top / 2 + ')'
          )
          .call(xAxis)

        context
          .append('g')
          .attr('class', 'y axis')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top * 3 + ')'
          )
          .call(yAxis)

        var circles = context
          .append('g')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
          )

        circles
          .selectAll('.circ')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'circ')
          .attr('x', function(d) {
            return lessThanDay(padding.pad) ? x(d.value) : x(getDate(d.value))
          })
          .attr('y', function(d) {
            return y(getDate(d.value))
            // return (this.lessThanDay(padding.pad)) ? y(this.getDate(d.value)) : y(getTime(d.value)); //~~ replace .value with date from start time
          })
          .attr('width', function(d) {
            return d.duration
          })
          .attr('height', 40)
          .attr('rx', 15)
          .attr('ry', 15)
          .attr('fill', function(d) {
            let categoryColorId = d.color

            // filter array by attribute value https://stackoverflow.com/a/2722213
            // get color from vuex store, returned color object (with color property) is an array of 1 object
            return colors.filter((color) => {
              return color._id == categoryColorId
            })[0].color
          })

        // .on("click", function() {})

        // add text https://stackoverflow.com/a/20644664/1446598
        // adding text labels https://stackoverflow.com/a/46138457/1446598
        var label = svg.selectAll('text').data(data)

        // add text https://stackoverflow.com/a/20644664/1446598
        label
          .enter()
          .append('text')
          .attr('x', function(d) {
            return d.value
          })
          .attr('y', function(d) {
            return d.value + 2
          })
          .text(function(d) {
            return d.logCode
          })
          .attr('text-anchor', 'middle')
          .attr('fill', '#707070')
      }
    }
  },
  mounted() {
    let visLogs = []

    if (!this.isSystem) {
      if (this.logs && this.logs.variables[0]) {
        this.logs.variables[0].log_data.forEach((logEntry) => {
          let durationInMinutes = Math.abs(
            new Date(logEntry.start_time).getHours() * 60 +
              new Date(logEntry.start_time).getMinutes() -
              new Date(logEntry.end_time).getHours() * 60 +
              new Date(logEntry.end_time).getMinutes()
          )
          let fullCategoryStr = ''
          let color = ''

          // delinate nested categories by '.' and save top-level category's color id
          logEntry.full_category.forEach((category, i) => {
            if (i == 0) color = category.color
            fullCategoryStr +=
              category.code +
              (i === logEntry.full_category.length - 1 ? '' : '.')
          })

          visLogs.push({
            value: new Date(logEntry.start_time).valueOf(),
            duration: durationInMinutes,
            logCode: fullCategoryStr,
            color: color
          })
        })
      }
    } else {
      visLogs = this.logs
      console.log('system case ', visLogs)
    }

    // force update render
    this.$forceUpdate()
    this.renderUpdate++
    this.timeseries('timeline', visLogs)
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';

.y.axis line {
  stroke: rgba(255, 255, 255, 0) !important;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis text {
  font-size: 12px;
}

.tick line {
  stroke: #d5d5d5;
  opacity: 0.7;
}

.domain {
  display: none;
}
</style>
