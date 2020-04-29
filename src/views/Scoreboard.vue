<template>
  <div>
    <div id="scoreboard" class="overflow-hidden">
      <div id="leaders">
        <div class="leader-row">
          <div v-for="c in scoreColumns" :key="c" class="leader-col">
            <div
              class="scores leader"
              v-for="sc in orderedScoresColumn(c)"
              :key="sc._id"
              :ref="`score_${sc._id}`"
            >
              {{ sc.name }}: {{ sc.totalScore }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <ScoreElement
          v-for="sc in scores"
          :key="sc._id"
          :score="sc"
          ref="score_follow"
        />
      </div>
    </div>
    <div id="active-round" v-if="activeScores.length > 0">
      <ActiveRound
        :scores="activeScores"
      />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import ScoreElement from '@/components/ScoreElement.vue';
import ActiveRound from '@/components/ActiveRound.vue';

const scoresPerCol = 11;

export default {
  name: 'Scores',
  components: {
    ScoreElement,
    ActiveRound,
  },
  data() {
    return {
      scores: [],
    };
  },
  computed: {
    scoreRows() {
      return scoresPerCol;
    },
    scoreColumns() {
      // needs improvement
      return Math.ceil(this.scores.length / scoresPerCol);
    },
    orderedScores() {
      return this.scores.concat()
        .sort((a, b) => this.scoresSort('totalScore', a, b));
    },
    activeScores() {
      return this.scores.filter((sc) => sc.activeScore !== null)
        .sort((a, b) => this.scoresSort('activeScore', a, b));
    },
  },
  methods: {
    scoresSort(key, a, b) {
      let cmp = b[key] - a[key];
      if (cmp !== 0) return cmp;
      cmp = a.name.localeCompare(b.name);
      return cmp;
    },
    scoresRef(row, col) {
      const ind = (scoresPerCol * col) + (row - 1);
      console.log(`ind: ${ind}`);
      try {
        return `score_${this.orderedScores[ind]._id}`;
      } catch { return null; }
    },
    orderedScoresColumn(colNum) {
      const start = (colNum - 1) * scoresPerCol;
      const end = colNum * scoresPerCol;
      return this.orderedScores.slice(start, end);
    },
    updateScores() {
      this.$axios.get(`/scoresApi/getScoresTotal/${this.$route.params.scoresId}`)
        .then((response) => {
          this.scores = response.data;
          setTimeout(this.updateFollowers, 150);
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(`Error getting scores: ${err}`);
        })
        .finally(() => {
          setTimeout(this.updateScores, 1600);
        });
    },
    updateFollowers() {
      for (let i = 0; i < this.scores.length; i += 1) {
        const scoreName = this.scores[i]._id;
        const ldr = $(this.$refs[`score_${scoreName}`]);
        const pos = ldr.position();
        const flw = $(this.$refs.score_follow[i].$refs.score_follow);
        flw.css('top', pos.top);
        flw.css('left', pos.left);
        flw.css('height', ldr.innerHeight());
        flw.css('width', ldr.innerWidth());
      }
    },
  },
  mounted() {
    this.updateScores();
  },
};
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  background: #021636;
  background-image: url('~@/assets/pqpq_BG_02.jpg');
  background-repeat: no-repeat;
  background-position: right top;
}

div#scoreboard {
  position: absolute;
  top: 10%;
  left: 4%;
  width: 60%;
  height: 80%;
  color: #ffffff;
}

.scores {
  width: 100%;
  height: 9%;
}
#leaders {
  height: 100%;
}
.leader {
  visibility: hidden;
  /*background: red;*/
}

.leader-col {
  float: left;
  width: 50%;
  height: 100%;
}

.leader-row {
  height: 100%;
}

.leader-row:after {
  content: "";
  display: table;
  clear: both;
}

div#active-round {
  position: absolute;
  top: 40%;
  left: 70%;
  width: 22%;
  height: 50%;
  color: #ffffff;
}
</style>
