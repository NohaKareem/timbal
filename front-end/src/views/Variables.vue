<template>
  <div id="app">
    {{variables}}
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Variables", 
    data() {
      return {
        variables: []
      }
    },
    created() {
      var self = this;

      // get all variables
      axios.get('http://localhost:3000/variables')
        .then(function(response) {
          // console.log(response)
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
