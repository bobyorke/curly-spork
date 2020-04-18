<template>
  <div
    class="scores follower"
    ref="score_follow"
  >
    <div class="active-container">
      <div class="active rounded" v-if="score.activeScore > 0">
        {{ score.activeScore }}
      </div>
    </div>
    <div class="rest-container">
      <span class="flag-container">
        <img :src="flagImgSrc" />
      </span>
      {{ score.country }}, {{ score.year }}
      <div class="total">
        {{ score.totalScore }}
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/../config.json';

export default {
  name: 'ScoreElement',
  props: {
    score: Object,
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    flagImgSrc() {
      return `${this.publicPath}flags/${config.countries[this.score.country].flag}`;
    },
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
  width: 10%;
  float: left;
  padding-top: 8px;
}

.active {
  background: white;
  color: black;
  margin: auto;
  width: 4vh;
  height: 4vh;
  text-align: center;
  line-height: 4vh;
  font-size: 3vh;
  font-weight: bold;
}

.rest-container {
  background-image: linear-gradient(to right, #032d61, #0163dd);
  padding: 0.4vw 1vw 0 1vw;
  height: 100%;
  width: 90%;
  float: left;
  font-size: 2.6vh;
}

.total {
  float: right;
}

.flag-container {
  width: 3vw;
  text-align: center;
  margin-right: 0.3vw;
}

.flag-container img {
  max-width: 3vw;
  max-height: 1.8vw;
}
</style>
