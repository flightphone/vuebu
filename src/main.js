import Vue from 'vue'
import App from './App.vue'

import Comp2 from './components/Comp1.vue';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = true;
const prodaction = true;

let mainObj = {
  message: "ого",
  drawer: false,
  current: "-1",
  openAlert: false,
  alert: function(title, text){
    this.alertConfirm = false;
    this.alertTitle = title;
    this.alertText = text;
    this.openAlert = true;
  },
  confirm: function(title, text, action){
    this.alertConfirm = true;
    this.alertTitle = title;
    this.alertText = text;
    this.confirmAction = action;
    this.openAlert = true;
  },
  history: ["-1"],
  curhistory: 0,
  
  gridHeight: function() {
    return document.documentElement.clientHeight - 65;
    
  },
  selectedColor: "LightGreen",
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

  
}; 

const baseUrl = (prodaction) ? "" : "http://localhost:5000/";

let openMap = new Map();




/*
let startObj = {
  Control: HelloWorld,
  Params: "1445",
  SQLParams: {},
  data: {}
}
openMap.set("839", startObj);
*/
openMap.set("-1",
  {
    Control: Comp2,
    Params: "",
    SQLParams: {},
    data: {}
  });



let openIDs = [];
openIDs.push("-1");



Vue.component('uni-comp', {
  data: function () {
    return {
      openMap: openMap,
      mainObj: mainObj
    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  render: function (createElement) {
    let C = openMap.get(this.id).Control;
    let params = openMap.get(this.id).Params;
    let v = (mainObj.current == this.id);
    return createElement(C,{
      props: {
        id: this.id,
        params: params,
        visible: v
      }
    });
  }
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');

export { openMap, mainObj, openIDs, prodaction, baseUrl }
