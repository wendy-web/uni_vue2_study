<template>
    <div class="puzzle">
        <div
            v-for="(piece, index) in shuffledPieces"
            :key="index"
            class="piece"
            :style="{ backgroundImage: `url(${piece})`, ...piecePosition(index) }"
        ></div>
    </div>
</template>
<script>
export default {
    data() {
      return {
        originalImage: 'https://file.y1b.cn/store/1-0/231227/658b997bb8200.png', // 替换为你的图片 URL
        pieces: [],
        rows: 4, // 图片拆分的行数
        cols: 4, // 图片拆分的列数
      };
    },
    computed: {
      shuffledPieces() {
        // 随机排序图片块
        return this.pieces.sort(() => Math.random() - 0.5);
      },
    },
    mounted() {
      this.splitImage();
    },
    methods: {
      splitImage() {
        const img = new Image();
        img.src = this.originalImage;
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
          const pieceWidth = img.width / this.cols;
          const pieceHeight = img.height / this.rows;
          for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
              const canvas = document.createElement('canvas');
              canvas.width = pieceWidth;
              canvas.height = pieceHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, y * pieceWidth, x * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
              this.pieces.push(canvas.toDataURL('image/png'));
            }
          }
        };



//         var canvas=document.getElementById("canvas"),//获取canvas
//       ctx = canvas.getContext("2d"), //对应的CanvasRenderingContext2D对象(画笔)
//       img = new Image(),//建立新的图片对象
//       base64 = '' ;//base64 
//   img.src = 'http://www.xxxx.png';
//   img.setAttribute("crossOrigin",'Anonymous')
//   img.onload = function(){//图片加载完，再draw 和 toDataURL
//        ctx.drawImage(img,0,0);    
//        base64 = canvas.toDataURL("image/png"); 
//    };
      },
      piecePosition(index) {
        const row = Math.floor(index / this.cols);
        const col = index % this.cols;
        return {
          transform: `translate(${col * (100 / this.cols)}%, ${row * (100 / this.rows)}%)`,
        };
      },
    },
  };
  </script>
  
  <style>
  .puzzle {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 调整列数和行数以适应你的拼图大小 */
    gap: 2px;
    width: 300px; /* 调整拼图宽度 */
    height: 300px; /* 调整拼图高度 */
    border: 2px solid #ccc;
    overflow: hidden;
    margin: auto;
  }
  
  .piece {
    background-size: 100% 100%;
    transition: transform 0.3s ease-out;
  }
  
  </style>
