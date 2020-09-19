<template>
  <div style="height:100vh;maxheight:100vh;overflow:auto">
    <div v-bind:hidden="mode!='edit'" style="height:100vh;maxheight:100vh;overflow:auto">
      <v-app-bar app color="primary" dark>
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
            <tbody :key="uid">
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
    mainObj: mainObj
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
      //mainObj.alert(this.mode);
    }
  }
};
</script>