<template>
    <div class="navbar">
        <div class="btn-signout" @click="Signout"><img src="../assets/images/signout.png"></div>
        <div class="buttons-group">
            <div class="userAdmin" v-if="isAdmin" @click="UserManage"><img src="../assets/images/userManage.png"></div>
            <div class="userInfo" @click="Dashboard">
                <div class="btn-name" >{{userName}}</div>
                <div class="btn-user">{{userEmail}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    data() {
        return {
            userEmail: "",
            userName: "",
            isAdmin: false
        }
    },
    methods: {
        Signout() {
            localStorage.removeItem("user_Id");
            if( this.$route.name != "Login" ) {
                this.$router.push({
                    name: "Login"
                });
            }
        },
        UserManage() {
            if( this.$route.name != "UserManagement" ) {
                this.$router.push({
                    name: "UserManagement"
                });
            }
        },
        Dashboard() {
            if( this.$route.name != "dashBoard" ) {
                this.$router.push({
                    name: "dashBoard"
                });
            }
        }
    },
    mounted() {
        var api = this.$store.state.backend_URL + "/getUserInfo";
        Vue.axios.post(api, {}, {
            params: {
                id: localStorage.user_Id
            }
        }).then((response) => {
            if( response.data == "error" ) {
                localStorage.removeItem("user_Id");
                this.$router.push({
                    name: "Login"
                });
            } else if(response.data == "not activated") {
                localStorage.removeItem("user_Id");
                this.$router.push({
                    name: "Login"
                });
            } else {
                this.userEmail = response.data.email;
                this.userName = response.data.userName;
                this.isAdmin = response.data.admin;
                
            }
        });
    },
}
</script>

<style scoped>
.userAdmin {
    margin-right: 2em;
    color: white;
    font-size: 1.5em;
    cursor: pointer;
}

.userInfo {
    cursor: pointer;
}

.buttons-group {
    display: flex;
    justify-content: center;
    align-items: center;
}

.navbar {
    background-color: #292929;
    min-height: 80px;
}

.btn-user {
    color: #AAA;
    font-size: 1.2em;
    font-weight: bold;
}

.btn-signout img {
    width: 50px;
}

.btn-signout {
    cursor: pointer;
    padding: 10px;
}

.btn-name {
    color: white;
    font-size: 1.2em;
    font-weight: bold;
}

.userAdmin img {
    width: 50px;
}
</style>