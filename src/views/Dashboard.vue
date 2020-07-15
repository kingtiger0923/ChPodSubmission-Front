<template>
  <div class="page-content">
    <app-navbar></app-navbar>
  </div>
</template>

<script>

import Navbar from '../components/navbar';

export default {
  components: {
    appNavbar: Navbar
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
</style>