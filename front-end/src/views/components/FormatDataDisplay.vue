<template>
    <div class="formatDataDisplayCon" ref="formatDataDisplayCon">
      <categoryItemsList :categoriesList="topLevelCategories" v-on:addedLogCategoryItem="addNewCateogryList()" />
      <!-- <categoryItemsList v-if="showNonTopLevelCategories" :categoriesList="nonTopLevelCategories" /> -->
      <categoryItemsList
          v-for="n in subCategoryMenus"
          :key="`subcategoryList_${n}`"
          :categoriesList="nonTopLevelCategories"
          v-on:addedLogCategoryItem="addNewCateogryList()"
      />
    </div>
</template>

<script>
  import axios from "axios";
  // import Vue from 'vue';
  import CategoryItemsList from "./CategoryItemsList.vue";
  export default {
    name: "FormatDataDisplay", 
    components: { 'categoryItemsList': CategoryItemsList },
    data() {
      return {
          topLevelCategories: [],
          nonTopLevelCategories: [], 
          atTopLevel: true, // true if current category level is top level
          subCategoryMenus: 0
      }
    },
    computed: {
      variableId() {
        return this.$store.state.variable;
      }
    },
    created() {
      var self = this;
      let GET_CATEGORIES_LINK = `http://localhost:3000/categories/variable/${this.variableId}/top-level`;

      // get all top level categories
      axios.get(GET_CATEGORIES_LINK + '/true')
      .then(function(response) {
          self.topLevelCategories = response.data;
          }).catch(function(error) { console.error(error); });

      // get all non-top level categories
      axios.get(GET_CATEGORIES_LINK + '/false')
      .then(function(response) {
          self.nonTopLevelCategories = response.data;
          }).catch(function(error) { console.error(error); });
      },
      methods: {
        // addCategoryToLog(categoryId) {
        //     let currLogsList =  this.$store.state.logInput;
        //     currLogsList.push(categoryId);
        //     this.$store.commit('logInput', currLogsList);
        // }, 

      // increment number of subcategory menus to be displayed
      addNewCateogryList() {
        this.subCategoryMenus++;
      }
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  
</style>
