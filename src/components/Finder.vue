<template>
  <div v-bind:hidden="!visible" style="height:100vh;maxheight:100vh;overflow:auto">
    <div v-bind:hidden="mode!='grid'" style="height:100vh;maxheight:100vh;overflow:auto">
      <v-app-bar app color="primary" dark v-if="!stateDrawer" max-width="100vw">
        <v-app-bar-nav-icon v-if="(editid == null)" @click="mainObj.drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>{{Descr}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="(editid != null)">
          <v-btn icon @click="selectFinder(editid)">
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-btn icon @click="clearFinder()">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </template>
        <slot></slot>
        <v-menu left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <template v-if="(editid==null) && (OpenMapData().EditProc) && !load">
                <v-list-item key="6" @click="add();">
                  <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Добавить</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item key="7" @click="edit()">
                  <v-list-item-icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Редактировать</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item key="8" @click="confirmDelete()">
                  <v-list-item-icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Удалить</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-if="!load">
                <v-list-item key="1" @click="mode='filter'">
                  <v-list-item-icon>
                    <v-icon>mdi-filter-menu</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Фильтровка и сортировка</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item key="2" @click="stateDrawer=true">
                  <v-list-item-icon>
                    <v-icon>mdi-code-tags</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Страницы</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-if="(editid==null) && !load">
                <v-list-item key="3" @click="csv()">
                  <v-list-item-icon>
                    <v-icon>mdi-cloud-download</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Экспорт в CSV</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item key="4" @click="openDetail()" v-if="OpenMapData().KeyValue">
                  <v-list-item-icon>
                    <v-icon>mdi-details</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Детали</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <v-list-item
                key="5"
                @click="editSetting()"
                v-if="OpenMapData().IdDeclareSet && !load"
              >
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Параметры</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-app-bar>

      <Pagination :findData="OpenMapData()" v-if="stateDrawer" />

      <v-main>
        <v-simple-table v-if="!load" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  v-for="column in OpenMapData().Fcols"
                  :key="column.FieldName"
                >{{column.FieldCaption}}</th>
              </tr>
            </thead>
            <tbody v-if="(nupdate > 0)">
              <tr
                v-for="(row, index) in OpenMapData().MainTab"
                :key="index"
                @click="handleClick(index)"
                v-bind:class="{selected: (index==current)}"
              >
                <td
                  v-for="column in OpenMapData().Fcols"
                  :key="column.FieldName"
                >{{(column.DisplayFormat == "") ? row[column.FieldName] : dateformat(row[column.FieldName], column.DisplayFormat)}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-main>
    </div>
    <div v-bind:hidden="mode!='filter'" style="height:100vh;maxheight:100vh;overflow:auto">
      <v-app-bar app color="primary" dark max-width="100vw">
        <v-toolbar-title>Фильтры, сортировка</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="updateTab()">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn icon @click="mode='grid'">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-simple-table v-if="!load" dense>
          <template v-slot:default>
            <tbody>
              <tr v-for="(column, index) in OpenMapData().Fcols" :key="column.FieldName">
                <td>
                  <v-text-field :label="column.FieldCaption" v-model="column.FindString"></v-text-field>
                </td>
                <td>
                  {{column.SortOrder}}
                  <span hidden>{{rangSort}}</span>
                </td>
                <td>
                  <v-select
                    :items="items"
                    v-model="column.Sort"
                    @change="(event)=>sortChange(event, index)"
                  ></v-select>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-main>
    </div>
    <div
      v-bind:hidden="!(mode == 'edit' || mode == 'add')"
      style="height:100vh;maxheight:100vh;overflow:auto"
    >
      <Editor
        v-if="(editid == null) && !load && (OpenMapData().EditProc)"
        :save="save"
        :closeEditor="closeEditor"
        :action="mode"
        :findData="OpenMapData()"
        :uid="uid"
      />
    </div>
    <div v-bind:hidden="!(mode=='setting')" style="height:100vh;maxheight:100vh;overflow:auto">
      <Editor
        v-if="OpenMapData().IdDeclareSet && !load"
        :save="saveSetting"
        :closeEditor="closeEditor"
        :action="mode"
        :findData="OpenMapData().Setting"
        :uid="uid2"
      />
    </div>
  </div>
</template>
<script>
//:id="id" :editid="editid"
import { mainObj, openMap, openIDs, prodaction, baseUrl } from "../main";
import Pagination from "./Pagination";
import Editor from "./Editor";

let Finder = {
  name: "Finder",
  components: { Pagination, Editor },
  data: () => ({
    mainObj: mainObj,
    openMap: openMap,
    load: true,
    mode: "grid",
    Descr: "Загрузка...",
    current: 0,
    stateDrawer: false,
    action: 1,
    nupdate: 1,
    nadd: 1,
    items: ["Нет", "По возрастанию", "По убыванию"],
    rangSort: 0,
    uid: "zz",
    uid2: "yy"
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: String,
    params: String,
    editid: Number,
    findData: Object,
    selectFinder: Function,
    clearFinder: Function
  },
  computed: {},
  methods: {
    sortChange: function(event, index) {
      let rang = 0;
      let columns = this.OpenMapData().Fcols;
      columns.map((column, i) => {
        if (i != index && column.SortOrder)
          if (column.SortOrder > rang) rang = column.SortOrder;
      });
      columns[index].SortOrder = rang + 1;
      this.rangSort = rang + 1;
      //columns[index].Sort = event.target.value;
    },
    dateformat: function(d, f) {
      if (!d) return d;

      if (d.length != 24) {
        let res = f.match(/0\.(0+)/);

        let n = 0;
        if (res)
          if (res.length > 1) {
            n = res[1].length;
          }

        if (n > 0) return Number(d.toString()).toFixed(n);
        else return d;
      }
      f = f.replace("yyyy", d.substr(0, 4));
      f = f.replace("yy", d.substr(2, 2));
      f = f.replace("MM", d.substr(5, 2));
      f = f.replace("dd", d.substr(8, 2));
      f = f.replace("HH", d.substr(11, 2));
      f = f.replace("mm", d.substr(14, 2));
      return f;
    },

    OpenMapData: function() {
      if (this.id != null) return openMap.get(this.id).data;
      else return this.findData;
    },
    OpenMapId: function() {
      return openMap.get(this.id);
    },
    setLoad: function(b) {
      this.load = b;
    },
    handleClick: function(index) {
      this.OpenMapData().curRow = index;
      this.current = index;
    },
    openDetail: function() {
      let mid = this.OpenMapData();
      if (mid.curRow == null) return;
      let rw = mid.MainTab[mid.curRow];
      let val = rw[mid.KeyF];
      let jsstr = {};
      jsstr[mid.KeyF] = val;
      let obj = {
        Control: Finder,
        Params: mid.KeyValue,
        TextParams: jsstr,
        data: {}
      };
      let newid = this.id + "_" + val;
      if (openMap.get(newid) == null) {
        openMap.set(newid, obj);
        openIDs.push(newid);
      }
      mainObj.current = newid;
    },
    csv: function() {
      const url = baseUrl + "React/csv";
      let bd = new FormData();
      let mid = this.OpenMapData();
      const IdDeclare = this.params;
      bd.append("id", IdDeclare);
      bd.append("Fc", JSON.stringify(mid.Fcols));
      if (mid.SQLParams) bd.append("SQLParams", JSON.stringify(mid.SQLParams));
      if (mid.TextParams)
        bd.append("TextParams", JSON.stringify(mid.TextParams));

      fetch(url, {
        method: "POST",
        mode: prodaction ? "no-cors" : "cors",
        cache: "no-cache",
        credentials: prodaction ? "include" : "omit",
        body: bd
      })
        .then(res => res.blob())
        .then(blob => {
          let a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.setAttribute("download", "data.csv");
          a.click();
        });
    },

    confirmDelete: function() {
      let mid = this.OpenMapData();
      if (mid.curRow == null) return;
      let rw = mid.MainTab[mid.curRow];
      let val = rw[mid.DispField];
      mainObj.confirm(
        this.Descr,
        "Удалить запись '" + val + "'?",
        this.rowDelete
      );
    },

    rowDelete: async function() {
      let mid = this.OpenMapData();
      let SQLParams = {};
      SQLParams[mid.KeyF] = mid.MainTab[mid.curRow][mid.KeyF];
      if (mid.DelProc.toLowerCase().indexOf("_del_1") > -1) {
        SQLParams["AUDTUSER"] = mid.Account;
      }

      const url = baseUrl + "React/exec";
      let bd = new FormData();

      bd.append("EditProc", mid.DelProc);
      bd.append("SQLParams", JSON.stringify(SQLParams));
      bd.append("KeyF", mid.KeyF);

      const response = await fetch(url, {
        method: "POST",
        mode: prodaction ? "no-cors" : "cors",
        cache: "no-cache",
        credentials: prodaction ? "include" : "omit",
        body: bd
      });

      const res = await response.json();
      if (
        res.message != "OK" &&
        res.message != "Invalid storage type: DBNull."
      ) {
        mainObj.alert("Ошибка", res.message);
        return;
      }
      mid.MainTab.splice(mid.curRow, 1);
      this.nupdate = this.nupdate + 1;
    },
    onChangePage: function(p) {
      this.action = this.action + 1;
      this.OpenMapData().page = p + 1;
      this.updateTab();
    },
    updateTab: async function() {
      const url = baseUrl + "React/FinderStart";
      let bd = new FormData();
      let mid = this.OpenMapData();
      const IdDeclare = this.params;
      bd.append("id", IdDeclare);
      bd.append("mode", "data");
      bd.append("page", mid.page.toString());
      bd.append("Fc", JSON.stringify(mid.Fcols));
      if (mid.SQLParams) bd.append("SQLParams", JSON.stringify(mid.SQLParams));

      if (mid.TextParams)
        bd.append("TextParams", JSON.stringify(mid.TextParams));
      const response = await fetch(url, {
        method: "POST",
        mode: prodaction ? "no-cors" : "cors",
        cache: "no-cache",
        credentials: prodaction ? "include" : "omit",
        body: bd
      });

      const data = await response.json();
      if (data.Error) {
        mainObj.alert("Ошибка", data.Error);
      } else {
        mid.MainTab = data.MainTab;
        mid.TotalTab = data.TotalTab;
        mid.page = data.page;
        if (this.mode != "grid");
        this.mode = "grid";
        this.nupdate = this.nupdate + 1;
      }
    },
    saveSetting: function() {
      let data = this.OpenMapData().Setting;
      let row = data.MainTab[0];
      data.ColumnTab.map(column => {
        row[column] = data.WorkRow[column];
      });

      let mid = this.OpenMapData();
      data.ReferEdit.SaveFieldList.map(f => {
        mid.SQLParams["@" + f] = data.MainTab[0][f];
      });
      this.updateTab();
    },
    save: async function() {
      let data = this.OpenMapData();
      //default values
      for (let f in data.DefaultValues) {
        data.WorkRow[f] = data.DefaultValues[f];
      }

      for (let f in data.TextParams) {
        data.WorkRow[f] = data.TextParams[f];
      }

      let SQLParams = {};
      data.ReferEdit.SaveFieldList.map(f => {
        SQLParams[f] = data.WorkRow[f];
      });

      const url = baseUrl + "React/exec";
      let bd = new FormData();

      bd.append("EditProc", data.EditProc);
      bd.append("SQLParams", JSON.stringify(SQLParams));
      bd.append("KeyF", data.KeyF);

      const response = await fetch(url, {
        method: "POST",
        mode: prodaction ? "no-cors" : "cors",
        cache: "no-cache",
        credentials: prodaction ? "include" : "omit",
        body: bd
      });

      const res = await response.json();
      if (res.message != "OK") {
        mainObj.alert("Ошибка", res.message);
        return;
      } else {
        if (res.ColumnTab.length == 1) {
          data.WorkRow[data.KeyF] = res.MainTab[0][res.ColumnTab[0]];
        } else {
          res.ColumnTab.map(column => {
            data.WorkRow[column] = res.MainTab[0][column];
          });
        }
      }

      let row = {};
      if (this.mode == "edit") {
        let c = data.curRow;
        row = data.MainTab[c];
      }
      data.ColumnTab.map(column => {
        row[column] = data.WorkRow[column];
      });
      if (this.mode == "add") data.MainTab.push(row);
      this.mode = "grid";
      this.nupdate = this.nupdate + 1;
    },
    closeEditor: function() {
      this.mode = "grid";
    },
    add: function() {
      let data = this.OpenMapData();
      if (data.WorkRow == null) data.WorkRow = {};
      data.ColumnTab.map(column => {
        data.WorkRow[column] = "";
      });
      this.nadd = this.nadd + 1;
      this.uid = "uid" + this.nadd.toString();
      this.mode = "add";
    },
    edit: function() {
      let data = this.OpenMapData();
      if (data.WorkRow == null) data.WorkRow = {};
      let c = data.curRow;
      let row = data.MainTab[c];
      data.ColumnTab.map(column => {
        data.WorkRow[column] = row[column] == null ? "" : row[column];
      });
      data.ReferEdit.Editors.map(column => {
        if (column.DisplayFormat != "") {
          data.WorkRow[column.FieldName] = this.dateformat(
            data.WorkRow[column.FieldName],
            column.DisplayFormat
          );
        }
      });
      this.nadd = this.nadd + 1;
      this.uid = "uid" + this.nadd.toString();
      this.mode = "edit";
    },
    editSetting: function() {
      let data = this.OpenMapData().Setting;
      data.WorkRow = {};
      let row = data.MainTab[0];
      data.ColumnTab.map(column => {
        data.WorkRow[column] = row[column] == null ? "" : row[column];
      });
      this.uid2 = "-10";
      this.mode = "setting";
    }
  },
  mounted: async function() {
    let OpenMapData = this.OpenMapData;
    let OpenMapId = this.OpenMapId;
    let setLoad = this.setLoad;

    const editid = this.editid;
    const IdDeclare = this.params;
    //const filterid = this.filterid;

    if (editid != null) {
      OpenMapData().curRow = 0;
      this.Descr = OpenMapData().Descr + " (выбор)";
      setLoad(false);
      return;
    }
    const url = baseUrl + "React/FinderStart";
    let bd = new FormData();
    bd.append("id", IdDeclare);

    let mid = OpenMapId();
    /*
    if (filterid != null && openMap.get(filterid) != null) {
      let fdat = openMap.get(filterid).data;
      fdat.ReferEdit.SaveFieldList.map(f => {
        mid.SQLParams["@" + f] = fdat.MainTab[0][f];
      });
    }
    */

    if (mid.SQLParams) {
      bd.append("SQLParams", JSON.stringify(mid.SQLParams));
    }
    if (mid.TextParams) bd.append("TextParams", JSON.stringify(mid.TextParams));

    const response = await fetch(url, {
      method: "POST",
      mode: prodaction ? "no-cors" : "cors",
      cache: "no-cache",
      credentials: prodaction ? "include" : "omit",
      body: bd
    });

    const data = await response.json();
    if (data.Error) {
      mainObj.alert("Ошибка", data.Error);
    } else {
      data.curRow = 0;
      data.WorkRow = {};
      data.ColumnTab.map(column => {
        data.WorkRow[column] = "";
      });
      let v = OpenMapId();
      v.data = data;
      this.Descr = data.Descr;
      setLoad(false);
    }
  }
};

export default Finder;
</script>

<style scoped>
.selected {
  background-color: #C2185B;
    color: lightblue;
}
</style>
