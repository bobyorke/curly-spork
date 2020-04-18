<template>
  <div
    class="scores follower"
    ref="score_follow"
  >
    <div class="active-container">
      <div class="active" v-if="score.activeScore > 0">
        {{ score.activeScore }}
      </div>
    </div>
    <div class="rest-container">
      {{ score.country }}, {{ score.year }}
      <div class="total">
        {{ score.totalScore }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreElement',
  props: {
    score: Object,
  },
};
</script>

<style scoped>
.follower {
  padding: 3px 8px;
  position: absolute;
  top: 200px;
  left: -300px;
  transition: top 1s, left 1s;
  font-variant: small-caps;
}

.active-container {
  height: 100%;
  width: 14%;
  float: left;
}

.rest-container {
  background-image: linear-gradient(to right, #032d61, #0163dd);
  height: 100%;
  width: 86%;
  float: left;
}

.total {
  float: right;
}
</style>
