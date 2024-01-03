<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable @update:show="drawerUpdate">
    <n-drawer-content :title="modalTitle" closable>
      <n-tabs type="line" size="large" justify-content="start">
        <n-tab-pane name="baseInfo" tab="基础信息" display-directive="show">
          <n-form
            ref="formRefOne"
            :model="model"
            :rules="ruleOne"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <n-form-item label="名称" path="title">
              <n-input v-model:value="model.title" :style="{ maxWidth: '300px' }" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item label="持续时间" path="datetimerange">
              <n-date-picker
                v-model:formatted-value="model.datetimerange"
                :style="{ maxWidth: '400px' }"
                :disabled="modalType === 1"
                value-format="yyyy-MM-dd"
                type="daterange"
                clearable
              />
            </n-form-item>

            <n-form-item label="图片" path="image">
              <!-- 测试环境上传需加、api,打包发布需去掉 -->
              <n-upload
                action="/apios/Tools/uploadImg"
                :disabled="modalType === 1"
                list-type="image-card"
                :default-file-list="fileList"
                :max="1"
                name="img"
                :style="{ maxWidth: '300px' }"
                @finish="handleFinish"
                @before-upload="beforeUpload"
              >
                <n-button quaternary>上传文件</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item label="副标题" path="intro">
              <n-input v-model:value="model.intro" :style="{ maxWidth: '900px' }" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item label="辅助说明" path="furtherExplain">
              <!-- <n-input v-model:value="model.explain" :style="{maxWidth: '900px'}"
								:disabled="modalType === 1" /> -->
              <n-input
                v-model:value="model.explain"
                :disabled="modalType === 1"
                placeholder=""
                type="textarea"
                :autosize="{
                  minRows: 10,
                  maxRows: 50,
                }"
                :style="{ maxWidth: '900px' }"
              />
            </n-form-item>
            <div class="item-row">
              <n-form-item label="目标人数" path="plan_num">
                <n-input v-model:value="model.plan_num" :style="{ maxWidth: '300px' }" :disabled="modalType === 1" />
              </n-form-item>
              <n-form-item label="目标能量" path="plan_love">
                <n-input v-model:value="model.plan_love" :style="{ maxWidth: '300px' }" :disabled="modalType === 1" />
              </n-form-item>
            </div>
            <n-form-item label="进度管理" path="schedule">
              <div class="item-col">
                <n-data-table
                  w-1000
                  :columns="processtableColumns"
                  :data="model.schedule"
                  :pagination="false"
                  :data-picker="true"
                >
                </n-data-table>
                <n-button v-if="model.schedule.length < 5 && model.status < 0" tertiary @click="addProcesstableCol">
                  + 添加下一区间
                </n-button>
              </div>
            </n-form-item>
          </n-form>
          <div flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="baseInfoValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="projectIntro" tab="项目介绍" display-directive="show">
          <n-form
            ref="formRefTwo"
            :model="model"
            :rules="ruleTwo"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <n-form-item label="项目介绍" path="introduce">
              <div style="border: 1px solid #ccc">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :default-config="toolbarConfig"
                  mode="default"
                />
                <Editor
                  v-model="model.introduce"
                  style="height: 1000px; overflow-y: hidden; width: 1400px"
                  :default-config="editorConfig"
                  mode="default"
                  @onCreated="handleCreated"
                />
              </div>
            </n-form-item>
          </n-form>
          <div v-if="model.com_id" flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="introValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="projectProcess" tab="项目进展" display-directive="show">
          <n-form
            ref="formRefThree"
            :model="model"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <n-form-item label="主标题" path="progress_title">
              <n-input
                v-model:value="model.progress_title"
                :style="{ maxWidth: '300px' }"
                :disabled="modalType === 1"
              />
            </n-form-item>
            <n-form-item label="副标题" path="progress_subtitle">
              <n-input
                v-model:value="model.progress_subtitle"
                :style="{ maxWidth: '300px' }"
                :disabled="modalType === 1"
              />
            </n-form-item>
            <n-form-item label="进展说明" path="progress_content">
              <n-input
                v-model:value="model.progress_content"
                placeholder=""
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 5,
                }"
                :style="{ maxWidth: '300px' }"
              />
            </n-form-item>
          </n-form>
          <div v-if="model.com_id" flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="progressValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="perform" tab="执行情况" display-directive="show">
          <n-form
            ref="formRefFour"
            :model="model"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <div class="perform-item-col">
              <template v-for="(item, index) in model.perform" :key="item.id">
                <n-card title="" closable @close="delPerformCol(index)">
                  <n-form-item label="标题" path="perform">
                    <n-input v-model:value="item.title" :style="{ maxWidth: '300px' }" :disabled="modalType === 1" />
                  </n-form-item>
                  <n-form-item label="内容">
                    <n-input
                      v-model:value="item.content"
                      placeholder=""
                      type="textarea"
                      :autosize="{
                        minRows: 10,
                        maxRows: 50,
                      }"
                      :style="{ maxWidth: '700px' }"
                    />
                  </n-form-item>
                  <n-form-item label="图片">
                    <n-upload
                      action="/apios/Tools/uploadImg"
                      :disabled="modalType === 1"
                      list-type="image-card"
                      :default-file-list="item.fileList"
                      :max="6"
                      name="img"
                      @finish="
                        ({ event }) => {
                          handleFinishZX(event, index)
                        }
                      "
                      @remove="
                        (options) => {
                          handleReomveZX({ options, index })
                        }
                      "
                      @before-upload="beforeUpload"
                    >
                      <n-button quaternary>上传文件</n-button>
                    </n-upload>
                  </n-form-item>
                </n-card>
                <!-- <div class="del-perform-item">
									<n-button type="warning" tertiary @click="delPerformCol(index)">删除</n-button>
								</div> -->
              </template>
              <div class="add-perform-box">
                <n-button tertiary @click="addPerformCol"> + 添加执行情况 </n-button>
              </div>
            </div>
          </n-form>
          <div v-if="model.com_id" flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="performValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="agencyInfo" tab="机构信息" display-directive="show">
          <n-form
            ref="formRefFive"
            :model="model"
            :rules="ruleFive"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <div class="perform-item-col">
              <n-form-item label="机构信息" path="institution">
                <div style="border: 1px solid #ccc">
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editorRefSecond"
                    :default-config="toolbarConfig"
                    mode="default"
                  />
                  <Editor
                    v-model="model.institution"
                    style="height: 1000px; overflow-y: hidden; width: 1400px"
                    :default-config="editorConfig"
                    mode="default"
                    @onCreated="handleCreatedSecond"
                  />
                </div>
              </n-form-item>
            </div>
          </n-form>
          <div v-if="model.com_id" flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="institutionValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="cert" tab="证书文案" display-directive="show">
          <n-form
            ref="formRefSix"
            :model="model"
            :rules="ruleSix"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <n-form-item label="项目名称" path="cert_title">
              <n-input v-model:value="model.cert_title" :style="{ maxWidth: '500px' }" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item label="证书内容一" path="cert_content1">
              <n-input v-model:value="model.cert_content1" :style="{ maxWidth: '500px' }" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item label="证书内容二" path="cert_content2">
              <n-input v-model:value="model.cert_content2" :style="{ maxWidth: '500px' }" :disabled="modalType === 1" />
            </n-form-item>
          </n-form>
          <div v-if="model.com_id" flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="certValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
        <n-tab-pane name="wxMessage" tab="消息设置" display-directive="show">
          <n-form
            ref="formRefSeven"
            :model="model"
            :rules="ruleSeven"
            label-placement="left"
            label-width="120px"
            require-mark-placement="right-hanging"
            size="large"
            :style="{ width: '1400px' }"
          >
            <n-form-item label="项目名称" path="wx_msg_thing1">
              <n-input v-model:value="model.wx_msg_thing1" :style="{ maxWidth: '500px' }" :disabled="modalType === 1" />
            </n-form-item>
            <n-form-item label="进展描述" path="wx_msg_thing2">
              <n-input v-model:value="model.wx_msg_thing2" :style="{ maxWidth: '500px' }" :disabled="modalType === 1" />
            </n-form-item>
          </n-form>
          <div v-if="model.com_id" flex justify-center w-1000>
            <n-button mr-10 @click="closeModel"> 关闭 </n-button>
            <n-button type="info" @click="wxMsgValidate"> 保存 </n-button>
          </div>
        </n-tab-pane>
      </n-tabs>

      <!-- <div flex justify-center w-1000>
					<n-button mr-10 @click="closeModel"> 关闭 </n-button>
					<n-button v-if="modalType !== 1" type="info" @click="handleValidate"> 保存 </n-button>
				</div> -->
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { ref, onBeforeUnmount, shallowRef } from 'vue'
import { useMessage, NInput, NButton, NDatePicker } from 'naive-ui'
import http from '../api'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { escape2Html, renderIcon, formatDate } from '@/utils'
import { addBaseParams } from '~/src/utils/http/helpers'
/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
/**modalTitle */
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
const formRefOne = ref(null)
const formRefTwo = ref(null)
const formRefThree = ref(null)
const formRefFour = ref(null)
const formRefFive = ref(null)
const formRefSix = ref(null)
const formRefSeven = ref(null)
//表单数据
const model = ref()
//优惠券id
let com_id = ''
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入公益标题',
  },
  // datetimerange: {
  // 	required: true,
  // 	validator: function(rule, value) {
  // 		console.log("持续时间：", value)
  // 		return Boolean(value)
  // 	},
  // 	trigger: ['blur', 'input'],
  // 	message: '请选择持续时间',
  // },
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请上传公益封面图片',
    // validator: function(rule, value) {
    // 	console.log("上传公益封面图片:", value);
    // 	// return Boolean(value)
    // 	return value?true:false
    // },
  },
  intro: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入副标题',
  },
  plan_num: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入目标人数',
  },
  plan_love: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入目标能量',
  },
  // schedule: {
  // 	required: true,
  // 	validator: function(rule, value) {
  // 		let arr = value.filter(item => {
  // 			return !item.date || !item.num
  // 		})
  // 		// 是否为空
  // 		let empty = true;
  // 		if (arr.length < value.length) {
  // 			empty = false
  // 		}
  // 		console.log(empty)
  // 		return !empty
  // 	},
  // 	trigger: ['blur', 'input'],
  // 	message: '请输入进度管理',
  // },
  // progress_title: {
  // 	required: false,
  // 	validator: function(rule, value) {
  // 		return Boolean(value)
  // 	},
  // 	trigger: ['blur', 'input'],
  // 	message: '请输入主标题',
  // },
  // progress_subtitle: {
  // 	required: false,
  // 	validator: function(rule, value) {
  // 		return Boolean(value)
  // 	},
  // 	trigger: ['blur', 'input'],
  // 	message: '请输入副标题',
  // },
  // perform: {
  // 	required: false,
  // 	validator: function(rule, value) {
  // 		let arr = value.filter(item => {
  // 			return !item.title
  // 		})
  // 		// 是否为空
  // 		let empty = true;
  // 		if (arr.length < value.length) {
  // 			empty = false
  // 		}
  // 		console.log(empty)
  // 		return !empty
  // 	},
  // 	trigger: ['blur', 'input'],
  // 	message: '请输入执行情况标题',
  // },
  introduce: {
    required: true,
    trigger: ['change', 'input'],
    validator: function (rule, value) {
      return value != '<p><br></p>' && Boolean(value)
    },
    message: '项目介绍不能为空',
  },
  institution: {
    required: true,
    trigger: ['change', 'input'],
    validator: function (rule, value) {
      return value != '<p><br></p>' && Boolean(value)
    },
    message: '机构信息不能为空',
  },
})
// 基础信息校验
const ruleOne = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入公益标题',
  },
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请上传公益封面图片',
  },
  intro: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入副标题',
  },
  plan_num: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入目标人数',
  },
  plan_love: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入目标能量',
  },
  schedule: {
    required: true,
    validator: function (rule, value) {
      let arr = value.filter((item) => {
        return !item.date || !item.num
      })
      // 是否为空
      let empty = true
      if (arr.length < value.length) {
        empty = false
      }
      console.log(empty)
      return !empty
    },
    trigger: ['blur', 'input'],
    message: '请输入进度管理',
  },
})
// 项目介绍验证规则
const ruleTwo = ref({
  introduce: {
    required: true,
    trigger: ['change', 'input'],
    validator: function (rule, value) {
      return value != '<p><br></p>' && Boolean(value)
    },
    message: '项目介绍不能为空',
  },
})
const ruleFive = ref({
  institution: {
    required: true,
    trigger: ['change', 'input'],
    validator: function (rule, value) {
      return value != '<p><br></p>' && Boolean(value)
    },
    message: '机构信息不能为空',
  },
})
// 证书文案验证规则
const ruleSix = ref({
  cert_title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入项目名称',
  },
  cert_content1: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入证书内容',
  },
  cert_content2: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入证书内容',
  },
})
// 微信模板消息验证
const ruleSeven = ref({
  wx_msg_thing1: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入项目名称',
  },
  wx_msg_thing2: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入进展描述',
  },
})
//商品选择
const loading = ref([false])

