<template>
  <div
    class="scores bg-danger follower"
    ref="score_follow"
  >
    <div class="active-container">
      <div class="active" v-if="score.activeScore > 0">
        {{ score.activeScore }}
      </div>
    </div>
    <div class="rest-container">
      {{ score.country }}
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

<style>
.follower {
  background-image: linear-gradient(to right, #032d61, #0163dd);
  position: absolute;
  top: 200px;
  left: -300px;
  transition: top 1s, left 1s;
}

.active-container {
  height: 100%;
  width: 14%;
  float: left;
}

.rest-container {
  height: 100%;
  width: 86%;
  float: left;
}
</style>
