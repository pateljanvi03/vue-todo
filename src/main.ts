import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8SY0U9Y8YBg1w6Ao92F_9TUR__zvh1Z0",
  authDomain: "todo-2fcf6.firebaseapp.com",
  projectId: "todo-2fcf6",
  storageBucket: "todo-2fcf6.appspot.com",
  messagingSenderId: "404814908905",
  appId: "1:404814908905:web:8358372a5949a17c9d8f78",
  measurementId: "G-RLG0195N93",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
