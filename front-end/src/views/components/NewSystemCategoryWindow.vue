<template>
  <div class="addSystemCategoryCon">
    <div class="addSystemCategory">
      <p class="cancelButton" @click="toggleAddCategoryWindow()">X</p>
      <form action="http://localhost:3000/systemCategory" method="POST">
        <h2>Add new system category</h2>
        <hr class="categoryHr" />
        <div class="newCategoryForm">
          <div class="newCategoryTextInput">
            <div class="newSystemCatText">
              <input
                type="text"
                name="name"
                value="name, eg. wellness"
                class="sm"
                placeholder="category name"
              />
              <input
                type="text"
                name="description"
                value="description, eg. tasks related to wellness"
                class="lg"
                placeholder="category description"
              />
            </div>
            <!-- pass variable fieldss to form -->
            <input
              type="text"
              name="is_top_level"
              ref="is_top_level"
              :value="is_top_level"
              id="is_top_level"
              placeholder="true"
              class="hidden"
            />
            <input
              type="text"
              name="variable"
              ref="catVariable"
              :value="variableId"
              id="variableName"
              placeholder="code"
              class="hidden"
            />
            <input
              type="text"
              name="color"
              ref="catColor"
              :value="selectedColor"
              id="colorId"
              class="hidden"
            />
          </div>
          <label for="portrait_varSystmeOptions">Variable</label>
          <select
            class="selectWithLabel"
            name="portrait_varSystemOptions"
            id="portrait_varSystemOptions"
            v-model="variable"
            @change="resetCurrCategories()"
          >
            <option
              v-for="variable in variables"
              :key="variable._id"
              :value="variable._id"
            >
              {{ variable.name }}
            </option>
          </select>
          <div v-if="variable" class="categoryListItemEditable">
            <div
              v-for="(varCategory, n) in categories.filter((cat) => {
                return cat.variable == variable
              })"
              class="categoryListItem"
              :class="currCategories[n] ? softUiInsetShadow : ''"
              :style="'background-color:' + getColor(varCategory.color)"
              :key="varCategory._id"
              @click="selectCategory(n)"
            >
              {{ varCategory.code }}:
              {{ varCategory.description }}
            </div>
          </div>

          <p class="codeInfo hidden" ref="codeInfo"
            >initial(s) to represent the category</p
          >

          <!-- display category color palette -->
          <h3>category color</h3>
          <div class="colorGridCon">
            <div class="colorGrid">
              <div
                class="colorSwatch"
                v-for="color in colors"
                :key="color._id"
                :style="`background-color: ${color.color}`"
                @click="selectColor(color._id)"
              >
                <p v-if="color._id === selectedColor">&#10004;</p>
                <p v-if="usedColors.includes(color._id)">X</p>
              </div>
            </div>
          </div>
          <p class="codeInfo hidden" ref="colorNote"
            >this color's already taken! try another one</p
          >
          <p class="codeInfo hidden" ref="formNote"
            >don't forget to fill all form fields!</p
          >
          <div class="addCategoryButton">
            <!-- <input type="submit" value="add category" v-if="formIncomplete" disabled @click="showFormCompletionNote()"> -->
            <!-- <input type="submit" value="add category" v-else> -->
            <input type="submit" value="add category" />
            <!-- <button type="button" @click="uploadColor()">add category</button> -->
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ShowNewCategoryWindow',
  data() {
    return {
      colors: [],
      selectedColor: '',
      usedColors: [],
      variables: [],
      categories: [],
      variable: '',
      varCategories: [],
      currCategories: [],
      formIncomplete: true,
      is_top_level: true //~e
    }
  },
  computed: {
    variableId() {
      return this.$store.state.variable
    }

    // // init array with length, of currently selected cateogries, to false
    // currCategories() {
    //   return new Array(
    //     this.categories.filter((cat) => {
    //       return cat.variable == this.variable
    //     }).length
    //   ).fill(false)
    // }
  },
  created() {
    let self = this
    // get all colors
    axios
      .get('http://localhost:3000/colors')
      .then(function(response) {
        // console.log(response)
        self.colors = response.data
      })
      .catch(function(error) {
        console.error(error)
      })

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
      .get(`http://localhost:3000/variables`)
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

    // get all used colors
    let GET_CATEGORIES_LINK = `http://localhost:3000/categories/variable/${this.variableId}/top-level`
    axios.get(GET_CATEGORIES_LINK + '/true').then(function(response) {
      console.log('used colors', response.data)
      response.data.forEach((category) => {
        self.usedColors.push(category.color._id)
      })
    })
  },
  methods: {
    // update data to be passed to form
    selectColor(colorId) {
      let colorNote = this.$refs.colorNote

      // update form feedback to indicate if color is already used
      if (this.usedColors.includes(colorId)) {
        console.log('this color is already taken')
        colorNote.classList.remove('hidden')
        this.selectedColor = ''
      } else {
        this.selectedColor = colorId
        colorNote.classList.add('hidden')
      }
    },

    // display info tooltip
    showToolTip() {
      console.log('in tool tip')
      this.$refs.codeInfo.classList.toggle('hidden')
    },

    // display window
    toggleAddCategoryWindow() {
      this.$refs.addCategoryWindow.classList.toggle('hidden')
    },

    getColor(categoryColorId) {
      // if non-top level category, chose a default color
      if (categoryColorId == undefined) return '#707070'
      // else return color given color id
      else
        return this.$store.state.colors.filter((color) => {
          return color._id == categoryColorId
        })[0].color
    },

    selectCategory(varCategoryIndex) {
      this.currCategories[varCategoryIndex] = !this.currCategories[
        varCategoryIndex
      ]
      console.log(this.currCategories, ' updated')
    },

    // init array with length, of currently selected cateogries, to false
    resetCurrCategories() {
      this.currCategories = new Array(
        this.categories.filter((cat) => {
          return cat.variable == this.variable
        }).length
      ).fill(false)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
