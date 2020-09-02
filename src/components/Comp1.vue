<template>
    <div>
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click="mainObj.drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>Карточки рейсов</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
          <span class="mr-2">Latest Release</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <h1>ыыыы</h1>
      </v-main>
    </div>
</template>
<script>
import {mainObj} from "../main"
export default {
    name: "Comp1",
    data: () => ({
    mainObj: mainObj
  })
}
</script>