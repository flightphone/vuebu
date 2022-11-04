import Vue from 'vue';
import App from './App.vue';

import Comp2 from './components/Comp1.vue';
import vuetify from './plugins/vuetify';




Vue.config.productionTip = true;
const prodaction = true;

let openMap = new Map();
openMap.set("-1",
  {
    Control: Comp2,
    Params: "",
    SQLParams: null,
    data: {}
  });

let openIDs = [];
  openIDs.push("-1");  


//запускаем нужную форму через стартовый якорь, например #839 (договоры), #81 тарифы  
let mainObj = {
  message: "ого",
  drawer: false,
  current: "-1",
  openAlert: false,
  alert: function (title, text) {
    this.alertConfirm = false;
    this.alertTitle = title;
    this.alertText = text;
    this.openAlert = true;
  },
  confirm: function (title, text, action) {
    this.alertConfirm = true;
    this.alertTitle = title;
    this.alertText = text;
    this.confirmAction = action;
    this.openAlert = true;
  },
  history: ["-1"],
  curhistory: 0,

  gridHeight: function () {
    return document.documentElement.clientHeight - 68;

  },
  selectedColor: "LightGreen",
  dateformat: function (d, f) {
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
  resize: function () {
    openMap.forEach((value) => {
      if (value.resize)
        value.resize()
    });
  }
};

const baseUrl = (prodaction) ? "" : "http://localhost:5000/";






//размеры окон 24/05/2022
window.addEventListener('resize', function() {
  if (mainObj.resize)
      mainObj.resize()
}, true);

//история переходов
window.addEventListener('popstate', function() {
  let hi = window.location.hash.replace('#', '');
  if (hi!=mainObj.current && openIDs.includes(hi))
  {
      mainObj.current = hi;
  }
}, false);

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
    return createElement(C, {
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

/*
Обновления май 2022
1. Поле поиска по DisplayField
2. Модальное окно фильтров, переработан дизайн
3. slot для таблицы и формы редактирования, по одному тесту сделано
4. Отработка на событие resize  с правильным пересчетом размеров гридов
5. Добавляются якоря при переходам по ссылкам, поддерживает история переходов в браузере. Запуск по якорю 839 или
   81
*/
