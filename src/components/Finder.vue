<template>
  <div v-bind:hidden="!visible" style="height:100vh;maxheight:100vh;overflow:auto">
    <div v-bind:hidden="mode!='grid'" style="height:100vh;maxheight:100vh;overflow:auto">
      <v-app-bar app color="primary" dark v-if="!stateDrawer">
        <v-app-bar-nav-icon @click="mainObj.drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>{{Descr}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="ismenu = true">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
      <Pagination :id="id" :editid="editid" v-if="stateDrawer" />

      <v-navigation-drawer v-model="ismenu" temporary absolute width="auto">
        <v-list>
          <v-list-item-group>
            <template v-if="(editid==null) && (OpenMapData().EditProc) && !load">
              <v-list-item key="6" @click="ismenu=false">
                <v-list-item-icon>
                  <v-icon>mdi-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Добавить</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item key="7" @click="ismenu=false">
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
              <v-list-item key="1" @click="ismenu=false;mode='filter'">
                <v-list-item-icon>
                  <v-icon>mdi-filter-menu</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Фильтровка и сортировка</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item key="2" @click="ismenu=false;stateDrawer=true">
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

              <v-list-item key="5" @click="ismenu=false" v-if="filterid!= null">
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Параметры</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-simple-table v-if="!load" fixed-header="true" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  v-for="column in OpenMapData().Fcols"
                  :key="column.FieldName"
                >{{column.FieldCaption}}</th>
              </tr>
            </thead>
            <tbody>
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
      <v-app-bar app color="primary" dark>
        <v-toolbar-title>Фильтры, сортировка</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="updateTab()">
          <v-icon>mdi-content-save</v-icon>
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
                <td>{{column.SortOrder}} <span hidden>{{rangSort}}</span></td>
                <td>
                  <v-select :items="items" v-model="column.Sort" @change="(event)=>sortChange(event, index)"></v-select>
                </td>
                
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-main>
    </div>
  </div>
</template>
<script>
import { mainObj, openMap, openIDs, prodaction, baseUrl } from "../main";
import Pagination from "./Pagination";
let Finder = {
  name: "Finder",
  components: { Pagination },
  data: () => ({
    mainObj: mainObj,
    openMap: openMap,
    load: true,
    mode: "grid",
    Descr: "Загрузка...",
    current: 0,
    ismenu: false,
    stateDrawer: false,
    action: 1,
    items: ['Нет', 'По возрастанию', 'По убыванию'],
    rangSort:0
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: String,
    params: String,
    editid: Number,
    filterid: String
  },
  computed: {},
  methods: {
    sortChange: function(event, index)
    {
      let rang = 0;
      let columns = this.OpenMapData().Fcols;
        columns.map((column, i)=>{
            if (i!=index && column.SortOrder)    
                if (column.SortOrder > rang)
                    rang = column.SortOrder;
        });
        columns[index].SortOrder = rang+1;
        this.rangSort = rang+1;
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
      if (this.editid == null) return openMap.get(this.id).data;
      else
        return openMap.get(this.id).data.ReferEdit.Editors[this.editid].joinRow
          .FindConrol;
    },
    OpenMapId: function() {
      return openMap.get(this.id);
    },
    setLoad: function(b) {
      this.load = b;
    },
    handleClick: function(index) {
      this.OpenMapData().curRow = index;
      if (openMap.get(this.id).data.setCurrent != null) {
        openMap.get(this.id).data.setCurrent(index);
      }
      this.current = index;
    },
    openDetail: function() {
      this.ismenu = false;
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
      this.ismenu = false;
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
      this.ismenu = false;
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
      let c = this.current;
      this.current = -1;
      this.current = c;
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
      }

      if (this.mode != "grid");
      this.mode = "grid";
      this.OpenMapData().curRow = 0;
      this.current = -1;
      this.current = 0;
    }
  },
  mounted: async function() {
    let OpenMapData = this.OpenMapData;
    let OpenMapId = this.OpenMapId;
    let setLoad = this.setLoad;

    const editid = this.editid;
    const IdDeclare = this.params;
    const filterid = this.filterid;

    if (editid != null) {
      OpenMapData().curRow = 0;
      setLoad(false);
      return;
    }
    const url = baseUrl + "React/FinderStart";
    let bd = new FormData();
    bd.append("id", IdDeclare);

    let mid = OpenMapId();
    if (filterid != null && openMap.get(filterid) != null) {
      let fdat = openMap.get(filterid).data;
      fdat.ReferEdit.SaveFieldList.map(f => {
        mid.SQLParams["@" + f] = fdat.MainTab[0][f];
      });
    }

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
  background-color: lightcoral;
  color: lightskyblue;
}
</style>
