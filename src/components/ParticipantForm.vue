<template>
  <div class="participant-form mt-2">
    <b-form inline @submit="submitEntry"
      @reset="resetEntry" @change="onChange"
      autocomplete="off"
    >
      <b-input class="ml-2" placeholder="particpant name" :state="nameOk"
        v-model="form.name">
      </b-input>
      <b-button v-if="participantData._id !== null" class="ml-2"
        variant="danger" @click="deleteEntry"
      >delete</b-button>
      <b-button v-if="changed" class="ml-2"
        variant="danger" type="reset"
      >reset</b-button>
      <b-button v-if="changed && readyToSave" class="ml-2"
        variant="success" type="submit"
      >save</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'ParticipantForm',
  props: {
    participantData: Object,
  },
  data() {
    return {
      changed: false,
      form: {
        _id: this.participantData._id,
        scoresId: this.participantData.scoresId,
        name: this.participantData.name,
      },
    };
  },
  computed: {
    nameOk() {
      return (this.form.name || '').length > 0;
    },
    readyToSave() {
      return this.nameOk;
    },
  },
  methods: {
    onChange() {
      this.changed = true;
    },
    submitEntry(evt) {
      evt.preventDefault();
      this.form.uuid = this.$uuid();
      this.$axios.post('/scoresApi/addParticipant', this.form)
        .then(() => { this.resetEntry(); })
        .catch((err) => {
          console.dir(err);
          const errMsg = (err.response) ? err.response.data : err;
          this.$bvModal.msgBoxOk(errMsg);
        })
        .finally(this.$parent.getParticipants);
    },
    resetEntry(evt) {
      if (evt) { evt.preventDefault(); }
      this.form.name = this.participantData.name;
      this.changed = false;
    },
    deleteEntry() {
      this.$bvModal.msgBoxConfirm(
        `Are you sure you want to delete ${this.form.name}?`,
      )
        .then(
          (value) => {
            if (value) {
              this.$axios.post('/scoresApi/deleteParticipant', {
                _id: this.form._id,
                scoresId: this.form.scoresId,
              })
                .catch((err) => {
                  console.dir(err);
                  const errMsg = (err.response) ? err.response.data : err;
                  this.$bvModal.msgBoxOk(errMsg);
                })
                .finally(this.$parent.getParticipants);
            }
          },
          () => { /* continue */ },
        );
    },
  },
};
</script>

<style scoped>
.form-input-year {
  width: 6em;
}

.flag-container {
  width: 40px;
  text-align: center;
}

.flag-container img {
  max-width: 40px;
  max-height: 24px;
  border: 1px solid black;
}
</style>
