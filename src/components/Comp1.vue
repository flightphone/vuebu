<template>
    <div   v-bind:hidden="!visible">
      <v-app-bar app >
        <v-app-bar-nav-icon @click="mainObj.drawer = !mainObj.drawer"></v-app-bar-nav-icon>
        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
      </v-main>
    </div>
</template>
<script>
import {mainObj} from "../main"
export default {
    name: "Comp1",
    data: () => ({
    mainObj: mainObj
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
}
</script>