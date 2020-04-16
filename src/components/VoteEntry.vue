<template>
  <div class="row py-2" :class="{ 'bg-success': active }">
    <div class="col-2">
      <b-button variant="danger"
        v-if="!active"
        @click="$parent.setActive(voter)"
      ><b-icon-circle/></b-button>
      <b-button variant="success"
        v-else
        @click="$parent.setActive(null)"
      ><b-icon-circle-fill/></b-button>
      {{ voter }}
    </div>
    <div class="col-10">
      <div class="container-fluid" v-if="active || !$parent.active">
        <div class="row">
          <div class="col" v-for="sc in scoresOptions" :key="sc">
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
    voter: String,
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
  },
  computed: {
    songOptions() {
      return [
        { value: null, text: 'select...', disabled: true },
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
    onChange(evt, score) {
      this.alreadySelected = Object.values(this.scores)
        .filter((x) => x !== null);
    },
  },
};
</script>
