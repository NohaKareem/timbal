<template>
  <div class="dayCon">
    <timeline />  

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
  import BubbleChart from "./vis/BubbleChart.vue";
  import Timeline from "./vis/Timeline.vue";
  import DayInputForm from "./components/DayInputForm.vue";
  export default {
    name: "Days", 
    components: { 'bubbleChart': BubbleChart, 'dayInputForm': DayInputForm, 'timeline': Timeline  },
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

      // get all colors
      axios.get('http://localhost:3000/colors')
      .then(function(response) { 
        self.$store.commit('colors', response.data);
        // response.data.forEach(element => {
          // console.log(element._id == '5e8b9ebd4b8d5674645b32bb')
        // });
        // response.data.includes((d) => {return d._id === id:'5e8b9ebd4b8d5674645b32bb'})
        // filter array by attribute value https://stackoverflow.com/a/2722213
        let colorId = '5e8b9ebd4b8d5674645b32bb';
        var color = response.data.filter((color) => {
          console.log(color._id == colorId)
            return color._id == colorId;
        });
        console.log(color[0].color )
      }).catch(function(error) { console.error(error); });

      // get all variable names
      axios.get('http://localhost:3000/variables')
      .then(function(response) { 
        self.variables = response.data;
      }).catch(function(error) { console.error(error); });
    }
  }

</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  input[type=time], input[type=date], input[type=text] {
    color: $timbalBlack;
  }
</style>