function handleSearch(query) {
  loading.value = true
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/apios/Tools/uploadImg',
      fieldName: 'img',
      // 自定义插入图片
      customInsert(res, insertFn) {
        // res 即服务端的返回结果
        let { url } = res.data
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(url, '', '')
      },
    },
  },
}
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorRef.value?.disable()
}
const editorRefSecond = shallowRef()
const handleCreatedSecond = (editor) => {
  editorRefSecond.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorRefSecond.value?.disable()
}
const handleCreatedTwo = (editor) => {
  editorRefSecond.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorRefSecond.value?.disable()
}

const processtableColumns = [
  {
    title: '截止日期(最多可设置5条)',
    key: 'date',
    align: 'center',
    render(row, index) {
      return h(NDatePicker, {
        type: 'date',
        clearable: false,
        disabled: model.value['status'] < 0 ? false : true,
        value: initProcessTime(model.value['schedule'][index].date, index),
        onUpdateValue(v) {
          model.value['schedule'][index].date = formatDate(v)
        },
      })
    },
  },
  {
    title: '目标人数',
    key: 'num',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.num,
        type: 'number',
        disabled: model.value['status'] < 0 ? false : true,
        onUpdateValue(v) {
          if (Number(v) >= 0) {
            model.value['schedule'][index].num = Number(v)
          }
        },
      })
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row, index) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            secondary: true,
            disabled: model.value['status'] < 0 ? false : true,
            onClick: () => deleteItem(row, index),
          },
          {
            default: () => '删除',
            icon: renderIcon('majesticons:eye-line', {
              size: 14,
            }),
          }
        ),
      ]
    },
  },
]

