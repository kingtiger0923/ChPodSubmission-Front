import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        //backend_URL: "http://localhost:3000",
        backend_URL: "http://c6beb1d343d7.ngrok.io"
    }
});