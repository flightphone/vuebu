<template>
  <v-app>
    <v-navigation-drawer v-model="mainObj.drawer" 
    absolute
    temporary
    >
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item @click="mainObj.current='-1';mainObj.drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item @click="mainObj.current='-2';mainObj.drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <template v-for="item in openIDs">
      <uni-comp v-bind:id="item" v-bind:key="item"></uni-comp>
    </template>
  </v-app>
</template>

<script>
import { mainObj, openIDs } from "./main";

export default {
  name: "App",
  data: function() {
    return {
      openIDs: openIDs,
      mainObj: mainObj
    };
  },
  mounted: function() {
    let elHtml = document.getElementsByTagName('html')[0]
    elHtml.style.overflowY = 'hidden'
  }
};
</script>