function initProcessTime(date, index) {
  if (date) {
    return new Date(date.replace(new RegExp(/-/gm), '/')).getTime()
  }
  model.value['schedule'][index].date = formatDate(Date.now())
  return Date.now()
}
// 删除一行
function deleteItem(row, index) {
  model.value['schedule'].splice(index, 1)
}
// 新增一行
function addProcesstableCol() {
  let arr = model.value['schedule']
  if (arr.length > 5) {
    message.error('最多可设置5条')
    return
  }
  let obj = {
    date: '',
    num: 0,
  }
  arr.push(obj)
  model.value['schedule'] = arr
}
// 新增执行情况
function addPerformCol() {
  let arr = model.value['perform']
  let idx = 0
  if (arr.length > 0) {
    idx = Number(arr[arr.length - 1]['id']) + 1
  }
  let obj = {
    id: '_add_' + idx,
    // id:idx,
    title: '',
    content: '',
    images: [],
  }
  arr.push(obj)
  model.value['perform'] = arr
}
// 删除执行情况
function delPerformCol(index) {
  model.value['perform'].splice(index, 1)
}
//已上传的公益图片
const fileList = ref([])
//已上传的执行情况图片
const zxfileList = ref([])
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.image = res.data.url
}
// 执行情况的上传
function handleFinishZX(event, index) {
  console.log('event:', event, index)
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  let { url } = res.data
  model.value.perform[index]['images'].push(url)
}
// 执行情况删除
function handleReomveZX(item) {
  console.log(item)
  let { options, index } = item
  let { file, fileList } = options
  let arr = []
  fileList.forEach((item) => {
    if (item.id != file.id) {
      arr.push(item.url)
    }
  })
  model.value.perform[index]['images'] = arr
}

