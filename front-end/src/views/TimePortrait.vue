<template>
  <div id="portraitsCon">
    <pageHeading
      h1="Time Portraits"
      h2="A query generator to view snapshots of your time from different perspectives"
    />

    <div class="portraitCon">
      <div class="itemTypeCon">
        <p>Detail type</p>
        <select
          name="portrait_varSystem"
          id="portrait_varSystem"
          @change="updateType()"
          v-model="portraitType"
        >
          <option value="variable">Variable </option>
          <option value="system"> System </option>
        </select>
      </div>
      <div class="itemTypeCon">
        <p>Portrait type</p>
        <select name="vis_type" id="vis_type" v-model="vis_type">
          <option
            v-for="currVisType in visTypes"
            :key="currVisType"
            :value="currVisType"
            >{{ capitalize(currVisType) }}</option
          >
        </select>
      </div>
      <div class="itemTypeCon">
        <p>{{ capitalize(portraitType) }}</p>
        <select
          name="portrait_varSystemOptions"
          id="portrait_varSystemOptions"
          v-model="currItemId"
        >
          <option
            v-for="item in portraitType === 'variable' ? variables : systems"
            :key="item._id"
            :value="item._id"
            @change="updateItem(item.name)"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="timeConCon">
        <p class="displayButton">
          <i class="fa fa-calendar" aria-hidden="true"></i> From
        </p>
        <div class="timeCon">
          <input
            type="date"
            name="startDate"
            id="startDate"
            ref="startDate"
            value="2020-01-10"
          />
        </div>
      </div>
      <div class="timeConCon">
        <p class="displayButton">
          <i class="fa fa-calendar" aria-hidden="true"></i> To </p
        ><div class="timeCon">
          <input
            type="date"
            name="endDate"
            ref="endDate"
            id="endDate"
            value="2020-02-28"
          />
        </div>
      </div>
    </div>
    <div class="center">
      <button @click="generatePortrait()" class="generateButton"
        >generate</button
      >
    </div>
    <!-- debug check data -->
    <!-- <div>
      <p v-for="l in logs" :key="l">{{ l._id }}</p>
    </div> -->
    <div v-if="displaySelectedVis[0]">
      <p class="center">Days at a glance</p>
      <div class="timelineCon" v-for="log in logs" :key="log">
        <Timeline :logs="log" />
      </div>
    </div>
    <!-- <div class="center" v-if="displaySelectedVis[1]">
      <button @click="updateDonutDisplay()">{{
        isDonutEntireDay ? 'Show logged data only' : 'Show full days'
      }}</button>
    </div> -->
    <div
      class="portraitVisCon"
      v-if="displaySelectedVis[1]"
      :key="donutRerender"
    >
      <p>Where does the day go?</p>
      <Donut />
      <div v-if="renderDonutChart">
        <Donut :visColors="patternColors" :logs="overviewData" />
      </div>
    </div>
    <div class="center donutDetails" v-if="displaySelectedVis[1]">
      <div class="visLegend">
        <div
          v-for="(title, n) in sortSet(varValTitles)"
          :key="title"
          class=" center"
        >
          <div
            class="visLegendcircle"
            :style="'background-color:' + patternColors[n]"
          ></div>
          {{ title }}
        </div>
      </div>
      <div>
        <p v-if="isDonutEntireDay">Each circle represents a 24 hour day</p>
        <p v-else
          >Each circle represents only logged data (not necessarily full 24 hour
          days)</p
        >
      </div>
    </div>

    <div class="portraitVisCon" v-if="displaySelectedVis[2]">
      <p
        >What are the trend patterns? When is something most likely to occur?</p
      >
      <RadarChart
        :data="patternData"
        :visColors="patternColors"
        v-if="renderRadarChart"
      />
      <div class="visLegend">
        <div
          v-for="(title, n) in sortSet(varValTitles)"
          :key="title"
          class=" center"
        >
          <div
            class="visLegendcircle"
            :style="'background-color:' + patternColors[n]"
          ></div>
          {{ title }}
        </div>
      </div>
    </div>

    <div class="portraitVisCon" v-if="displaySelectedVis[3]">
      <p>How is my time actually broken down?</p>
      <Sankey :logs="sankeyVals" :sankeyColors="sankeyColors" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Timeline from './vis/Timeline.vue'
