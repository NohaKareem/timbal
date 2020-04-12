<template>
  <div class="dayCon">
    <!-- {{days}} -->
    <h2>Log a <span ref="variableTitle">task</span></h2>
    <select name="variableSelect" id="variableSelect" @change="updateVariable()" v-model="currentVariable">
      <option v-for="variable in variables" :key="variable._id" :value="unselected ? 'tasks' : variable._id" ref="currentVariableSelection">
        {{ variable.name }} 
      </option>
    </select>
    <form action="http://localhost:3000/day" method="POST">
      <div class="logTaskInputHeader">
        <div class="logTaskInput">
          <label for="date">date</label>
          <input type="date" name="date" id="date" ref="date">
        </div>
        <div class="logTaskInput">
          <label for="timeInput_from">from</label>
          <input type="time" name="timeInput_from" id="timeInput_from" ref="timeInput_from">
        </div>
        <div class="logTaskInput">
          <label for="timeInput_to">to</label>
          <input type="time" name="timeInput_to" id="timeInput_to" ref="timeInput_to">
        </div>
        <input type="text" name="full_category" id="full_category" placeholder="task log" value="b.a.w.6003">
          <br>
      </div>
        <hr>
        <div class="addLogButton" @mouseover="showAddCategoryWindow()">
          <input type="submit" value="add log">
        </div>
    </form>
    <!-- <div class="addCategory hidden" ref="addCategoryWindow"> -->
    
    <form action="http://localhost:3000/day" method="POST">
      <div class="addCategory" ref="addCategoryWindow">
        <h2>Add new category</h2>
        <hr>
        <div class="newCategoryForm">
          <div class="newCategoryTextInput">
              <div class="codeInput">
                <input type="text" name="code" id="categoryCode" placeholder="code">
                <button class="smallInfoButton" value="s" @click="showToolTip()">i</button>
                <p class="codeInfo hidden" ref="codeInfo">initial(s) to represent the category</p>
              </div>
              <input type="text" name="name" id="categoryCode" placeholder="descriptive name" value="sleep">
          </div>
          <h3>category color</h3>
          <div class="addCategoryButton">
            <input type="submit" value="add category">
          </div>
        </div>
      </div>
    </form>
    <hr>
    {{ variableId }}
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
        days: [], 
        currentVariable: "tasks", 
        variables: [], 
        unselected: true
      }
    },
    computed: {
      variableId() {
        return this.$store.state.variable;
      }
    },
    methods: {
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

      // display window 
      showAddCategoryWindow() {
        this.$refs.addCategoryWindow.classList.remove('hidden');
      },
      
      // display 
      showToolTip() {
        console.log('in tool tip')
          this.$refs.codeInfo.classList.toggle('hidden');
      }
    },

created() {
     var self = this;

      // get all days
      axios.get('http://localhost:3000/days')
        .then(function(response) { 
          // console.log(response)
          self.days = response.data;
        }).catch(function(error) { console.error(error); });

      // get all variable names
      axios.get('http://localhost:3000/variables')
      .then(function(response) { 
        self.variables = response.data;
      }).catch(function(error) { console.error(error); });
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
  select {
    @include softUiShadow();
    background-color: $grayWhite;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    // select menu styling https://stackoverflow.com/a/24671889
    --baseFg: #F0F0F0;//c70062;
    --baseBg: #ffe3f1;
    --accentFg: #707070;//green;// #c70062;
    --accentBg: #F0F0F0;//#ffaad4;

     font: 400 12px/1.3 sans-serif;
      -webkit-appearance: none;
      appearance: none;
      color: $timbalBlack;
      // border: 1px solid var(--baseFg);
      line-height: 1;
      outline: 0;
      padding: 0.65em 2.5em 0.55em 0.75em;
      border-radius: $baseMargin * 5;// var(--radius);
      // background-color: var(--baseBg);
      background-image: 
      linear-gradient(var(--baseFg), var(--baseFg)),
        linear-gradient(-135deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(-225deg, transparent 50%, var(--accentBg) 50%),
        linear-gradient(var(--accentBg) 42%, var(--accentFg) 42%);
      background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
      background-size: 1px 100%, 20px 22px, 20px 22px, 20px 100%;
      background-position: right 20px center, right bottom, right bottom, right bottom;  
  }
</style>
