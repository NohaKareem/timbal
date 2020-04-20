<template>
    <div class="formatDataDisplayCon" ref="formatDataDisplayCon">
      <categoryItemsList :categoriesList="topLevelCategories" v-on:addedLogCategoryItem="addNewCateogryList()" />
      <!-- <categoryItemsList v-if="showNonTopLevelCategories" :categoriesList="nonTopLevelCategories" /> -->
      <categoryItemsList
          v-for="n in amountOfSecondaryLevels"
          :key="`secondary-list-${n}`"
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
          amountOfSecondaryLevels: 0
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

        // render a new category list for every time an element is selected form the previous list.
        // this builds a GUI for nested hierarchy of categories for a log entry
        // dynamically isntantiating vue components ref https://css-tricks.com/creating-vue-js-component-instances-programmatically/
       addNewCateogryList() {
          // this.showNonTopLevelCategories = true;
          this.amountOfSecondaryLevels++;

          // console.log('addNewCateogryList from item list caller');
                  
          // // set a constructor for dynamically instantiating CategoryItemsList elements 
          // var CategoryItemsListClass = Vue.extend(CategoryItemsList);
          // var categoryItemsListInstance = new CategoryItemsListClass({
            
          //   // pass categoriesList prop
          //   propsData: { "categoriesList": this.nonTopLevelCategories } //~
          //   // propsData: { categoriesList: this.nonTopLevelCategories } //~
          // });
          // console.log('new instance')
          // console.log(categoryItemsListInstance)
          // console.log('props =>', categoryItemsListInstance._props)
          
          // categoryItemsListInstance.$mount();
          
          // // append to DOM
          // this.$refs.formatDataDisplayCon.appendChild(categoryItemsListInstance.$el);
        
        }
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  
</style>
