<template>
  <v-app>
    <v-navigation-drawer
      v-model="mainObj.drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  
    <Comp1 />
  </v-app>
</template>

<script>
import Comp1 from "./components/Comp1";
import {mainObj} from "./main"

export default {
  name: "App",

  components: {
    Comp1
  },

  data: () => ({
    mainObj: mainObj
  })
};
</script>
