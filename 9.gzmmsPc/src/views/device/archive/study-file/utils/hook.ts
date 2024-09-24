import type { PaginationProps } from "@pureadmin/table";
import { getUploadFileTypeApi } from "@/api/device/common/index";
import { IdNameType } from "@/api/device/common/types";

export function useList() {
  const fileTypeList = ref<IdNameType[]>([]);
  async function getTypeList() {
    const result = await getUploadFileTypeApi();
    fileTypeList.value = result.data;
  }

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 40, 50],
  });

  function getTypeName(type: number) {
    const typeMap = new Map([
      [1, "设备图片"],
      [2, "设备文档"],
      [3, "图纸"],
      [4, "课件"],
      [5, "停机报告"],
      [6, "经验分享报告"],
    ]);

    return typeMap.get(type) || "";
  }

  const columns: TableColumnList = [
    {
      prop: "file_name",
      label: "文件名",
      align: "center",
    },
    {
      prop: "type",
      label: "分类名称",
      align: "center",
      cellRenderer: ({ row }) => {
        return getTypeName(row.type);
      },
    },
    {
      prop: "download_num",
      label: "下载次数",
      align: "center",
    },
    // {
    //   prop: "",
    //   label: "文件大小",
    //   align: "center",
    // },
    {
      prop: "create_time",
      label: "上传时间",
      align: "center",
    },
    // {
    //   prop: "",
    //   label: "扩展名",
    //   align: "center",
    // },
    {
      prop: "name",
      label: "上传人",
      align: "center",
    },
    {
      prop: "note",
      label: "备注",
      align: "center",
    },
    {
      label: "操作",
      slot: "operation",
      align: "center",
      fixed: "right",
    },
  ];

  const searchColumns: PlusColumnList = [
    {
      label: "文件名称",
      prop: "file_name",
      fieldProps: {
        placeholder: "请输入",
      },
    },
    {
      label: "分类",
      labelWidth: 60,
      prop: "type",
      valueType: "select",
      fieldProps: {
        placeholder: "请输入分类",
      },
      options: computed(() => {
        return fileTypeList.value.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }),
    },
  ];

  return {
    pagination,
    columns,
    searchColumns,
    fileTypeList,
    getTypeList,
  };
}
