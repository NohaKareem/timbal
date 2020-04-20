<template>
    <div class="timelineCon">
        <div class="timeline"></div>
    </div>
</template>

<script>
  import axios from "axios";
import * as d3 from 'd3';
import moment from "vue-moment";
import Vue from 'vue';

// including js liibraries https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/
Object.defineProperty(Vue.prototype, '$moment', { value: moment });
// this.use(moment);
// this.use(d3);
//   import moment from "moment";
import * as _ from 'lodash';
// this.prototype._ = _;
Object.defineProperty(Vue.prototype, '$_', { value: _ });

export default {
    name: "Timeline", 
    data() {
        return {
            self: this
        }
    },
    methods: {
        lessThanDay(d) {
            return (d === "hours" || d === "minutes" || d === "seconds") ? true : false;
        },
        getDate(d, self) {
            var date = self.$moment(d);
            date.hour(1);
            date.minute(0);
            date.second(0);
            return date.valueOf();
        },

        /* 
        Given a list of time stamps, compute the minimum and maxium dates. Return a padded
        version of the min and max dates based on the temporal distance between them.
        */
        timeRangePad(dates, self) {
            var minDate, maxDate, pad;
            if (dates.length > 1) {
                minDate = self.$moment(self.$_.min(dates));
                maxDate = self.$moment(self.$_.max(dates));
                pad = self.getDatePadding(minDate, maxDate);
                minDate.subtract(1, pad);
                maxDate.add(1, pad);
            } else {
                minDate = self.$moment(dates[0]).subtract(1, 'hour');
                maxDate = self.$moment(dates[0]).add(1, 'hour');
            }
            return {
                'minDate': minDate,
                'maxDate': maxDate,
                'pad': pad
            };
        },
        getDatePadding(minDate, maxDate) {
            if (maxDate.diff(minDate, 'years') > 0)
                return 'months';
            else if (maxDate.diff(minDate, 'months') > 0)
                return 'days';
            else if (maxDate.diff(minDate, 'days') > 0)
                return 'days';
            else if (maxDate.diff(minDate, 'hours') > 0)
                return 'hours';
            else if (maxDate.diff(minDate, 'minutes') > 0)
                return 'minutes';
            else
                return 'seconds';
        },

        // rendering method
        render(classd, spaced, data, self) {
            // using map instead of pluck https://stackoverflow.com/a/35136589
            var padding = self.timeRangePad(self.$_.map(data, 'value'), self);
            // var padding = self.timeRangePad(self.$_.pluck(data, 'value'), self);
            
            var margin = {
                top: 10,
                right: 25,
                bottom: 15,
                left: 35
            }
            var width = window.innerWidth - 150;
            var height = (self.lessThanDay(padding.pad)) ? (100 - margin.top - margin.bottom) : (100 - margin.top - margin.bottom);

            var x = d3.time.scale().
                    range([0 + margin.right, width - margin.left]),

                y = d3.time.scale()
                    .range([margin.top, height - margin.bottom - margin.top]);

            var ticks = width > 800 ? 8 : 4;

            x.domain(d3.extent([padding.minDate, padding.maxDate])); 

            var xFormat, yFormat;

            // date as y axis constantly ~todo
            yFormat = "%m/%d/%y";
            xFormat = "%H:%M";
            y.domain(d3.extent([padding.minDate]));

            var xAxis = d3.svg.axis().scale(x).orient("top")
                .ticks(ticks)
                .tickSize(-height, 0)
                .tickFormat(d3.time.format(xFormat)); //~was commented

            var yAxis = d3.svg.axis().scale(y).orient("left")//~important
                .ticks(5)
                .tickSize(-width + margin.right, margin.left)
                .tickFormat(d3.time.format(yFormat));//~important

            var svg = d3.select("." + classd).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + (margin.top / 2) + ")")
                .call(xAxis);

            context.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + "," + margin.top * 3 + ")")
                .call(yAxis);

            var circles = context.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
            circles.selectAll(".circ")
                .data(data)
                .enter().append("rect")
                .attr("class", "circ")
                .attr("x", function(d) {
                    // .attr("cx", function(d) {
                    console.log('x val', (self.lessThanDay(padding.pad)) ? x(d.value) : x(self.getDate(d.value, self))); //~~ replace .value with start and end time
                    return (self.lessThanDay(padding.pad)) ? x(d.value) : x(self.getDate(d.value, self)); //~~ replace .value with start and end time
                })
                .attr("y", function(d) {
                    // .attr("cy", function(d, i) {
                    return  y(self.getDate(d.value, self));
                    // return (self.lessThanDay(padding.pad)) ? y(d.value) : y(self.getDate(d.value, self)); //~~ replace .value with start and end time
                    // return (self.lessThanDay(padding.pad)) ? y(self.getDate(d.value, self)) : y(getTime(d.value)); //~~ replace .value with date from start time 
                })
                // .attr("r", 9)
                .attr("width", function(d) { return d.duration})// 70)//~rect imp ~data //~30
                .attr("height", 40)//~rect imp ~fixed
                .attr("rx", 15)//~imp // set to val of width/2 if width === height
                .attr("ry", 15)//~imp 
                // .attr("ry", 9)
                
                .on("click", function(d) {
                    //~~ display tool tip
                    console.log(new Date(d.value));
                })

                // add text https://stackoverflow.com/a/20644664/1446598
                .append("text")
                // .attr("x", function(d) {
                //     // .attr("cx", function(d) {
                //     return (self.lessThanDay(padding.pad)) ? x(d.value) : x(self.getDate(d.value, self))
                // })
                // .attr("y", 20)
                // .attr("dy", ".5em")
                .text(function(d) { return d.logCode })
                .attr("color", "red")
        },

        // render timeseries   
        timeseries(spaced, data, self) {
            console.log('in time series method')
                /* TIMESERIES - A simple D3.js timeseries.
                *   [timeseries code + doc edited, original source: https://github.com/mlvl/timeseries]
                *   call timeseries(<classd>, <data>, <enableBrush>) with the following parameters
                *   classd - the class name of your container div for the timeseries to attach to
                */
                // var timeseries = function(spaced, data, self) {
                    console.log('data received')
                    console.log(data)
                    let classd = spaced.replace(new RegExp(" "), "."); //~added let
                    self.render(classd, spaced, data, self);
                // }
            console.log('after time series var')
            
                // /* Use this function, in conjunction to setting a time element to 'selected', to highlight the 
                // data point on the timeseries. */
                // function redraw() {
                //     d3.selectAll(".circ")
                //         .transition(10)
                //         .style("opacity", function(d) {
                //             return d.selected ? 1 : 0.6;
                //         })
                //         .attr("r", function(d) {
                //             return d.selected ? 15 : 7;
                //         });
                // }

                // if (typeof define === "function" && define.amd) define(timeseries);
                // else if (typeof module === "object" && module.exports) module.exports = timeseries;
                
                // this.timeseries = timeseries;//~
            }
    },
    mounted() {
        //reading in CSV which contains data
        let logs = [];
        let self = this;

        // d3.json("http://localhost:3000/day/5e611877b705711710a1b28d/var/5e3316671c71657e18823380/details", 
        // function(error, data) {
        axios.get("http://localhost:3000/day/5e611877b705711710a1b28d/var/5e3316671c71657e18823380/details")
          .then(function(response) {
            let data = response.data;
            console.log(data)
            data.variables[0].log_data.forEach((logEntry) => {
                let durationInMinutes = Math.abs(new Date(logEntry.start_time).getHours() * 60 + new Date(logEntry.start_time).getMinutes()
                    - new Date(logEntry.end_time).getHours() * 60 + new Date(logEntry.end_time).getMinutes());
                let fullCategoryStr = "";

                // delinate nested categories by .
                logEntry.full_category.forEach((category, i) => {
                    fullCategoryStr += category.code + ((i === logEntry.full_category.length - 1) ? "" : ".");
            });
            
            // parse date https://stackoverflow.com/a/53269761/1446598
            // let formattedDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(logEntry.start_time);// logEntry.start_time.toTimeString();
            logs.push({
                'value': new Date(logEntry.start_time).valueOf(), //~startTime
                // 'value': new Date(formattedDate).valueOf(), //~startTime
                'duration': durationInMinutes, //unix timestapm sconds
                'logCode': fullCategoryStr 
            });

        });
            console.log('logs', logs)
            self.timeseries('timeline', logs, self);
        });
        // return [
        //     {
        //         value: 158072030000 , 
        //         duration: 60, logCode:"e"
        //     }, {
        //         value: 1580408743520 , 
        //         duration: 60, logCode:"e"
        //     }
        // ];
    }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
