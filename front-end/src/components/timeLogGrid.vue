<template>
  <div>
    <!-- TODO feed with data -->
    <button class="dropDown">tasks ></button>
    <button class="circle">+</button>
    <div class="timeLogGrid">
      <h2 class="hidden">Time Log Grid Timeline</h2>
      <div class="logTimelineHeading">1</div>
      <div class="logTimelineHeading">2</div>
      <div class="logTimelineHeading">3</div>
      <div class="logTimelineHeading">4</div>
      <div class="logTimelineHeading">5</div>
    </div>
    <div class="timeLogGrid">
      <!-- {{variables}} -->
      <h2 class="hidden">Time Log Grid</h2>
      <div class="logEntry">1</div>
      <div class="logEntry">2</div>
      <div class="logEntry">3</div>
      <div class="logEntry">4</div>
      <div class="logEntry">5</div>

      <!-- TODO repeat for all non-filled cells, separate component -->
      <input type="text" placeholder="_" class="logEntryInput" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Variables',
  data() {
    return {
      variables: []
    }
  },
  created() {
    var self = this

    // get all variables
    axios
      .get('http://localhost:3000/variables')
      .then(function(response) {
        // console.log(response)
        self.variables = response.data
      })
      .catch(function(error) {
        console.error(error)
      })
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
.timeLogGrid {
  display: flex;
  flex-direction: row;
}

.logTimelineHeading {
  display: flex;
  justify-content: center;
  align-items: center;

  width: $logEntryWidth;
  margin-right: $baseMargin;
  margin-bottom: $baseMargin;
}

.logEntry,
.logEntryInput {
  border-radius: 50%;
  margin-right: $baseMargin;

  width: $logEntryWidth;
  height: $logEntryWidth;

  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: white;

  @include softUiShadow();

  background-color: $category_1;
}

.logEntry:hover {
  @include softUiInsetShadow();
}

.logEntryInput {
  background-color: $grayWhite;

  color: $timbalBlack;
  border: none;
  padding: 0;
  @include softUiInsetShadow();
}

button {
  margin-top: $baseMargin * 2;
  margin-bottom: $baseMargin * 3;
}

@media screen and (min-width: $desktopWidth) {
  .logTimelineHeading {
    width: 5vw;
  }

  .logEntry {
    border-radius: 50%;
    width: $mobileLogEntryWidth;
    height: $mobileLogEntryWidth;
  }

  .logEntryInput {
    width: 5.5vw;
    height: 5.5vw;
  }
}
</style>
