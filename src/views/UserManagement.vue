<template>
  <div class="page-content">
    <app-navbar></app-navbar>
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
                <tr v-for="user in userData" :key="user._id">
                    <td>{{user.userId}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.active?"Yes":"No"}}</td>
                    <td>{{user.admin?"Admin":"No"}}</td>
                    <td>{{"Assignments"}}</td>
                    <td>{{"Actions"}}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Navbar from '../components/navbar';

export default {
  data() {
      return {
          userData : []
      }
  },
  components: {
    appNavbar: Navbar
  },
  mounted() {
    var api = this.$store.state.backend_URL + "/getAllUsers";
    Vue.axios.get(api).then((response) => {
        this.userData = response.data;
    });
  }
}
</script>

<style scoped>
.page-content {
  background-image: url('../assets/images/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  min-height: 100vh;
}

.table-userlist {
    width: 80%;
    margin: auto;
    margin-top: 80px;
    background-color: white;
    color: #50a0e6;
    border-radius: 10px;
}

.table-userlist table {
    width: 100%;
}

.table-userlist table thead {
    background-color: gray;
    color: white;
    border-radius: 10px 0px 0px 10px;
    padding: 10px;
}
</style>