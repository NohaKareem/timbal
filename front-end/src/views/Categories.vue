<template>
  <div id="categoryCon">
    <!-- {{categories}} -->
    <br>
    <br>
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
    }
  }
</script>

<style lang="scss">

</style>
