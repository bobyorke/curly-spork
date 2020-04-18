<template>
  <div id="scoreboard" class="overflow-hidden">
    <div id="leaders">
      <table>
        <tbody>
          <tr v-for="r in scoreRows" :key="r">
            <td>
              <div class="scores leader" :ref="scoresRef(r, 0)" >
                ---
              </div>
              <div class="scores leader" :ref="scoresRef(r, 1)" >
                ---
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div
        class="scores bg-danger follower"
        v-for="sc in scores"
        :key="sc._id"
        ref="score_follow"
      >
        {{ sc.country }}, {{ sc.year }}: {{ sc.totalScore }}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

const scoresPerCol = 11;

export default {
  name: 'Scores',
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
        .sort((a, b) => b.totalScore - a.totalScore);
    },
  },
  methods: {
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
          setTimeout(this.updateScores, 5000);
        });
    },
    updateFollowers() {
      for (let i = 0; i < this.scores.length; i += 1) {
        const scoreName = this.scores[i]._id;
        const ldr = $(this.$refs[`score_${scoreName}`]);
        const pos = ldr.position();
        const flw = $(this.$refs.score_follow[i]);
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
  background: #aaee88;
  /*background: #021636;*/
}

div#scoreboard {
  position: absolute;
  top: 10%;
  left: 7%;
  width: 60%;
  height: 80%;
  color: #ffffff;
  border: 1px solid black;
}

.scores {
  height: 9%;
}
#leaders {
  margin-left: 100px;
}
.leader {
  width: 200px;
  height: 30px;
  /*visibility: hidden;*/
  background: red;
}
.follower {
  background-image: linear-gradient(to right, #032d61, #0163dd);
  position: absolute;
  top: 200px;
  left: -300px;
  transition: top 1s, left 1s;
}

</style>
