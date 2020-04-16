<template>
  <b-form>
    <b-form-textarea
      v-model="votersText"
      :placeholder="placeholderText"
      :rows="taRows"
      debounce="1250"
    ></b-form-textarea>
  </b-form>
</template>

<script>
const defaultText = 'enter names here (one entry per line)';

export default {
  name: 'Voters',
  props: {
    scoresId: String,
  },
  data() {
    return {
      placeholderText: defaultText,
      votersText: '',
    };
  },
  computed: {
    votersAsArray() {
      return this.votersText.split(/[\r\n]+/);
    },
    votersWeeded() {
      return this.votersAsArray
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
    },
    taRows() {
      return Math.min(8, this.votersAsArray.length + 1);
    },
  },
  methods: {
    updateFromDb() {
      this.$axios.get(`/scoresApi/getVoters/${this.scoresId}`)
        .then((response) => {
          this.votersText = response.data
            .map((v) => v.name).join('\n');
          this.$parent.voters = response.data.map((vd) => ({
            _id: vd._id,
            name: vd.name,
          }));
        })
        .catch(() => {
          this.placeholderText = `${defaultText}\nError reading from database.`;
        });
    },
  },
  mounted() {
    this.updateFromDb();
  },
  watch: {
    /*
    votersWeeded(val) {
      const voterData = val.map((v) => ({
        _id: this.$uuid(),
        scoresId: this.scoresId,
        name: v,
      }));
      this.$axios.post(
        '/scoresApi/setVoters',
        voterData,
      )
        .catch((err) => {
          this.$bvModal.msgBoxOk(
            `Error updating voters: ${err.response.data}`,
          );
        });
    },
    */
  },
};
</script>
