<template>
    <div class="categoryListCon">
        <div class="categoryListItem" v-for="category in categoriesList" :key="category._id"
            :style="'background-color:'+ category.color.color"
            @click="addCategoryToLog(category._id, category.is_top_level)">
            {{ category.code }}: {{ category.description }}
        </div>
        <div class="verticalLine"></div>
    </div>
</template>

<script>
//   import axios from "axios";
  export default {
    name: "CategoryItemsList", 
    props: ["categoriesList"],
    data() {
      return {
      }
    },
    // computed: {
    //   variableId() {
    //     return this.$store.state.variable;
    //   }
    // },
  
created() {
    // var self = this;
    // let GET_CATEGORIES_LINK = `http://localhost:3000/categories/variable/${this.variableId}/top-level`;

    // // get all top level categories
    // axios.get(GET_CATEGORIES_LINK + '/true')
    //  .then(function(response) {
    //     self.topLevelCategories = response.data;
    //     }).catch(function(error) { console.error(error); });

    // // get all non-top level categories
    // axios.get(GET_CATEGORIES_LINK + '/false')
    //  .then(function(response) {
    //     self.nonTopLevelCategories = response.data;
    //     }).catch(function(error) { console.error(error); });
    
    },
    methods: {
        // update vuex logInput state with selected categories (push to logInput array)
        addCategoryToLog(categoryId, isTopLevel) {
            let currLogsList =  this.$store.state.logInput;
            
            // reset logInput in vuex if category is top level (ie. new log entry, not a nested hierarchy to an existing one)
            if (isTopLevel) currLogsList = [];
            currLogsList.push(categoryId);
            this.$store.commit('logInput', currLogsList);

            // emit event to parent, to render a new instance of this component
            this.$emit("addedLogCategoryItem");
        }
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  
</style>
