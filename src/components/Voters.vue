<template>
  <b-form>
    <b-form-textarea
      v-model="votersText"
      placeholder="enter names here (one entry per line)"
      :rows="taRows"
      debounce="50"
    ></b-form-textarea>
  </b-form>
</template>

<script>
export default {
  props: {
    scoresId: String,
  },
  data() {
    return {
      votersText: '',
    };
  },
  computed: {
    taRows() {
      return Math.min(8, this.votersText.split(/[\r\n]+/).length + 2);
    },
  },
  methods: {
    updateFromDb() {
      this.$axios.get(`/getVoters/${this.scoresId}`);
    },
  },
  mounted() {
    this.updateFromDb();
  },
};
</script>
