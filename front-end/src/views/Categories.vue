<template>
  <div id="categoryCon">
    <h1>Categories Library</h1>
    <div v-for="variable in variables" :key="variable._id">
      <h2>{{ variable.name }} Categories</h2>
      <br>
      <!-- {{categories.filter(cat => {return cat.variable == variable._id })[0]}} -->
      <div class="categoryListItemEditable">
        <div class="categoryListItem" 
              :style="'background-color:' + getColor(category.color)"
              v-for="category in categories.filter(cat => {return cat.variable == variable._id })" 
              :key="category._id">
              {{ category.code }}: {{ category.description }}
            </div>
        </div>
    </div>
   
    <br>
    <!-- {{variables}} -->
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Categories", 
    data() {
      return {
        categories: [], 
        variables: []
      }
    },
    methods: {
      getColor(categoryColorId) {
        // if non-top level category, chose a default color
        if (categoryColorId == undefined ) return "#707070";

        // else return color given color id
        else return this.$store.state.colors.filter((color) => {
              return color._id == categoryColorId;
        })[0].color;
      }
    },
    created() {
      var self = this;

      // get all categories
      axios.get('http://localhost:3000/categories')
        .then(function(response) {
          self.categories = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });

      // get all variables
      axios.get('http://localhost:3000/variables')
        .then(function(response) {
          self.variables = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });

      // get all colors
      axios.get('http://localhost:3000/colors')
      .then(function(response) { 
        self.$store.commit('colors', response.data);
      }).catch(function(error) { console.error(error); });

    }
  }
</script>

<style lang="scss" scoped>
h2 {
  font-weight: normal;
}
</style>
