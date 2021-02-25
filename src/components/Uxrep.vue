<template>
    <Finder :id="id" :visible="visible" :params="params" ref="uxrepFind">
        <template>
            <a target="_blanck" hidden ref="fileLink"></a>
        <v-btn icon @click="openfile()">
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
        </template>
    </Finder> 
</template>
<script>
import { openMap, baseUrl } from "../main";
import Finder from "./Finder";
export default {
    name: "Uxrep",
  data: () => ({
    
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
      openfile: function(){
          let c = openMap.get(this.id).data.curRow;
          this.$refs.fileLink.href = this.fileUrl(c);
          this.$refs.fileLink.click();
      },
      fileUrl : function(c){
          if (c < 0 || c > openMap.get(this.id).data.MainTab.length - 1)
            return;
          let agr_key = openMap.get(this.id).data.MainTab[c]["FC_PK"].toString();
          let res = baseUrl + "Flight?FC_PK=" + agr_key;
          return res;
      }

  } 
}
</script>