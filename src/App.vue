<template>
  <div id="app">
    <h1>Test app</h1>
    <div 
      class="scores bg-primary mb-2"
      v-for="([name, score]) in orderedScores"
      :key="name"
    >
      {{ name }}: {{ score }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      scores: {},
    };
  },
  computed: {
    orderedScores() {
      return Object.entries(this.scores)
        .sort((a, b) => a[1] - b[1]);
    },
  },
  methods: {
    updateScores() {
      axios.get('/scoresApi/test')
        .then(response => {
          this.scores = response.data;
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(`Error getting scores: ${err}`);
        })
        .finally(() => {
          setTimeout(this.updateScores, 2000);
        });
    },
  },
  mounted() {
    this.updateScores();
  },
}
</script>

<style>
.scores {
  transition: top 2s;
}
</style>
