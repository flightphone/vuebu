<template>
  <v-app>

    <a target="_blanck" hidden ref="openFileLink"></a>

    <v-dialog v-model="mainObj.openAlert" persistent>
      <v-card>
        <v-card-title>{{mainObj.alertTitle}}</v-card-title>
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

    <!--<v-navigation-drawer v-model="mainObj.drawer" app width="auto" left>-->
	<v-navigation-drawer color="primary" dark v-model="mainObj.drawer" app width="280" left>
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
import Uxrep from "./components/Uxrep.vue";
import Tarifs from "./components/Tarifs.vue";
import Declare from "./components/Declare";
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
      if (mainObj.curhistory < mainObj.history.length - 1) {
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
        let lnk = item.attributes.link1;
        if (lnk) {
          if (lnk.substring(0, 1) == "/") {
              lnk = baseUrl + lnk;
              this.$refs.openFileLink.href = lnk;
              this.$refs.openFileLink.click();
              mainObj.drawer = false;
              return;
          }
        }
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
      //mainObj.curhistory = mainObj.curhistory + 1;
      //mainObj.history.splice(mainObj.curhistory, mainObj.history.length, id);
      //25.05.2022 история по якорям
      window.location.hash = id;
    },
    getForm: function(item) {
      let p = item.attributes;
      let control = p.params ? Finder : Comp1;
      let params = p.params;
      let SQLParams = null;
      if (p.link1 == "RegulationPrint.Dgs.DogovorList") control = Dogovors;
      if (p.link1 == "RegulationPrint.ParamReports.ParReports") control = Uxrep;
      if (params == "1550") control = Uxrep;
      if (params == "1451") control = Uxrep;
      if (p.link1 == "tariffs") control = Tarifs;
      if (p.link1 == "Declare") control = Declare;
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
    
    //стартовый якорь 25.05.2022
    let hi = window.location.hash.replace('#', '');
    if (hi == "839")
     {
      openMap.set(hi,
      {
        Control: Dogovors,
        Params: "1445",
        SQLParams: null,
        data: {}
      });
      openIDs.push(hi);
      mainObj.current = hi;
     }

     if (hi == "81")
     {
      openMap.set(hi,
      {
        Control: Tarifs,
        Params: "133",
        SQLParams: null,
        data: {}
      });
      openIDs.push(hi);
      mainObj.current = hi;
     }
  }
};
</script>