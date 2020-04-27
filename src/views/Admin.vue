<template>
  <div id="admin">
    <div v-if="quiz === undefined">
      <p>Looking up quiz details for {{ $route.params.uuid }}</p>
    </div>
    <div v-else-if="quiz === null">
      <p>Not found. No details found for {{ $route.params.uuid }}</p>
    </div>
    <div v-else>
      <h2>Quiz admin</h2>
      <p>
        Scores ID: <a
          :href="`/scoreboard/${quiz.scoresId}`"
          target="_blank"
        >{{ quiz.scoresId }}</a>.<br />
        Created: {{ createdDateNice }}.
      </p>
      <h3 class="mt-3">Vote!!</h3>
      <Voting
        :scoresId="quiz.scoresId"
        :songs="songs"
        :participants="voters"
      />
      <h3 class="mt-3">Participants</h3>
      <VoterForm v-for="vt in participants" :key="vt.uuid" :voterData="vt" />
      <VoterForm :voterData="newVoterData()" />
      <h3 class="mt-3">Songs</h3>
      <SongForm v-for="sd in songs" :key="sd.uuid" :songData="sd" />
      <SongForm :songData="newSongData()" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import SongForm from '@/components/SongForm.vue';
import VoterForm from '@/components/VoterForm.vue';
import Voting from '@/components/Voting.vue';

export default {
  data() {
    return {
      quiz: undefined,
      songs: [],
      participants: [],
    };
  },
  components: {
    SongForm,
    VoterForm,
    Voting,
  },
  computed: {
    createdDateNice() {
      return moment(this.quiz.creationDate).format('HH:mm:ss DD/MM/YY');
    },
  },
  methods: {
    getSongs() {
      this.$axios.get(`/scoresApi/getSongs/${this.quiz.scoresId}`)
        .then((response) => { this.songs = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting songs array: ${err}`);
        });
    },
    getVoters() {
      this.$axios.get(`/scoresApi/getVoters/${this.quiz.scoresId}`)
        .then((response) => { this.participants = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting participants array: ${err}`);
        });
    },
    lookupScoresId() {
      this.$axios.get(`/scoresApi/getQuiz/${this.$route.params.uuid}`)
        .then((response) => { this.quiz = response.data; })
        .then(this.getSongs)
        .then(this.getVoters)
        .catch(() => { this.quiz = null; });
    },
    newSongData() {
      return {
        _id: null,
        scoresId: this.quiz.scoresId,
        country: null,
        year: null,
        englishName: null,
        localName: null,
        performingArtist: null,
        credits: null,
        chosenBy: null,
      };
    },
    newVoterData() {
      return {
        _id: null,
        scoresId: this.quiz.scoresId,
        name: null,
      };
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
