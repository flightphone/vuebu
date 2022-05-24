<template>
    <Finder :id="id" :visible="visible" :params="params" ref="dogFind">

<template v-slot:default>
  <a target="_blanck" hidden ref="fileLink"></a>
  <v-btn icon @click="openfile()">
    <v-icon>mdi-attachment</v-icon>
  </v-btn>
</template> 

<template v-slot:table>
  <v-simple-table  dense :height="gridHeight">
    <template v-slot:default>
      <tbody v-if="(nupdate > 0)">
      <tr 
        v-for="(row, index) in OpenMapData().MainTab"
        :key="index"
        @click="handleClick(index)"
        v-bind:style="{'background-color': (index==current)?selectedColor:'white'}"
      >
        <td>
                <v-card
                    class="mx-auto"
                    tile
                    flat
                    max-width="420"
                    v-bind:style="{'background-color': (index==current)?selectedColor:'white'}"
                >
                <v-list-item  dense>
                  
                  <v-list-item-icon>
                    <v-icon dense>mdi-file-document</v-icon>
                  </v-list-item-icon>
                  
                    <v-list-item-content>
                        <v-list-item-title class="caption">{{row["agr_key"]}}, {{row["agreement_num"]}}</v-list-item-title>
                        <v-list-item-title class="caption">{{dateformat(row["agreement_date"], 'dd.MM.yyyy')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item  dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Компания G-Group</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["gln_gmc_name"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item  dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Контрагент</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["contractor_full_name"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                </v-card>
        </td>    

        <td>
                <v-card
                    class="mx-auto"
                    tile
                    flat
                    max-width="300"
                    v-bind:style="{'background-color': (index==current)?selectedColor:'white'}"
                >
                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Кураторы</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["persons"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Статус договора</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["agreement_state"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Роль компании G-Group</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["gln_role"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                </v-card>
        </td>


        <td>
                <v-card
                    class="mx-auto"
                    tile
                    flat
                    max-width="300"
                    v-bind:style="{'background-color': (index==current)?selectedColor:'white'}"
                >
                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Срок действия</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{dateformat(row["expiration_date"], 'dd.MM.yyyy')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Тип договора</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["agreement_type"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-subtitle>Категория</v-list-item-subtitle>
                        <v-list-item-title class="caption">{{row["category_alias"]}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                </v-card>
        </td>
      </tr>
    </tbody>


  </template>
</v-simple-table>
</template>    
        

    </Finder> 
</template>
<script>
import { mainObj, openMap, baseUrl } from "../main";
import Finder from "./Finder";
export default {
    name: "Dogovors",
  data: () => ({
    current: 0,
    selectedColor: mainObj.selectedColor,  
    nupdate: 1,
    gridHeight: mainObj.gridHeight() 
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: String,
    params: String
  },
  components: {Finder},
  methods: {
    resize: function()
        {
            this.gridHeight = mainObj.gridHeight()
        },  
    updateTab: function()
        {   
            this.nupdate = this.nupdate + 1
        },
        OpenMapData: function() {
            return openMap.get(this.id).data;
        },
        handleClick: function(index) {
                this.current = index;
                //вызываем функцию в FinderCore
                openMap.get(this.id).handleClick(index);
        },

        dateformat: function(d, f) {
          return mainObj.dateformat(d, f)
        },

      openfile: function(){
          let c = openMap.get(this.id).data.curRow;
          this.$refs.fileLink.href = this.fileUrl(c);
          this.$refs.fileLink.click();
      },
      fileUrl : function(c){
          if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1)
            return;
          let agr_key = openMap.get(this.id).data.MainTab[c]["agr_key"].toString();
          let res = baseUrl + "Docfiles/dir?id=" + agr_key + "/";
          return res;
      }
    },
    computed: {
      /*
        gridHeight: function()
        {
            return mainObj.gridHeight();
        }
      */  
    },
    mounted: function()
    {
        const mid = openMap.get(this.id)
        mid.updateTab = this.updateTab;
        mid.resize = this.resize;
    }    
}
</script>