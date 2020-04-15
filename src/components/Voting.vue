<template>
  <div class="voting">
    <div class="container-fluid">
      <VoteEntry
        v-for="voter in voters"
        :key="voter"
        :voter="voter"
        :songs="songs"
        :active="active === voter"
        :scoresOptions="scoresOptions"
        @setActive="setActive"
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
    songs: Array,
    voters: Array,
    scoresOptions: Array,
  },
  data() {
    return {
      active: null,
    };
  },
  methods: {
    setActive(value) {
      console.log(`setActive: ${value}`);
      this.active = value;
    },
  },
};
</script>
