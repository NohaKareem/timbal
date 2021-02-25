<template>
  <div class="dayPageCon">
    <!-- <signIn v-if="!userLoggedIn"/> -->

    <div class="dayCon">
      <button
        class="circle tutorialButton"
        ref="tutorialButton"
        type="button"
        @click="showTutorial()"
        ><span class="italic">i</span></button
      >

      <div class="hidden tutorial" ref="tutorial1">
        <div class="infoSign"><span class="italic">i</span></div>
        <p>Here's a timeline view of a day</p>
      </div>

      <div class="timelineHeaderCon">
        <!-- {{userLoggedIn}} -->

        <!-- dropdown menu -->
        <select
          name="variableSelect"
          id="variableSelect"
          @change="updateVariable()"
          v-model="currentVariable"
        >
          <option
            v-for="variable in variables"
            :key="variable._id"
            :value="unselected ? 'tasks' : variable._id"
            ref="currentVariableSelection"
          >
            {{ variable.name }}
          </option>
        </select>

        <div class="timelineCon">
          <timeline />
        </div>

        <button class="circle" ref="addLogButton" @click="startLogInput()"
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
      <bubbleChart />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BubbleChart from './vis/BubbleChart.vue'
import Timeline from './vis/Timeline.vue'
import DayInputForm from './components/DayInputForm.vue'
import Vue from 'vue'
import VueShepherd from 'vue-shepherd'
Vue.use(VueShepherd)

// import SignIn from "./SignIn.vue";
export default {
  name: 'Days',
  components: {
    bubbleChart: BubbleChart,
    dayInputForm: DayInputForm,
    timeline: Timeline
    // 'signIn': SignIn
  },
  data() {
    return {
      // days: [],
      currentVariable: 'tasks',
      variables: [],
      unselected: true,
      displayForm: false
    }
  },
  computed: {
    variableId() {
      return this.$store.state.variable
    },
    userLoggedIn() {
      return this.$store.state.isLoggedIn
    }
  },
  methods: {
    showTutorial() {
      console.log(this.$refs.tutorialButton.classList)
      this.$refs.tutorialButton.classList.toggle('selected')
      this.$refs.tutorial1.classList.toggle('hidden')
      this.$refs.tutorial2.classList.toggle('hidden')
    },
    startLogInput() {
      // toggle betweem show/hide display form, and add/cancel buttons
      this.displayForm = !this.displayForm
      this.$refs.addLogButton.innerHTML = this.displayForm ? 'X' : '+'
    },
    updateVariable() {
      this.unselected = false
      // let self = this;
      console.log(this.currentVariable)
      this.$store.commit('variable', this.currentVariable)
      // axios.get(`http://localhost:3000/variable/name/${self.currentVariable}`)
      // .then(function(response) {
      //   self.$store.commit('variable', response.data);
      // }).catch(function(error) { console.error(error);});
    }
  },

  created() {
    var self = this

    // check if user is logged in
    axios
      .get('http://localhost:3000/check')
      .then(function(response) {
        // check if user needs to log in
        if (response.data.user == undefined) {
          self.$store.commit('isLoggedIn', false)
          console.log('user not logged in')
        } else {
          self.$store.commit('isLoggedIn', true)
          console.log('user logged in')
        }
      })
      .catch(function(error) {
        console.error(error)
      })

    // get all colors
    axios
      .get('http://localhost:3000/colors')
      .then(function(response) {
        self.$store.commit('colors', response.data)
      })
      .catch(function(error) {
        console.error(error)
      })

    // get all variable names
    axios
      .get(
        'http://localhost:3000/variables'
        // { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )
      .then(function(response) {
        // if(response.data.msg) {
        //   self.$store.commit('isLoggedIn', false);
        //   console.log('user NOT logged in');
        // }
        // else {
        //   self.$store.commit('isLoggedIn', true);
        self.variables = response.data
        //   console.log('user logged in');
        // }
      })
      .catch(function(error) {
        console.error(error)
      })

    // console.log('chcecking if user logged in')
    //  (response.data.msg) ? false : true;
  },
  mounted() {
    // let self = this
    console.log('mounted')

    this.$nextTick(() => {
      const tour = this.$shepherd({
        useModalOverlay: true,
        classes: 'shepherd-theme-arrows'
      })

      tour.addSteps([
        {
          text: 'Test',
          attachTo: { element: '.timelineCon', on: 'top' },
          buttons: [
            {
              text: 'next',
              action: tour.next
            },
            {
              text: 'X',
              action: tour.cancel
            }
          ]
        },
        {
          text: 'Test 2', //~
          attachTo: { element: '.dayCon', on: 'top' },
          buttons: [
            {
              text: 'prev',
              action: tour.back
            },
            {
              text: 'X',
              action: tour.cancel
            }
          ]
        }
      ])
      tour.start()
    })
  }
}
</script>

<style lang="scss">
@import '~shepherd.js/dist/css/shepherd.css';
@import '@/styles/globalStyles.scss';

input[type='time'],
input[type='date'],
input[type='text'] {
  color: $timbalBlack;
}

.timelineCon {
  padding: $baseMargin;
  padding-right: 0;
}

// tutorial
.selected {
  box-shadow: inset -5px -5px 15px 0 white, inset 5px 5px 10px 0 $teal;
  color: $teal;
}

.tutorial {
  margin-top: $baseMargin * 3;
  margin-bottom: $baseMargin * 3;
  @include softUiSelectedInsetShadow_teal();
  border-radius: $baseMargin * 5;
  display: flex;

  p {
    margin-left: $baseMargin * 3;
    margin-right: $baseMargin * 3;
  }
}

.italic {
  font-style: italic;
}

.tutorialButton {
  margin-left: 91% !important;
  width: $baseMargin * 3.5 !important;
  height: $baseMargin * 3.5 !important;
}

.infoSign {
  margin-left: $baseMargin * 3;
  margin-top: $baseMargin * 1.75;
  color: $teal;
}

@media screen and (min-width: $desktopWidth) {
  .tutorialButton {
    margin-left: 90vw !important;
  }
}
</style>
