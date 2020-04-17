<template>
  <div id="scoreboard" class="overflow-hidden">
    <div id="leaders">
      <div
        class="scores leader"
        v-for="sc in orderedScores"
        :key="sc._id"
        :ref="`score_${sc._id}`"
      >
        {{ sc.song.country }}, {{ sc.song.year }}: {{ sc.total }}
      </div>
    </div>
    <div>
      <div
        class="scores bg-danger follower"
        v-for="sc in scores"
        :key="sc._id"
        ref="score_follow"
      >
        {{ sc.song.country }}, {{ sc.song.year }}: {{ sc.total }}
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
      scores: [],
    };
  },
  computed: {
    orderedScores() {
      return this.scores.concat()
        .sort((a, b) => b.total - a.total);
    },
  },
  methods: {
    updateScores() {
      this.$axios.get(`/scoresApi/getScoresTotal/${this.$route.params.scoresId}`)
        .then((response) => {
          console.log('scores:-');
          console.dir(response.data);
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
      for (let i = 0; i < this.scores.length; i += 1) {
        const scoreName = this.scores[i]._id;
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
  background: #aaee88;
  /*background: #021636;*/
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
  background-image: linear-gradient(to right, #032d61, #0163dd);
  position: absolute;
  top: 200px;
  left: -300px;
  transition: top 1s, left 1s;
}

</style>
