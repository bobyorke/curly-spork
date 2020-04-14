<template>
  <div class="song-form">
    <b-form inline @submit="onSubmit" @reset="onReset" @change="onChange">
      <label>Country</label>
      <b-form-select class="ml-2" v-model="form.country" :options="countryOptions">
      </b-form-select>
      <label class="ml-3">Year</label>
      <b-input class="ml-2 form-input-year" :state="yearOk" v-model="form.year"></b-input>
      <label class="ml-3">Name (English)</label>
      <b-input class="ml-2" v-model="form.englishName"></b-input>
      <label class="ml-3">Name (Local)</label>
      <b-input class="ml-2" v-model="form.localName"></b-input>
      <label class="ml-3">Chosen by</label>
      <b-input class="ml-2" v-model="form.chosenBy"></b-input>
      <b-button class="ml-2" variant="danger" type="reset">reset</b-button>
      <b-button v-if="!cleared" class="ml-2" variant="danger" @click="clearEntry">clear</b-button>
      <b-button v-if="cleared && form._id !== -1" class="ml-2"
        variant="danger" @click="deleteEntry"
      >delete</b-button>
      <b-button v-if="changed" class="ml-2" variant="success" type="submit">save</b-button>
      <b-form-invalid-feedback :state="yearOk">
        Invalid year (first Eurovision was 1956)
      </b-form-invalid-feedback>
    </b-form>
  </div>
</template>

<script>
import config from '../../config.json';

export default {
  props: {
    songData: Object,
  },
  data() {
    return {
      changed: false,
      cleared: false,
      form: {
        // eslint-disable-next-line
        _id: this.songData._id || -1,
        country: this.songData.country,
        year: this.songData.year,
        englishName: this.songData.englishName,
        localName: this.songData.localName,
        performingArtist: this.songData.performingArtist,
        credits: this.songData.credits,
        chosenBy: this.songData.chosenBy,
      },
      countryOptions: config.countries.map((c) => ({
        value: c.name,
        text: this.countryText(c),
      })),
    };
  },
  computed: {
    yearOk() {
      return /^(?:19(?:5[6-9]|[6-9][0-9])|20[012][0-9])$/.test(this.form.year);
    },
  },
  methods: {
    countryText(c) {
      if (c.yearsActive) {
        return `${c.name} (${c.yearsActive})`;
      }
      return c.name;
    },
    onChange() {
      this.changed = true;
      this.cleared = false;
    },
    onSubmit(evt) {
      evt.preventDefault();
    },
    onReset(evt) {
      evt.preventDefault();
      this.form = {
        country: this.songData.country,
        year: this.songData.year,
        englishName: this.songData.englishName,
        localName: this.songData.localName,
        performingArtist: this.songData.performingArtist,
        credits: this.songData.credits,
        chosenBy: this.songData.chosenBy,
      };
      this.changed = false;
    },
    clearEntry() {
      this.form = {
        country: null,
        year: null,
        englishName: null,
        localName: null,
        performingArtist: null,
        credits: null,
        chosenBy: null,
      };
      this.cleared = true;
    },
    deleteEntry() {
    },
  },
};
</script>

<style scoped>
.form-input-year {
  width: 6em;
}
</style>
