<template>
  <v-app>
    <v-main>
      <TableRecursion/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
// import ImgPage from './components/ImgPage.vue'
import TableRecursion from './components/TableRecursion.vue'
import 'izitoast/dist/css/iziToast.min.css';
export default {
  name: 'App',

  components: {
    TableRecursion,
  },

  data: () => ({
    //
  }),
};
</script>
