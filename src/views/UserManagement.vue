<template>
  <div class="page-content">
    <div class="background"></div>
    <app-sidebar></app-sidebar>
    <div class="content-container">
      <app-navbar></app-navbar>
      <div class="content">
        <div class="empty-region"></div>
        <div class="table-userlist">
            <table>
                <thead>
                    <tr>
                        <td>User Name</td>
                        <td>Email</td>
                        <td>Actived</td>
                        <td>Admin</td>
                        <td>Assigned Lessons</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in userData" :key="user._id">
                        <td>{{user.userId}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.active?"Yes":"No"}}</td>
                        <td>{{user.admin?"Admin":"No"}}</td>
                        <td>{{getAssignmentsasString(index)}}</td>
                        <td><span class="btn-edit" @click="EditUser(index)">Edit</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
    <div :class="{'modal-window':true, show: modalShow}">
      <div class="modal-useredit" v-if="modalShow">
        <div class="title">
          {{currentUser.email}}
        </div>
        <div class="isActive item">
          <div class="py-2 item-title">Active</div>
          <div class="text-center p-2 item-value">
            <span :class="{ selected: currentUser.active==true, 'item-value-one' : true }" @click="ChangeActive(true)"> Yes </span>
            <span :class="{ selected: currentUser.active==false, 'item-value-one' : true }" @click="ChangeActive(false)"> No </span>
          </div>
        </div>
        <div class="isAdmin item">
          <div class="py-2 item-title">Admin</div>
          <div class="text-center p-2 item-value">
            <span :class="{ selected: currentUser.admin==true, 'item-value-one' : true }" @click="ChangeAdmin(true)"> Yes </span>
            <span :class="{ selected: currentUser.admin==false, 'item-value-one' : true }" @click="ChangeAdmin(false)"> No </span>
          </div>
        </div>
        <div class="Assignment">
          <div class="py-2 item-title">Assigned Lessons</div>
          <div class="actions">
            <input type="text" class="inp lessons" v-model="inpLesson" @input="onLessonInput"/>
            <span class="btn-assign" @click="AddLesson">Assign</span>
          </div>
          <div class="assign-list">
            <div  class="assign-item" 
                  v-for="(assign, idx) in currentUser.assignments" :key="assign+idx" 
                  @click="DeleteAssignment(currentUserIdx, assign)">
              {{assign}}
            </div>
          </div>
        </div>
        <div class="userlist-actions">
          <div class="userlist-action" @click="SaveUser"> Save </div>
          <div class="userlist-action" @click="CloseModal"> Close </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {POST} from '../utils/api';
