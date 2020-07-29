<template>
  <div class="page-content">
    <div class="background"></div>
    <app-sidebar></app-sidebar>
    <div class="content-container">
      <app-navbar></app-navbar>
      <div class="content">
        <div class="empty-region"></div>
        <div class="table-lessonlist">
          <div class="header">
            <div class="title"> Your Assigned Lessons </div>
            <div class="actions">
            </div>
          </div>
          <div class="body-content">
            <table>
              <thead>
                <tr>
                  <td style="width: 25%;">Lesson Number</td>
                  <td style="width: 50%;">Lesson Title</td>
                  <td style="width: 25%;">Status</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lesson in lessondetails" :key="lesson.number" 
                  @click="GotoLessonDetail(lesson.number)">
                  <td>{{lesson.number}}</td>
                  <td>{{lesson.title}}</td>
                  <td :class="{'notpresent' : lesson.complete == 0,
                               'incomplete': lesson.complete == 1,
                               'complete': lesson.complete == 2}">
                    {{lesson.complete==0?"Not Present":(lesson.complete==1?"Incomplete":"Complete")}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {POST} from '../utils/api';
import Navbar from '../components/navbar';
import SideBar from '../components/sidebar'
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'lessondetails',
      "isReceived",
      "backendURL",
      "_id"
    ])
  },
  components: {
    appNavbar: Navbar,
    appSidebar: SideBar,
  },
  methods: {
    SignOut() {
      localStorage.removeItem("user_Id");
      this.$store.state.dataReceive = false;
      this.$router.push({
          name: "Login"
      });
    },
    GotoLessonDetail(numLesson) {
      this.$router.push({
        name: "LessonDetail",
        params: { num: numLesson }
      })
    }
  },
  mounted() {
    if( !localStorage.user_Id ) {
      this.SignOut();
    } else if( !this.isReceived ) {
      var api = this.backendURL + "/getFullData";
      POST(api, {id: this._id})
      .then((response) => {
        this.$store.commit("ownUserReceived", response.data.user);
        this.$store.commit("usersReceived", response.data.users);
        this.$store.commit("lessonsReceived", response.data.lessons);
        this.$store.commit("dataReceived", true);
        
        localStorage.user_Id = response.data.user._id;
      });
    }
  }
}
</script>

<style scoped>
.table-lessonlist .body-content table thead td {
  border: 1px solid gray;
  padding: 7px 15px;
}

.table-lessonlist .body-content table tbody td {
  padding: 6px 15px;
}

.table-lessonlist .body-content table tbody td.notpresent {
  color: black;
}

.table-lessonlist .body-content table tbody td.incomplete {
  color: rgba(255,0,0,0.73);
}

.table-lessonlist .body-content table tbody td.complete {
  color: green;
}

.table-lessonlist .body-content table tbody tr{
  border-bottom: 1px solid black;
  cursor: pointer;
}

.table-lessonlist .body-content table tbody tr:hover{
  background-color: #e2e2e2;
}

.table-lessonlist .body-content table thead {
  font-weight: bold;
  background-color: #292929;
  color: white;
}

.table-lessonlist .body-content table{
  width: 100%;
  color: black;
  background-color: white;
}

.table-lessonlist .body-content {
  padding: 25px;
}

.table-lessonlist .header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: black;
  font-weight: bold;
  font-size: 1.6em;
}

.table-lessonlist .title {
  padding: 0px 0px 0px 35px;
}

.table-lessonlist {
    width: 80%;
    margin: auto;
    margin-top: 80px;
    margin-bottom: 80px;
    color: white;
    box-shadow: 6px 10px 8px #9995;
    padding: 0px 15px;
}

.content {
  display: flex;
  width: 100%;
}

.content .empty-region {
  width: 300px;
  height: 100vh;
}

.page-content {
  width: 100%;
  min-height: 100vh;
}

.page-content .background {
  /* background-image: url('../assets/images/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>