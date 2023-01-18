<template>
<v-fragment>
     <v-dialog v-model="openEditor" persistent>
      <v-card>
      <v-card-title>Редактор колонок</v-card-title>
      <div style="height:60vh;maxheight:60vh;overflow:auto">
        <v-simple-table dense light>
          <template v-slot:default>
            <tbody>
              <tr v-for="(column, index) in columns" :key="index" style="background-color:white;" >
                <td style="border-bottom: none;width: 15px;">
                  <v-checkbox v-model="column.visible">
                  </v-checkbox>
                </td>
                <td style="border-bottom: none; width: 100px;">
                  <v-text-field label="№" v-model="column.ord"></v-text-field>
                </td>
                <td style="border-bottom: none;">
                  <v-text-field :label="column.fieldname" v-model="column.fieldcaption"></v-text-field>
                </td>
                <td style="border-bottom: none;">
                  <v-text-field label="Формат" v-model="column.displayformat"></v-text-field>
                </td>
              </tr>  
            </tbody>
          </template>
        </v-simple-table>
      </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="SaveColumn()">ОК</v-btn>
          <v-btn color="green darken-1" text @click="setEditor(false)">Отмена</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

  <Finder :id="id" :visible="visible" :params="params" ref="columnEdit">
    <template>
      <v-divider
      class="mx-4"
      vertical
      ></v-divider>
      <v-btn icon title="Просмотр данных"  @click="open()">
        <v-icon>mdi-database-search</v-icon>
      </v-btn>
      <v-btn icon title="Редактор колонок" @click="beginEdit()">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-btn icon title="Очистить настройки колонок" @click="del()">
        <v-icon>mdi-autorenew</v-icon>
      </v-btn>

      

    </template>
  </Finder>
  </v-fragment>
</template>
<script>
import { mainObj, openMap, baseUrl, prodaction } from "../main";
import Finder from "./Finder";
export default {
  name: "Declare",
  data: () => ({
    openEditor: false,
    columns: [{FieldName:'aaa'}, {FieldName:'bbb'}]
  }),
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
    setEditor: function(b) {
      this.openEditor = b;
    },
    beginEdit: async function(){

      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let id = openMap.get(this.id).data.MainTab[c]["iddeclare"].toString();
      let lnk = baseUrl + "React/GetColumn?id=" + id;

      
      const response = await fetch(lnk, {
      method: "GET",
      mode: prodaction ? "no-cors" : "cors",
      cache: "no-cache",
      credentials: prodaction ? "include" : "omit"
      });

      const data = await response.json();
      if (data.Error)
      {
        mainObj.alert("Колонки таблиц", data.Error);
        return;
      }
          
      this.columns = [];
      data.map(d => this.columns.push(d));
      //alert(this.columns.length())
      this.setEditor(true);

      
    },
    SaveColumn: async function() {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let id = openMap.get(this.id).data.MainTab[c]["iddeclare"].toString();
      let lnk = baseUrl + "React/SaveColumnA"
      let bd = new FormData();
      bd.append("id", id);
      bd.append("columns", JSON.stringify(this.columns)); 
      const response = await fetch(lnk, {
      method: "POST",
      body: bd,
      mode: prodaction ? "no-cors" : "cors",
      cache: "no-cache",
      credentials: prodaction ? "include" : "omit"
      });
      const data = await response.json();
      if (data.Error)
      {
        mainObj.alert("Колонки таблиц", data.Error);
      }
      this.setEditor(false);
    },
    open: function () {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let rw = openMap.get(this.id).data.MainTab[c];
      let iddeclare = rw["iddeclare"].toString();
      let newid = this.id + "_query_" + rw["iddeclare"].toString();
      mainObj.openFinder(iddeclare, newid, Finder);
    },
    del: function () {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let ido = openMap.get(this.id).data.MainTab[c]["iddeclare"];
      if (ido == null)
        ido = openMap.get(this.id).data.MainTab[c]["IdDeclare"];
      let id = ido.toString();
      let lnk = baseUrl + "React/ClearColumn?id=" + id;

      fetch(lnk, {
        method: "GET"
      })
        .then(function (result) {
          return result.json();
        })
        .then(function (msg) {
          mainObj.alert("Колонки таблиц", msg.Error);
        });
    },

    update: function () {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let id = openMap.get(this.id).data.MainTab[c]["iddeclare"].toString();
      let lnk = baseUrl + "React/UpdateColumn?id=" + id;

      fetch(lnk, {
        method: "GET"
      })
        .then(function (result) {
          return result.json();
        })
        .then(function (msg) {
          mainObj.alert("Колонки таблиц", msg.Error);
        });
    },

    save: function () {
      let c = openMap.get(this.id).data.curRow;
      if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1) return;
      let id = openMap.get(this.id).data.MainTab[c]["iddeclare"].toString();
      let lnk = baseUrl + "React/SaveColumn?id=" + id;

      fetch(lnk, {
        method: "GET"
      })
        .then(function (result) {
          return result.json();
        })
        .then(function (msg) {
          mainObj.alert("Колонки таблиц", msg.Error);
        });
    }
  }
};
</script>