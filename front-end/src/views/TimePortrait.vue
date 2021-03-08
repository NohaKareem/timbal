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
      <button>generate</button>
    </div>
    <div class="portraitVisCon">
      <RadarChart />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import RadarChart from './vis/RadarChart.vue'
export default {
  components: { RadarChart },
  name: 'TimePortrait',
  data() {
    return {
      portraitType: 'variable',
      variables: [],
      systems: [],
      items: []
    }
  },
  methods: {
    updateType() {},
    updateItem() {
      if (this.portraitType === 'variable') {
        console.log('portrait')
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
    console.log('this.items')
    this.items = this.variables
    console.log('this.items2', this.variables)
  }
}
</script>

<style lang="scss" scoped></style>
