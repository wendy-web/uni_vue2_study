<template>
<uni-shadow-root class="vant_update-popup-popup"><view v-if="inited" :class="'custom-class '+(classes)+' '+(utils.bem('popup', [position, { round, safe: safeAreaInsetBottom, safeTop: safeAreaInsetTop, safeTabBar: safeAreaTabBar }]))" :style="computed.popupStyle({ zIndex, currentDuration, display, customStyle })" @transitionend="onTransitionEnd">
  <slot></slot>
  <van-icon v-if="closeable" :name="closeIcon" :class="'close-icon-class van-popup__close-icon van-popup__close-icon--'+(closeIconPosition)" @click.native="onClickCloseIcon"></van-icon>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'vant_update/popup/popup'

Component({})

export default global['__wxComponents']['vant_update/popup/popup']
</script>
<style platform="mp-weixin">

</style>