import Navbar from '../components/navbar';
import SideBar from '../components/sidebar';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      "userData",
      "isReceived",
      "backendURL",
      "_id"
    ])
  },
  data() {
      return {
          currentUser : {},
          currentUserIdx: 0,
          modalShow: false,
          inpLesson: "",
      }
  },
  components: {
    appNavbar: Navbar,
    appSidebar: SideBar
  },
  methods: {
    DeleteAssignment(idx, assign) {
      this.currentUser.assignments = this.currentUser.assignments.filter(function(el) {
        return el != assign;
      })
    },
    onLessonInput() {
      this.inpLesson = this.inpLesson.toUpperCase();
    },
    AddLesson() {
      if( this.checkValidLesson() ) {
        this.currentUser.assignments.push(this.inpLesson);
      } else {
        alert("Lesson Name is not valid!");
      }
    },
    checkValidLesson() {
      if( this.inpLesson.length == 6 ) {
        let regex = RegExp('[A-Z]{2}[0-9]{4}');
        let match = regex.test(this.inpLesson);
        if( match ) return true;
      } else if( this.inpLesson.length == 4 ) {
        let regex = RegExp('[0-9]{4}');
        let match = regex.test(this.inpLesson);
        if( match ) return true;
      }
      return false;
    },
    ChangeAdmin(val) {
      this.currentUser.admin = val;
    },
    ChangeActive(val) {
      this.currentUser.active = val;
    },
    EditUser(idx) {
      this.currentUser = JSON.parse(JSON.stringify(this.userData[idx]));
      this.currentUserIdx = idx;
      this.modalShow = true;
    },
    SaveUser() {
      var api = this.backendURL + "/editUser";
      POST(api, {
        user: this.currentUser
      }).then((response) => {
        if( response.data == "success" ) {
          this.userData[this.currentUserIdx].active = this.currentUser.active;
          this.userData[this.currentUserIdx].admin = this.currentUser.admin;
          this.userData[this.currentUserIdx].assignments = JSON.parse(JSON.stringify(this.currentUser.assignments));
        } else {
          alert("Failed to Edit User!");
        }
      });
      this.modalShow = false;
    },
    CloseModal() {
      this.modalShow = false;
    },
    SignOut() {
      localStorage.removeItem("user_Id");
      this.$store.state.dataReceive = false;
      this.$router.push({
          name: "Login"
      });
    },
    getAssignmentsasString(idx) {
      return this.userData[idx].assignments.join(", ");
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

<style>
body {
  overflow-y: scroll!important;
}
</style>

<style scoped>
.content {
  display: flex;
  width: 100%;
}

.content .empty-region {
  width: 300px;
  height: 100vh;
}

.Assignment .actions .inp.lessons {
  font-size: 15px;
  margin-right: 20px;
}

.Assignment .actions .btn-assign {
  background-color: #292929;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 10px;
  cursor: pointer;
}

.modal-window {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: none;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0,0,0,0.7);
}

.modal-window.show {
  display: flex;
}

.modal-window .userlist-actions {
  display: flex;
  justify-content: center;
  padding: 10px 20px;
}

.modal-window .userlist-actions .userlist-action {
  padding: 5px 20px;
  margin: 0px 10px;
  background-color: #292929;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.modal-window .userlist-actions .userlist-action:hover{
  background-color: #595959;
}

.modal-useredit .Assignment .item-title {
  color: black;
  font-weight: bold;
}

.modal-useredit .Assignment .assign-list {
  display: flex;
  margin: 0px 15px;
  flex-wrap: wrap;
  max-height: 200px;
  overflow-y: scroll;  
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
  border-radius: 4px;
}

.modal-useredit .Assignment .assign-list .assign-item {
  background: #292929;
  color: white;
  font-weight: bold;
  padding: 6px 15px;
  margin: 5px;
  cursor: pointer;
}

.modal-useredit .Assignment .assign-list .assign-item:after {
  content: "x";
  margin: 0px 0px 3px 3px;
  color: rgba(255, 0, 0, 0.73);
}

.modal-useredit .item .item-value .item-value-one.selected {
  background-color: #292929;
  color: white;
}

.modal-useredit .item .item-value .item-value-one {
  background-color: #e2e2e2;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  margin: 0px 20px;
}

.modal-useredit .item .item-value .item-value-one:hover {
  background-color:#595959;
  color: white;
}

.modal-useredit .item .item-title {
  font-weight: bold;
  color: black;
}

.modal-useredit {
  width: 420px;
  max-height: 550px;
  margin: auto;
  background-color: white;
}

.modal-useredit .title {
  background-color: rgba(255, 0, 0, 0.73);
  min-height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.table-userlist {
    width: 80%;
    margin: auto;
    margin-top: 80px;
    margin-bottom: 80px;
    color: white;
    box-shadow: 6px 10px 8px #9995;
    padding: 0px 15px;
}

.table-userlist table {
    width: 100%;
}

.table-userlist table thead {
    background-color: #292929;
    color: white;
    border-radius: 10px 0px 0px 10px;
    padding: 10px;
    font-weight: bold;
}

.table-userlist table td {
  padding: 8px 0px 7px;
  max-width: 225px;
}

.table-userlist table tbody {
  background-color: white;
  color: black;
}

.table-userlist table .btn-edit {
  cursor: pointer;
  padding: 5px 20px;
  background-color: #00b233;
  color: white;
  border-radius: 25px;
  font-size: 0.8em;
}

.table-userlist table .btn-edit:hover {
  background-color: #00b23377;
}

.table-userlist table tbody tr:nth-child(2n+1) {
  background-color: #DEDEDE;
  color: black;
}

.table-userlist table tbody tr:hover {
  background-color: #CECECE;
}
</style>