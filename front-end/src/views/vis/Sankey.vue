<template>
  <div class="sankeyCon">
    <div class="sankey">
      <GChart
        :settings="{ packages: ['corechart', 'table', 'map'] }"
        type="ColumnChart"
        :data="logs"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import Vue from 'vue'
import VueGoogleCharts from 'vue-google-charts'
import { GChart } from 'vue-google-charts'
Vue.use(VueGoogleCharts)

export default {
  name: 'Timeline',
  components: { GChart },
  computed: {
    colors() {
      return this.$store.state.colors
    }
  },
  data() {
    return {
      logs: [
        ['Category', 'SubCategory', 'Hours', 'tooltip'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
      ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017'
        }
      }
    }
  },
  //   props: ['logs'],
  //   methods: {},
  mounted() {
    console.log('in sankey')
    this.$forceUpdate()
    // this.timeseries('timeline', this.logs)
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
