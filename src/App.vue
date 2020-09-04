<template>
  <v-app>
    <v-navigation-drawer v-model="mainObj.drawer" absolute temporary width="auto">
      <p v-if="loading">Загрузка...</p>
      <v-treeview v-else 
      :items="treejson" 
      :hoverable="hoverable"
      :open-on-click="openOnClick"
      :selected-color="selectedColor"
      :color="color"
      :shaped="shaped"
      :rounded="rounded"
      >
      <template slot="label" slot-scope="{ item }">
          <div @click="handleselect(item)">{{ item.text }}</div>
      </template>
      </v-treeview>
    </v-navigation-drawer>

    <template v-for="item in openIDs">
      <uni-comp v-bind:id="item" v-bind:key="item"></uni-comp>
    </template>
  </v-app>
</template>
  

<script>
import { mainObj, openIDs, prodaction, baseUrl, menuMap } from "./main";

export default {
  name: "App",
  data: function() {
    return {
      openIDs: openIDs,
      mainObj: mainObj,
      loading: true,
      treejson: [],
      
      dense: false,
      selectable: false,
      activatable: true,
      hoverable: false,
      openOnClick: true,
      shaped: false,
      rounded: false,
      color: 'primary',
      selectedColor: 'accent',
      selectedColors: [
        'accent',
        'teal',
        'red',
        'success',
        'warning lighten-2',
      ],
      multipleactive: false
      
    };
  },
  methods: {
    handleselect: function (item) {
      if (!item.children)
      {
        //alert(item.attributes.link1);
        this.save(item);
        mainObj.drawer = false;
      }
    },
    save: function(item)
    {
      alert(item.attributes.link1)
    }

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
    //createMenuMap(data);
    this.treejson = data;
    this.loading = false;
    
    
  }
};
</script>
