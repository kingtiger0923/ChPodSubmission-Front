<template>
    <div class="sidebar">
        <div class="logo"><img src="../assets/images/logo.png"/></div>
        <div class="Admin item" v-if="isAdmin" @click="userManage">
            <img src="../assets/images/userManage.png"> User Management</div>
        <div class="lesson item" @click="Lesson">
            <img src="../assets/images/lesson.png"> Lessons</div>
        <div class="logout item" @click="Signout">
            <img src="../assets/images/logout.png"> Sign Out</div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters([
            "isAdmin"
        ])
    },
    methods: {
        Lesson() {
            if( this.$route.name != "dashBoard" ) {
                this.$router.push({
                    name: "dashBoard"
                });
            }
        },
        Signout() {
            localStorage.removeItem("user_Id");
            this.$store.state.dataReceive = false;
            if( this.$route.name != "Login" ) {
                this.$router.push({
                    name: "Login"
                });
            }
        },
        userManage() {
            if( this.$route.name != "UserManagement" ) {
                this.$router.push({
                    name: "UserManagement"
                });
            }
        }
    },
    beforeMount() {
        // window.addEventListener("beforeunload", event => {
        //     event.preventDefault();
        //     event.returnValue = "";
        // });
    }
}
</script>

<style scoped>
.sidebar {
    background-color: #292929;
    height: 100vh;
    width: 300px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
.sidebar .logo {
    background-color: #292929;
    width: 100%;
}

.sidebar .logo img {
    width: 100%;
    padding: 14px 10px;
}

.sidebar .item {
    color: white;
    padding: 15px 10px 15px 35px;
    text-align: left;
    font-size: 20px;
    cursor: pointer;
    background-color: #393939;
    border: 1px solid #292929;
}

.sidebar .item img {
    width: 25px;
    margin-right: 10px;
    vertical-align: sub;
}

.sidebar .logout.item {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 15px 10px;
}

.sidebar .logout.item img{
    height: 25px;
}

.sidebar .item:hover {
    background-color: #696969;
}
</style>