<template>
  <div id="systemCon">
    <pageHeading h1="System Library" h2="Your systems at a glance" />

    <div v-for="system in systems" :key="system._id">
      <h2
        >{{ system.name }} Categories
        <!-- <button
            class="smallInfoButton deleteButton"
            @click="launchDeleteConfirmation()"
            ><i class="fa fa-trash" aria-hidden="true"></i
          ></button> -->
      </h2>
      <div class="categoryListItemEditable">
        <div
          v-for="category in systemCategories.filter((cat) => {
            return cat.system == system._id
          })"
          :key="category._id"
        >
          <div
            class="categoryListItem"
            :style="'background-color:' + getColor(category.color)"
            @click="launchViewCategoryWindow(category._id)"
          >
            {{ category.name }}
          </div>
          <button
            class="smallInfoButton deleteButton"
            @click="launchDeleteConfirmation(category._id)"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="addButtonCenter"
        ><button
          class="circle"
          type="button"
          @click="launchNewCategoryWindow(system._id)"
          >+
        </button>
      </div>
      <hr />
    </div>
    <transition name="appearTransition">
      <div class="launchedWindowCon" v-if="showDeleteConfirmation">
        <deleteConfirmationWindow
          itemType="systemCategory"
          :itemId="deleteItemId"
        />
      </div>
    </transition>
    <transition name="appearTransition">
      <div class="launchedWindowCon" v-if="showViewCategoryWindow">
        <viewSystemCategoryWindow :systemCategoryId="showItemId" />
      </div>
    </transition>
    <transition name="appearTransition">
      <div class="launchedWindowCon" v-if="showNewCategoryWindow">
        <newSystemCategoryWindow :systemId="chosenSystem" />
      </div>
    </transition>
    <br />
    <div class="addVar">
      <form action="http://localhost:3000/system" method="post">
        <input type="text" name="name" value="name" placeholder="system name" />
        <input
          type="text"
          name="description"
          value="description"
          placeholder="description"
        />
        <input type="submit" value="add system" />
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NewSystemCategoryWindow from './components/NewSystemCategoryWindow.vue'
import DeleteConfirmationWindow from './components/DeleteConfirmationWindow.vue'
import ViewSystemCategoryWindow from './components/ViewSystemCategoryWindow.vue'
import PageHeading from './components/PageHeading.vue'

export default {
  name: 'Systems',
  components: {
    newSystemCategoryWindow: NewSystemCategoryWindow,
    deleteConfirmationWindow: DeleteConfirmationWindow,
    viewSystemCategoryWindow: ViewSystemCategoryWindow,
    pageHeading: PageHeading
  },
  data() {
    return {
      systemCategories: [],
      systems: [],
      chosenSystem: '',
      showNewCategoryWindow: false,
      showViewCategoryWindow: false,
      showDeleteConfirmation: false,
      deleteItemId: '',
      showItemId: ''
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
      this.showNewCategoryWindow = true
    },
    launchViewCategoryWindow(itemId) {
      this.showViewCategoryWindow = true
      this.showItemId = itemId
    },
    launchDeleteConfirmation(itemId) {
      this.deleteItemId = itemId
      this.showDeleteConfirmation = true
    }
    // deleteItem(itemId) {
    //   axios
    //     .post(`http://localhost:3000/systems/systemCategory/${itemId}/delete`)
    //     .then(function(response) {
    //       console.log('deleted', response.data)
    //     })
    //     .catch(function(error) {
    //       console.error(error)
    //     })
    // }
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
