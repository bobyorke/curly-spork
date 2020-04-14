<template>
  <div class="song-form mt-2">
    <b-form inline @submit="onSubmit" @reset="onReset" @change="onChange">
      <b-form-select class="ml-2" placeholder="country" :state="countryOk"
        v-model="form.country" :options="countryOptions">
      </b-form-select>
      <span class="ml-1 flag-container">
        <img v-if="form.country" :src="flagImgSrc" />
      </span>
      <b-input class="ml-1 form-input-year" placeholder="year"
        :state="yearOk" v-model="form.year"></b-input>
      <b-input class="ml-2" placeholder="name (English)" v-model="form.englishName"></b-input>
      <b-input class="ml-2" placeholder="name (local)" v-model="form.localName"></b-input>
      <b-input class="ml-2" placeholder="artist(s)" v-model="form.performingArtist"></b-input>
      <b-input class="ml-2" placeholder="credits" v-model="form.credits"></b-input>
      <b-input class="ml-2" placeholder="chosen by" v-model="form.chosenBy"></b-input>
      <b-button v-if="songData._id != -1" class="ml-2"
        variant="danger" type="reset"
      >reset</b-button>
      <b-button v-if="!cleared" class="ml-2"
        variant="danger" @click="clearEntry"
      >clear</b-button>
      <b-button v-if="cleared && songData._id != -1" class="ml-2"
        variant="danger" @click="deleteEntry"
      >delete</b-button>
      <b-button v-if="changed && readyToSave" class="ml-2"
        variant="success" type="submit"
      >save</b-button>
      <b-form-invalid-feedback :state="countryOk">
        Please select a country
      </b-form-invalid-feedback>
      <b-form-invalid-feedback :state="yearOk">
        Invalid year (first Eurovision was 1956)
      </b-form-invalid-feedback>
      <b-form-invalid-feedback :state="hasName">
        Please enter at least the English or the local song name
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
      publicPath: process.env.BASE_URL,
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
      countryOptions: [
        {
          value: null,
          text: 'country',
        },
      ].concat(Object.entries(config.countries).map(([k, v]) => ({
        value: k,
        text: this.countryText(k, v),
      }))),
    };
  },
  computed: {
    countryOk() {
      return !!this.form.country;
    },
    yearOk() {
      return /^(?:19(?:5[6-9]|[6-9][0-9])|20[012][0-9])$/.test(this.form.year);
    },
    hasName() {
      return !!(this.form.englishName || this.form.localName);
    },
    readyToSave() {
      return (
        this.countryOk
        && this.yearOk
        && this.hasName
      );
    },
    flagImgSrc() {
      return `${this.publicPath}flags/${config.countries[this.form.country].flag}`;
    },
  },
  methods: {
    countryText(cName, cVal) {
      if (cVal.yearsActive) {
        return `${cName} (${cVal.yearsActive})`;
      }
      return cName;
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
      this.form.country = this.songData.country;
      this.form.year = this.songData.year;
      this.form.englishName = this.songData.englishName;
      this.form.localName = this.songData.localName;
      this.form.performingArtist = this.songData.performingArtist;
      this.form.credits = this.songData.credits;
      this.form.chosenBy = this.songData.chosenBy;
      this.changed = false;
    },
    clearEntry() {
      this.form.country = null;
      this.form.year = null;
      this.form.englishName = null;
      this.form.localName = null;
      this.form.performingArtist = null;
      this.form.credits = null;
      this.form.chosenBy = null;
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
