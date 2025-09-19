<template>
  <v-app>
    <v-main>
      <ImgPage/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import ImgPage from './components/ImgPage.vue'

export default {
  name: 'App',

  components: {
    ImgPage,
  },

  data: () => ({
    //
  }),
};
</script>
