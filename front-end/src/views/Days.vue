<template>
  <div class="dayPageCon">
    <pageHeading h1="Dashboard" h2="Your day at a glance" />
    <!-- <signIn v-if="!userLoggedIn"/> -->

    <div class="dayCon">
      <button class="help" @click="launchOnboarding()">?</button>

      <!-- <button
        class="circle tutorialButton"
        ref="tutorialButton"
        type="button"
        @click="showTutorial()"
        ><span class="italic">i</span></button
      > -->

      <div class="hidden tutorial" ref="tutorial1">
        <div class="infoSign"><span class="italic">i</span></div>
        <p>Here's a timeline view of a day</p>
      </div>
      <div class="timelineHeaderCon">
        <!-- {{userLoggedIn}} -->

        <select
          name="portrait_varSystem"
          id="portrait_varSystem"
          v-model="portraitType"
        >
          <option value="variable">Variable </option>
          <option value="system"> System </option>
        </select>
        <select
          name="portrait_varSystemOptions"
          id="portrait_varSystemOptions"
          @change="updateVariable()"
          v-model="currentVariable"
        >
          <option
            v-for="item in portraitType === 'variable' ? variables : systems"
            :key="item._id"
            :value="item._id"
            @change="updateItem()"
          >
            {{ item.name }}
          </option>
        </select>

        <!-- dropdown menu -->
        <!-- <select
          name="variableSelect"
          id="variableSelect"
          @change="updateVariable()"
          v-model="currentVariable"
        >
          <option
            v-for="variable in variables"
            :key="variable._id"
            :value="unselected ? 'tasks' : variable._id"
            @change="updateVariable()"
            ref="currentVariableSelection"
          >
            {{ variable.name }}
          </option>
        </select> -->

        <div class="timelineCon">
          <timeline :key="renderUpdate" :logs="logs" />
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
      <bubbleChart :key="renderUpdate" />
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
import PageHeading from './components/PageHeading.vue'
// import NestedDonut from './vis/NestedDonut.vue'
Vue.use(VueShepherd)

// import SignIn from "./SignIn.vue";
export default {
  name: 'Days',
  components: {
    bubbleChart: BubbleChart,
    dayInputForm: DayInputForm,
    timeline: Timeline,
    pageHeading: PageHeading
    // nestedDonut: NestedDonut
    // 'signIn': SignIn
  },
  data() {
    return {
      portraitType: 'variable',
      currentVariable: 'tasks',
      variables: [],
      items: [],
      systems: [],
      displayForm: false,
      renderUpdate: 0,
      unselected: true,
      tour: {},
      logs: []
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
      // this.$forceUpdate()
      // this.renderUpdate++ // force update render
      this.$store.commit('variable', this.currentVariable)
      this.getTimelineLog()
    },
    launchOnboarding() {
      this.tour.start()
    },
    getTimelineLog() {
      let self = this
      // axios.get(`http://localhost:3000/day/${this.$store.state.day}/var/${this.$store.state.variable}/details`)
      // sample day id
      axios
        .get(
          `http://localhost:3000/day/5e611877b705711710a1b28d/var/${this.$store.state.variable}/details`
        )
        .then(function(response) {
          self.logs = response.data
          // force update render
          self.$forceUpdate()
          self.renderUpdate++
        })
      axios
        .get(`http://localhost:3000/systems`)
        .then(function(response) {
          self.systems = response.data
        })
        .catch(function(error) {
          console.error(error)
        })
      axios
        .get(`http://localhost:3000/variables`)
        .then(function(response) {
          self.variables = response.data
        })
        .catch(function(error) {
          console.error(error)
        })
    },
    updateItem() {
      // this.currItemId = itemId
      if (this.portraitType === 'variable') {
        this.items = this.variables
      } else {
        this.items = this.systems
      }
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
    let self = this
    let steps = []

    // fetch and display onboarding steps
    axios
      .get('http://localhost:3000/onboardingSteps')
      .then(function(response) {
        steps = response.data

        // add navigation
        self.$nextTick(() => {
          self.tour = self.$shepherd({
            useModalOverlay: true
          })
          steps.forEach((step, i) => {
            let buttons = []
            if (i > 0)
              buttons.push({
                text: '←',
                action: self.tour.back
              })
            if (i < steps.length - 1)
              buttons.push({
                text: steps.button ? steps.button : '→',
                action: self.tour.next
              })
            buttons.push({
              text: 'X',
              action: self.tour.cancel
            })
            self.tour.addSteps([
              {
                text: `${step.heading} <br/><br/> ${step.text}`,
                attachTo: { element: '.timelineCon', on: 'top' },
                buttons: buttons
              }
            ])
          })
          // self.tour.start()
        })
      })
      .catch(function(error) {
        console.error(error)
      })
    this.getTimelineLog()
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
