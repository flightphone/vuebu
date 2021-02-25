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
  curhistory: 0
  
}; 

const baseUrl = (prodaction) ? "" : "http://192.168.43.81:5000/";

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
