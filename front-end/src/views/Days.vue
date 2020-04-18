<template>
  <div class="dayCon">
    <!-- {{days}} -->
    <div class="dayTimelineCon">
      <h2>Log a <span ref="variableTitle">task</span></h2>
   
      <!-- dropdown menu -->
        <select name="variableSelect" id="variableSelect" @change="updateVariable()" v-model="currentVariable">
        <option v-for="variable in variables" :key="variable._id" :value="unselected ? 'tasks' : variable._id" ref="currentVariableSelection">
          {{ variable.name }} 
        </option>
      </select>
      <button class="circle" ref="addLogButton" @click="startLogInput()">+</button>
    </div>
    
    <dayInputForm v-if="displayForm" />  

    <bubbleChart />
  </div>
</template>

<script>
  import axios from "axios";
  import BubbleChart from "./BubbleChart.vue";
  import DayInputForm from "./DayInputForm.vue";
  export default {
    name: "Days", 
    components: { 'bubbleChart': BubbleChart, 'dayInputForm': DayInputForm },
    data() {
      return {
        // days: [], 
        currentVariable: "tasks", 
        variables: [], 
        unselected: true, 
        displayForm: false
      }
    },
    computed: {
      variableId() {
        return this.$store.state.variable;
      }
    },
    methods: {
      startLogInput() {
        // toggle betweem show/hide display form, and add/cancel buttons
        this.displayForm = !this.displayForm;
        this.$refs.addLogButton.innerHTML = this.displayForm ? 'X' : '+';
      },
      updateVariable() {
        this.unselected = false;
        // let self = this;
        console.log(this.currentVariable)
        this.$store.commit('variable', this.currentVariable);
        // axios.get(`http://localhost:3000/variable/name/${self.currentVariable}`)
        // .then(function(response) { 
        //   self.$store.commit('variable', response.data);
        // }).catch(function(error) { console.error(error);});
      }, 
    },

created() {
     var self = this;

        // // get all days
        // axios.get('http://localhost:3000/days')
        //   .then(function(response) { 
        //     // console.log(response)
        //     self.days = response.data;
        //   }).catch(function(error) { console.error(error); });

      // get all variable names
      axios.get('http://localhost:3000/variables')
      .then(function(response) { 
        self.variables = response.data;
      }).catch(function(error) { console.error(error); });
    }
  }

</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss'
</style>
