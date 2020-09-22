<template>
  <v-app>
    <v-dialog v-model="mainObj.openAlert" persistent>
      <v-card>
        <v-card-title class="headline">{{mainObj.alertTitle}}</v-card-title>
        <v-card-text>{{mainObj.alertText}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="handleClose()">ОК</v-btn>
          <v-btn
            v-if="mainObj.alertConfirm"
            color="green darken-1"
            text
            @click="mainObj.openAlert = false"
          >Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="mainObj.drawer" absolute temporary width="auto" left>
      <v-app-bar app>
        <v-btn icon @click="back()" :disabled="!(mainObj.curhistory > 0)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon @click="next()" :disabled="!(mainObj.curhistory < mainObj.history.length-1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="exit()">
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <p v-if="loading">Загрузка...</p>
        <v-treeview
          v-else
          :items="treejson"
          :hoverable="hoverable"
          :open-on-click="openOnClick"
          dense
        >
          <template slot="label" slot-scope="{ item }">
            <div @click="handleselect(item)">{{ item.text }}</div>
          </template>
        </v-treeview>
      </v-main>
    </v-navigation-drawer>

    <template v-for="item in openIDs">
      <uni-comp v-bind:id="item" v-bind:key="item"></uni-comp>
    </template>
  </v-app>
</template>
  

<script>
import { mainObj, openIDs, prodaction, baseUrl, openMap } from "./main";
import Comp1 from "./components/Comp1.vue";
import Finder from "./components/Finder.vue";
import Dogovors from "./components/Dogovors.vue";

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
    back: function() {
      //mainObj.alert("test", mainObj.curhistory);
      if (mainObj.curhistory > 0) {
        mainObj.curhistory = mainObj.curhistory - 1;
        mainObj.drawer = false;
        mainObj.current = mainObj.history[mainObj.curhistory];
      }
    },
    next: function() {
      if (mainObj.curhistory < mainObj.history.length-1) {
        mainObj.curhistory = mainObj.curhistory + 1;
        mainObj.drawer = false;
        mainObj.current = mainObj.history[mainObj.curhistory];

      }
    },
    exit: function() {
      window.location = baseUrl + "Home/logout";
    },
    handleselect: function(item) {
      if (!item.children) {
        //alert(item.attributes.link1);
        this.open(item);
        mainObj.drawer = false;
      }
    },
    handleClose: function() {
      mainObj.openAlert = false;
      if (mainObj.alertConfirm) mainObj.confirmAction();
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
      mainObj.curhistory = mainObj.curhistory + 1;
      mainObj.history.splice(mainObj.curhistory, mainObj.history.length, id);

    },
    getForm: function(item) {
      let p = item.attributes;
      let control = p.params ? Finder : Comp1;
      let params = p.params;
      let SQLParams = null;

      if (p.link1 == "RegulationPrint.Dgs.DogovorList") control = Dogovors;

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
