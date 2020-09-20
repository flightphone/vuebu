<template>
  <div style="height:100vh;maxheight:100vh;overflow:auto">
    <div v-bind:hidden="mode!='edit'" style="height:100vh;maxheight:100vh;overflow:auto">
      <v-app-bar app color="primary" dark max-width="100vw">
        <v-app-bar-nav-icon v-if="action!='setting'" @click="mainObj.drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>{{Descr()}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="save()">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn icon @click="closeEditor()">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-simple-table v-if="!load" dense>
          <template v-slot:default>
            <tbody v-if="(nupdate > 0) && uid != '-#-'">
              <tr v-for="(column, index) in findData.ReferEdit.Editors" :key="index">
                <td>
                  <v-text-field
                    v-if="column.joinRow==null"
                    :label="column.FieldCaption"
                    :key="column.FieldName"
                    v-model="findData.WorkRow[column.FieldName]"
                  ></v-text-field>
                  <template v-else>
                    <v-text-field
                      v-if="column.joinRow.classname == 'Bureau.Finder'"
                      :label="column.FieldCaption"
                      :key="column.FieldName"
                      v-model="findData.WorkRow[column.FieldName]"
                      append-icon="mdi-magnify"
                      @click:append="open(index)"
                    ></v-text-field>

                    <v-select
                      v-if="column.joinRow.classname == 'Bureau.GridCombo'"
                      :label="column.FieldCaption"
                      :items="column.joinRow.FindConrol.MainTab"
                      :item-value="column.joinRow.keyField"
                      :item-text="column.joinRow.FindConrol.DispField"
                      v-model="findData.WorkRow[column.joinRow.valField]"
                      @change="(event)=>sortChange(event, column)"
                    ></v-select>
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-main>
    </div>

    <template v-for="(column, index) in findData.ReferEdit.Editors">
      <template v-if="column.joinRow != null">
        <Finder
          v-if="column.joinRow.classname == 'Bureau.Finder'"
          :visible="mode=='finder_' + index.toString()"
          :params="column.joinRow.IdDeclare"
          :editid="index"
          :findData="column.joinRow.FindConrol"
          :key="index"
          :selectFinder="selectFinder"
          :clearFinder="clearFinder"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { mainObj } from "../main";
export default {
  name: "Editor",
  data: () => ({
    mode: "edit",
    mainObj: mainObj,
    nupdate: 1
  }),
  props: {
    save: Function,
    closeEditor: Function,
    action: String,
    findData: Object,
    uid: String
  },
  beforeCreate: function() {
    this.$options.components.Finder = require("./Finder.vue").default;
  },
  methods: {
    Descr: function() {
      if (this.action == "add") return "Новая запись";
      if (this.action == "edit") return "Редактирование";
      if (this.action == "setting") return "Параметры";
    },
    open: function(index) {
      this.mode = "finder_" + index.toString();
    },
    selectFinder: function(editid) {
      let column = this.findData.ReferEdit.Editors[editid];
      let c = this.findData.ReferEdit.Editors[editid].joinRow.FindConrol.curRow;
      let row = column.joinRow.FindConrol.MainTab[c];
      for (let s in column.joinRow.fields) {
        this.findData.WorkRow[column.joinRow.fields[s]] = row[s];
      }
      this.nupdate = this.nupdate + 1;
      this.mode = "edit";
    },
    sortChange: function(event, column) {
      column.joinRow.FindConrol.MainTab.map(row => {
        if (row[column.joinRow.keyField] == event) {
          for (let s in column.joinRow.fields) {
            this.findData.WorkRow[column.joinRow.fields[s]] = row[s];
          }
        }
      });
      this.nupdate = this.nupdate + 1;
    },
    clearFinder: function() {
      this.mode = "edit";
    }
  }
};
</script>