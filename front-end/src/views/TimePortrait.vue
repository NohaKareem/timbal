<template>
  <div id="portraitsCon">
    <h1>Time Portraits</h1>
    <div class="portraitCon">
      <select
        name="portrait_varSystem"
        id="portrait_varSystem"
        @change="updateType()"
        v-model="portraitType"
      >
        <option value="variable">Variable </option>
        <option value="system"> System </option>
      </select>
      <select name="vis_type" id="vis_type" v-model="vis_type">
        <option
          v-for="currVisType in visTypes"
          :key="currVisType"
          :value="currVisType"
          >{{ currVisType }}</option
        >
      </select>
      <select
        name="portrait_varSystemOptions"
        id="portrait_varSystemOptions"
        v-model="currItemId"
      >
        <option
          v-for="item in portraitType === 'variable' ? variables : systems"
          :key="item._id"
          :value="item._id"
          @change="updateItem()"
        >
          {{ item.name }}
        </option>
      </select>
      <div class="timeCon">
        <button class="displayButton">
          <i class="fa fa-calendar" aria-hidden="true"></i> from
        </button>
        <input
          type="date"
          name="startDate"
          id="startDate"
          ref="startDate"
          value="2020-01-10"
        />
      </div>
      <div class="timeCon">
        <button class="displayButton">
          <i class="fa fa-calendar" aria-hidden="true"></i> to
        </button>
        <input
          type="date"
          name="endDate"
          ref="endDate"
          id="endDate"
          value="2020-02-28"
        />
      </div>
    </div>
    <div class="center">
      <button @click="generatePortrait()">generate</button>
    </div>

    <div class="timelineCon" v-if="displaySelectedVis[0]">
      <Timeline v-for="log in logs" :key="log" :logs="log" />
    </div>

    <!-- <div class="radarCon">
      <div class="radar"><RadarChart :data="patternData"/></div>
    </div> -->

    <div class="portraitVisCon" v-if="displaySelectedVis[2]">
      <RadarChart :data="patternData" :visColors="patternColors" />
    </div>

    <div class="portraitVisCon" v-if="displaySelectedVis[3]">
      <Sankey />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Timeline from './vis/Timeline.vue'
