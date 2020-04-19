<template>
    <div class="categoryListCon">
        category list con
        <!-- add category color if top level category, otherwise add current top level category color -->
        <div class="categoryListItem" v-for="category in categoriesList" :key="category._id"
            :style="category.color !== undefined ? 'background-color:'+ category.color.color : 'background-color:'+ green"
            @click="addCategoryToLog(category._id, category.is_top_level, category.code, category.color != undefined ? category.color.color : currColor)">
            {{ category.code }}: {{ category.description }} 
        </div>
        <button class="circle" type="button" @click="launchNewCategoryWindow()">+</button>
        <newCategoryWindow v-if="showNewCategoryWindow" />
        <div class="verticalLine"></div>
    </div>
</template>

<script>
  import NewCategoryWindow from './NewCategoryWindow.vue';
  export default {
    name: "CategoryItemsList", 
    components: { 'newCategoryWindow': NewCategoryWindow },
    props: ["categoriesList"],
    data() {
      return {
          showNewCategoryWindow: false
      }
    },
    computed: {
      currColor() {
        return this.$store.state.currColor;
      }, 
      currLogsList() {
        return this.$store.state.logInput;
      }, 
      currLogsStr() {
        return this.$store.state.logStr;
      }
    },
    mounted() {
        console.log('props from component')
        console.log(this.categoriesList)    
    },
    methods: {
      launchNewCategoryWindow() {
        this.showNewCategoryWindow = true;
        console.log('launch new window')
      },
      // update vuex logInput state with selected categories (push to logInput array, concatenate log string delineated with '.')
      addCategoryToLog(categoryId, isTopLevel, categoryStr, catColor) {
          let currLogsList =  this.currLogsList;
          let currLogStr =  this.currLogStr;
          
          // reset logInput and LogStr in vuex if category is top level (ie. new log entry, not a nested hierarchy to an existing one)
          if (isTopLevel) {
              currLogsList = [];
              currLogStr = "";

              // update current top level color, to use with subcategories
              this.$store.commit.currColor = catColor;
          }
          currLogsList.push(categoryId);
          currLogStr += (isTopLevel ? "" :  ".") + categoryStr;
          this.$store.commit('logInput', currLogsList);
          this.$store.commit('logStr', currLogStr);

          // emit event to parent, to render a new instance of this component
          this.$emit("addedLogCategoryItem");
      }
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
  
</style>
