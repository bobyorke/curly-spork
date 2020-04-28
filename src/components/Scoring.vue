<template>
  <div class="scoring">
    <div class="container-fluid">
      <ScoreEntry
        v-for="round in rounds"
        :key="round._id"
        :scoresId="scoresId"
        :round="round"
        :participants="participants"
        :active="activeRoundId === round._id"
        @setActive="setActiveRound"
      />
    </div>
  </div>
</template>

<script>
import ScoreEntry from '@/components/ScoreEntry.vue';

export default {
  name: 'Scoring',
  components: {
    ScoreEntry,
  },
  props: {
    scoresId: String,
    participants: Array,
    rounds: Array,
    scoresOptions: Array,
  },
  data() {
    return {
      activeRoundId: null,
    };
  },
  methods: {
    getActiveRound() {
      this.$axios.get(`/scoresApi/getActiveRound/${this.scoresId}`)
        .then((response) => {
          if (response.data.activeRoundId) {
            this.activeRoundId = response.data.activeRoundId;
          } else {
            this.activeRoundId = null;
          }
        })
        .catch((err) => {
          console.log(`Error getting active round: ${err}`);
        });
    },
    setActiveRound(value) {
      this.activeRoundId = value ? value._id : null;
      this.$axios.post('/scoresApi/setActiveRound', {
        scoresId: this.scoresId,
        activeRoundId: value ? value._id : null,
        activeRoundName: value ? value.name : null,
      })
        .catch((err) => {
          this.$bvModal.msgBoxOk(`Error setting active round: ${err}`);
        });
    },
  },
  mounted() {
    this.getActiveRound();
  },
};
</script>
