<template>
  <div id="app">
    <template v-for="item in openIDs">
      <uni-comp v-bind:id="item" v-bind:key="item"></uni-comp>
    </template>  
  </div>
</template>

<script>
import {openIDs} from "./main";

export default {
  name: 'App',
  data: function() {
    return {
      openIDs : openIDs
      };
  }
 
}
</script>