async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

/**展示弹窗 */
function show(operatType, data) {
  console.log('operatType:', operatType)
  com_id = data?.id
  modalType.value = operatType
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  // if (operatType === 1) editorRef.value?.disable()
  if (operatType === 1) {
    editorRef.value?.disable()
    editorRefSecond.value?.disable()
  }
  init(com_id)
}

function init(com_id) {
  fileList.value = []
  if (modalType.value != 3) {
    http
      .getInfo({
        com_id,
      })
      .then((res) => {
        let {
          com_id: id,
          title,
          image,
          intro,
          explain,
          plan_love,
          plan_num,
          schedule,
          introduce,
          institution,
          progress_title,
          progress_subtitle,
          progress_content,
          perform,
          start_time,
          end_time,
          status,
          cert_title,
          cert_content1,
          cert_content2,
          wx_msg_thing1,
          wx_msg_thing2,
        } = res.data
        /** 公益封面 图片预览 */
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
        /** 执行情况 图片预览 */
        if (perform.length) {
          perform.forEach((item) => {
            item.fileList = item.images.map((img, index) => {
              return {
                id: 'c' + index,
                name: '已上传的图片',
                status: 'finished',
                url: img,
              }
            })
          })
        }
        model.value = {
          com_id,
          title,
          image,
          intro,
          explain,
          plan_love,
          plan_num,
          schedule,
          introduce: escape2Html(introduce),
          institution: escape2Html(institution),
          progress_title,
          progress_subtitle,
          progress_content,
          perform,
          start_time,
          end_time,
          status,
          cert_title,
          cert_content1,
          cert_content2,
          wx_msg_thing1,
          wx_msg_thing2,
        }
        // 活动进行中:取消时间、进度验证
        if (model.value.status == 0) {
          delete rules.value.schedule
          delete rules.value.datetimerange
        }
        timeConfirm()
        showModal.value = true
      })
  } else {
    var schedule = Array.from(
      {
        length: 1,
      },
      (v, i) => ({
        date: '',
        num: 0,
      })
    )
    var perform = Array.from(
      {
        length: 1,
      },
      (v, i) => ({
        title: '',
        content: '',
        images: [],
        // fileList: [{
        // 		id: 'c',
        // 		name: '已上传的图片',
        // 		status: 'finished',
        // 		url: "https://file.y1b.cn/store/1-0/23217/63ef1bd4dcbfd.jpg",
        // 	},
        // ]
      })
    )
    model.value = {
      title: '',
      image: [],
      intro: '',
      explain: '',
      plan_love: '',
      plan_num: '',
      schedule,
      introduce: '',
      institution: '',
      progress_title: '',
      progress_subtitle: '',
      progress_content: '',
      perform,
      status: -1,
      cert_title: '',
      cert_content1: '',
      cert_content2: '',
      wx_msg_thing1: '',
      wx_msg_thing2: '',
    }
    // handleSearch('')
    showModal.value = true
  }
}

