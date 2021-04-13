<template>
  <div class="addSystemCategoryCon" ref="viewSystemCategoryWindow">
    <div class="deleteWindow">
      <p class="cancelButton" @click="toggleViewCategoryWindow()">X</p>
      <h3>Category: {{ systemCategoryData.name }}</h3>
      <p>{{ systemCategoryData.description }}</p>
      <div class="categoryListItemEditable" v-if="varVals">
        <div v-for="v in varVals" :key="v._id">
          <div
            class="categoryListItem"
            :style="'background-color:' + getColor(v.color)"
          >
            {{ v.code }}:{{ v.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ViewSystemCategoryWindow',
  data() {
    return {
      systemCategoryData: '',
      varVals: { type: Array }
    }
  },
  props: {
    systemCategoryId: { type: String }
  },
  created() {
    let self = this
    // get all colors
    axios
      .get('http://localhost:3000/colors')
      .then(function(response) {
        self.colors = response.data
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

    // get system category info
    console.log('systemCategoryId', this.systemCategoryId)
    axios
      .get(`http://localhost:3000/systemCategories/${this.systemCategoryId}`)
      .then(function(response) {
        console.log('got results')
        console.log(response.data)
        console.log(response.data.values)
        self.systemCategoryData = response.data
        self.varVals = response.data.values
      })
  },
  methods: {
    // display window
    toggleViewCategoryWindow() {
      this.$refs.viewSystemCategoryWindow.classList.toggle('hidden')
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
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
