<template>
    <div class="addCategoryCon">
      <div class="addCategory" ref="addCategoryWindow">
          <p class="cancelButton" @click="toggleAddCategoryWindow()">X</p>
          <form action="http://localhost:3000/category" method="POST">
              <h2>Add new category</h2>
              <hr class="categoryHr">
              <div class="newCategoryForm">
              <div class="newCategoryTextInput">
                  <div class="codeInput">
                      <input type="text" name="code" id="categoryCode" placeholder="code">
                      <button class="smallInfoButton" value="s" @click="showToolTip()">i</button>
                  </div>
                  <input type="text" name="description" id="categoryName" placeholder="descriptive name" value="sleep">
              </div>
              <p class="codeInfo hidden" ref="codeInfo">initial(s) to represent the category</p>
              <h3>category color</h3>
              <div class="colorGridCon">
                  <div class="colorGrid">
                  <!-- ~add existing category colors -->
                  <!-- ~TODO change post to axios post, add color to post -->
                  <!-- ~TODO add selected colors to v-for -->
                  <div class="colorSwatch" v-for="color in colors" :key="color._id" :style="`background-color: ${color.color}`"></div>
                  </div>
              </div>
              <div class="addCategoryButton">
                  <input type="submit" value="add category">
              </div>
              </div>
          </form>
      </div> 
    </div>
</template>

<script>
  export default {
    name: "ShowNewCategoryWindow", 
    data() {
      return {
      }
    },
    computed: {
  
    },
  
    methods: {
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
</style>
