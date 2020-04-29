<template>
  <div>
    <h2 class="text-center">Incoming scores</h2>
    <div class="container-fluid">
      <div class="row active-score" v-for="sc in scores" :key="sc._id">
        <div class="col-10">
          {{ sc.name }}
        </div>
        <div class="col-2">
          {{ sc.activeScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActiveVoter',
  props: {
    scores: Array,
  },
};
</script>

<style scoped>
.active-score {
  font-size: 2.6vh;
  font-variant: small-caps;
}
</style>
