<script setup lang="ts">
/* 检测说明组件 */

const props = defineProps({
  brand: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="explain-container px-4">
    <!-- 红牛 -->
    <ul class="red-bull" v-if="brand === 'ND1'">
      <li>1、当班化验员各岗位工序检验频次为每4小时一次，所有实时情况如实填写；</li>
      <li>
        2、每小时专检中：20罐空罐质量包括空罐的外观、标签标识、罐内外涂膜质量等；20罐产品质量包括产品外观、标签标识、罐底码、防伪和二维码质量等；
      </li>
      <li>
        3、码垛岗位二维码质量包括扫读和追溯信息，扫读抽检频次：5箱/小时，追溯信息验证频次：1箱/批，记录扫读5箱中的其中1箱身份编码并确认信息正误；
      </li>
      <li>4、所有检测项目中如有复检等特殊情况需在备注进行详细说明。</li>
    </ul>
    <!-- 战马 -->
    <ul class="war-horse" v-if="brand === 'ND2'">
      <li>1、当班化验员各岗位工序检验频次为每4小时一次，所有实时情况如实填写；</li>
      <li>
        2、每小时专检中：20罐空罐质量包括空罐的外观、标签标识、罐内外涂膜质量等；20罐产品质量包括产品外观、标签标识、罐底码、防伪和二维码质量等；
      </li>
      <li>3、所有检测项目中如有复检等特殊情况需在备注进行详细说明。</li>
    </ul>
  </div>
</template>
<style lang="scss" scoped></style>
