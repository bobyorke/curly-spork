<template>
  <div>
    <h2 class="text-center">Incoming scores</h2>
    <div class="container-fluid">
      <div class="row active-score" v-for="sc in scoresSliced" :key="sc._id">
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
  name: 'ActiveRound',
  props: {
    scores: Array,
  },
  computed: {
    scoresSliced() {
      const lim = 8;
      const scoresLength = this.scores.length;
      const sliceStart = (scoresLength > lim) ? (scoresLength - lim) : 0;
      return this.scores.slice(sliceStart);
    },
  },
};
</script>

<style scoped>
.active-score {
  font-size: 2.6vh;
  font-variant: small-caps;
}
</style>
