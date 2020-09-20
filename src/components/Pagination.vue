<template>
  <v-app-bar app color="primary" dark max-width="100vw">
    <span hidden>{{$parent.action}}</span>
    {{page() * rowsPerPage + 1}} - {{Math.min((page() + 1) * rowsPerPage, count())}} из {{count()}}
    <v-spacer></v-spacer>
    <v-btn icon @click="$parent.onChangePage(0)" :disabled="page() === 0">
      <v-icon>mdi-page-first</v-icon>
    </v-btn>
    <v-btn icon @click="$parent.onChangePage(page()-1)" :disabled="page() === 0">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    {{page() + 1}} из {{Math.max(0, Math.ceil(count() / rowsPerPage) - 1) + 1}}
    <v-btn
      icon
      @click="$parent.onChangePage(page()+1)"
      :disabled="page() >= Math.ceil(count() / rowsPerPage) - 1"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
    <v-btn
      icon
      @click="$parent.onChangePage(Math.max(0, Math.ceil(count() / rowsPerPage) - 1))"
      :disabled="page() >= Math.ceil(count() / rowsPerPage) - 1"
    >
      <v-icon>mdi-page-last</v-icon>
    </v-btn>

    <v-btn icon @click="$parent.stateDrawer = false">
      <v-icon>mdi-window-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
//import { openMap } from "../main";

export default {
  name: "Pagination",
  data: () => ({
    //openMap: openMap,
    rowsPerPage: 30
  }),
  props: {
    //id: String,
    //editid: Number
    findData:Object
  },
  methods: {
    OpenMapData: function() {
      /*
      if (this.editid == null) return openMap.get(this.id).data;
      else
        return openMap.get(this.id).data.ReferEdit.Editors[this.editid].joinRow
          .FindConrol;
      */
       return this.findData;    
    },
    count: function() {
      if (this.OpenMapData().TotalTab)
        return this.OpenMapData().TotalTab[0].n_total;
      else return 0;
    },
    page: function() {
      if (this.OpenMapData().page) return this.OpenMapData().page - 1;
      else return 0;
    }
  }
};
</script>