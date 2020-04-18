<template>
  <div class="voting">
    <div class="container-fluid">
      <div class="row">
        <div class="col-2"></div>
        <div class="col-10">
          <div class="container-fluid">
            <div class="row">
              <div
                v-for="sc in scoresOptions"
                :key="sc"
                class="col-12 col-lg-2"
              >
                <h5 class="text-center">
                  {{ pointsSuffix(sc) }}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VoteEntry
        v-for="voter in voters"
        :key="voter._id"
        :scoresId="scoresId"
        :voter="voter"
        :songs="songs"
        :active="activeVoterId === voter._id"
        :scoresOptions="scoresOptions"
        @setActive="setActiveVoter"
      />
    </div>
  </div>
</template>

<script>
import VoteEntry from '@/components/VoteEntry.vue';

export default {
  name: 'Voting',
  components: {
    VoteEntry,
  },
  props: {
    scoresId: String,
    songs: Array,
    voters: Array,
    scoresOptions: Array,
  },
  data() {
    return {
      activeVoterId: null,
    };
  },
  computed: {
    voterNames() {
      return Object.values(this.voters);
    },
  },
  methods: {
    pointsSuffix(label) {
      return `${label} point${/^1$/.test(label) ? '' : 's'}`;
    },
    getActiveVoter() {
      this.$axios.get(`/scoresApi/getActiveVoter/${this.scoresId}`)
        .then((response) => {
          if (response.data.activeVoterId) {
            this.activeVoterId = response.data.activeVoterId;
          } else {
            this.activeVoterId = null;
          }
        })
        .catch((err) => {
          console.log(`Error getting active voter: ${err}`);
        });
    },
    setActiveVoter(value) {
      this.activeVoterId = value ? value._id : null;
      this.$axios.post('/scoresApi/setActiveVoter', {
        scoresId: this.scoresId,
        activeVoterId: value ? value._id : null,
        activeVoterName: value ? value.name : null,
      })
        .catch((err) => {
          this.$bvModal.msgBoxOk(`Error setting active voter: ${err}`);
        });
    },
  },
  mounted() {
    this.getActiveVoter();
  },
};
</script>