function timeConfirm() {
  let { start_time, end_time } = model.value
  if (start_time && end_time) {
    model.value.datetimerange = [start_time, end_time]
  } else {
    model.value.datetimerange = ''
  }
}
/**关闭弹窗 */
function closeModel() {
  showModal.value = false
  emit('refresh', modalType.value)
}
// drawerUpdate
function drawerUpdate(event) {
  emit('refresh', modalType.value)
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    console.log(model.value)
    let {
      com_id,
      title,
      image,
      start_time,
      end_time,
      intro,
      explain,
      plan_love,
      plan_num,
      schedule,
      introduce,
      institution,
      progress_title,
      progress_subtitle,
      progress_content,
      perform,
      datetimerange,
    } = model.value

    if (perform.length > 0) {
      perform.forEach((item) => {
        delete item.fileList
      })
    }
    if (!errors) {
      let params = {
        title,
        image,
        start_time,
        end_time,
        intro,
        explain,
        plan_love,
        plan_num,
        schedule,
        introduce,
        institution,
        progress_title,
        progress_subtitle,
        progress_content,
        perform,
      }
      if (datetimerange && datetimerange.length) {
        params.start_time = datetimerange[0]
        params.end_time = datetimerange[1]
      }
      if (com_id) {
        params.com_id = com_id
      }
      console.log('传参：', params)
      // return
      /**更新数据 */
      http.create(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
          showModal.value = false
          emit('refresh', modalType.value)
        } else {
          message.error(res.msg)
        }
      })
    } else {
      // message.error("请补全其它信息")
    }
  })

  return false
}

