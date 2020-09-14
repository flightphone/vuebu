<template>
  <div v-bind:hidden="!visible" style="height:100vh;maxheight:100vh;overflow:auto">
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="mainObj.drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>{{Descr}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="ismenu = true">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="ismenu" temporary absolute width="auto">
      <v-list>
        <v-list-item-group>
          <template v-if="(editid==null) && (OpenMapData().EditProc)">
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

            <v-list-item key="8" @click="ismenu=false">
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Удалить</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item key="1" @click="ismenu=false">
            <v-list-item-icon>
              <v-icon>mdi-filter-menu</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Фильтровка и сортировка</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item key="2" @click="ismenu=false">
            <v-list-item-icon>
              <v-icon>mdi-code-tags</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Страницы</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <template v-if="(editid==null)">
            <v-list-item key="3" @click="ismenu=false">
              <v-list-item-icon>
                <v-icon>mdi-cloud-download</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Экспорт в CSV</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item key="4" @click="ismenu=false" v-if="OpenMapData().KeyValue">
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
      <v-simple-table v-if="!load" height="fill" fixed-header="true">
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
</template>
<script>
import { mainObj, openMap, prodaction, baseUrl } from "../main";
export default {
  name: "Finder",
  data: () => ({
    mainObj: mainObj,
    openMap: openMap,
    load: true,
    mode: "grid",
    Descr: "Загрузка...",
    current: 0,
    ismenu: false
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
      alert(data.Error);
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
</script>

<style scoped>
.selected {
  background-color: lightcoral;
  color: lightskyblue;
}
</style>
