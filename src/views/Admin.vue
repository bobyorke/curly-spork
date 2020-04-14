<template>
  <div id="admin">
    <div v-if="contest === undefined">
      <p>Looking up contest details for {{ $route.params.uuid }}</p>
    </div>
    <div v-else-if="contest === null">
      <p>Not found. No details found for {{ $route.params.uuid }}</p>
    </div>
    <div v-else>
      <h2>Coronavision admin</h2>
      <p>
        Scores ID: {{ contest.scoresId }}.<br />
        Points: {{ contest.scoresOptions }}.<br />
        Created: {{ createdDateNice }}.
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      contest: undefined,
      songs: [],
    };
  },
  computed: {
    createdDateNice() {
      return moment(this.contest.creationDate).format('HH:mm:ss DD/MM/YY');
    },
  },
  methods: {
    getSongs() {
      axios.get(`/scoresApi/getSongs/${this.contest.scoresId}`)
        .then((response) => { this.songs = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting songs array: ${err}`);
        });
    },
    lookupScoresId() {
      axios.get(`/scoresApi/getContest/${this.$route.params.uuid}`)
        .then((response) => { this.contest = response.data; })
        // .then(this.getSongs)
        .catch(() => { this.contest = null; });
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
