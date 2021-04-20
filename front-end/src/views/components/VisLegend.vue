<template>
  <div class="visLegend center">
    <div
      v-for="(title, n) in sortSet(varValTitles)"
      :key="title"
      class=" center"
    >
      <div
        class="visLegendcircle"
        :style="'background-color:' + colors[n]"
      ></div>
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisLegend',
  props: {
    varValTitles: Object,
    colors: Array
  },
  methods: {
    sortSet(set) {
      return Array.from(new Set(set)).sort()
    }
  }
}
</script>

<style lang="scss" scoped></style>
