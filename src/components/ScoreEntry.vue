<template>
  <div class="row py-2"
    :class="{ 'border': active, 'border-success': active }"
  >
    <div class="col-2">
      <b-button variant="danger"
        v-if="!active"
        @click="$emit('setActive', round)"
      ><b-icon-circle/></b-button>
      <b-button variant="success"
        v-else
        @click="$emit('setActive', null)"
      ><b-icon-circle-fill/></b-button>
      {{ round.name }}
    </div>
    <div class="col-10">
      <div class="container-fluid" v-if="active || !$parent.activeRoundId">
        <div class="row">
          <div class="col-12 col-lg-2" v-for="pt in participants" :key="pt.uuid">
            <b-select
              :options="pointsArray(pt.name)"
              v-model="scores[pt._id]"
              @change="(e) => onChange(e, pt)"
            >
            </b-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreEntry',
  props: {
    active: Boolean,
    scoresId: String,
    round: Object,
    participants: Array,
  },
  data() {
    return {
      scores: {},
    };
  },
  mounted() {
    setTimeout(() => {
      this.scores = Object.fromEntries(
        this.participants.map((pt) => [pt._id, null]),
      );
      this.$axios.get(
        `/scoresApi/getScores/${this.scoresId}/${this.round._id}`,
      )
        .then((response) => {
          if (response.data && response.data.scores) {
            response.data.scores.forEach((sc) => {
              const pt = this.participants.find((p) => p._id === sc.participantId);
              if (pt) {
                this.scores[pt._id] = sc.score;
              }
            });
          }
        })
        .catch(() => { /* continue */ });
    });
  },
  methods: {
    pointsArray(name) {
      return [{ value: null, html: `[ ${name} ]` }]
        .concat(
          [...Array(65).keys()]
            .map((x) => ({
              value: x,
              text: x,
            })),
        );
    },
    // onChange(evt, score) {
    onChange() {
      const scoresData = {
        scoresId: this.scoresId,
        roundId: this.round._id,
        scores: [],
      };
      Object.entries(this.scores).forEach(([k, v]) => {
        if (v !== null && /^\d+$/.test(v)) {
          scoresData.scores.push({
            participantId: k,
            score: parseInt(v, 10),
          });
        }
      });
      this.$axios.post('/scoresApi/submitScores', scoresData)
        .catch((err) => {
          this.$bvModal.msgBoxOk(`Error submitting score: ${err}`);
        });
    },
  },
};
</script>

<style scoped>
</style>
