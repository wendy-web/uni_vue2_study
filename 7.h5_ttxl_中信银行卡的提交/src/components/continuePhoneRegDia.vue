<template>
<van-popup
  v-model="isShow"
  :round="true"
>
<div class="dia_cont">
  <div class="confirm_text">确定手机号是否正确</div>
  <div class="confirm_num" v-html="showValue"></div>
  <div class="btns_box">
    <div class="pop_btn" @click="onClose">取消</div>
    <div class="pop_btn pop_btn-confirm" @click="onConfirm">确认</div>
  </div>
</div>
</van-popup>
</template>

<script>
	export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      telNum: {
        type: String,
        default: ''
      }
    },
		data() {
			return {
			}
		},
    computed: {
      showValue() {
       return this.formatterFun(this.telNum)
      }
    },
		methods: {
			onConfirm() {
        this.$emit("confirm");
			},
			onClose() {
        this.$emit("close");
			},
      formatterFun(value) {
        let showValue = String(value);
        showValue = showValue.slice(0,3) + "&ensp;" + showValue.slice(3,7) + "&ensp;" + showValue.slice(7);
        return showValue;
      }
		}

	}
</script>

<style lang="scss" scoped>
.dia_cont {
  width: 343px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
  color: #333;
}
.btns_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 20px;
  .pop_btn {
    width: 144px;
    height: 44px;
    background: #f7f7f7;
    border-radius: 12px;
    box-sizing: border-box;
    line-height: 44px;
    text-align: center;
    font-weight: 500;
    border: none;
    background: #f7f7f7;
    font-size: 14px;
    &.pop_btn-confirm {
      color: #fff;
      background: linear-gradient(135deg,#f2554d, #f04037);
    }
  }
}
.confirm_text {
  font-size: 14px;
  text-align: center;
  color: #999;
  line-height: 20px;
  margin-top: 32px;
}
.confirm_num {
  font-size: 25px;
  color: #333;
  margin-top: 12px;
  font-weight: 600;
}
</style>
