<template>
<div class="page-content">
  <div class="logo">
    <img src="../assets/images/logo.png">
  </div>
  <div class="login-form">
    <p class="title">Welcome To Submission System</p>
    <GoogleLogin :params="params" :onSuccess="onGoogleSuccess" :onFailure="onGoogleFailure">
      <span class="btn-login g-signin2" data-onsuccess="onGoogleSuccess" id="gsignbtn"><img src="../assets/images/g_icon.png"> Continue with Google</span>
    </GoogleLogin>
  </div>
</div>
</template>

<script>
import GoogleLogin from 'vue-google-login';
import {POST} from '../utils/api';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      "backendURL"
    ])
  },
  data() {
    return {
      params: {
        client_id: "770615248747-msculnn22ietgkrvt386um53u88uej36.apps.googleusercontent.com"
      }
    };
  },
  components: {
    GoogleLogin
  },
  methods: {
    onGoogleSuccess : function (googleUser) {
      var gUser = googleUser.getBasicProfile();
      var email = gUser.getEmail();
      var userId = gUser.getName();
      
      var api = this.backendURL + "/userLogin";
      POST(api, {
          email,
          userId})
      .then((response) => {
        if( response.data == "Reg Success" ) {
          alert("Your account is not activated!");
        } else {
          this.$store.commit("ownUserReceived", response.data.user);
          this.$store.commit("usersReceived", response.data.users);
          this.$store.commit("lessonsReceived", response.data.lessons);
          this.$store.commit("dataReceived", true);
          
          localStorage.user_Id = response.data.user._id;
          this.$router.push({
            name: "dashBoard"
          });
        }
      });
    },
    onGoogleFailure : function () {
    }
  },
  mounted() {
    if( localStorage.user_Id ) {
        this.$router.push({
          name: "dashBoard"
        });
    }
  }
};
</script>

<style scoped>
.page-content {
  background-image: url('../assets/images/bg_login.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  min-height: 100vh;
}

.logo {
  padding-top: 20vh;
}

.logo img {
  height: 7vh;
  min-height: 50px;
}

.login-form {
  max-width: 500px;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.73);
  min-height: 30vh;
  border-radius: 5px;
  padding: 8vh 30px;
  margin-top: 50px;
  box-shadow: 5px 10px rgba(0,0,0,0.16);
}

.login-form .title {
  color: #5B5B5B;
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 50px;
}

.login-form .btn-login {
  background-color: #E1001E;
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  font-weight: bold;
  font-size: 1.3em;
  margin-top: 5vh;
  cursor: pointer;
  box-shadow: 2px 3px #AAAA;
}

.login-form .btn-login img {
  width: 20px;
  vertical-align: text-top;
}

button[id*='google-signin-btn'] {
  border: none;
}

button[id*='google-signin-btn']:focus {
  border: none!important;
  outline: none;
}
</style>