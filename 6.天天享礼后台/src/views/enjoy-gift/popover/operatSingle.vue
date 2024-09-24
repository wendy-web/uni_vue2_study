<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="150px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="标题" path="title" w-400>
          <n-input v-model:value="model.title" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="背景透明度(%)" path="opacity" w-400>
          <n-input-number v-model:value="model.opacity" :min="0" :max="100" :disabled="modalType === 1" />
        </n-form-item>
        <div class="flex">
          <n-form-item label="发布页面" path="page">
            <n-select
              v-model:value="model.page"
              :options="pageOptions"
              :disabled="modalType === 1"
              style="width: 200px"
              @update:value="pageChange"
            />
          </n-form-item>
          <block v-if="model.page == 12">
            <n-form-item label="彬纷菜单" path="position_id">
              <n-select
                v-model:value="model.position_id"
                :options="menuOptions"
                :disabled="modalType === 1"
                style="width: 400px"
              />
            </n-form-item>
          </block>
        </div>
        <n-form-item v-if="model.page == 4" label="是否广告" path="is_advertisement">
          <n-switch v-model:value="model.is_advertisement" />
        </n-form-item>
        <div v-if="model.page == 1">
          <n-form-item label="是否悬浮" path="is_xf">
            <n-switch v-model:value="model.is_xf" @update:value="xfChange" />
          </n-form-item>
          <n-form-item v-if="model.is_xf == 1" label="悬浮类型" path="xf_type" w-500>
            <n-radio-group
              v-model:value="model.xf_type"
              :disabled="modalType === 1"
              name="radiogroup"
              @update:value="checkedRadioHandle"
            >
              <n-space>
                <n-radio :key="0" :value="0"> 默认 </n-radio>
                <n-radio :key="1" :value="1"> 订单待付款 </n-radio>
                <n-radio :key="2" :value="2"> 返利待领取 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </div>
        <n-form-item v-if="model.page == 9 || model.page == 10" label="排序" path="sort" w-800>
          <n-input-number v-model:value="model.sort" style="width: 120px; margin: 0 4px" :disabled="modalType === 1" />
        </n-form-item>
        <block v-if="!model.is_advertisement">
          <n-form-item label="图片" path="image">
            <n-upload
              v-if="showModal"
              action="/apios/Tools/uploadImg"
              :disabled="modalType === 1"
              list-type="image-card"
              :default-file-list="fileList"
              :max="1"
              name="img"
              @finish="handleFinish"
              @before-upload="beforeUpload"
              @remove="handleRemove"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item v-if="model.type == 1 && model.xf_type == 0" label="图片2" path="main_url">
            <n-upload
              v-if="showModal"
              action="/apios/Tools/uploadImg"
              :disabled="modalType === 1"
              list-type="image-card"
              :default-file-list="mainfileList"
              :max="1"
              name="img"
              @finish="mainHandleFinish"
              @before-upload="beforeUpload"
              @remove="handleRemove2"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item v-if="[9, 13].includes(model.page)" label="彬纷扫码配置图" path="abnormal_img">
            <n-upload
              v-if="showModal"
              action="/apios/Tools/uploadImg"
              :disabled="modalType === 1"
              list-type="image-card"
              :default-file-list="abnormalfileList"
              :max="1"
              name="img"
              @finish="abnormalHandleFinish"
              @before-upload="beforeUpload"
              @remove="abnormalRemove"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
        </block>
        <dive v-if="![9, 10, 11, 12, 13].includes(model.page) && model.xf_type == 0">
          <n-form-item label="触发条件" path="second" w-800>
            <span style="font-size: 14px">进入页面后:</span>
            <n-input-number
              v-model:value="model.second"
              style="width: 120px; margin: 0 4px"
              :disabled="modalType === 1"
            />
            <span style="font-size: 14px">秒出现弹窗</span>
          </n-form-item>
          <n-form-item label="生效日期" path="datetimerange" :disabled="modalType === 1">
            <n-date-picker
              v-model:formatted-value="model.datetimerange"
              :disabled="modalType === 1"
              value-format="yyyy-MM-dd"
              type="daterange"
              clearable
          /></n-form-item>
          <n-form-item label="弹窗时间" :disabled="modalType === 1">
            <n-time-picker
              v-model:formatted-value="model.popover_start"
              :disabled="modalType === 1"
              value-format="HH:mm:ss"
              clearable
            />
            <span style="padding: 0 10px">-</span>
            <n-time-picker
              v-model:formatted-value="model.popover_over"
              :disabled="modalType === 1"
              value-format="HH:mm:ss"
              clearable
            />
          </n-form-item>
          <n-form-item label="显示类型" path="is_loop" w-500>
            <n-radio-group
              v-model:value="model.is_loop"
              :disabled="modalType === 1"
              name="radiogroup"
              @update:value="checkedRadioHandle"
              @change="doChange2"
            >
              <n-space>
                <n-radio v-if="model.type != 14" :key="0" :value="0"> 仅一次 </n-radio>
                <n-radio :key="1" :value="1"> 每天 </n-radio>
                <n-radio v-if="model.type != 14" :key="2" :value="2"> 按周 </n-radio>
                <n-radio v-if="model.type != 14" :key="3" :value="3"> 按天 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item v-if="model.is_loop == 2" label="星期" path="week" w-800>
            <n-checkbox-group v-model:value="model.week">
              <n-space item-style="display: flex;">
                <n-checkbox value="1" label="周一" />
                <n-checkbox value="2" label="周二" />
                <n-checkbox value="3" label="周三" />
                <n-checkbox value="4" label="周四" />
                <n-checkbox value="5" label="周五" />
                <n-checkbox value="6" label="周六" />
                <n-checkbox value="7" label="周日" />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <n-form-item v-if="model.is_loop == 3" label="天" path="day" w-800>
            <n-checkbox-group v-model:value="model.day">
              <n-space item-style="display: flex;">
                <n-checkbox value="1" label="1号" />
                <n-checkbox value="2" label="2号" />
                <n-checkbox value="3" label="3号" />
                <n-checkbox value="4" label="4号" />
                <n-checkbox value="5" label="5号" />
                <n-checkbox value="6" label="6号" />
                <n-checkbox value="7" label="7号" />
                <n-checkbox value="8" label="8号" />
                <n-checkbox value="9" label="9号" />
                <n-checkbox value="10" label="10号" />
                <n-checkbox value="11" label="11号" />
                <n-checkbox value="12" label="12号" />
                <n-checkbox value="13" label="13号" />
                <n-checkbox value="14" label="14号" />
                <n-checkbox value="15" label="15号" />
                <n-checkbox value="16" label="16号" />
                <n-checkbox value="17" label="17号" />
                <n-checkbox value="18" label="18号" />
                <n-checkbox value="19" label="19号" />
                <n-checkbox value="20" label="20号" />
                <n-checkbox value="21" label="21号" />
                <n-checkbox value="22" label="22号" />
                <n-checkbox value="23" label="23号" />
                <n-checkbox value="24" label="24号" />
                <n-checkbox value="25" label="25号" />
                <n-checkbox value="26" label="26号" />
                <n-checkbox value="27" label="27号" />
                <n-checkbox value="28" label="28号" />
                <n-checkbox value="29" label="29号" />
                <n-checkbox value="30" label="30号" />
                <n-checkbox value="31" label="31号" />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
        </dive>
        <dive v-if="![10, 11, 12].includes(model.page) && model.xf_type == 0">
          <n-form-item v-if="!model.is_xf" label="目标用户" path="people_type">
            <n-select
              v-model:value="model.people_type"
              :options="peopleOptions"
              :disabled="modalType === 1"
              style="width: 200px"
            />
          </n-form-item>
          <n-form-item v-if="!model.is_xf" label="运营商" path="operation_type">
            <n-select
              v-model:value="model.operation_type"
              :options="operationOptions"
              :disabled="modalType === 1"
              style="width: 200px"
            />
          </n-form-item>
        </dive>
        <block v-if="!model.is_advertisement && model.xf_type == 0">
          <n-form-item label="跳转页面" path="jump_title" w-400>
            <n-input v-model:value="model.jump_title" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item label="呈现类型" path="show_type" w-800>
            <n-radio-group
              v-model:value="model.show_type"
              :disabled="modalType === 1"
              name="radiogroup"
              @update:value="checkedRadioHandle"
              @change="doChange2"
            >
              <n-space>
                <n-radio :key="1" :value="1"> 自定义图片 </n-radio>
                <n-radio :key="2" :value="2" :disabled="![6, 12, 14].includes(model.type)"> 天降神券 </n-radio>
                <n-radio :key="3" :value="3" :disabled="![6, 12, 14].includes(model.type)"> 0元下单 </n-radio>
                <n-radio :key="4" :value="4"> 福利抽奖 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item v-if="model.show_type == 2" label="弹窗文案" path="jd_word" w-400>
            <n-input v-model:value="model.jd_word" :disabled="modalType === 1" placeholder="天降神券" />
          </n-form-item>
          <n-form-item label="页面类型" path="type" w-1800>
            <n-radio-group
              v-model:value="model.type"
              :disabled="modalType === 1"
              name="radiogroup"
              @update:value="typeChange"
            >
              <n-space>
                <n-radio :key="1" :value="1"> 优惠券 </n-radio>
                <n-radio :key="2" :value="2"> 公众号 </n-radio>
                <n-radio :key="3" :value="3"> 视频号 </n-radio>
                <n-radio :key="4" :value="4"> 小程序 </n-radio>
                <n-radio :key="5" :value="5"> 聚推客电影 </n-radio>
                <n-radio :key="6" :value="6"> 电商商品 </n-radio>
                <n-radio v-if="model.page != 6" :key="7" :value="7"> 领券中心 </n-radio>
                <n-radio :key="8" :value="8">聚推客打车 </n-radio>
                <n-radio :key="9" :value="9">小程序内页 </n-radio>
                <n-radio :key="10" :value="10">半屏推券 </n-radio>
                <n-radio :key="11" :value="11">专题页面 </n-radio>
                <n-radio :key="12" :value="12">多商品列表 </n-radio>
                <n-radio :key="13" :value="13">小程序h5 </n-radio>
                <n-radio :key="14" :value="14">商品轮巡 </n-radio>
                <n-radio :key="15" :value="15">乐唯娃娃机 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <!-- 公众号-->
          <div v-if="model.type == 2">
            <n-form-item label="同主体" path="is_main">
              <n-radio-group
                v-model:value="model.is_main"
                :disabled="modalType === 1"
                name="radiogroup"
                @update:value="checkedRadioHandle"
              >
                <n-space>
                  <n-radio :key="1" :value="1"> 同主体 </n-radio>
                  <n-radio :key="2" :value="2"> 非同主体 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="model.is_main == 1" label="文章地址" path="article_url">
              <n-input
                v-model:value="model.article_url"
                type="textarea"
                :style="{
                  maxWidth: '400px',
                }"
                :disabled="modalType === 1"
              />
            </n-form-item>
            <n-form-item v-else label="网页图片" path="main_url">
              <n-upload
                v-if="showModal"
                action="/apios/Tools/uploadImg"
                :disabled="modalType === 1"
                list-type="image-card"
                :default-file-list="mainfileList"
                :max="1"
                name="img"
                @finish="mainHandleFinish"
                @before-upload="beforeUpload"
              >
                <n-button quaternary>上传文件</n-button>
              </n-upload>
            </n-form-item>
          </div>
          <!-- 小程序-->
          <div v-if="model.type == 4">
            <n-form-item label="小程序类型" path="is_main">
              <n-radio-group
                v-model:value="model.is_main"
                :disabled="modalType === 1"
                name="radiogroup"
                @update:value="checkedRadioHandle2"
              >
                <n-space>
                  <n-radio :key="1" :value="1"> 默认 </n-radio>
                  <n-radio :key="2" :value="2"> 拼多多营销工具 </n-radio>
                  <n-radio :key="3" :value="3"> 拼多多频道推广 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="打开方式" path="open_mini_type">
              <n-radio-group
                v-model:value="model.open_mini_type"
                :disabled="modalType === 1"
                name="radiogroup"
                @update:value="checkedRadioHandle"
              >
                <n-space>
                  <n-radio :key="1" :value="1"> 全屏打开 </n-radio>
                  <n-radio :key="2" :value="2"> 半屏打开 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item v-if="model.is_main == 1" label="小程序ID" path="type_id" w-400>
              <n-input v-model:value="model.type_id" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item v-if="model.is_main == 1" label="页面路径" path="type_sid" w-400>
              <n-input v-model:value="model.type_sid" :disabled="modalType === 1" />
            </n-form-item>
            <template v-if="model.is_main == 1 && model.type_id == 'wx91d27dbf599dff74'">
              <n-form-item label="推广位ID" path="video_account_id" w-400>
                <n-input v-model:value="model.video_account_id" :disabled="modalType === 1" />
              </n-form-item>
              <n-form-item label="京东itemId(B段)" path="video_id" w-400>
                <n-input v-model:value="model.video_id" :disabled="modalType === 1" />
              </n-form-item>
              <n-form-item label="个性化推荐" path="bold">
                <n-radio-group v-model:value="model.bold" name="radiogroup" :disabled="modalType === 1">
                  <n-space>
                    <n-radio v-for="song in tjOptions" :key="song.value" :value="song.value">
                      {{ song.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
            </template>
            <n-form-item v-if="model.is_main == 2" label="拼多多推广位" path="type_id" w-400>
              <n-input v-model:value="model.type_id" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item v-if="model.is_main == 2" label="营销工具" path="type_sid">
              <n-select
                v-model:value="model.type_sid"
                :options="pddOptions"
                :disabled="modalType === 1"
                style="width: 200px"
              />
            </n-form-item>
            <div v-if="model.is_main == 2">
              <!-- 选择红包金额类型 -->
              <n-form-item
                v-if="model.type_sid == 0 || model.type_sid == 2"
                label="商品金额"
                path="diy_red_packet_param.amounttype"
              >
                <n-select
                  v-model:value="model.diy_red_packet_param.amounttype"
                  :options="amounttypeOptions"
                  :disabled="modalType === 1"
                  style="width: 200px"
                />
              </n-form-item>
              <!-- 指定红包金额amount_probability多选 -->
              <n-form-item
                v-if="model.diy_red_packet_param.amounttype == 2 && (model.type_sid == 0 || model.type_sid == 2)"
                label="指定红包金额"
                path="diy_red_packet_param.amount_probability"
              >
                <n-checkbox-group v-model:value="model.diy_red_packet_param.amount_probability" flex flex-wrap>
                  <n-space v-for="item in amountOptions" :key="item.value" item-style="display: flex;" mr-10 mb-10>
                    <n-checkbox :value="item.value" :label="item.label" />
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
              <n-form-item
                v-if="model.diy_red_packet_param.amounttype == 3 && (model.type_sid == 0 || model.type_sid == 2)"
                label="红包抵后价"
                path="diy_red_packet_param.range_items[0]"
              >
                <n-input-number
                  v-model:value="model.diy_red_packet_param.range_items[0].range_from"
                  :min="0"
                  :precision="0"
                  :style="{ width: '120px' }"
                  :disabled="modalType === 1"
                />元
                <span style="padding: 0 15px">-</span>
                <n-input-number
                  v-model:value="model.diy_red_packet_param.range_items[0].range_to"
                  :min="0"
                  :precision="0"
                  :style="{ width: '120px' }"
                  :disabled="modalType === 1"
                />元
              </n-form-item>
              <n-form-item
                v-if="model.type_sid == 0 || model.type_sid == 2 || model.type_sid == 12"
                label="商品佣金"
                path="diy_red_packet_param.range_items[1]"
              >
                <n-input-number
                  v-model:value="model.diy_red_packet_param.range_items[1].range_from"
                  :min="0"
                  :precision="0"
                  :style="{ width: '120px' }"
                  :disabled="modalType === 1"
                />%
                <span style="padding: 0 15px">-</span>
                <n-input-number
                  v-model:value="model.diy_red_packet_param.range_items[1].range_to"
                  :min="0"
                  :precision="0"
                  :style="{ width: '120px' }"
                  :disabled="modalType === 1"
                />%
              </n-form-item>
              <!-- 推广页设置not_show_background -->
              <n-form-item
                v-if="model.type_sid == 0 || model.type_sid == 2"
                label="设置推广页"
                path="diy_red_packet_param.not_show_background"
              >
                <n-radio-group
                  v-model:value="model.diy_red_packet_param.not_show_background"
                  :disabled="modalType === 1"
                  name="radiogroup"
                >
                  <n-space>
                    <n-radio :key="0" :value="0"> 红包开启页 </n-radio>
                    <n-radio :key="1" :value="1"> 红包领取页 </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
              <div v-if="model.type_sid == 3">
                <!-- 刮刮卡指定金额scratch_card_amount单选 -->
                <n-form-item label="刮刮卡金额" path="diy_red_packet_param.scratch_card_amount_type">
                  <n-radio-group
                    v-model:value="model.diy_red_packet_param.scratch_card_amount_type"
                    :disabled="modalType === 1"
                    name="radiogroup"
                  >
                    <n-space>
                      <n-radio :key="0" :value="0"> 默认推荐金额 </n-radio>
                      <n-radio :key="1" :value="1"> 固定金额 </n-radio>
                    </n-space>
                  </n-radio-group>
                </n-form-item>
                <n-form-item
                  v-if="model.diy_red_packet_param.scratch_card_amount_type == 1"
                  label="固定金额"
                  path="diy_red_packet_param.scratch_card_amount"
                >
                  <n-input-number
                    v-model:value="model.diy_red_packet_param.scratch_card_amount"
                    :min="2"
                    :max="100"
                    :precision="0"
                    :style="{ width: '120px' }"
                    :disabled="modalType === 1"
                  />元
                </n-form-item>
              </div>
              <div v-if="model.type_sid == 12">
                <n-form-item label="砸金蛋金额" path="diy_red_packet_param.scratch_card_amount_type">
                  <n-radio-group
                    v-model:value="model.diy_red_packet_param.scratch_card_amount_type"
                    :disabled="modalType === 1"
                    name="radiogroup"
                  >
                    <n-space>
                      <n-radio :key="0" :value="0"> 默认推荐金额 </n-radio>
                      <n-radio :key="1" :value="1"> 指定金额 </n-radio>
                    </n-space>
                  </n-radio-group>
                </n-form-item>
                <n-form-item
                  v-if="model.diy_red_packet_param.scratch_card_amount_type == 1"
                  label="指定金额"
                  path="diy_red_packet_param.amount_probability"
                >
                  <n-checkbox-group v-model:value="model.diy_red_packet_param.amount_probability" flex flex-wrap>
                    <n-space v-for="item in amount2Options" :key="item.value" item-style="display: flex;" mr-10 mb-10>
                      <n-checkbox :value="item.value" :label="item.label" />
                    </n-space>
                  </n-checkbox-group>
                </n-form-item>
              </div>
            </div>
            <template v-if="model.is_main == 3">
              <n-form-item label="拼多多推广位" path="type_id" w-400>
                <n-input v-model:value="model.type_id" :disabled="modalType === 1" />
              </n-form-item>
              <n-form-item label="频道来源" path="diy_red_packet_param.resource_type">
                <n-select
                  v-model:value="model.diy_red_packet_param.resource_type"
                  :options="resourceOptions"
                  :disabled="modalType === 1"
                  style="width: 200px"
                />
              </n-form-item>
              <n-form-item
                v-if="model.diy_red_packet_param.resource_type == 39998"
                label="原活动链接（短链）"
                path="diy_red_packet_param.url"
              >
                <n-input
                  v-model:value="model.diy_red_packet_param.url"
                  type="textarea"
                  :style="{
                    maxWidth: '400px',
                  }"
                  :disabled="modalType === 1"
                />
              </n-form-item>
            </template>
          </div>
          <!--视频号-->
          <div v-if="model.type == 3">
            <n-form-item label="视频号ID" path="video_id" w-400>
              <n-input v-model:value="model.video_id" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item label="视频ID" path="video_account_id">
              <n-input
                v-model:value="model.video_account_id"
                type="textarea"
                :style="{
                  maxWidth: '400px',
                }"
                :disabled="modalType === 1"
              />
            </n-form-item>
          </div>
          <!--千猪-->
          <div v-if="model.type == 9 || model.type == 13">
            <n-form-item label="跳转地址" path="qz_url">
              <n-input
                v-model:value="model.qz_url"
                type="textarea"
                :style="{
                  maxWidth: '400px',
                }"
                :disabled="modalType === 1"
              />
            </n-form-item>
          </div>
          <!-- 优惠券-->
          <div v-if="model.type == 1">
            <n-form-item label="安卓券ID" path="coupon_id_android" w-400>
              <n-input
                v-model:value="model.coupon_id_android"
                style="width: 240px; margin-left: 4px"
                :disabled="modalType === 1"
              />
            </n-form-item>
            <n-form-item label="苹果券ID" path="coupon_id_ios" w-400>
              <n-input
                v-model:value="model.coupon_id_ios"
                style="width: 240px; margin-left: 4px"
                :disabled="modalType === 1"
              />
            </n-form-item>
          </div>
          <!-- 电商商品 -->
          <div v-if="model.type == 6">
            <n-form-item label="电商商品" path="type_id" w-800 mb-10>
              <n-input v-model:value="model.skuName" :maxlength="20" disabled />
              <n-button ml-10 :disabled="modalType === 1" @click="selectJdListHandle"> 选择电商商品 </n-button>
              <div class="type_id">ID: {{ model.type_id }}</div>
            </n-form-item>
            <n-form-item label="跳转方式" path="is_jump">
              <n-radio-group
                v-model:value="model.is_jump"
                :disabled="modalType === 1"
                name="radiogroup"
                @update:value="checkedRadioHandle"
              >
                <n-space>
                  <n-radio :key="2" :value="2"> 半屏 </n-radio>
                  <n-radio :key="1" :value="1"> feed流 </n-radio>
                  <n-radio :key="3" :value="3"> 中转详情 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="专属返现" path="main_url" w-400>
              <n-input-number v-model:value="model.main_url" min="0" max="100" :disabled="modalType === 1" />&nbsp;%
            </n-form-item>
            <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0; padding-left: 60px">
              由该入口进入购买的商品仅按“专属返现”计算订单返现，同时不参与分佣；不填写走默认返现逻辑
            </div>
          </div>
          <!-- 乐唯娃娃机 -->
          <div v-if="model.type == 15">
            <n-form-item label="打开方式" path="is_main">
              <n-radio-group
                v-model:value="model.is_main"
                :disabled="modalType === 1"
                name="radiogroup"
                @update:value="checkedRadioHandle"
              >
                <n-space>
                  <n-radio :key="1" :value="1"> 点击打开 </n-radio>
                  <n-radio :key="2" :value="2"> 直接打开 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="跳转方式" path="is_jump">
              <n-radio-group
                  v-model:value="model.is_jump"
                  :disabled="modalType === 1"
                  name="radiogroup"
                  @update:value="checkedRadioHandle"
              >
                <n-space>
                  <n-radio :key="1" :value="1"> 直接跳转 </n-radio>
                  <n-radio :key="2" :value="2"> 中转跳转 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="房间地址" path="qz_url">
              <n-input
                v-model:value="model.qz_url"
                type="textarea"
                :style="{
                  maxWidth: '400px',
                }"
                :disabled="modalType === 1"
              />
            </n-form-item>
          </div>
          <n-form-item
            v-if="model.type == 6 || model.type == 12 || model.type == 14"
            label="订单范围"
            path="type_sid"
            w-400
          >
            <n-input-number v-model:value="model.type_sid" min="0" :disabled="modalType === 1" />&nbsp;天
          </n-form-item>
          <!-- 领券中心 -->
          <div v-if="model.type == 7 && model.page != 6">
            <n-form-item label="频道选择" path="type_id">
              <n-select
                v-model:value="model.type_id"
                label-field="name"
                value-field="id_index"
                :options="centerOptions"
                :disabled="modalType === 1"
                style="width: 400px"
                clearable
              />
            </n-form-item>
          </div>
          <!-- 半屏推券 -->
          <div v-if="model.type == 10">
            <n-form-item label="分组列表" path="type_id">
              <n-select
                v-model:value="model.type_id"
                :options="couponOptions"
                :disabled="modalType === 1"
                style="width: 200px"
              />
            </n-form-item>
            <n-form-item label="持续时长" path="type_sid">
              <n-input-number v-model:value="model.type_sid" :disabled="modalType === 1" min="0" style="width: 200px" />
              <span style="padding-left: 8px">分钟</span>
            </n-form-item>
            <n-form-item label="每次重新计时" path="is_main">
              <n-radio-group
                v-model:value="model.is_main"
                :disabled="modalType === 1"
                name="radiogroup"
                @update:value="checkedRadioHandle"
              >
                <n-space>
                  <n-radio :key="1" :value="1"> 是 </n-radio>
                  <n-radio :key="2" :value="2"> 否 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="弹出方式" path="open_mini_type">
              <n-radio-group v-model:value="model.open_mini_type" :disabled="modalType === 1" name="radiogroup">
                <n-space>
                  <n-radio :key="1" :value="1"> 点击弹出 </n-radio>
                  <n-radio :key="2" :value="2"> 直接弹出 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="小程序插屏广告" path="is_advertise">
              <n-switch v-model:value="model.is_advertise" />
            </n-form-item>
          </div>
          <!-- 专题页面 -->
          <block v-if="model.type == 11">
            <n-form-item label="分组列表" path="type_id">
              <n-select
                v-model:value="model.type_id"
                :options="themeOptions"
                :disabled="modalType === 1"
                style="width: 200px"
              />
            </n-form-item>
            <n-form-item label="打开方式" path="open_mini_type">
              <n-radio-group v-model:value="model.open_mini_type" :disabled="modalType === 1" name="radiogroup">
                <n-space>
                  <n-radio :key="1" :value="1"> 全屏跳转 </n-radio>
                  <n-radio :key="2" :value="2"> 半屏弹出 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </block>
          <block v-if="model.type == 12 || model.type == 14">
            <n-form-item label="添加商品" path="coupon_id" w-600>
              <n-button mr-10 :disabled="modalType === 1" @click="selectHandle"> 选择商品列表 </n-button>
            </n-form-item>
            <n-form-item label="商品列表">
              <n-data-table
                ref="tableRef"
                :checked-row-keys="model.group"
                :row-key="(row) => row['coupon_id']"
                :columns="columns"
                :data="tableData"
                :pagination="false"
                @update:checked-row-keys="handleCheck"
              />
            </n-form-item>
          </block>
        </block>
        <block v-if="model.xf_type != 0">
          <n-form-item label="跳转地址" path="qz_url">
            <n-input
              v-model:value="model.qz_url"
              type="textarea"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
        </block>
        <div flex justify-center w-500>
          <n-button mr-10 @click="showModal = false"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <!-- 京东商品 -->
  <sel-operat-jd-list ref="selOperatJdListRef" @selectList="selectListHandle" />
  <operate-group-detail ref="operateGroupDetailRef" :ck-ids="ckIds" @addList="addListHandle" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NDatePicker, NInput, NInputNumber, NSwitch, useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import http from './api';
