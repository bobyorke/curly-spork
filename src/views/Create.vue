<template>
  <div id="create">
    <h2>Create new contest</h2>
    <b-form inline @submit="onSubmit">
      <label>Identifier:</label>
      <b-input class="ml-2" v-model="form.sid"></b-input>
      <b-input class="ml-2" v-model="form.uuid"></b-input>
      <b-button class="ml-2" variant="primary" type="submit">Create!</b-button>
    </b-form>
    <div>
      <p>
        This contest can be administered from <a
          :href="`/admin/${this.form.uuid}`"
          target="_blank"
        >{{ adminUrl }}</a>
      </p>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';

export default {
  data() {
    return {
      form: {
        sid: this.getRandomSid(),
        uuid: uuid(),
      },
    };
  },
  computed: {
    adminUrl() {
      return `${window.location.origin}/admin/${this.form.uuid}`;
    },
  },
  methods: {
    getRandomSid() {
      return `0000000000${Math.floor(Math.random() * 1000000000)}`
        .slice(-10);
    },
    onSubmit(evt) {
      console.log('onSubmit() called');
      console.dir(evt);
      console.dir(this);
      evt.preventDefault();
      // eslint-disable-next-line
      alert(JSON.stringify(this.form, null, 2));
    },
  },
};
</script>

<style scoped>
div#create {
  padding: 30px;
}
</style>
