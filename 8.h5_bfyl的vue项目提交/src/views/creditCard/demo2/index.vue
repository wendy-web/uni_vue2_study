<template>
  <div>
    <div class="puzzle-container">
      <div
        v-for="(piece, index) in pieces"
        :key="index"
        :class="{ 'piece': true, 'empty': piece === emptyPiece }"
        @click="movePiece(index)"
      >
        <img :src="piece" class="puzzle-piece" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pieces: [
        'https://img14.360buyimg.com/pop/jfs/t1/76891/32/21241/195902/64a4d6ffF5ea6e8ab/4b64db7641507beb.jpg',
        'https://t-yk-rick-static.oss-cn-shenzhen.aliyuncs.com/2022-11-09/030b2f37d4fe48e8991c0446861dca40.jpg',
        'https://img14.360buyimg.com/pop/jfs/t1/163441/10/3501/184469/60093364Ece745424/8a4de29cb06dee31.png',
        'https://img14.360buyimg.com/pop/jfs/t1/116611/29/27501/384143/62babfe8Efad44024/27b3d6ce32cefe3f.jpg',
        'https://img14.360buyimg.com/pop/jfs/t1/97643/10/26600/84145/6455bc66Fd27dfc45/527d087f09411070.jpg' // Empty piece
      ],
      emptyPiece: 'https://img14.360buyimg.com/pop/jfs/t1/97643/10/26600/84145/6455bc66Fd27dfc45/527d087f09411070.jpg',
      gridSize: 2 // Change this value based on the grid size of the puzzle
    };
  },
  methods: {
    movePiece(index) {
      if (this.isMoveValid(index)) {
        this.swapPieces(index);
      }
    },
    isMoveValid(index) {
      // Check if the empty piece is adjacent to the clicked piece
      const emptyIndex = this.pieces.indexOf(this.emptyPiece);
      const rowDiff = Math.abs(Math.floor(index / this.gridSize) - Math.floor(emptyIndex / this.gridSize));
      const colDiff = Math.abs((index % this.gridSize) - (emptyIndex % this.gridSize));
      return (rowDiff === 1 && colDiff === 0) || (colDiff === 1 && rowDiff === 0);
    },
    swapPieces(index) {
      const emptyIndex = this.pieces.indexOf(this.emptyPiece);
      const temp = this.pieces[index];
      this.$set(this.pieces, index, this.emptyPiece);
      this.$set(this.pieces, emptyIndex, temp);
    }
  }
};
</script>

<style>
.puzzle-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Change this value based on the grid size of the puzzle */
  grid-gap: 5px;
}

.piece {
  width: 100%;
  height: auto;
}

.empty {
  visibility: hidden;
}

.puzzle-piece {
  width: 100%;
  height: 100%;
}
</style>
