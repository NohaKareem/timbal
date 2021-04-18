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

        <div class="portraitTypeInput">
          <select
            name="portrait_varSystem"
            id="portrait_varSystem"
            v-model="portraitType"
          >
            <option value="variable">Variable </option>
            <option value="system"> System </option>
          </select>
        </div>
        <div class="varSystemValuesInput">
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
        </div>

        <div class="timelineCon">
          <timeline
            :key="renderUpdate"
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
      <bubbleChart :key="renderUpdate" />
      <!-- <bubbleChart /> -->
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

Vue.use(VueShepherd)

// import SignIn from "./SignIn.vue";
export default {
  name: 'Days',
  components: {
    bubbleChart: BubbleChart,
    dayInputForm: DayInputForm,
    timeline: Timeline,
    pageHeading: PageHeading
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
      logs: [],
      systemLogs: [],
      systemTimelineData: []
    }
  },
  computed: {
    variableId() {
      return this.$store.state.variable
    },
    userLoggedIn() {
      return this.$store.state.isLoggedIn
    },
    isSystem() {
      return this.portraitType === 'system'
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
      if (this.portraitType === 'variable') {
        this.$store.commit('variable', this.currentVariable)
      }
      this.getTimelineLog()
    },
    launchOnboarding() {
      this.tour.start()
    },
    // parse timeline log from a system's perspective
    parseSystemTimeline(self) {
      console.log('in parseSystemTimeline')
      self.systemLogs.forEach((systemCat) => {
        self.logs.variables.forEach((log) => {
          log.log_data.forEach((l) => {
            l.full_category.forEach((c) => {
              // if var val belongs to current system category
              if (systemCat.values.includes(c._id)) {
                self.systemTimelineData.push({
                  color: systemCat.color,
                  duration: Math.abs(
                    new Date(l.start_time).getHours() * 60 +
                      new Date(l.start_time).getMinutes() -
                      new Date(l.end_time).getHours() * 60 +
                      new Date(l.end_time).getMinutes()
                  ),
                  logCode: systemCat.name,
                  value: new Date(l.start_time).valueOf()
                })
              }
            })
          })
        })
      })
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

          // if (this.portraitType != 'system') {
          // force update render

          // self.$forceUpdate()
          // self.renderUpdate++
          // }
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

      if (this.portraitType == 'system') {
        // this.systemLogs.push(this.currentVariable)
        this.systemLogs = []
        let logs = []
        axios
          .get(
            `http://localhost:3000/systems/${this.currentVariable}/categories`
          )
          .then(function(response) {
            logs = response.data
            logs.forEach((l) => {
              self.systemLogs.push(l)
            })
            self.parseSystemTimeline(self)
            // force update render
            self.$forceUpdate()
            self.renderUpdate++
          })

        // force update render
        self.$forceUpdate()
        self.renderUpdate++
      }
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
            // keep full window interactive
            useModalOverlay: false
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
                text: `<span class="bold">${step.heading}</span> <br/><br/> ${step.text}`,
                attachTo: { element: step.attachTo, on: 'top' },
                // attachTo: { element: '.timelineCon', on: 'top' },
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

.varSystemValuesInput {
  margin-left: $baseMargin;
  margin-top: $baseMargin * 2;
  margin-bottom: $baseMargin * 2;
}

@media screen and (min-width: $desktopWidth) {
  .tutorialButton {
    margin-left: 90vw !important;
  }

  .varSystemValuesInput {
    margin-top: unset;
    margin-bottom: unset;
  }
}
</style>
