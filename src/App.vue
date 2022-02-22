<template>
  <Header />
  <Times />
</template>

<script>
import Header from "./components/Header.vue";
import Times from "./components/Times.vue";

export default {
  name: "App",
  components: {
    Header,
    Times,
  },
};
</script>

<style>
/* @import './assets/base.css'; */
</style>
