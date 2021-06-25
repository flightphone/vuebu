<template>
  <Finder :id="id" :visible="visible" :params="params" ref="dogFind">
    <template>
      <a hidden ref="fileLink"></a>
      <input type="file" ref="fileElem" style="display:none" accept=".csv" @change="handleFiles();" />
      <v-btn icon @click="upfile()">
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <v-btn icon @click="openfile()">
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn icon @click="confirmRun()">
        <v-icon>mdi-database-plus</v-icon>
      </v-btn>
    </template>
  </Finder>
</template>
<script>
import { mainObj, openMap, baseUrl } from "../main";
import Finder from "./Finder";
export default {
  name: "Tarifs",
  data: () => ({}),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: String,
    params: String
  },
  components: { Finder },
  methods: {
    handleFiles: function() {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let nn = openMap.get(this.id).data.MainTab[c]["nn"].toString();
      let lnk = baseUrl + "FileLoad/tffile";

      let files = this.$refs.fileElem.files;
      if (!files.length) return;

      let f = new FormData();
      f.append("nn", nn);
      f.append("tfile", files[0]);

      fetch(lnk, {
        method: "POST",
        body: f
      })
        .then(function(result) {
          return result.text();
        })
        .then(function(msg) {
          mainObj.alert("Загрузка файла", msg);
        });

      this.$refs.fileElem.value = "";
    },

    confirmRun: function() {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let nn = openMap.get(this.id).data.MainTab[c]["nn"].toString();
      mainObj.confirm(
        "Внимание! Данная операция переносит тарифы в uSmart",
        "Перенести тарифы по строке '" + nn.toString() + "' в uSmart?",
        this.runsql
      );
    },
    runsql: function() {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let nn = openMap.get(this.id).data.MainTab[c]["nn"].toString();
      let lnk = baseUrl + "FileLoad/tariffs?nn=" + nn + "&mode=run";

      fetch(lnk, {
        method: "POST"
      })
        .then(function(result) {
          return result.text();
        })
        .then(function(msg) {
          mainObj.alert("Перенос тарифов в uSmart", msg);
        });


    },
    upfile: function() {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;

      this.$refs.fileElem.click();
    },
    openfile: function() {
      let c = openMap.get(this.id).data.curRow;
      this.$refs.fileLink.href = this.fileUrl(c);
      this.$refs.fileLink.click();
    },
    fileUrl: function(c) {
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let agr_key = openMap.get(this.id).data.MainTab[c]["nn"].toString();
      let res = baseUrl + "FileLoad/tariffs?nn=" + agr_key;
      return res;
    }
  }
};
</script>