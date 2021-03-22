<template>
  <div id="systemCon">
    <h1>Systems Library</h1>
    <div v-for="system in systems" :key="system._id">
      <h2
        >{{ system.name }} Categories
        <!-- <button
            class="smallInfoButton deleteButton"
            @click="launchDeleteConfirmation()"
            ><i class="fa fa-trash" aria-hidden="true"></i
          ></button> -->
      </h2>
      <div class="categoryListItemEditable"
        ><div
          v-for="category in systemCategories.filter((cat) => {
            return cat.system == system._id
          })"
          :key="category._id"
        >
          <div
            class="categoryListItem"
            :style="'background-color:' + getColor(category.color)"
          >
            {{ category.name }}
          </div>
          <button
            class="smallInfoButton deleteButton"
            @click="launchDeleteConfirmation()"
          >
            <i class="fa fa-trash" aria-hidden="true"></i
          ></button>
        </div>
      </div>
      <div class="addButtonCenter"
        ><button
          class="circle"
          type="button"
          @click="launchNewCategoryWindow(system._id)"
          >+</button
        ></div
      >
      <hr />
    </div>
    <transition name="appearTransition">
      <deleteConfirmationWindow v-if="showDeleteConfirmation" />
    </transition>
    <transition name="appearTransition">
      <div class="launchedWindowCon" v-if="showNewCategoryWindow">
        <newSystemCategoryWindow :systemId="chosenSystem" />
      </div>
    </transition>
    <br />
  </div>
</template>

<script>
import axios from 'axios'
import NewSystemCategoryWindow from './components/NewSystemCategoryWindow.vue'
import DeleteConfirmationWindow from './components/DeleteConfirmationWindow.vue'
export default {
  name: 'Systems',
  components: {
    newSystemCategoryWindow: NewSystemCategoryWindow,
    deleteConfirmationWindow: DeleteConfirmationWindow
  },
  data() {
    return {
      systemCategories: [],
      systems: [],
      chosenSystem: '',
      showNewCategoryWindow: false,
      showDeleteConfirmation: false
    }
  },
  methods: {
    getColor(categoryColorId) {
      // if non-top level category, chose a default color
      if (categoryColorId == undefined) return '#707070'
      // else return color given color id
      else
        return this.$store.state.colors.filter((color) => {
          return color._id == categoryColorId
        })[0].color
    },
    launchNewCategoryWindow(systemId) {
      this.chosenSystem = systemId
      console.log(this.chosenSystem)
      this.showNewCategoryWindow = true
    },
    launchDeleteConfirmation() {
      this.showDeleteConfirmation = true
    },
    deleteItem(itemId) {
      axios
        .post(`http://localhost:3000/systems/system/${itemId}/delete`)
        .then(function(response) {
          console.log('deleted', response.data)
        })
        .catch(function(error) {
          console.error(error)
        })
    }
  },
  created() {
    var self = this

    // get all systems
    axios
      .get('http://localhost:3000/systems')
      .then(function(response) {
        self.systems = response.data
      })
      .catch(function(error) {
        console.error(error)
      })

    // get all system categories
    axios
      .get('http://localhost:3000/systemCategories')
      .then(function(response) {
        self.systemCategories = response.data
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
  }
}
</script>

<style lang="scss">
h2 {
  font-weight: normal;
  text-align: center;
}
h1 {
  text-align: center;
}
.addButtonCenter {
  text-align: center;
}
.deleteButton {
  margin-top: -10px;
  padding: 10px;
  margin-left: -20px;
}
.addVar {
  display: flex;
  text-align: center;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
}
</style>
