<template>
  <v-app>
    <v-navigation-drawer v-model="mainObj.drawer" absolute temporary width="auto">
      <p v-if="loading">Загрузка...</p>
      <v-treeview v-else :items="treeJson"></v-treeview>
    </v-navigation-drawer>

    <template v-for="item in openIDs">
      <uni-comp v-bind:id="item" v-bind:key="item"></uni-comp>
    </template>
  </v-app>
</template>
  

<script>
import { mainObj, openIDs, prodaction, baseUrl, createMenuMap, menuMap } from "./main";

export default {
  name: "App",
  data: function() {
    return {
      openIDs: openIDs,
      mainObj: mainObj,
      loading: true,
      treeJson: []
    };
  },
  mounted: async function() {
    let elHtml = document.getElementsByTagName("html")[0];
    elHtml.style.overflowY = "hidden";

    const url = baseUrl + "ustore/gettree";
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: prodaction ? "no-cors" : "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: prodaction ? "include" : "omit" // include, *same-origin, omit
    });

    let data = await response.json();
    menuMap.clear();
    createMenuMap(data);
    this.treeJson = data;
    this.loading = false;
    
    
  }
};
</script>
