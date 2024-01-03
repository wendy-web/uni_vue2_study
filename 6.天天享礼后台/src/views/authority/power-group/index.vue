<template>
    <CommonPage show-footer title="权限组">
        <template #action>
            <n-button type="primary" @click="handleAdd">
                <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加
            </n-button>
        </template>
        <CrudTable
            ref="$table"
            v-model:query-items="queryItems"
            :scroll-x="1200"
            :columns="columns"
            :get-data="http.groupList"
            :is-pagination="false"
        >
        <template #queryBar>
            <QueryBarItem label="类目" :label-width="65">
              <n-select v-model:value="queryItems.cid" :options="cidOptions" @update:value="doChange"  />
            </QueryBarItem>
          </template>
        </CrudTable>
    </CommonPage>
    <operate-single
        ref="operateSingleRef"
        :cid="queryItems.cid"
        :useData="useData"
        :treeData="treeData"
        @refresh="refresh"
    />
</template>

<script setup>
    import { NButton } from 'naive-ui';
    import { renderIcon } from '@/utils';
    import { useMessage, useDialog } from 'naive-ui';
    import http from './api';
    import { cidOptions } from './options';
    import operateSingle from './operateSingle.vue';
    defineOptions({ name: 'CouponGroup' })
    //表格操作
    const $table = ref(null);
    const operateSingleRef = ref(null);
    /** QueryBar筛选参数（可选） */
    const queryItems = ref({
        cid: 1
    });
    const treeData = ref();
    const useData  = ref();
    onMounted(async () => {
        refresh();
        const useRes = await http.useGetList();
        if(useRes.code != 1) return;
        useData.value = useRes.data.list;
    });
    watch(
        () => queryItems,
        () => initTree(),
        {
            deep: true,
            immediate: true
        }
    );
    async function initTree() {
        const res = await http.getList(queryItems.value);
        if(res.code != 1) return;
        treeData.value = res.data;
    }
    function refresh() {
        $table.value?.handleSearch();
    }
    const columns = [
        { title: '分组ID', key: 'id', align: 'center' },
        { title: '分组名称', key: 'title', align: 'center' },
        { title: '创建时间', key: 'create_time', align: 'center' },
        { title: '修改时间', key: 'update_time', align: 'center' },
        {
            title: '操作',
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 300,
            render(row) {
                return [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'primary',
                            style: { 'margin-right': '10px' },
                            secondary: true,
                            onClick: () => lookCoupon(row),
                        },
                        { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'info',
                            secondary: true,
                            style: { 'margin-right': '10px' },
                            onClick: () => editCoupon(row),
                        },
                        { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'error',
                            secondary: true,
                            onClick: () => removeCoupon(row),
                        },
                        { default: () => '删除', icon: renderIcon('material-symbols:cancel-outline-rounded', { size: 14 }) }
                    ),
                ]
            },
        },
    ]
    //提示展示
    const message = useMessage();
    /**查看 */
    function lookCoupon(row) {
        operateSingleRef.value.show(1, row)
    }
    /**编辑 */
    function editCoupon(row) {
        operateSingleRef.value.show(2, row)
    }
    /**新增活动 */
    function handleAdd() {
        operateSingleRef.value.show(3)
    }
    /** 自定义单元格 */
    const dialog = useDialog();
    /**删除分组 */
    function removeCoupon(row) {
        dialog.warning({
            title: '警告',
            content: '确定删除？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: function () {
                http.groupDelte({ id: row.id }).then(function (res) {
                    if (res.code == 1) {
                        message.success(res.msg)
                        refresh()
                    } else {
                        message.error(res.msg)
                    }
                })
            },
        })
    }
    function doChange(value){
        queryItems.value.cid = value;
        refresh()
    }
</script>
