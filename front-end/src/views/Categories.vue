<template>
  <div id="app">
    {{categories}}
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Categories", 
    data() {
      return {
        categories: []
      }
    },
    created() {
      var self = this;

      // get all categories
      axios.get('http://localhost:3000/categories')
        .then(function(response) {
          // console.log(response)
          self.categories = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }
</script>

<style lang="scss">

</style>
