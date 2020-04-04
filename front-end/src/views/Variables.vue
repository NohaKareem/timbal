<template>
  <div id="app">
    {{variables}}
    <TimeLogGrid/> 
  </div>
</template>

<script>
  import axios from "axios";
  import TimeLogGrid from "@/components/timeLogGrid.vue";

  export default {
    name: "Variables", 
    components: {
     TimeLogGrid
    },
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
