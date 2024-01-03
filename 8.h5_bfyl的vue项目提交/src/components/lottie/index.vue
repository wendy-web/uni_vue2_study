<template>
    <div class="lottie-web-box" :style="style" ref="lavContainer"></div>
</template>
  
<script>
import lottie from "lottie-web";

export default {
    name: "lottie",
    props: {
        options: {
            type: Object,
            required: true,
        },
        height: {
            type: String,
            value: '',
        },
        width: {
            type: String,
            value: '',
        },
    },

    data() {
        return {
            style: {
                width: this.width ? this.width : "100%",
                height: this.height ? this.height : "100%",
                overflow: "hidden",
                margin: "0 auto",
                zIndex: "2",
            },
            anim: null,
        };
    },

    mounted() {
        this.anim = lottie.loadAnimation({
            container: this.$refs.lavContainer,
            renderer: "svg",
            loop: this.options.loop !== false,
            autoplay: this.options.autoplay !== false,
            animationData: this.options.animationData,
            rendererSettings: this.options.rendererSettings,
        });
        this.$emit("animCreated", this.anim);
    },
};
</script>
<style>
.lottie-web-box{
    position: relative;
    z-index: 0;
}
</style>
  