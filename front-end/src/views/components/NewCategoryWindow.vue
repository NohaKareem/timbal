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
                      <input type="text" name="code" ref="catCode" id="categoryCode" placeholder="code">
                      <button class="smallInfoButton" type="button" @click="showToolTip()">i</button>
                  </div>
                  <input type="text" name="description" ref="catDescription" id="categoryName" placeholder="descriptive name">
                  <!-- pass variable -->
                  <input type="text" name="variable"  ref="catVariable" :value="variableId" id="variableName" placeholder="code" class="hidden">
                  <input type="text" name="color"  ref="catColor" :value="selectedColor" id="colorId" class="hidden">
              </div>
              <p class="codeInfo hidden" ref="codeInfo">initial(s) to represent the category</p>
              <!-- display category color palette -->
              <h3>category color</h3>
              <div class="colorGridCon">
                <div class="colorGrid">
                  <div class="colorSwatch" v-for="color in colors" :key="color._id" :style="`background-color: ${color.color}`" @click="selectColor(color._id)">
                    <p v-if="color._id === selectedColor">&#10004;</p>
                  </div>
                </div>
              </div>
              <!-- <div class="colorGridCon">
                <div class="colorGrid overlaySwatches">
                  <div v-for="color in colors" :key="color._id" :class="selectedColor !== color._id ? 'hidden' : 'colorSwatch overlay'"></div>
                </div>
              </div> -->
              <div class="addCategoryButton">
                  <input type="submit" value="add category">
                  <!-- <button type="button" @click="uploadColor()">add category</button> -->
              </div>
              </div>
          </form>
      </div> 
    </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "ShowNewCategoryWindow", 
    data() {
      return {
        colors: [], 
        selectedColor: ""        
      }
    },
    computed: {
      variableId() {
        return this.$store.state.variable;
      }
    },
    created() {
      let self = this;
      // get all colors
      axios.get('http://localhost:3000/colors')
      .then(function(response) { 
        // console.log(response)
        self.colors = response.data;
      }).catch(function(error) { console.error(error); });
    },
    methods: { 
      // update data to be passed to form 
      selectColor(colorId) {
        this.selectedColor = colorId;
      },
      
      // uploadColor() {
      //   // get day id if exists
      //   // let self = this;
      //   let colorDoc = {
      //     variable: this.variableId, 
      //     code: this.$refs.catCode.value, 
      //     description: this.$refs.catDescription.value, 
      //     color: this.selectedColor
      //   };
      //   console.log(colorDoc)
      //   axios.post(`http://localhost:3000/color`, colorDoc)
      //     .then(function(response) { 
      //       console.log('added color', response.data)
      //     }).catch(function(error) { console.error(error); });
      // },

      // display info tooltip
      showToolTip() {
        console.log('in tool tip')
          this.$refs.codeInfo.classList.toggle('hidden');
      }, 

       // display window 
      toggleAddCategoryWindow() {
        this.$refs.addCategoryWindow.classList.toggle('hidden');
      },
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
</style>
