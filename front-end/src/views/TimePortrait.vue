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
      <select name="portrait_varSystemOptions" id="portrait_varSystemOptions">
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
        <input type="date" name="startDate" id="startDate" value="2021-04-10" />
      </div>
      <div class="timeCon">
        <button class="displayButton">
          <i class="fa fa-calendar" aria-hidden="true"></i> to
        </button>
        <input type="date" name="endDate" id="endDate" value="2021-04-10" />
      </div>
    </div>
    <div class="center">
      <button @click="generatePortrait()">generate</button>
    </div>

    <div class="timelineCon" v-if="displaySelectedVis[0]">
      <Timeline :key="renderUpdate" />
      <!-- <Timeline :key="renderUpdate" /> -->
      <!-- <Timeline :key="renderUpdate" /> -->
    </div>

    <div class="portraitVisCon" v-if="displaySelectedVis[2]">
      <RadarChart />
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
      renderUpdate: 0
    }
  },
  methods: {
    generatePortrait() {
      this.renderUpdate++ // force update
      this.visTypes.forEach((v, i) => {
        if (v == this.vis_type) {
          this.displaySelectedVis[i] = true
        } else {
          this.displaySelectedVis[i] = false
        }
      })
      // update render
      this.$forceUpdate()
    },
    updateType() {},
    updateItem() {
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
    this.items = this.variables
  }
}
</script>

<style lang="scss" scoped></style>
