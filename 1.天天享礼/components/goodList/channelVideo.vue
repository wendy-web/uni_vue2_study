<template>
  <!-- 视频组件 -->
  <channel-video
    class="channel_video"
    object-fit="cover"
    autoplay
    loop
    :muted="true"
    :feed-id="good.video_account_id"
    :finder-user-name="good.video_id"
    @error="sphError"
  >
    <van-image
      @click="openSph(good.video_account_id, good.video_id)"
      width="100%" height="100%"
      :src="good.image" use-loading-slot
    ><van-loading slot="loading" type="spinner" size="20" vertical />
    </van-image>
  </channel-video>
</template>

<script>
export default {
  props: {
    good: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {};
  },
  methods: {
    sphError(err) { },
  },
};
</script>
<style lang="scss">
.channel_video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  border-radius: 8px;
}
</style>
