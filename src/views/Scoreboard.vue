<template>
  <div id="scoreboard" class="overflow-hidden">
    <div id="leaders">
      <h1>Test app</h1>
      <div
        class="scores leader"
        v-for="[name, score] in orderedScores"
        :key="name"
        :ref="`score_${name}`"
      >
        {{ name }}: {{ score }}
      </div>
    </div>
    <div>
      <div
        class="scores bg-danger follower"
        v-for="[name, score] in arrayScores"
        :key="name"
        ref="score_follow"
      >
        {{ name }}: {{ score }}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'Scores',
  data() {
    return {
      scores: {},
    };
  },
  computed: {
    arrayScores() {
      return Object.entries(this.scores);
    },
    orderedScores() {
      return this.arrayScores.concat()
        .sort((a, b) => b[1] - a[1]);
    },
  },
  methods: {
    updateScores() {
      this.$axios.get('/scoresApi/test')
        .then((response) => {
          this.scores = response.data;
          setTimeout(this.updateFollowers, 150);
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting scores: ${err}`);
        })
        .finally(() => {
          setTimeout(this.updateScores, 5000);
        });
    },
    updateFollowers() {
      for (let i = 0; i < this.arrayScores.length; i += 1) {
        const scoreName = Object.keys(this.scores)[i];
        const ldr = $(this.$refs[`score_${scoreName}`][0]);
        const pos = ldr.position();
        const flw = $(this.$refs.score_follow[i]);
        flw.css('top', pos.top);
        flw.css('left', pos.left);
        flw.css('height', ldr.innerHeight());
        flw.css('width', ldr.innerWidth());
      }
    },
  },
  mounted() {
    this.updateScores();
  },
};
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  /*background: #aaee88;*/
  background: #021636;
}

div#scoreboard {
  position: absolute;
  top: 10%;
  left: 7%;
  width: 60%;
  height: 80%;
  color: #ffffff;
  border: 1px solid black;
}

.scores {
  width: 200px;
  padding: 8px;
  margin-bottom: 6px;
}
#leaders {
  margin-left: 100px;
}
.leader {
  /*visibility: hidden;*/
  background: red;
}
.follower {
  display: none;
  background-image: linear-gradient(to right, #032d61, #0163dd);
  position: absolute;
  top: 200px;
  left: -300px;
  transition: top 1s, left 1s;
}

</style>