import RadarChart from './vis/RadarChart.vue'
import Sankey from './vis/Sankey.vue'
export default {
  components: { Timeline, RadarChart, Sankey },
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
      currItemId: '',
      logs: [], // for raw data
      patternColors: ['#ff0000', '#CC33fF', '#00A0B0'],
      patternData: [
        [
          //iPhone
          {
            axis: '12',
            value: 0.22
          },
          {
            axis: '1',
            value: 0.28
          },
          {
            axis: '2',
            value: 0.29
          },
          {
            axis: '3',
            value: 0.17
          },
          {
            axis: '4',
            value: 0.22
          },
          {
            axis: '5',
            value: 0.02
          },
          {
            axis: '6',
            value: 0.09
          },
          {
            axis: '7',
            value: 0.21
          },
          {
            axis: '8',
            value: 0.5
          },
          {
            axis: '9',
            value: 0.09
          },
          {
            axis: '10',
            value: 0.21
          },
          {
            axis: '11',
            value: 0.5
          },
          {
            axis: '12',
            value: 0.5
          },
          {
            axis: '1',
            value: 0.09
          },
          {
            axis: '2',
            value: 0.29
          },
          {
            axis: '3',
            value: 0.17
          },
          {
            axis: '4',
            value: 0.22
          },
          {
            axis: '5',
            value: 0.02
          },
          {
            axis: '6',
            value: 0.09
          },
          {
            axis: '7',
            value: 0.21
          },
          {
            axis: '8',
            value: 0.5
          },
          {
            axis: '9',
            value: 0.09
          },
          {
            axis: '10',
            value: 0.21
          },
          {
            axis: '11',
            value: 0.5
          }
        ],
        [
          //Samsung
          {
            axis: '1',
            value: 0.16
          },
          {
            axis: '2',
            value: 0.35
          },
          {
            axis: '3',
            value: 0.13
          },
          {
            axis: '4',
            value: 0.2
          },
          {
            axis: '5',
            value: 0.13
          },
          {
            axis: '6',
            value: 0.09
          },
          {
            axis: 'Price Of Device',
            value: 0.35
          },
          {
            axis: '8',
            value: 0.38
          },
          {
            axis: '9',
            value: 0.09
          },
          {
            axis: '10',
            value: 0.21
          },
          {
            axis: '11',
            value: 0.5
          },
          {
            axis: '1',
            value: 0.09
          },
          {
            axis: '2',
            value: 0.29
          },
          {
            axis: '3',
            value: 0.17
          },
          {
            axis: '4',
            value: 0.22
          },
          {
            axis: '5',
            value: 0.02
          },
          {
            axis: '6',
            value: 0.09
          },
          {
            axis: '7',
            value: 0.21
          },
          {
            axis: '8',
            value: 0.5
          },
          {
            axis: '9',
            value: 0.09
          },
          {
            axis: '10',
            value: 0.21
          },
          {
            axis: '11',
            value: 0.5
          }
        ],
        [
          //Nokia Smartphone
          {
            axis: '1',
            value: 0.1
          },
          {
            axis: '2',
            value: 0.3
          },
          {
            axis: '3',
            value: 0.14
          },
          {
            axis: '4',
            value: 0.22
          },
          {
            axis: '5',
            value: 0.04
          },
          {
            axis: '6',
            value: 0.09
          },
          {
            axis: '7',
            value: 0.41
          },
          {
            axis: '8',
            value: 0.3
          },
          {
            axis: '9',
            value: 0.09
          },
          {
            axis: '10',
            value: 0.21
          },
          {
            axis: '11',
            value: 0.5
          }
        ]
      ]
    }
  },
  methods: {
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
      // update render
      this.renderUpdate++
      this.$forceUpdate() //~method
    },
    // loadRadarData() {
    //   let tempLogs
    //   console.log(this.$refs.startDate)

    //   axios
    //     .get(
    //       `http://localhost:3000/day/start/${new Date(
    //         this.$refs.startDate.value
    //       ).toISOString()}/end/${new Date(
    //         this.$refs.endDate.value
    //       ).toISOString()}/variable/5e3316671c71657e18823380` //${this.currItemId}//~
    //     )
    //     .then(function(response) {
    //       tempLogs = response.data

    //       if (tempLogs) {
    //         console.log(tempLogs)
    //       } else {
    //         console.log('no')
    //       }
    //     })
    // },
    parsePatternData(logs) {
      // let selectedVarLogs = logs.filter((l) => {
      //   return l.variables.variable == this.currItemId
      // })
      // let patternVarVals = []
      let varValSet = new Set()
      logs.forEach((d) => {
        d.variables.forEach((v) => {
          // if selected var, iterate through all vals to add to chart
          if (v.variable == this.currItemId) {
            v.log_data.forEach((l) => {
              let currVal = l.full_category[0]
              let varTitle = `${currVal.code}: ${currVal.description}`
              //// add if entry doesn't exist
              // let itemExists = false
              // itemExists = patternVarVals.find((d) => {
              //   return d == varTitle
              // })
              // if (!itemExists) patternVarVals.push(varTitle)
              varValSet.add(varTitle)
              console.log(varValSet)
            })
          }
        })
      })
      // console.log(selectedVarLogs)
      // let varVals = [
      //   ...new Set(selectedVarLogs.map((d) => d.log_data.full_category[0]))
      // ]
      // console.log(varVals)
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
          // patterns
          case 2:
            // let patternData = {}
            // self.patternData = []
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
                // console.log(self.logs)
                // self.logs.forEach((day) => {
                //   day.variables.forEach((variable) => {
                //     variable.log_data.forEach((log) => {
                //       console.log(log.full_category[0].color)
                //       console.log(
                //         `${log.full_category[0].code}:${log.full_category[0].description}`
                //       )
                //       let ms = new Date(log.end_time) - new Date(log.start_time)
                //       ms = ms / 1000 / 60 / 60 // ms to hrs`
                //       console.log(ms)
                //       // accumulate by var val
                //       // bin by start date
                //       // if hour(end date) != hour(start date), iterate from start to end date, increment counter
                //       self.patternData.push({
                //         axis: new Date(log.start_time).getHours(),
                //         value: 1 //~
                //       })
                //       console.table(self.patternData)
                //     })
                //   })
                // })
              })
            break
        }
        this.logs = self.logs
        this.$forceUpdate()
        this.renderUpdate++
      }
      // // system vis data
      // else {
      // }
    },
    updateType() {},
    updateItem() {
      // this.currItemId = itemId
      if (this.portraitType === 'variable') {
        this.items = this.variables
      } else {
        this.items = this.systems
      }
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

    // this.loadRadarData() //~
  }
}
</script>

<style lang="scss" scoped>
.radarCon {
  display: flex;
  flex-direction: row;
}
</style>
