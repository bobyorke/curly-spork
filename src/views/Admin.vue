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
      <h3 class="mt-3">Scores!!</h3>
      <Scoring
        :scoresId="quiz.scoresId"
        :rounds="rounds"
        :participants="participants"
      />
      <h3 class="mt-3">Rounds</h3>
      <RoundForm v-for="rd in rounds" :key="rd.uuid" :roundData="rd" />
      <RoundForm :roundData="newRoundData()" />
      <h3 class="mt-3">Participants</h3>
      <ParticipantForm v-for="pt in participants" :key="pt.uuid" :participantData="pt" />
      <ParticipantForm :participantData="newParticipantData()" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import ParticipantForm from '@/components/ParticipantForm.vue';
import RoundForm from '@/components/RoundForm.vue';
import Scoring from '@/components/Scoring.vue';

export default {
  data() {
    return {
      quiz: undefined,
      rounds: [],
      participants: [],
    };
  },
  components: {
    ParticipantForm,
    RoundForm,
    Scoring,
  },
  computed: {
    createdDateNice() {
      return moment(this.quiz.creationDate).format('HH:mm:ss DD/MM/YY');
    },
  },
  methods: {
    getParticipants() {
      this.$axios.get(`/scoresApi/getParticipants/${this.quiz.scoresId}`)
        .then((response) => { this.participants = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting participants array: ${err}`);
        });
    },
    getRounds() {
      this.$axios.get(`/scoresApi/getRounds/${this.quiz.scoresId}`)
        .then((response) => { this.rounds = response.data; })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting rounds array: ${err}`);
        });
    },
    lookupScoresId() {
      this.$axios.get(`/scoresApi/getQuiz/${this.$route.params.uuid}`)
        .then((response) => { this.quiz = response.data; })
        .then(this.getParticipants)
        .then(this.getRounds)
        .catch(() => { this.quiz = null; });
    },
    newRoundData() {
      return {
        _id: null,
        scoresId: this.quiz.scoresId,
        name: null,
      };
    },
    newParticipantData() {
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
