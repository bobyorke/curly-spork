<template>
  <div>
    <div id='leaders'>
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
import axios from 'axios';

export default {
  name: 'App',
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
      axios.get('/scoresApi/test')
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
body {
  background: #021636;
  color: #ffffff;
}

.scores {
  width: 200px;
  padding: 8px;
  margin-bottom: 6px;
}
#leaders {
  margin: 100px;
}
.leader {
  visibility: hidden;
  /*background: red;*/
}
.follower {
  background-image: linear-gradient(to right, #032d61, #0163dd);
  position: absolute;
  top: 1200px;
  left: 900px;
  transition: top 1s, left 1s;
}

</style>
