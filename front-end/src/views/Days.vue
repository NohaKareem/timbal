<template>
  <div id="dayCon">
    <!-- {{days}} -->
    <form action="http://localhost:3000/day" method="POST">
      <div class="logTaskInputHeader">
        <div class="logTaskInput">
          <label for="date">date</label>
          <input type="date" name="date" id="date" ref="date">
        </div>
        <div class="logTaskInput">
          <label for="timeInput_from">Start time</label>
          <input type="time" name="timeInput_from" id="timeInput_from" ref="timeInput_from">
        </div>
        <div class="logTaskInput">
          <label for="timeInput_to">End time</label>
          <input type="time" name="timeInput_to" id="timeInput_to" ref="timeInput_to">
        </div>
          <input type="text" name="full_category" id="full_category" placeholder="task log" value="b.a.w.6003">
        <br>
        <input type="submit" value="add log">
      </div>
    </form>
    <hr>
    <!-- {{variableId}} -->
    <bubbleChart />
    </div>
</template>

<script>
  import axios from "axios";
  import BubbleChart from "./BubbleChart.vue";
  export default {
    name: "Days", 
    components: { 'bubbleChart': BubbleChart },
    data() {
      return {
        days: []
      }
    },
    computed: {
      variableId() {
        return this.$store.state.variable;
      }
    },
    created() {
     var self = this;
      // get all days
      axios.get('http://localhost:3000/days')
        .then(function(response) { 
          // console.log(response)
          // self.$store.commit('variable', response.data);//~
          self.days = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });


    }, 
    mounted() {
      // setting date to today https://stackoverflow.com/a/51466175/1446598
      this.$refs.date.value = (new Date()).toISOString().substr(0,10);
      // date.value =  (new Date()).toISOString().substr(0,10);
      // setting sample time
      this.$refs.timeInput_from.value = (new Date().getHours() + ":" + new Date().getMinutes());
      this.$refs.timeInput_to.value = ((new Date().getHours() + 1) + ":" + new Date().getMinutes());

          // // load bubble chart
          // let self = this;
          // axios.get('http://localhost:3000/bubble')
          // .then(function(response) {
          //   // let bubbleChart = document.querySelector('.bubbleChart');
          //   // console.log(response.data)
          //   // self.$refs.bubbleChart.innerHTML = response.data;
          //   self.$refs.bubbleChart.innerHTML = response.data;
          //   console.log(self.$refs.bubbleChart.innerHTML)
          // })
          // .catch(function(error) {
          //   console.error(error);
          // });
    }
  }
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';

</style>
