<template>
  <!--  Note: component not currently in use (was built for a render bug fix) -->
  <div>
    <div>
      <div class="timelineCon">
        <timeline
          :logs="isSystem ? systemTimelineData : logs"
          :isSystem="isSystem"
        />
      </div>

      <button
        class="circle addButton"
        ref="addLogButton"
        @click="startLogInput()"
        >+</button
      >
    </div>

    <dayInputForm v-if="displayForm" />

    <div class="hidden tutorial" ref="tutorial2">
      <div class="infoSign"><span class="italic">i</span></div>
      <p
        >Here's a bubble chart of a day, each circle represents the total
        minutes for that (top-level) category</p
      >
    </div>
    <bubbleChart :systemCategories="isSystem ? systemLogs : null" />
  </div>
</template>

<script>
import BubbleChart from '../vis/BubbleChart.vue'
import Timeline from '../vis/Timeline.vue'
import DayInputForm from './DayInputForm.vue'

export default {
  name: 'DashboardVis',
  components: {
    bubbleChart: BubbleChart,
    timeline: Timeline,
    dayInputForm: DayInputForm
  },
  props: {
    displayForm: { type: Boolean, default: false },
    logs: { type: Array },
    systemLogs: { type: Array },
    systemTimelineData: { type: Array }
  }
}
</script>

<style lang="scss"></style>
