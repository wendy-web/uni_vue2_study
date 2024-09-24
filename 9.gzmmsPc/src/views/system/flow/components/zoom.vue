<script setup lang="ts">
const emits = defineEmits(["zoom"]);

let nowVal = ref(100);
const zoomSize = (type: number) => {
  if (type == 1) {
    if (nowVal.value == 50) {
      return;
    }
    nowVal.value -= 10;
    emits("zoom", nowVal.value);
  } else {
    if (nowVal.value == 300) {
      return;
    }
    nowVal.value += 10;
    emits("zoom", nowVal.value);
  }
};
</script>
<template>
  <div class="zoom-wrapper">
    <div class="zoom-out" :class="nowVal == 50 && 'disabled'" @click="zoomSize(1)">
      <i-ep-Minus class="zoom-icon"></i-ep-Minus>
    </div>
    <span>{{ nowVal }}%</span>
    <div class="zoom-in" :class="nowVal == 300 && 'disabled'" @click="zoomSize(2)">
      <i-ep-Plus class="zoom-icon"></i-ep-Plus>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.zoom-wrapper {
  display: flex;
  position: fixed;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  height: 40px;
  width: 125px;
  top: 180px;
  right: 120px;
  margin-top: 30px;
  z-index: 10;
}

.zoom-wrapper .zoom-in,
.zoom-wrapper .zoom-out {
  width: 30px;
  height: 30px;
  background: #fff;
  color: #c1c1cd;
  cursor: pointer;
  background-size: 100%;
  background-repeat: no-repeat;
}

.zoom-wrapper .zoom-out {
  color: #333333;
  text-align: center;
  line-height: 30px;
}

.zoom-wrapper .zoom-out.disabled {
  opacity: 0.5;
}

.zoom-wrapper .zoom-in {
  text-align: center;
  color: #333333;
  line-height: 30px;
}

.zoom-wrapper .zoom-in.disabled {
  opacity: 0.5;
}
</style>
