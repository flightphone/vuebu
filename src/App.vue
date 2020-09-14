<template>
  <v-app>
    <v-navigation-drawer v-model="mainObj.drawer" absolute temporary width="auto">
      <p v-if="loading">Загрузка...</p>
      <v-treeview
        v-else
        :items="treejson"
        :hoverable="hoverable"
        :open-on-click="openOnClick"
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
import { mainObj, openIDs, prodaction, baseUrl, openMap } from "./main";
import Comp1 from './components/Comp1.vue';
import Finder from './components/Finder.vue';

export default {
  name: "App",
  data: function() {
    return {
      openIDs: openIDs,
      mainObj: mainObj,
      loading: true,
      treejson: [],
      hoverable: false,
      openOnClick: true
      
    };
  },
  methods: {
    handleselect: function(item) {
      if (!item.children) {
        //alert(item.attributes.link1);
        this.open(item);
        mainObj.drawer = false;
      }
    },
    open: function(item) {
      let id = item.id;
      if (openMap.get(id) == null) {
        let c = this.getForm(item);
        let obj = {
          Control: c.Conrol,
          Params: c.Params,
          SQLParams: c.SQLParams,
          data: {}
        };
        openMap.set(id, obj);
        openIDs.push(id);
      }
      //Setcurrent(id);
      mainObj.current = id;
    },
    getForm: function(item) {
      let p = item.attributes;
      let control = p.params ? Finder : Comp1;
      let params = p.params;
      let SQLParams = null; 
      if (p.link1 == "RegulationPrint.repSDM") {
        SQLParams = {
          "@DateStart": "2000-01-01",
          "@DateFinish": "2099-01-01"
        };
      }

      if (p.link1 == "RegulationPrint.ServiceReport") {
        SQLParams = {
          "@DateStart": "2000-01-01",
          "@DateFinish": "2099-01-01",
          "@AL_UTG": "<Все>"
        };
      }

      return {
        Conrol: control,
        Params: params,
        SQLParams: SQLParams
      };
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
    this.treejson = data;
    this.loading = false;
  }
};
</script>
