<template>
  <el-dialog v-model="visibleDialog" title="选择成员" width="50%" draggable>
    <div class="dialog-content flex border-[1px] border-solid">
      <div class="dialog-left flex-1 p-[10px]">
        <div class="left-sarch flex items-center">
          <el-input v-model="dialogKeyValue" placeholder="搜索成员" clearable>
            <template #prefix>
              <i-ep-search></i-ep-search>
            </template>
          </el-input>
          <el-button type="primary" @click="">搜索</el-button>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="成员列表" name="first">
            <el-checkbox-group
              v-model="checkList"
              @change="memberChange"
              class="max-h-[400px] min-h-[400px] overflow-y-auto"
            >
              <template v-for="item in checkMemberList" :key="item">
                <el-checkbox :label="item.id" class="block">
                  <svg-icon icon-class="user"></svg-icon>
                  <span class="inline-block mr-[10px]">{{ item.name }}</span>
                  <span>{{ item.mobile }}</span>
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="角色列表" name="second">
            <el-checkbox-group
              v-model="checkList"
              class="max-h-[400px] min-h-[400px] overflow-y-auto"
            >
              <template v-for="item in checkRoleList" :key="item">
                <el-checkbox :label="item.id" class="block">{{ item.name }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="dialog-right flex-1">
        <div
          class="right-header flex items-center justify-between py-[10px] px-[20px] border-b-[1px] border-solid"
        >
          <div class="text-[14px]">
            <span>已选</span>
            <span>({{ selectedNum }})</span>
          </div>
          <span class="text-[14px] text-blue-400 cursor-pointer" @click="clickClear">清空</span>
        </div>
        <div class="right-list max-h-[460px] min-h-[460px] overflow-y-auto">
          <div
            class="flex items-center justify-between py-[6px] px-[20px] hover:bg-gray-100"
            v-for="item in selectedList"
            :key="item.id"
          >
            <div>
              <svg-icon icon-class="user"></svg-icon>
              <span>{{ item.name }}</span>
            </div>
            <i-ep-CircleClose class="cursor-pointer" @click="clickDel(item.id)"></i-ep-CircleClose>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="visibleDialog = false">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
let emits = defineEmits(["update:visible"]);

const dialogKeyValue = ref("");
const activeName = ref("first");
const checkList = ref([1, 2]); //选中状态的数组
const checkMemberList = ref([
  {
    name: "用户1",
    mobile: "18999887799",
    id: 1,
  },
  {
    name: "用户2",
    mobile: "18999887799",
    id: 2,
  },
  {
    name: "用户3",
    mobile: "18999887799",
    id: 3,
  },
  {
    name: "用户1",
    mobile: "18999887799",
    id: 1,
  },
  {
    name: "用户2",
    mobile: "18999887799",
    id: 2,
  },
  {
    name: "用户3",
    mobile: "18999887799",
    id: 3,
  },
  {
    name: "用户1",
    mobile: "18999887799",
    id: 1,
  },
  {
    name: "用户2",
    mobile: "18999887799",
    id: 2,
  },
  {
    name: "用户3",
    mobile: "18999887799",
    id: 3,
  },
  {
    name: "用户1",
    mobile: "18999887799",
    id: 1,
  },
  {
    name: "用户2",
    mobile: "18999887799",
    id: 2,
  },
  {
    name: "用户3",
    mobile: "18999887799",
    id: 3,
  },
  {
    name: "用户1",
    mobile: "18999887799",
    id: 1,
  },
  {
    name: "用户2",
    mobile: "18999887799",
    id: 2,
  },
  {
    name: "用户3",
    mobile: "18999887799",
    id: 3,
  },
]);
const checkRoleList = ref([
  {
    name: "角色1",
    id: 1,
  },
  {
    name: "角色2",
    id: 2,
  },
  {
    name: "角色3",
    id: 3,
  },
]);

const selectedList = ref<any[]>([]);

let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});

const selectedNum = computed(() => {
  return selectedList.value.length;
});

function closeDialog() {
  emits("update:visible", false);
  console.log(activeName.value);
}

// 成员分组改变时的事件
function memberChange(val: any[]) {
  getSelectedList();
}

// 点击清空
function clickClear() {
  selectedList.value = [];
  checkList.value = [];
}

function clickDel(id: number) {
  let checkIndex = checkList.value.findIndex((item) => {
    return item == id;
  });

  let selectedIdnex = selectedList.value.findIndex((item) => {
    return item.id == id;
  });

  checkList.value.splice(checkIndex, 1);
  selectedList.value.splice(selectedIdnex, 1);
}

// 设置已选择的人员数组
function getSelectedList() {
  let list = checkList.value.map((item) => {
    return checkMemberList.value.find((newitem) => {
      return item == newitem.id;
    });
  });
  selectedList.value = list;
}

onMounted(() => {
  getSelectedList();
});
</script>

<style scoped lang="scss">
:deep(.el-checkbox) {
  display: block;
}
.dialog-right {
  border-left: 1px solid #e5e5e5;
}
</style>
