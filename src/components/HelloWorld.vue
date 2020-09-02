<template>
<span>
  <p>Ни хрена не понимаю!</p>
  <p>{{mainObj.message}}</p>
</span>
</template>
<script>

import {mainObj} from "../main";

export default {
  name: 'HelloWorld',
  data: function() {
    return {
      mainObj : mainObj
      };
  }
  /*,
  props: {
    id:String
  }, 
  methods: {
    greet: function () {
     mainObj.message = "ыыыыыыыыыыыыы";
    }
  }
  */
}
</script>
