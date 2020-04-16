<template>
  <div id="create">
    <h2>Create new contest</h2>
    <b-form inline @submit="onSubmit" v-if="submitStatus === undefined">
      <label>Identifier:</label>
      <b-input class="ml-2" v-model="form.sid"></b-input>
      <label class="ml-3">score values:</label>
      <b-input class="ml-2" :state="scoresOk" v-model="form.scoresOptions"></b-input>
      <b-button class="ml-2" variant="primary" type="submit">Create!</b-button>
      <b-form-invalid-feedback :state="scoresOk">
        Score values can only contain numbers separated by commas or spaces
      </b-form-invalid-feedback>
    </b-form>
    <div v-else-if="submitStatus === false">
      <b-spinner variant="success"></b-spinner>
    </div>
    <div v-else-if="submitStatus === true">
      <p>Submitted!</p>
    </div>
    <div class="mt-3">
      <p>
        This contest can be administered from:-<br /><a
          :href="`/admin/${this.form.uuid}`"
          target="_blank"
        >{{ adminUrl }}</a><br />
        <strong>Make a note of this! You'll need it.</strong>
      </p>
    </div>
  </div>
</template>

<script>
import config from '../../config.json';

export default {
  data() {
    return {
      submitStatus: undefined,
      form: {
        sid: this.getRandomSid(),
        scoresOptions: config.defaultScoresOptions.join(', '),
        uuid: this.$uuid(),
      },
    };
  },
  computed: {
    adminUrl() {
      return `${window.location.origin}/admin/${this.form.uuid}`;
    },
    scoresOk() {
      return /^(?:\d[\s,]*)+$/.test(this.form.scoresOptions);
    },
  },
  methods: {
    getRandomSid() {
      return `0000000000${Math.floor(Math.random() * 1000000000)}`
        .slice(-10);
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.submitStatus = false;
      this.$axios.post('/scoresApi/create', this.form)
        .then(() => {
          this.submitStatus = true;
          setTimeout(() => {
            window.location.href = this.adminUrl;
          }, 2000);
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.dir(err);
          let errMsg = err.message;
          try {
            errMsg = err.response.data;
          } catch { /* continue */ }
          this.submitStatus = undefined;
          this.$bvModal.msgBoxOk(`Error on submission: ${errMsg}`);
        });
    },
  },
};
</script>

<style scoped>
div#create {
  padding: 30px;
}
</style>
