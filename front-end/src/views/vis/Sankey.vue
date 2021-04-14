<template>
  <div class="sankeyCon">
    <div class="sankey">
      <GChart
        :settings="{ packages: ['sankey'] }"
        type="Sankey"
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
  props: {
    isSystem: { type: Boolean, default: false },
    logs: { type: Array }
  },
  data() {
    return {
      // logs: [
      //   [
      //     // this.isSystem ? 'System Category' : 'Variable value',
      //     'Category',
      //     'included variable value',
      //     'Hours',
      //     'tooltips'
      //   ],
      //   // ['Category', 'SubCategory', 'Hours', 'tooltip'],
      //   ['2014', '1000', 400, 1000],
      //   ['2014', '1170', 400, 200],
      //   ['2015', '1170', 460, 250],
      //   ['2016', '1170', 1120, 300],
      //   ['2016', '1030', 1120, 300],
      //   ['2016', '660', 1120, 300],
      //   ['2014', '660', 1120, 300],
      //   ['2017', '1030', 540, 350],
      //   ['1030', '100', 540, 350],
      //   ['660', '215', 1120, 300],
      //   ['660', '230', 1120, 300]
      // ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
          // width: '600'
          barCornerRadius: 15,
          labelStyle: {
            fontName: 'Quattrocento Sans',
            fontSize: 70
          }
        }
        // palette: [
        //   {
        //     color: '#FFF',
        //     dark: '#F00',
        //     light: '#0FF'
        //   }
        // ],
      }
    }
  },
  //   props: ['logs'],
  //   methods: {},
  mounted() {
    this.$forceUpdate()
    // this.timeseries('timeline', this.logs)
  },
  methods: {
    generateToolTip(category, subCategory, hours) {
      return `<div class="tooltip">
				<span class="bold">${category}</span>
				- ${subCategory}: ${hours} hours
			</div>`
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
