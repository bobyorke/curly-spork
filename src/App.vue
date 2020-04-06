<template>
  <div id="app">
    <div id='leaders'>
      <h1>Test app</h1>
      <div 
        class="scores bg-primary mb-2 leader"
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
        .then(response => {
          this.scores = response.data;
          setTimeout(this.updateFollowers, 150);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(`Error getting scores: ${err}`);
        })
        .finally(() => {
          setTimeout(this.updateScores, 5000);
        });
    },
    updateFollowers() {
      for(let i = 0; i < this.arrayScores.length; i++) {
        const scoreName = Object.keys(this.scores)[i];
        const pos = $(this.$refs[`score_${scoreName}`][0]).position();
        const flw = $(this.$refs.score_follow[i]);
        flw.css('top', pos.top);
        flw.css('left', pos.left);
      }
    }, 
  },
  mounted() {
    this.updateScores();
  },
}
</script>

<style>
.scores {
  width: 200px;
  height: 25px;
}
#leaders {
  margin: 100px;
}
.leader {
  visibility: hidden;
}
.follower {
  position: absolute;
  top: 400px;
  left: -300px;
  transition: top 1s, left 1s;
}
</style>
