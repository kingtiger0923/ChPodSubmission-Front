import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        backend_URL: "http://localhost:3000",
        dataReceive: false,
        user: {},
        users: [],
        lessons: []
    },
    mutations: {
        dataReceived(state, val) {
            state.dataReceive = val;
        },
        ownUserReceived(state, revUser) {
            state.user = revUser;
        },
        usersReceived( state, revUsers ) {
            state.users = revUsers;
        },
        lessonsReceived( state, revLessons ) {
            state.lessons = revLessons;
        }
    },
    getters: {
        backendURL: state => {
            return state.backend_URL;
        },
        isReceived: state => {
            return state.dataReceive;
        },
        lessondetails: state => {
            return state.lessons;
        },
        userEmail: state => {
            return state.user.email;
        },
        userName: state => {
            return state.user.userId;
        },
        isAdmin: state => {
            return state.user.admin;
        },
        _id: () => {
            return localStorage.user_Id;
        },
        userData: state => {
            return state.users;
        },
        getLessonById: (state) => (id) => {
            return state.lessons.find((ele) => ele.number == id);
        }
    }
});