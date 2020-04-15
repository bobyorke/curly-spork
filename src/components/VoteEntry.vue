<template>
  <div class="row border border-dark" :class="{ 'bg-danger': active }">
    <div class="col-md">
      {{ voter }}
    </div>
    <div class="col-md">
      {{ voter }}
    </div>
    <div class="col-md">
      {{ voter }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoteEntry',
  props: {
    active: Boolean,
    voter: String,
    songs: Array,
    scoresOptions: Array,
  },
};
</script>