import operateGroupDetail from './operateGroupDetail.vue';
import selOperatJdList from './selOperatJdList.vue';
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
const tjOptions = [
  {
    value: 0,
    label: '是',
  },
  {
    value: 1,
    label: '否',
  },
]
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '标题不能为空',
  },
  datetimerange: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入生效时间',
  },
})
// 发布页面
const pageOptions = [
  {
    label: '首页',
    value: 1,
  },
  {
    label: '惠吃喝',
    value: 2,
  },
  {
    label: '福利中心',
    value: 3,
  },
  {
    label: '我的',
    value: 4,
  },
  {
    label: '支付成功',
    value: 5,
  },
  {
    label: '领券中心',
    value: 6,
  },
  {
    label: '外卖红包',
    value: 7,
  },
  {
    label: '低价卡券',
    value: 8,
  },
  {
    label: '扫拉环码异常',
    value: 9,
  },
  {
    label: '福利中心(模块)',
    value: 10,
  },
  {
    label: '扫拉环码未中奖(新人)',
    value: 11,
  },
  {
    label: '彬纷享礼入口菜单弹窗',
    value: 12,
  },
  {
    label: '彬纷享礼换购成功弹窗',
    value: 13,
  },
]
const centerOptions = ref([])
const couponOptions = ref([])
const themeOptions = ref([])
const menuOptions = ref([])
onMounted(() => {
  http.getLists().then((res) => {
    if (res.code == 1) {
      centerOptions.value = res.data
    }
  })
})
//目标用户
const peopleOptions = [
  {
    label: '新用户',
    value: 1,
  },
  {
    label: '老用户',
    value: 2,
  },
  {
    label: '全部用户',
    value: 3,
  },
]
//手机运营商
const operationOptions = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '移动用户',
    value: 1,
  },
  {
    label: '非移动用户',
    value: 2,
  },
]
//红包金额
const amountOptions = [
  {
    label: '2元',
    value: 200,
  },
  {
    label: '3元',
    value: 300,
  },
  {
    label: '5元',
    value: 500,
  },
  {
    label: '10元',
    value: 1000,
  },
  {
    label: '20元',
    value: 2000,
  },
  {
    label: '30元',
    value: 3000,
  },
  {
    label: '40元',
    value: 4000,
  },
]
//砸金蛋金额
const amount2Options = [
  {
    label: '10元',
    value: 1000,
  },
  {
    label: '15元',
    value: 1500,
  },
  {
    label: '20元',
    value: 2000,
  },
  {
    label: '25元',
    value: 2500,
  },
  {
    label: '30元',
    value: 3000,
  },
  {
    label: '35元',
    value: 3500,
  },
  {
    label: '40元',
    value: 4000,
  },
]
//红包金额类型
const amounttypeOptions = [
  {
    label: '红包金额个性化',
    value: 1,
  },
  {
    label: '指定红包金额',
    value: 2,
  },
  {
    label: '红包抵后价',
    value: 3,
  },
]
function pddChange() {
  model.value.diy_red_packet_param.amount_probability = []
}
//营销工具
const pddOptions = [
  {
    label: '红包',
    value: 0,
  },
  {
    label: '新人红包',
    value: 2,
  },
  {
    label: '刮刮卡',
    value: 3,
  },
  {
    label: '员工内购',
    value: 5,
  },
  {
    label: '砸金蛋',
    value: 12,
  },
  {
    label: '千万补贴B端页面',
    value: 14,
  },
  {
    label: '充值中心B端页面',
    value: 15,
  },
  {
    label: '千万补贴C端页面',
    value: 16,
  },
  {
    label: '超级红包',
    value: 23,
  },
  {
    label: '礼金全场N折活动B端页面',
    value: 24,
  },
  {
    label: '带货赢千万',
    value: 27,
  },
  {
    label: '千万神券C端页面',
    value: 34,
  },
  {
    label: '千万神券B端页面',
    value: 35,
  },
  {
    label: '超级红包B端推品页',
    value: 37,
  },
]
//拼多多频道来源
const resourceOptions = [
  {
    label: '限时秒杀',
    value: 4,
  },
  {
    label: '活动转链',
    value: 39998,
  },
  {
    label: '百亿补贴',
    value: 39996,
  },
  {
    label: '领券中心',
    value: 40000,
  },
  {
    label: '火车票',
    value: 50005,
  },
]
function checkedRadioHandle2() {
  model.value.type_id = ''
  model.value.type_sid = ''
}
//已上传的图片
const fileList = ref([])
const mainfileList = ref([])
const abnormalfileList = ref([])
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.image = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
function mainHandleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.main_url = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
function abnormalHandleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.abnormal_img = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
function handleRemove() {
  model.value.image = ''
}
function handleRemove2() {
  model.value.main_url = ''
}
function abnormalRemove() {
  model.value.abnormal_img = ''
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let group = model.value.group
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
          goods_sign: item.goods_sign || '',
          itemId: item.itemId || '',
          btn_name: item.btn_name || '',
        }))
      model.value.is_loop = Number(model.value.is_loop)
      http
        .operatSingleImage({
          ...model.value,
          group,
        })
        .then((res) => {
          if (res.code == 1) {
            message.success(res.msg)
            emit('refresh')
            showModal.value = false
          } else {
            message.error(res.msg)
          }
        })
    }
  })

  return false
}
//查询参数
const tableData = ref([])
const operateGroupDetailRef = ref(null)
function selectHandle() {
  operateGroupDetailRef.value.show()
}
const ckIds = ref([])
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'id',
    disabled(row) {
      return modalType.value == 1
    },
    render() {
      return true
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center', width: 100 },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    width: 520,
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title || row.skuName
    },
  },
  {
    title: '佣金率',
    width: 80,
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  {
    title: '面值(元)',
    key: 'face_value',
    align: 'center',
    width: 80,
    render(row) {
      return row.face_value || row.discount
    },
  },
  {
    title: '来源',
    key: 'lx_type',
    align: 'center',
    width: 80,
    render(row, index) {
      return ['', '京东', '选品库', '拼多多'][row.lx_type - 1]
    },
  },
  {
    title: '按钮文字',
    key: 'btn_name',
    align: 'center',
    fixed: 'right',
    size: 'large',
    width: 100,
    render(row, index) {
      return h(NInput, {
        value: row.btn_name || '',
        style: {
          'margin-right': '10px',
          width: '200px',
          display: 'inline-block',
        },
        disabled: modalType.value == 1,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].btn_name = value
        },
      })
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    size: 'large',
    width: 260,
    render(row, index) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: {
              'margin-right': '10px',
            },
            disabled: modalType.value == 1,
            secondary: true,
            onClick: () => {
              const currentIndex = row.current_index
              const currData = tableData.value[currentIndex]
              tableData.value.splice(currentIndex, 1)
              tableData.value.unshift(currData)
              resetIndex()
            },
          },
          { default: () => '置顶', icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
        ),
        h(NInputNumber, {
          value: row._index,
          min: 1,
          size: 'tiny',
          max: tableData.value.length,
          style: {
            'margin-right': '10px',
            width: '100px',
            display: 'inline-block',
          },
          disabled: modalType.value == 1,
          onUpdateValue(value) {
            const currentIndex = row.current_index
            tableData.value[currentIndex]._index = value
          },
          onBlur(value) {
            const currInputIndex = row.current_index
            const inputValue = row._index - 1
            if (currInputIndex === inputValue) return
            const currData = tableData.value[currInputIndex]
            const targetIndex = tableData.value[inputValue]
            // tableData.value[inputValue] = currData
            // tableData.value[currInputIndex] = targetIndex
            tableData.value.splice(currInputIndex, 1)
            tableData.value.splice(inputValue, 0, currData)
            resetIndex()
          },
        }),
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: {
              'margin-right': '10px',
            },
            secondary: true,
            disabled: modalType.value == 1,
            onClick: () => {
              const currentIndex = row.current_index
              const currData = tableData.value[currentIndex]
              tableData.value.splice(currentIndex, 1)
              tableData.value.push(currData)
              resetIndex()
            },
          },
          { default: () => '置底', icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
        ),
      ]
    },
  },
]
const tableRef = ref(null)
// 添加数组内容
function addListHandle(addList) {
  addList &&
    addList.forEach((item) => {
      model.value.group.push(item.coupon_id)
      tableData.value.push({
        ...item,
        _index: tableData.value.length + 1,
        current_index: tableData.value.length,
      })
    })
  // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 10000,
    })
  }, 100)
  tableRef.value.filter({
    title: [],
  })
}
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}
/**展示弹窗 */
function show(operatType, data) {
  fileList.value = []
  mainfileList.value = []
  abnormalfileList.value = []
  tableData.value = []
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType

  if (operatType !== 3) {
    http.getSingleImage({ id: data.id, lx_type: 1 }).then((res) => {
      let {
        id,
        title,
        opacity,
        page,
        image,
        sort,
        second,
        datetimerange,
        people_type,
        operation_type,
        jump_title,
        type,
        is_jump,
        is_main,
        article_url,
        main_url,
        open_mini_type,
        type_id,
        type_sid,
        video_id,
        video_account_id,
        qz_url,
        coupon_id_android,
        coupon_id_ios,
        lx_type,
        skuName,
        popover_start,
        popover_over,
        jd_word,
        is_loop,
        week,
        day,
        is_advertisement,
        is_xf,
        xf_type,
        list,
        ckIds,
        diy_red_packet_param,
        position_id,
        is_advertise,
        abnormal_img,
        bold,
        show_type,
      } = res.data
      ckIds.value = ckIds
      tableData.value = list
      const group = list.map((item) => item.coupon_id)
      resetIndex()
      model.value = {
        id,
        title,
        opacity,
        page,
        image,
        sort,
        second,
        datetimerange,
        people_type,
        operation_type,
        jump_title,
        type,
        is_jump,
        is_main,
        article_url,
        main_url,
        open_mini_type,
        type_id,
        type_sid,
        video_id,
        video_account_id,
        qz_url,
        coupon_id_android,
        coupon_id_ios,
        lx_type,
        skuName,
        popover_start,
        popover_over,
        jd_word,
        is_loop,
        week,
        day,
        is_advertisement: Boolean(is_advertisement),
        is_xf: Boolean(is_xf),
        xf_type,
        group,
        diy_red_packet_param: diy_red_packet_param || {
          amount_probability: [],
          range_items: [
            {
              range_from: 0,
              range_id: 1,
              range_to: 0,
            },
            {
              range_from: 0,
              range_id: 2,
              range_to: 0,
            },
          ],
          amounttype: 1,
          not_show_background: 0,
          scratch_card_amount_type: 0,
          scratch_card_amount: 2,
          resource_type: '',
          url: '',
        },
        position_id,
        is_advertise: Boolean(is_advertise),
        abnormal_img,
        bold: Number(bold),
        show_type,
      }
      if (!show_type) {
        model.value.show_type = [6, 12].includes(model.value.type) ? 2 : 1
      }
      /**图片预览 */
      if (image) {
        fileList.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: image,
          },
        ]
      }
      if (main_url) {
        mainfileList.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: main_url,
          },
        ]
      }
      if (abnormal_img) {
        abnormalfileList.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: abnormal_img,
          },
        ]
      }
      http.getGroup({ page: res.data.page }).then((res) => {
        couponOptions.value = res.data.list
        themeOptions.value = res.data.list2
      })
      showModal.value = true
    })
  } else {
    model.value = {
      title: '',
      opacity: null,
      page: 1,
      image: '',
      sort: 0,
      second: 0,
      datetimerange: '',
      people_type: 3,
      operation_type: 0,
      jump_title: '',
      type: 1,
      is_jump: 2,
      is_main: 1,
      article_url: '',
      main_url: '',
      open_mini_type: 1,
      type_id: 0,
      type_sid: '',
      video_id: '',
      video_account_id: '',
      qz_url: '',
      coupon_id_android: '',
      coupon_id_ios: '',
      lx_type: 1,
      skuName: '',
      popover_start: null,
      popover_over: null,
      jd_word: '',
      is_loop: 0,
      week: null,
      day: null,
      is_advertisement: false,
      is_xf: false,
      xf_type: 0,
      group: [],
      diy_red_packet_param: {
        amount_probability: [],
        range_items: [
          {
            range_from: 0,
            range_id: 1,
            range_to: 0,
          },
          {
            range_from: 0,
            range_id: 2,
            range_to: 0,
          },
        ],
        amounttype: 1,
        not_show_background: 0,
        scratch_card_amount_type: 0,
        scratch_card_amount: 2,
        resource_type: '',
        url: '',
      },
      position_id: '',
      is_advertise: false,
      abnormal_img: '',
      bold: 0,
      show_type: 1,
    }
    http.getGroup({ page: 1 }).then((res) => {
      couponOptions.value = res.data.list
      themeOptions.value = res.data.list2
    })
    setTimeout(() => {
      showModal.value = true
    }, 0)
  }
  model.value.lx_type = 1
  http.getPosition({}).then((res) => {
    menuOptions.value = res.data
  })
}
function pageChange(value) {
  http.getGroup({ page: value }).then((res) => {
    couponOptions.value = res.data.list
  })
}
const selOperatJdListRef = ref(null)
// 打开京东可选
function selectJdListHandle() {
  selOperatJdListRef.value.show()
}
// 京东商品的选择
function selectListHandle(selectList) {
  model.value.skuName = selectList.title
  model.value.type_id = selectList.coupon_id
  model.value.itemId = selectList.itemId
  model.value.goods_sign = selectList.goods_sign
}
function typeChange(value) {
  model.value.show_type = [6, 12].includes(model.value.type) ? 2 : 1
  model.value.type_id = null
  model.value.skuName = ''
  model.value.is_loop = 0
  if (value == 14) {
    model.value.is_loop = 1
  }
}
function xfChange(value) {
  if (!value) {
    model.value.xf_type = 0
  }
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>
<style scoped>
.type_id {
  position: absolute;
  font-size: 14px;
  color: gray;
  bottom: -70%;
}
</style>
