<template>
  <div class="addCategoryCon">
    <div class="addCategory" ref="addCategoryWindow">
      <p class="cancelButton" @click="toggleAddCategoryWindow()">X</p>
      <form action="http://localhost:3000/category" method="POST">
        <h2>Add new category</h2>
        <hr class="categoryHr" />
        <div class="newCategoryForm">
          <div class="newCategoryTextInput">
            <div class="codeInput">
              <input
                type="text"
                name="code"
                ref="catCode"
                value="m"
                id="categoryCode"
                placeholder="code"
              />
              <button
                class="smallInfoButton"
                type="button"
                @click="showToolTip()"
                >i</button
              >
            </div>
            <input
              type="text"
              name="description"
              value="make"
              ref="catDescription"
              id="categoryName"
              placeholder="descriptive name"
            />

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
          <p class="hidden codeInfo" ref="codeInfo"
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
          <p class="hidden codeInfo" ref="colorNote"
            >this color's already taken! try another one</p
          >
          <p class="hidden codeInfo" ref="formNote"
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
      formIncomplete: true,
      is_top_level: true 
    }
  },
  computed: {
    variableId() {
      return this.$store.state.variable
    }
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

    // showFormCompletionNote() {
    //     this.$refs.formNote.classList.toggle('hidden');
    // },

    // display window
    toggleAddCategoryWindow() {
      this.$refs.addCategoryWindow.classList.toggle('hidden')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