import RadarChart from './vis/RadarChart.vue'
import Sankey from './vis/Sankey.vue'
import PageHeading from './components/PageHeading.vue'
import Donut from './vis/Donut.vue'

export default {
  components: { Timeline, RadarChart, Sankey, Donut, pageHeading: PageHeading },
  name: 'TimePortrait',
  data() {
    return {
      portraitType: 'variable',
      variables: [],
      systems: [],
      items: [],
      vis_type: '',
      displayVis: false,
      visTypes: ['raw data', 'overview', 'patterns', 'relationships'],
      displaySelectedVis: [false, false, false, false],
      renderUpdate: 0,
      donutRerender: 0,
      currItemId: '',
      logs: [], // for raw data
      patternColors: [],
      renderRadarChart: false,
      renderDonutChart: false,
      overviewData: [],
      sankeyVals: [['Category', 'included variable value', 'Hours']],
      temp: [],
      sankeyColors: [],
      isDonutEntireDay: true,
      // varValSet: {},
      varValTitles: new Set(),
      itemName: ''
    }
  },
  methods: {
    capitalize(str) {
      return str[0].toUpperCase() + str.slice(1)
    },
    sortSet(set) {
      return Array.from(new Set(set)).sort()
    },
    updateRender(cntxt) {
      cntxt.renderUpdate++
      cntxt.$forceUpdate()
    },
    updateDonutDisplay() {
      this.isDonutEntireDay = !this.isDonutEntireDay
      this.generatePortrait()
      this.updateRender(this)
    },
    generatePortrait() {
      this.renderUpdate++ // force update
      this.visTypes.forEach((v, i) => {
        if (v == this.vis_type) {
          this.displaySelectedVis[i] = true
          this.loadData(i)
        } else {
          this.displaySelectedVis[i] = false
        }
      })
      this.updateRender(this)
    },

    // gets unique var values, and their colors (updates varValSet, and patternColors)
    getVarValData(logs, varValSet) {
      this.varValTitles = new Set()
      logs.forEach((d) => {
        // get unique var vals
        d.variables.forEach((v) => {
          // if selected var, iterate through all vals to add to chart
          if (v.variable == this.currItemId) {
            //~~~~~
            v.log_data.forEach((l) => {
              let currVal = l.full_category[0]
              this.varValTitles.add(`${currVal.code}: ${currVal.description}`)
              if (!varValSet.has(currVal._id)) {
                varValSet.add(currVal._id)
                this.patternColors.push(this.getColor(currVal.color))
              }
            })
          }
        })
      })
    },
    parseOverviewData(logs) {
      this.patternColors = []
      let patternVarVals = []
      let varValSet = new Set()

      // get colors + data
      this.getVarValData(logs, varValSet)

      // add default color for rest of the day, if vis wrt entire day
      if (this.isDonutEntireDay) this.patternColors.push('#F0F0F0')

      // computed aggregate time per var val, per day
      // iterate every day in logs
      logs.forEach((d) => {
        // consider only relevant var
        d.variables.forEach((v) => {
          if (v.variable == this.currItemId) {
            // iterate each possible var val
            let tempVarTotals = []
            varValSet.forEach((val) => {
              // iterate each log entry (in a given day)
              let totalTime = 0
              v.log_data.forEach((l) => {
                // increment time for every log entry with current var val
                if (l.full_category[0]._id == val) {
                  let startTime = new Date(l.start_time)
                  let endTime = new Date(l.end_time)
                  // i iterates ea. logged hour
                  for (
                    let i = startTime.getHours();
                    i <= endTime.getHours();
                    i++
                  ) {
                    // increment time within current hour, for curr var val
                    if (i == startTime.getHours()) {
                      totalTime += 60 - startTime.getMinutes()
                    } else if (i == endTime.getHours()) {
                      totalTime += endTime.getMinutes()
                    } else {
                      totalTime += 60
                    }
                  }
                }
              })
              tempVarTotals.push(totalTime)
            })
            patternVarVals.push(tempVarTotals)
          }
        })
      })

      // get percentages per day
      // iterate per day
      patternVarVals.forEach((v) => {
        let sumLoggedVals = v.reduce((a, b) => a + b, 0)
        const TOTAL_MINS_PER_DAY = 60 * 24
        // iterate per var val
        let tempAggregates = []
        v.forEach((varValTotal) => {
          tempAggregates.push(
            (varValTotal /
              (this.isDonutEntireDay ? TOTAL_MINS_PER_DAY : sumLoggedVals)) *
              100
          )
        })

        // unlogged time, if vis wrt entire day
        if (this.isDonutEntireDay)
          tempAggregates.push(
            ((TOTAL_MINS_PER_DAY - sumLoggedVals) / TOTAL_MINS_PER_DAY) * 100
          )
        this.overviewData.push(tempAggregates)
      })

      // re-render
      this.$forceUpdate()
      this.renderUpdate++
      this.renderDonutChart = true
    },
    parsePatternData(logs) {
      this.patternColors = []
      let patternVarVals = []
      let varValSet = new Set()

      // get colors + data
      this.getVarValData(logs, varValSet)

      // compute time
      let n = 0
      varValSet.forEach((val) => {
        // populate every hour with an initial value of 0 for curr. var val
        patternVarVals[n] = []
        for (let i = 0; i < 24; i++) {
          patternVarVals[n].push({
            axis: `${('00' + i).slice(-2)}:00`,
            value: 0
          })
        }
        logs.forEach((d) => {
          d.variables.forEach((v) => {
            if (v.variable == this.currItemId) {
              v.log_data.forEach((l) => {
                // increment time for every log entry with current var val
                if (l.full_category[0]._id == val) {
                  let startTime = new Date(l.start_time)
                  let endTime = new Date(l.end_time)
                  for (
                    let i = startTime.getHours();
                    i <= endTime.getHours();
                    i++
                  ) {
                    // increment time within current hour, for curr var val
                    if (i == startTime.getHours()) {
                      patternVarVals[n][i].value += 60 - startTime.getMinutes()
                    } else if (i == endTime.getHours()) {
                      patternVarVals[n][i].value += endTime.getMinutes()
                    } else {
                      patternVarVals[n][i].value += 60
                    }
                  }
                }
              })
            }
          })
        })
        n++
      })

      // normalize minutes (divide by max value)
      // get max
      let maxVals = []
      patternVarVals.forEach((v) => {
        maxVals.push(
          Math.max.apply(
            Math,
            v.map((val) => val.value)
          )
        )
      })
      let maxVal = Math.max(...maxVals)

      // divide by max val
      let tempVals = []
      patternVarVals.forEach((v) => {
        let updatedVals = []
        v.forEach((val) => {
          updatedVals.push({ axis: val.axis, value: val.value / maxVal })
        })
        tempVals.push(updatedVals)
      })

      patternVarVals = tempVals
      this.patternData = patternVarVals

      // re-render
      this.$forceUpdate()
      this.renderUpdate++
      this.renderRadarChart = true
    },
    parseRelData(logs) {
      this.patternColors = []
      let varValSet = new Set()

      // get colors + data
      this.getVarValData(logs, varValSet)
      this.temp = logs //~
      // compute time
      varValSet.forEach((val) => {
        logs.forEach((d) => {
          d.variables.forEach((v) => {
            if (v.variable == this.currItemId) {
              v.log_data.forEach((l) => {
                // increment time for every log entry with current var val
                let parent = true
                let prevVal = val
                let baseColor = ''
                l.full_category.forEach((varCat, m) => {
                  // if curr val is first, then it's the top parent val
                  if (m > 0) parent = false
                  else baseColor = this.getColor(varCat.color)
                  let startTime = new Date(l.start_time)
                  let endTime = new Date(l.end_time)
                  // i iterates ea. logged hour
                  let sumMins = 0
                  for (
                    let i = startTime.getHours();
                    i <= endTime.getHours();
                    i++
                  ) {
                    // increment time within current hour, for curr var val
                    if (i == startTime.getHours()) {
                      sumMins += 60 - startTime.getMinutes()
                    } else if (i == endTime.getHours()) {
                      sumMins += endTime.getMinutes()
                    } else {
                      sumMins += 60
                    }
                  }
                  if (!parent) {
                    this.sankeyVals.push([
                      prevVal,
                      `${varCat.code}: ${varCat.description}`,
                      parseFloat((sumMins / 60).toFixed(1))
                    ])
                    // duplicate first entry
                    if (this.sankeyColors.length == 1)
                      this.sankeyColors.push(baseColor)
                    this.sankeyColors.push(baseColor)
                  }
                  // update src node for next node
                  prevVal = `${varCat.code}: ${varCat.description}`
                })
              })
            }
          })
        })
      })
      // re-render
      this.$forceUpdate()
      this.renderUpdate++
    },
    loadData(visType) {
      let self = this
      // variable vis data
      if (this.portraitType == 'variable') {
        switch (visType) {
          // raw data
          case 0:
            axios
              .get(
                `http://localhost:3000/day/start/${new Date(
                  this.$refs.startDate.value
                ).toISOString()}/end/${new Date(
                  this.$refs.endDate.value
                ).toISOString()}/variable/${this.currItemId}`
              )
              .then(function(response) {
                self.logs = response.data
              })

            break
          // overview
          case 1:
            axios
              .get(
                `http://localhost:3000/day/start/${new Date(
                  this.$refs.startDate.value
                ).toISOString()}/end/${new Date(
                  this.$refs.endDate.value
                ).toISOString()}/variable/${this.currItemId}`
              )
              .then(function(response) {
                self.logs = response.data
                self.parseOverviewData(self.logs)
              })
            // this.donutRerender++
            // this.$forceUpdate()
            // this.renderUpdate++
            break
          // patterns
          case 2:
            axios
              .get(
                `http://localhost:3000/day/start/${new Date(
                  this.$refs.startDate.value
                ).toISOString()}/end/${new Date(
                  this.$refs.endDate.value
                ).toISOString()}/variable/${this.currItemId}`
              )
              .then(function(response) {
                self.logs = response.data
                self.parsePatternData(self.logs)
              })
            break
          //relationships
          case 3:
            axios
              .get(
                `http://localhost:3000/day/start/${new Date(
                  this.$refs.startDate.value
                ).toISOString()}/end/${new Date(
                  this.$refs.endDate.value
                ).toISOString()}/variable/${this.currItemId}`
              )
              .then(function(response) {
                self.logs = response.data
                self.parseRelData(self.logs)
              })
            break
        }
        // this.logs = self.logs
        this.$forceUpdate()
        this.renderUpdate++
      }
    },
    updateItem(itemName) {
      this.itemName = itemName
      if (this.portraitType === 'variable') {
        this.items = this.variables
      } else {
        this.items = this.systems
      }
    },
    getColor(categoryColorId) {
      // if non-top level category, chose a default color
      if (categoryColorId == undefined) return '#707070'
      // else return color given color id
      else
        return this.$store.state.colors.filter((color) => {
          return color._id == categoryColorId
        })[0].color
    }
  },
  created() {
    var self = this
    axios
      .get(`http://localhost:3000/variables`)
      .then(function(response) {
        self.variables = response.data
      })
      .catch(function(error) {
        console.error(error)
      })
    axios
      .get(`http://localhost:3000/systems`)
      .then(function(response) {
        self.systems = response.data
      })
      .catch(function(error) {
        console.error(error)
      })
    axios //~
      .get('http://localhost:3000/colors')
      .then(function(response) {
        self.$store.commit('colors', response.data)
      })
      .catch(function(error) {
        console.error(error)
      })
    this.items = this.variables
  }
}
</script>

<style lang="scss" scoped>
.radarCon {
  display: flex;
  flex-direction: row;
}
</style>
