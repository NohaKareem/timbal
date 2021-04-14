<template>
  <div id="categoryCon">
    <pageHeading h1="Variable Library" h2="Your variables at a glance" />

    <div v-for="variable in variables" :key="variable._id">
      <h2>{{ variable.name }} Categories</h2>
      <!-- {{categories.filter(cat => {return cat.variable == variable._id })[0]}} -->
      <div class="categoryListItemEditable">
        <div
          v-for="category in categories.filter((cat) => {
            return cat.variable == variable._id
          })"
          :key="category._id"
        >
          <div
            class="categoryListItem"
            :style="'background-color:' + getColor(category.color)"
          >
            {{ category.code }}: {{ category.description }}
          </div>
          <!-- <button class="smallInfoButton deleteButton" @click="deleteItem(category._id)"><i class="fa fa-trash" aria-hidden="true"></i></button> -->
          <button
            class="smallInfoButton deleteButton"
            @click="launchDeleteConfirmation()"
            ><i class="fa fa-trash" aria-hidden="true"></i
          ></button>
        </div>
      </div>
      <!-- <div class="categoryListItem" 
              :style="'background-color:' + getColor(category.color)"
              v-for="category in categories.filter(cat => {return cat.variable == variable._id })" 
              :key="category._id">
              {{ category.code }}: {{ category.description }}
        </div> -->
      <div class="addButtonCenter"
        ><button class="circle" type="button" @click="launchNewCategoryWindow()"
          >+</button
        ></div
      >
      <hr />
    </div>
    <!-- <transition name="appearTransition">
      <deleteConfirmationWindow v-if="showDeleteConfirmation" />
    </transition> -->
    <transition name="appearTransition">
      <div class="launchedWindowCon" v-if="showDeleteConfirmation">
        <deleteConfirmationWindow />
      </div>
    </transition>
    <transition name="appearTransition">
      <newCategoryWindow v-if="showNewCategoryWindow" />
    </transition>
    <br />
    <div class="addVar">
      <form action="http://localhost:3000/variable" method="post">
        <input
          type="text"
          name="name"
          value="name"
          placeholder="variable name"
        />
        <input
          type="text"
          name="description"
          value="description"
          placeholder="description"
        />
        <input type="submit" value="add variable" />
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NewCategoryWindow from './components/NewCategoryWindow.vue'
import DeleteConfirmationWindow from './components/DeleteConfirmationWindow.vue'
import PageHeading from './components/PageHeading.vue'
export default {
  name: 'Categories',
  components: {
    newCategoryWindow: NewCategoryWindow,
    deleteConfirmationWindow: DeleteConfirmationWindow,
    pageHeading: PageHeading
  },
  data() {
    return {
      categories: [],
      variables: [],
      showNewCategoryWindow: false,
      showDeleteConfirmation: false
    }
  },
  methods: {
    deleteItem(itemId) {
      axios
        .post(`http://localhost:3000/categories/category/${itemId}/delete`)
        .then(function(response) {
          console.log('deleted', response.data)
        })
        .catch(function(error) {
          console.error(error)
        })
    },
    launchNewCategoryWindow() {
      this.showNewCategoryWindow = true
    },
    launchDeleteConfirmation() {
      this.showDeleteConfirmation = true
    },
    getColor(categoryColorId) {
      // if non-top level category, chose a default color
      if (categoryColorId == undefined) return '#707070'
      // else return color given color id
      else
        return this.$store.state.colors.filter((color) => {
          return color._id == categoryColorId
        })[0].color
    }
  },
  created() {
    var self = this

    // get all categories
    axios
      .get('http://localhost:3000/categories')
      .then(function(response) {
        self.categories = response.data
      })
      .catch(function(error) {
        console.error(error)
      })

    // get all variables
    axios
      .get('http://localhost:3000/variables')
      .then(function(response) {
        self.variables = response.data
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

<style lang="scss" scoped>
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
