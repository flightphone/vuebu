import Vue from 'vue'
import App from './App.vue'

import Comp1 from './components/Comp1.vue';
import Comp2 from './components/Comp2.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

let mainObj = {
  message: "ого",
  drawer: false,
  current: "-2"
};
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
    Control: Comp1,
    Params: "",
    SQLParams: {},
    data: {}
  });

openMap.set("-2", 
{
  Control: Comp2,
  Params: "",
  SQLParams: {},
  data: {}
});

let openIDs = [];
openIDs.push("-1");
openIDs.push("-2");


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
    //let v = "aaa";
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

export { openMap, mainObj, openIDs }