// 基础信息验证
function baseInfoValidate() {
  formRefOne.value?.validate((errors) => {
    console.log(model.value)
    let { com_id, title, datetimerange, image, start_time, end_time, intro, explain, plan_love, plan_num, schedule } =
      model.value

    if (!errors) {
      let params = {
        title,
        image,
        intro,
        explain,
        plan_love,
        plan_num,
        schedule,
      }
      if (datetimerange && datetimerange.length) {
        params.start_time = datetimerange[0]
        params.end_time = datetimerange[1]
      }
      if (com_id) {
        params.com_id = com_id
      }
      console.log('传参基础信息：', params)
      /**更新数据 */
      http.create(params).then((res) => {
        if (res.code == 1) {
          modalType.value = 2
          com_id = res.data.com_id
          model.value.com_id = com_id
          init(com_id)
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}
// 项目介绍验证
function introValidate() {
  formRefTwo.value?.validate((errors) => {
    console.log(model.value)
    let { com_id, introduce } = model.value

    if (!errors) {
      let params = {
        com_id,
        introduce,
      }

      console.log('传参项目介绍：', params)
      /**更新数据 */
      http.createIntroduce(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}
// 项目进展
function progressValidate() {
  let { com_id, progress_title, progress_subtitle, progress_content } = model.value

  let params = {
    com_id,
    progress_title,
    progress_subtitle,
    progress_content,
  }

  console.log('传参项目进展：', params)
  /**更新数据 */
  http.createProgress(params).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
    } else {
      message.error(res.msg)
    }
  })
}
// 执行情况
function performValidate() {
  let { com_id, perform } = model.value
  let _perform = JSON.parse(JSON.stringify(perform))
  if (_perform.length > 0) {
    let reg = /_add_/
    _perform.forEach((item) => {
      // 去掉新增时的id
      if (reg.test(item.id)) {
        // item.id = Number(item.id.replace(/_add_/,""))
        delete item.id
      }
      delete item.fileList
    })
  }
  let params = {
    com_id,
    perform: _perform,
  }

  console.log('传参执行情况：', params)
  /**更新数据 */
  http.createPerform(params).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
    } else {
      message.error(res.msg)
    }
  })
}
// 机构信息
function institutionValidate() {
  formRefFive.value?.validate((errors) => {
    console.log(model.value)
    let { com_id, institution } = model.value

    if (!errors) {
      let params = {
        com_id,
        institution,
      }

      console.log('传参机构信息：', params)

      /**更新数据 */
      http.createInstitution(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}
// 证书文案
function certValidate() {
  formRefSix.value?.validate((errors) => {
    console.log(model.value)
    let { com_id, cert_title, cert_content1, cert_content2 } = model.value

    if (!errors) {
      let params = {
        com_id,
        cert_title,
        cert_content1,
        cert_content2,
      }

      console.log('传参证书文案：', params)
      /**更新数据 */
      http.createCert(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}
// 微信模板消息设置
function wxMsgValidate() {
  formRefSeven.value?.validate((errors) => {
    console.log(model.value)
    let { com_id, wx_msg_thing1, wx_msg_thing2 } = model.value

    if (!errors) {
      let params = {
        com_id,
        wx_msg_thing1,
        wx_msg_thing2,
      }

      console.log('传参消息设置：', params)
      /**更新数据 */
      http.createWxMsg(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style lang="scss">
.item-row {
  max-width: 700px;
  display: flex;
  justify-content: space-between;
}

.item-col {
  display: flex;
  flex-direction: column;
}

.perform-item-col {
  // display: flex;
  // flex-direction: column;
  max-width: 800px;

  /* 去掉 NaiveUI 表单组件的 label 样式 */
  .n-form-item-label {
    width: 84px !important;
    text-align: right !important;
  }
}

.del-perform-item {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.add-perform-box {
  margin-left: 32px;
  margin-top: 30px;
}

.n-modal .n-card,
.n-drawer .n-card {
  margin-bottom: 50px;
}
</style>
