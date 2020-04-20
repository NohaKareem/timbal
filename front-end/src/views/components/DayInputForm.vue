<template>
    <div class="dayInputFormCon">
        <div class="logInputForm">
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

            <!-- form GUI -->
            <formatDataDisplay />

            <div class="addLogButton">
                <!-- <input type="submit" value="add log"> -->
                <input type="button" value="add log" @click="addDayDocument()">
            </div>
            <hr>
        </form>
      </div>
    </div>
</template>

<script>
  import axios from "axios";
  import formatDataDisplay from "./FormatDataDisplay.vue";
  export default {
    name: "DayInputForm", 
    components: { 'formatDataDisplay': formatDataDisplay },
    data() {
      return {
        currentVariable: "tasks", 
        variables: [], 
        unselected: true, 
        dayDocExists: false
      }
    },
    computed: {
      variableId() {
        return this.$store.state.variable;
      },
      logString() {
        return this.$store.state.logStr; 
      }
    },
    methods: {
      addDayDocument() {
        console.log('in addDayDoc')
        // check if day exists
        this.checkIfDayDocExists();

        console.log('logInput in dayDoc')
        console.log(this.$store.state.logInput)

        let dayDocument = {
          date: new Date(this.$refs.date.value),
          variable: this.variableId, 
          start_time: (this.$refs.timeInput_from.value),
          end_time: (this.$refs.timeInput_to.value),
          full_category: this.$store.state.logInput
          
          // [ //~~~~
              // "5e61102fb705711710a1b286"
          // ]
        };
        let self = this;
        // post new day document. if day document exists, update day document; otherwise , post new day document 
        // test /day/5e94dfe5dd64435c38f3e346/variable/5e3316671c71657e18823380
        axios.post(self.dayDocExists ? `http://localhost:3000/day/${self.$store.state.day}/variable/${self.variableId}` : 'http://localhost:3000/day', dayDocument) 
            .then(function(response) {
              // console.log('added day document through route ' + self.dayDocExists ? `http://localhost:3000/day/${self.$store.state.day}/variable/${ self.variableId}` : 'http://localhost:3000/day', response.data);
              // update day id in vuex
              self.$store.commit('day', response.data._id);

            }).catch(function(error) { console.error(error); });
      }, 

      // check if day document exists, if not set new document and save id
      checkIfDayDocExists() {
        console.log('in check if day doc exists')

        // get day id if exists
        let self = this;
        axios.get(`http://localhost:3000/day/date/${new Date(this.$refs.date.value).toISOString()}`)
        // axios.get(`/day/date/2020-01-30T18:25:43.511+00:00`)
          .then(function(response) { 
            console.log('day doc exists response', response.data)
            // if no day document exists, start one
            if (!response.data) {
                  console.log('does not exist')
                  self.dayDocExists = false;
                  // axios.post('http://localhost:3000/day', dayDocument) // testing update
                  //       .then(function(response) {
                  //         console.log('started day document', response.data);

                  //         // udpate day id in vuex
                  //         self.$store.commit('day', response.data._id);
                  //       }).catch(function(error) { console.error(error); });
                  } else {
                    console.log('exists')
                      // update day id in vuex
                      self.dayDocExists = true;
                      self.$store.commit('day', response.data._id);
                  }  
          }).catch(function(error) { console.error(error); });
      }
    },

created() {
    // setting date to today https://stackoverflow.com/a/51466175/1446598
    this.$refs.date.value = (new Date()).toISOString().substr(0,10);
    // date.value =  (new Date()).toISOString().substr(0,10);
    // setting sample time
    this.$refs.timeInput_from.value = (new Date().getHours() + ":" + new Date().getMinutes());
    this.$refs.timeInput_to.value = ((new Date().getHours() + 1) + ":" + new Date().getMinutes());
    
    var self = this;

    // get all variable names
    axios.get('http://localhost:3000/variables')
    .then(function(response) { 
      self.variables = response.data;
    }).catch(function(error) { console.error(error); });
  }, 

    // mounted() {
    //   // update vuex with day doc if exists
    //   this.checkIfDayDocExists();
    //   console.log('date set')

    
    //       // // load bubble chart
    //       // let self = this;
    //       // axios.get('http://localhost:3000/bubble')
    //       // .then(function(response) {
    //       //   // let bubbleChart = document.querySelector('.bubbleChart');
    //       //   // console.log(response.data)
    //       //   // self.$refs.bubbleChart.innerHTML = response.data;
    //       //   self.$refs.bubbleChart.innerHTML = response.data;
    //       //   console.log(self.$refs.bubbleChart.innerHTML)
    //       // })
    //       // .catch(function(error) {
    //       //   console.error(error);
    //       // });
    // }
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
