<template>
    <div class="navbar">
        <div class="button-actions">
        </div>
        <div class="buttons-group">
            <div class="userInfo" @click="Dashboard">
                <!-- <div class="btn-name" >{{userName}}</div> -->
                <div class="btn-user"><span>Logged in as</span> {{userEmail}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {POST} from '../utils/api';

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
        POST(api, {
            id: localStorage.user_Id
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
.userInfo {
    cursor: pointer;
}

.buttons-group {
    display: flex;
    justify-content: center;
    align-items: center;
}

.button-actions {
    display: flex;
    justify-content: center;
    align-items: center;
}

.signOut {
    color: white;
    font-weight: bold;
    font-size: 1.2em;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
}

.signOut:hover {
    background-color: #393939;
}

.navbar {
    background-color: #292929;
    min-height: 80px;
}

.btn-user {
    color: white;
    font-size: 1.1em;
    font-weight: bold;
}

.btn-user span {
    font-weight: normal;
    font-size: 0.9em;
}

.btn-name {
    color: white;
    font-size: 0.9em;
    font-weight: bold;
}

.userAdmin {
    padding: 8px 20px;
    border-radius: 10px;
}


.userAdmin img {
    height: 35px;
}
</style>