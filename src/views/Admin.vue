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
      <h3 class="mt-3">Vote!!</h3>
      <Voting
        :scoresId="contest.scoresId"
        :songs="songs"
        :voters="voters"
        :scoresOptions="contest.scoresOptions"
      />
      <h3 class="mt-3">Voters</h3>
      <VoterForm v-for="vt in voters" :key="vt.uuid" :voterData="vt" />
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
      contest: undefined,
      songs: [],
      voters: [],
    };
  },
  components: {
    SongForm,
    VoterForm,
    Voting,
  },
  computed: {
    createdDateNice() {
      return moment(this.contest.creationDate).format('HH:mm:ss DD/MM/YY');
    },
  },
  methods: {
    getSongs() {
      this.$axios.get(`/scoresApi/getSongs/${this.contest.scoresId}`)
        .then((response) => { this.songs = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting songs array: ${err}`);
        });
    },
    getVoters() {
      this.$axios.get(`/scoresApi/getVoters/${this.contest.scoresId}`)
        .then((response) => { this.voters = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting voters array: ${err}`);
        });
    },
    lookupScoresId() {
      this.$axios.get(`/scoresApi/getContest/${this.$route.params.uuid}`)
        .then((response) => { this.contest = response.data; })
        .then(this.getSongs)
        .then(this.getVoters)
        .catch(() => { this.contest = null; });
    },
    newSongData() {
      return {
        scoresId: this.contest.scoresId,
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
        scoresId: this.contest.scoresId,
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
