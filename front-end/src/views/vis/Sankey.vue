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
    logs: { type: Array },
    sankeyColors: { type: Array }
  },
  data() {
    return {
      chartOptions: {
        width: '800',
        height: '400',
        sankey: {
          link: {
            colorMode: 'gradient',
            colors: this.sankeyColors,
            color: {
              fill: '#e6e6e6'
            }
          },
          node: {
            colors: this.sankeyColors,
            label: {
              fontName: 'Quattrocento Sans',
              fontSize: 20,
              color: '#707070'
            }
          }
        }
      }
    }
  },
  mounted() {
    this.$forceUpdate()
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
