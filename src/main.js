import Vue from 'vue'
import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
import Comp1 from './components/Comp1.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

let mainObj = {
  message:"ого",
  drawer : true
};
let openMap = new Map();

let startObj = {
  Control: HelloWorld,
  Params: "1445",
  SQLParams: {},
  data: {}
}
openMap.set("839", startObj);
openMap.set("-1", 
{
  Control: Comp1,
  Params: "",
  SQLParams: {},
  data: {}
});


let openIDs = [];
openIDs.push("839");
openIDs.push("-1");


Vue.component('uni-comp', {
  data: function() {
    return {
      openMap: openMap
    };
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  render: function (createElement){
    let C = openMap.get(this.id).Control;
    return createElement(C);
  }
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');

export {openMap, mainObj, openIDs}
