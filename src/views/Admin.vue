<template>
  <div id="admin">
    <div v-if="scoresId === undefined">
      <p>Looking up contest details for {{ $route.params.uuid }}</p>
    </div>
    <div v-else-if="scoresId === null">
      <p>Not found. No details found for {{ $route.params.uuid }}</p>
    </div>
    <div v-else>
      <h2>Coronavision admin</h2>
      <h6>Scores ID: {{ scoresId }}</h6>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      scoresId: undefined,
      songs: [],
    };
  },
  methods: {
    getSongs() {
      axios.get(`/scoresApi/getSongs/${this.scoresId}`)
        .then((response) => { this.songs = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting songs array: ${err}`);
        });
    },
    lookupScoresId() {
      axios.get(`/scoresApi/getScoresId/${this.$route.params.uuid}`)
        .then((response) => { this.scoresId = response.data.scoresId; })
        .then(this.getSongs)
        .catch(() => { this.scoresId = null; });
    },
  },
  mounted() {
    this.lookupScoresId();
  },
};
</script>

<style scoped>
div#admin {
  padding: 30px;
}
</style>
