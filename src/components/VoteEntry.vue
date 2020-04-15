<template>
  <div class="row border border-dark" :class="{ 'bg-success': active }">
    <b-form inline>
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
      <div class="col-10 border border-primary">
        <div class="container-fluid" v-if="active || !$parent.active">
          <div class="row">
            <div class="col" v-for="sc in scoresOptions" :key="sc">
              <b-form-select :options="songOptionsPoints(sc)" v-model="form[sc]">
              </b-form-select>
            </div>
          </div>
        </div>
      </div>
    </b-form>
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
      form: {},
    };
  },
  mounted() {
    this.scoresOptions.forEach((s) => {
      this.form[s] = null;
    });
  },
  computed: {
    songOptions() {
      return this.songs.map((s) => ({
        value: s,
        text: `${s.country}/${s.year}`,
      }));
    },
  },
  methods: {
    songOptionsPoints(label) {
      return [
        { value: null, text: label },
      ].concat(this.songOptions);
    },
  },
};
</script>
