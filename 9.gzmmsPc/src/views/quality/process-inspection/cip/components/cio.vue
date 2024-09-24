<script setup lang="ts"></script>
<template>
  <table>
    <tr>
      <td>序号</td>
      <td>检测项目</td>
      <td colspan="2">内容</td>
      <td>测定值</td>
      <td>检验人员</td>
      <td>检测状态</td>
      <td>操作</td>
    </tr>
    <tr>
      <td>1</td>
      <td rowspan="2">CIP前</td>
      <td colspan="2">产品卷封质量</td>
      <td>ok</td>
      <td>X.Feng</td>
      <td>已检测</td>
      <td>无需执行</td>
    </tr>
    <tr>
      <td>2</td>
      <td colspan="2">灌装间卫生检测</td>
      <td></td>
      <td></td>
      <td>未检测</td>
      <td>无需执行</td>
    </tr>
    <tr>
      <td rowspan="2">3</td>
      <td rowspan="2">CIP</td>
      <td rowspan="2">悬浮粒子</td>
      <td>≥0.5um</td>
      <td>
        <ul>
          <li>均值：</li>
          <li>限值：</li>
        </ul>
      </td>
      <td>-</td>
      <td>未检测</td>
      <td>无需执行</td>
    </tr>
    <tr>
      <td>≥5um</td>
      <td>
        <ul>
          <li>均值：</li>
          <li>限值：</li>
        </ul>
      </td>
      <td>-</td>
      <td>未检测</td>
      <td>无需执行</td>
    </tr>
    <tr>
      <td>4</td>
      <td rowspan="8">开机前过滤器后水样 （二氧化氯）</td>
      <td colspan="2">电导率（≤3us/cm）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>5</td>
      <td colspan="2">PH值（5.2-6.8）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td rowspan="2">6</td>
      <td colspan="2">二氧化氯（＜0.2ppm）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td colspan="2">余氯（＜0.05ppm）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>7</td>
      <td colspan="2">色度（≤10）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>8</td>
      <td colspan="2">感官</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>9</td>
      <td colspan="2">抽滤是否有油</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>10</td>
      <td colspan="2">取水样2瓶</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>11</td>
      <td rowspan="3">开机前红牛半成品</td>
      <td colspan="2">糖度（12.1-12.6）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>12</td>
      <td colspan="2">酸度（3.40-3.55）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>13</td>
      <td colspan="2">UV</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>14</td>
      <td>开机前灌装出口水样</td>
      <td colspan="2">取未封口样3瓶</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>15</td>
      <td rowspan="4">开机时红牛产品</td>
      <td colspan="2">纯净度</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <!-- 战马时显示 -->
      <td>16</td>
      <td colspan="2">10罐产品高温内压均值（MPa）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>16</td>
      <td colspan="2">糖度（12.1-12.6）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>17</td>
      <td colspan="2">酸度（3.40-3.55）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>18</td>
      <td>开机后</td>
      <td colspan="2">取样40罐</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td>19</td>
      <td>正常生产15分钟后</td>
      <td colspan="2">产品卷封</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td rowspan="2">20</td>
      <td rowspan="2">正常生产20分钟后</td>
      <td colspan="2">20罐产品重量均值（g）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
    <tr>
      <td colspan="2">罐盖重量均值（g）</td>
      <td>-</td>
      <td>-</td>
      <td>未检测</td>
      <td>执行检测</td>
    </tr>
  </table>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>
