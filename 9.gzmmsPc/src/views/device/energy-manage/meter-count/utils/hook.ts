import type { PaginationProps } from "@pureadmin/table";
import type { IdNameType } from "@/api/device/common/types";
import { getCountRelationApi } from "@/api/device/inspection/meter-count/index";

export function useList() {
  const relationgList = ref<IdNameType[]>([]);
  async function getRelation() {
    const result = await getCountRelationApi();
    relationgList.value = result.data;
  }

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  const columns: TableColumnList = [
    {
      type: "index",
      label: "序号",
      align: "center",
      width: 60,
    },
    {
      label: "设备编码",
      prop: "asset_no",
      align: "center",
    },
    {
      label: "资产名称",
      prop: "bar_title",
      align: "center",
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      align: "center",
    },
    {
      label: "资产类型",
      prop: "equipment_type_text",
      align: "center",
    },
    {
      label: "倍率",
      prop: "mult",
      align: "center",
    },
    {
      label: "实时读数",
      prop: "num",
      align: "center",
    },
    {
      label: "最后更新时间",
      prop: "update_time",
      align: "center",
    },
    {
      label: "绑定关系",
      prop: "rel_text",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      fixed: "right",
    },
  ];

  const editVisible = ref(false);
  const editFormData = ref({
    bar_title: "",
    asset_no: "",
    save_addr_text: "",
    rel_id: undefined as FormNumType,
    id: 0,
    eq_id: 0,
  });

  const editColumns: PlusColumnList = [
    {
      label: "资产名称",
      prop: "bar_title",
      valueType: "text",
      fieldProps: {
        placeholder: "--",
      },
    },
    {
      label: "资产编码",
      prop: "asset_no",
      valueType: "text",
      fieldProps: {
        placeholder: "--",
      },
    },
    {
      label: "使用位置",
      prop: "save_addr_text",
      valueType: "text",
      fieldProps: {
        placeholder: "--",
      },
    },
    {
      label: "绑定关联",
      prop: "rel_id",
      valueType: "select",
      fieldProps: {
        placeholder: "请选择",
      },
      options: computed(() => {
        return relationgList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
  ];

  const editRules = {
    rel_id: [
      {
        required: true,
        message: "请选择绑定关联",
        trigger: "change",
      },
    ],
  };

  return {
    columns,
    pagination,
    editVisible,
    editFormData,
    editColumns,
    editRules,
    getRelation,
    relationgList,
  };
}
