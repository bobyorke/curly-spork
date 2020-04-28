<template>
  <div class="voter-form mt-2">
    <b-form inline @submit="submitEntry"
      @reset="resetEntry"
      autocomplete="off"
    >
      <b-input class="ml-1" placeholder="name"
        :state="nameOk" v-model="form.name"></b-input>
      <b-button class="ml-2" variant="danger" type="reset">reset</b-button>
      <b-button v-if="voterData._id !== null" class="ml-2"
        variant="danger" @click="deleteEntry"
      >delete</b-button>
      <b-button class="ml-2" variant="success" type="submit">save</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'VoterForm',
  props: {
    voterData: Object,
  },
  data() {
    return {
      form: {
        _id: this.voterData._id,
        scoresId: this.voterData.scoresId,
        name: this.voterData.name,
      },
    };
  },
  computed: {
    nameOk() {
      return (this.form.name || '').length > 0;
    },
  },
  methods: {
    submitEntry(evt) {
      evt.preventDefault();
      this.form.uuid = this.$uuid();
      this.$axios.post('/scoresApi/addVoter', this.form)
        .then(() => { this.resetEntry(); })
        .catch((err) => {
          console.dir(err);
          const errMsg = (err.response) ? err.response.data : err;
          this.$bvModal.msgBoxOk(errMsg);
        })
        .finally(this.$parent.getVoters);
    },
    resetEntry(evt) {
      if (evt) { evt.preventDefault(); }
      this.form.name = this.voterData.name;
    },
    deleteEntry() {
      this.$bvModal.msgBoxConfirm(
        `Are you sure you want to delete voter "${this.form.name}"?
        Any scores they have submitted will also be deleted!`,
      )
        .then(
          (value) => {
            if (value) {
              this.$axios.post('/scoresApi/deleteVoter', {
                _id: this.form._id,
                scoresId: this.form.scoresId,
              })
                .catch((err) => {
                  console.dir(err);
                  const errMsg = (err.response) ? err.response.data : err;
                  this.$bvModal.msgBoxOk(errMsg);
                })
                .finally(this.$parent.getVoters);
            }
          },
          () => { /* continue */ },
        );
    },
  },
};
</script>

<style scoped>
</style>
