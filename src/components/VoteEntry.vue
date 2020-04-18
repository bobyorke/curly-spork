<template>
  <div class="row py-2"
    :class="{ 'border': active, 'border-success': active }"
  >
    <div class="col-2">
      <b-button variant="danger"
        v-if="!active"
        @click="$emit('setActive', voter)"
      ><b-icon-circle/></b-button>
      <b-button variant="success"
        v-else
        @click="$emit('setActive', null)"
      ><b-icon-circle-fill/></b-button>
      {{ voter.name }}
    </div>
    <div class="col-10">
      <div class="container-fluid" v-if="active || !$parent.activeVoterId">
        <div class="row">
          <div class="col-12 col-lg-2" v-for="sc in scoresOptions" :key="sc">
            <b-select
              :options="songOptions"
              v-model="scores[sc]"
              @change="(e) => onChange(e, sc)"
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
  name: 'VoteEntry',
  props: {
    active: Boolean,
    scoresId: String,
    voter: Object,
    songs: Array,
    scoresOptions: Array,
  },
  data() {
    return {
      scores: {},
      alreadySelected: [],
    };
  },
  mounted() {
    this.scores = Object.fromEntries(
      this.scoresOptions.map((sc) => [sc, null]),
    );
    this.$axios.get(
      `/scoresApi/getScores/${this.scoresId}/${this.voter._id}`,
    )
      .then((response) => {
        response.data.scores.forEach((sc) => {
          const song = this.songs.find((s) => s._id === sc.songId);
          if (song) {
            this.scores[`${sc.score}`] = song;
          }
        });
      })
      .catch(() => { /* continue */ });
  },
  computed: {
    songOptions() {
      return [
        { value: null, text: 'select...', disabled: false },
      ].concat(this.songs
        .map((s) => ({
          value: s,
          text: `${s.country}/${s.year}`,
          disabled: this.alreadySelected.includes(s),
        }))
        .sort((a, b) => a.text.localeCompare(b.text)));
    },
  },
  methods: {
    // onChange(evt, score) {
    onChange() {
      this.alreadySelected = Object.values(this.scores)
        .filter((x) => x !== null);
      const scoresData = {
        scoresId: this.scoresId,
        voterId: this.voter._id,
        scores: [],
      };
      Object.entries(this.scores).forEach(([k, v]) => {
        if (v !== null && /^\d+$/.test(k)) {
          scoresData.scores.push({
            songId: v._id,
            score: parseInt(k, 10),
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
