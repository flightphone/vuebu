<template>


  
  <div v-bind:hidden="!visible" style="height:100vh;maxheight:100vh;overflow:auto">

    <v-dialog v-model="openFilter" persistent>
      <v-card>
      <v-card-title>Фильтровка и сортировка</v-card-title>
      <div style="height:60vh;maxheight:60vh;overflow:auto">
        <v-simple-table v-if="!load" dense light>
          <template v-slot:default>
            <tbody>
              <tr v-for="(column, index) in OpenMapData().Fcols" :key="column.FieldName" style="background-color:white;" >
                <td style="border-bottom: none;">
                  <v-badge style="width:100%"
                    :content="column.SortOrder"
                    color="info"
                    overlap
                    top
                  >
                  <v-text-field :label="column.FieldCaption" v-model="column.FindString"
                      :prepend-inner-icon="getIcon(column)"
                      @click:prepend-inner = "sortChangeIndex(column, index)"
                  ></v-text-field>
                  <!--
                    :append-icon="getIcon(column)"
                      @click:append="sortChangeIndex(column, index)"
                    -->
                  </v-badge>
                  <span hidden>{{rangSort}}</span>
                  <span hidden>{{nactord}}</span>
                </td>
                <!--
                <td style="border-bottom: none;width:100px">
                  <v-select
                    :items="items"
                    v-model="column.Sort"
                    @change="(event)=>sortChange(event, index)"
                  ></v-select>
                </td>
                -->
                <!--
                <td style="border-bottom: none;width:0px">
                  {{column.SortOrder}}
                  <span hidden>{{rangSort}}</span>
                  <span hidden>{{nactord}}</span>
                  
                </td>
                -->
              

              </tr>
            </tbody>
          </template>
        </v-simple-table>
      
      
    </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="updateTab()">ОК</v-btn>
          <v-btn color="green darken-1" text @click="setFilter(false )">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <div v-bind:hidden="mode!='grid'" style="height:100vh;maxheight:100vh;overflow:auto">
      <v-app-bar app v-if="!stateDrawer" max-width="100vw" height="65">
        <v-app-bar-nav-icon v-if="(editid == null)" @click="mainObj.drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>{{Descr}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field v-if="!load" 
            label="Поиск"
            dense
            filled
            rounded
            hide-details
            prepend-inner-icon="mdi-magnify"
            single-line
            v-model="OpenMapData().Fcols[dispIndex].FindString"
            @input="updateTab()"
          ></v-text-field>

        
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
              <template v-if="(editid==null) && !load">
                <v-list-item key="6" @click="add();" v-if="(OpenMapData().DelProc)">
                  <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Добавить</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item key="7" @click="edit()">
                  <v-list-item-icon>
                    <v-icon v-if="(OpenMapData().EditProc)">mdi-pencil</v-icon>
                    <v-icon v-else>mdi-magnify</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-if="(OpenMapData().EditProc)">Редактировать</v-list-item-title>
                    <v-list-item-title v-else>Просмотр</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item key="8" @click="confirmDelete()" v-if="(OpenMapData().DelProc)">
                  <v-list-item-icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Удалить</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-if="!load">
                <v-list-item key="1" @click="setFilter(true)">
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

                <v-list-item key="0" @click="updateTab()">
                  <v-list-item-icon>
                    <v-icon>mdi-refresh</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Обновить</v-list-item-title>
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
                <!--
                <v-list-item key="11" @click="loadFile()">
                  <v-list-item-icon>
                    <v-icon>mdi-database-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Файлы</v-list-item-title>
                    <a target="_blanck" hidden ref="fileLink2"></a>
                  </v-list-item-content>
                </v-list-item>
                -->
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
        
		<template v-if="!load">    
		<slot name="table">
		<v-simple-table v-if="!load" dense fixed-header :height="gridHeight">
          <template v-slot:default>
            <thead>
              <tr>
                <th style="background-color: LightGrey"
                  v-for="column in OpenMapData().Fcols"
                  :key="column.FieldName"
                ><br/>{{column.FieldCaption}}</th>
              </tr>
            </thead>
            <tbody v-if="(nupdate > 0)">
              <tr 
                v-for="(row, index) in OpenMapData().MainTab"
                :key="index"
                @click="handleClick(index)"
                v-bind:style="{'background-color': (index==current)?selectedColor:'white'}"
              >
                <td
                  v-for="column in OpenMapData().Fcols"
                  :key="column.FieldName"
                >{{(column.DisplayFormat == "") ? row[column.FieldName] : dateformat(row[column.FieldName], column.DisplayFormat)}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        </slot>
        </template>
		
		
      </v-main>
    </div>
    <div
      v-bind:hidden="!(mode == 'edit' || mode == 'add')"
      style="height:100vh;maxheight:100vh;overflow:auto"
    >
      <Editor
        v-if="(editid == null) && !load"
        :save="save"
        :closeEditor="closeEditor"
        :action="mode"
        :findData="OpenMapData()"
        :uid="uid"
        :readonly="!(OpenMapData().EditProc)"
      >
      <slot name="editor"></slot> 
      </Editor>
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

/*
Новые конструкции
17.09.2020  
Если в t_rpDeclare заполнено поле DispParamName , то по IdDeclare = DispParamName
создается новый Finder и присваивается полю Setting . По полям первой строки таблицы
Setting.MainTab заполняются параметры @ в запросе исходного Finder. Для возможности
изменить параметры Setting.EditProc!='', Setting.SaveFieldList!='' . 
Для Setting  можно заполнять таблицу t_sysFieldMap

24.09.2020
(Фрактал, орган)
Если в записи есть поля keyf, dispfield, iddeclare , то при детализации берутся
значения из этих полей, а не из соответсвующих полей объекта Finder (iddeclare 
используется вместо KeyValue)


04.06.2021
Решена проблема фиксации заголовков гридов и полос прокрутки. 
Заголовоки гридов покрашены в LightGrey
*/

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
    nactord: 1,  //20.05.2022
    nadd: 1,
    items: ["Нет", "ASC", "DESC"],
    rangSort: 0,
    uid: "zz",
    uid2: "yy",
    selectedColor: mainObj.selectedColor,
    openFilter: false,
    //19/05/2022
    dispIndex: 0,
    //24.05.2022
    gridHeight: mainObj.gridHeight(), 
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
  computed: {
    /*
    gridHeight: function()
    {
      return mainObj.gridHeight();
    },
    */
    finderRowStyle: function()
    {

    }
  },
  methods: {
    //24.05.2022
    resize: function()
        {
            this.gridHeight = mainObj.gridHeight()
        },
    sortChange: function(event, index) {
      let rang = 0;
      let columns = this.OpenMapData().Fcols;
      columns.map((column, i) => {
        if (column.Sort == "Нет")  
          column.SortOrder = null;

        if (i != index && column.SortOrder)
          if (column.SortOrder > rang) rang = column.SortOrder;
        
      });
      columns[index].SortOrder = rang + 1;
      this.rangSort = rang + 1;
      this.nactord = this.nactord + 1;
      //columns[index].Sort = event.target.value;
    },
    //20.05.2022
    sortChangeIndex: function(column, index)
    {
      if (column.Sort == "ASC")
          column.Sort = "DESC"
      else
      if (column.Sort == "DESC")    
        column.Sort = "Нет"
      else
        column.Sort = "ASC"

      this.sortChange (null, index)  
    },
    //20.05.2022
    getIcon: function(column)
    {
      if (column.Sort == "ASC")
          return "mdi-arrow-down"
      
      if (column.Sort == "DESC") 
          return "mdi-arrow-up"
      
         return "mdi-sort";
    },


    dateformat: function(d, f) {
      return mainObj.dateformat(d, f);
    },

    OpenMapData: function() {
      if (this.id != null) 
      {
          if (openMap.get(this.id) == null) 
          {
              
              openMap.set(this.id, {
                  Control: null,
                  Params: this.params,
                  SQLParams: null,
                  data: {}
              })
          }
          return openMap.get(this.id).data;
      }
      return this.findData;
    },
    OpenMapId: function() {
      if (openMap.get(this.id) == null) 
          {
              openMap.set(this.id, {
                  Control: null,
                  Params: this.params,
                  SQLParams: null,
                  data: {}
              })
          }
        return openMap.get(this.id);
    },
    setLoad: function(b) {
      this.load = b;
    },

    setFilter: function(b) {
      //b = false;
      //alert(this.dispIndex);
      this.openFilter = b;
    },

    handleClick: function(index) {
      if (this.OpenMapData().curRow == index) {
        //double click
        this.current = index;
        if (this.editid == null) {
          if (this.OpenMapData().EditProc) this.edit();
          else if (this.OpenMapData().KeyValue) this.openDetail();
          else this.edit();
        } else this.selectFinder(this.editid);
      } else {
        this.OpenMapData().curRow = index;
        this.current = index;
      }
    },
    openDetail: function() {
      let mid = this.OpenMapData();
      if (mid.curRow == null) return;
      let rw = mid.MainTab[mid.curRow];
      let val;
      let par;
      let jsstr = {};
      let title;
      if (rw["iddeclare"] && rw["keyf"]) {
        let KeyF = rw["keyf"];
        let DispField = rw["dispfield"];
        let KeyValue = rw["iddeclare"];

        val = rw[KeyF];
        jsstr[KeyF] = val;
        par = KeyValue;
        title = rw[DispField];
      } else {
        val = rw[mid.KeyF];
        jsstr[mid.KeyF] = val;
        par = mid.KeyValue;
        title = rw[mid.DispField];
      }

      let obj = {
        Control: Finder,
        Params: par,
        TextParams: jsstr,
        title: title,
        data: {}
      };
      let newid = this.id + "_" + rw[mid.KeyF];
      if (openMap.get(newid) == null) {
        openMap.set(newid, obj);
        openIDs.push(newid);
      }
      mainObj.current = newid;
      //mainObj.curhistory = mainObj.curhistory + 1;
      //mainObj.history.splice(mainObj.curhistory, mainObj.history.length, newid);
      //25.05.2022 история по якорям
      window.location.hash = newid;
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

    loadFile: function(){
      let mid = this.OpenMapData();
      if (mid.curRow == null) return;
      let rw = mid.MainTab[mid.curRow];
      const IdDeclare = this.params;
      let agr_key = "F" + IdDeclare + "_" + rw[mid.KeyF];
      let agr_caption = mid.Descr + ", " + rw[mid.DispField];
      let res = baseUrl + "Docfiles/dir?id=" + agr_key + "/&caption=" + agr_caption;
      this.$refs.fileLink2.href = res;
      this.$refs.fileLink2.click();
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
      //Сигнал в слоты 22/05/2022
      if (openMap.get(this.id).updateTab != null)
        openMap.get(this.id).updateTab()
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
        this.openFilter = false;
        //Сигнал в слоты 22/05/2022
        if (openMap.get(this.id).updateTab != null)
          openMap.get(this.id).updateTab()
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
      //Сигнал в слоты 22/05/2022
      if (openMap.get(this.id).updateTab != null)
        openMap.get(this.id).updateTab()	  
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
      data.Fcols.map(column => {
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
      data.Fcols.map(column => {
        if (column.DisplayFormat != "") {
          data.WorkRow[column.FieldName] = this.dateformat(
            data.WorkRow[column.FieldName],
            column.DisplayFormat
          );
        }
      });
      this.nadd = this.nadd + 1;
      this.uid2 = "uid2" + this.nadd.toString();
      this.mode = "setting";
    }
  },
  mounted: async function() {
    let OpenMapData = this.OpenMapData;
    let OpenMapId = this.OpenMapId;
    let setLoad = this.setLoad;

    const editid = this.editid;
    const IdDeclare = this.params;
    
    
    

    if (editid != null) {
      //19/05/2022
      let md = OpenMapData();
      md.curRow = 0;
      this.Descr = md.Descr + " (выбор)";
      md.Fcols.map((column, index)=>{
         if (column.FieldName == md.DispField) 
         {
            this.dispIndex = index
         }
      });
      //размер окна
      md.resize = this.resize;
      //размеры окон 24/05/2022
      window.addEventListener('resize', function() {
      if (md.resize)
          md.resize()
      }, true);

      setLoad(false);
      return;
    }

    let mid = OpenMapId();
    //Выбор строки для слота 22.05.2022
    mid.handleClick = this.handleClick;
    //изменение размеров окна
    mid.resize = this.resize;

    const url = baseUrl + "React/FinderStart";
    let bd = new FormData();
    bd.append("id", IdDeclare);

    
    
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
      return;
    } 

      data.curRow = 0;
      data.WorkRow = {};
      data.ColumnTab.map(column => {
        data.WorkRow[column] = "";
      });

      //19/05/2022
      data.Fcols.map((column, index)=>{
         if (column.FieldName == data.DispField) 
         {
            this.dispIndex = index
         }
      });

      
      
      mid.data = data;
      this.Descr = data.Descr;
      if (mid.title) this.Descr = this.Descr + " (" + mid.title + ")";

      setLoad(false);
    
  }
};

export default Finder;
</script>

<style scoped>
.selected {
  background-color: LightGreen;
  color: lightblue;
}

</style>


