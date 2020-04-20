<template>
  <div class="dayPageCon">
    <!-- <signIn v-if="!userLoggedIn"/> -->

    <div class="dayCon">
      <div class="timelineHeaderCon">
          <!-- {{userLoggedIn}} -->
          
        <!-- dropdown menu -->
        <select name="variableSelect" id="variableSelect" @change="updateVariable()" v-model="currentVariable">
          <option v-for="variable in variables" :key="variable._id" :value="unselected ? 'tasks' : variable._id" ref="currentVariableSelection">
            {{ variable.name }}
          </option>
        </select>
        
        <timeline />  
        
        <button class="circle" ref="addLogButton" @click="startLogInput()">+</button>
      </div>
      
      <dayInputForm v-if="displayForm" />  

      <bubbleChart />
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import BubbleChart from "./vis/BubbleChart.vue";
  import Timeline from "./vis/Timeline.vue";
  import DayInputForm from "./components/DayInputForm.vue";
  // import SignIn from "./SignIn.vue";
  export default {
    name: "Days", 
    components: { 
      'bubbleChart': BubbleChart, 
      'dayInputForm': DayInputForm, 
      'timeline': Timeline, 
      // 'signIn': SignIn  
    },
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
      }, 
      userLoggedIn() {
        return this.$store.state.isLoggedIn;
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

      // check if user is logged in
      axios.get('http://localhost:3000/check')
      .then(function(response) {
        // check if user needs to log in
        if(response.data.user == undefined) {
          self.$store.commit('isLoggedIn', false);
          console.log('user not logged in');
        } else {
          self.$store.commit('isLoggedIn', true);
          console.log('user logged in');
        }
      }).catch(function(error) { console.error(error); });

      // get all colors
      axios.get('http://localhost:3000/colors')
      .then(function(response) { 
        self.$store.commit('colors', response.data);
      }).catch(function(error) { console.error(error); });

      // get all variable names
      axios.get('http://localhost:3000/variables', 
      // { headers: { "Content-Type": "application/json" }, withCredentials: true }
        )
      .then(function(response) { 
        // if(response.data.msg) {
        //   self.$store.commit('isLoggedIn', false);
        //   console.log('user NOT logged in');
        // }
        // else {
        //   self.$store.commit('isLoggedIn', true);
          self.variables = response.data;
        //   console.log('user logged in');
        // } 
      }).catch(function(error) { console.error(error); });

      // console.log('chcecking if user logged in')
      //  (response.data.msg) ? false : true;
    }
  }
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  input[type=time], input[type=date], input[type=text] {
    color: $timbalBlack;
  }
</style>
