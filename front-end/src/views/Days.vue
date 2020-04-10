<template>
  <div id="dayCon">
    <!-- {{days}} -->
    <form action="http://localhost:3000/day" method="POST">
      <input type="date" name="date" id="date" ref="date">
      <label for="timeInput_from">Start time</label>
      <input type="time" name="timeInput_from" id="timeInput_from" ref="timeInput_from">
      <label for="timeInput_to">End time</label>
      <input type="time" name="timeInput_to" id="timeInput_to" ref="timeInput_to">
      <input type="text" name="full_category" id="full_category" placeholder="add log here (or use the form!)" value="b.a.w.6003">
      <br>
      <input type="submit" value="add log">
    </form>
    <hr>
    {{variableId}}
    <!-- <div class="bubbleChart" ref="bubbleChart">hi</div> -->
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
          self.$store.commit('variable', respzonse.data);//~
          self.days = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });


    }, 
    mounted() {
      // setting date to today https://stackoverflow.com/a/51466175/1446598
      // this.$refs.date.value = (new Date()).toISOString().substr(0,10);
      let date = document.querySelector('#date');
      date.value =  (new Date()).toISOString().substr(0,10);
      // setting sample time
      let timeInput_from = document.querySelector('#timeInput_from');
      let timeInput_to = document.querySelector('#timeInput_to');
      timeInput_from.value = ((new Date().getHours() - 1) + ":" + new Date().getMinutes());
      timeInput_to.value = ((new Date().getHours()) + ":" + new Date().getMinutes());
      // this.$refs.timeInput_from.value =  ((new Date().getHours() - 1) + ":" + new Date().getMinutes());
      // this.$refs.timeInput_to.value = (new Date().getHours() + ":" + new Date().getMinutes());

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
  
  input {
    background-color: $grayWhite;
    font-family: 'Quattrocento Sans', sans-serif;
  }
</style>
