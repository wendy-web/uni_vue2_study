import { ElOption, ElSelect } from "element-plus";
import dayjs from "dayjs";
import { getWsCodeMap } from "@/api/product-stock/product-in";
import { getWlCodeDropApi } from "@/api/product-stock/common";
import { useProcuctStock } from "../../hooks";

export function useAdd() {
    const { factoryCodeList, getFactoryCodeList, wsCodeList, getWscodeList, stockType } = useProcuctStock();
    /** 记录的物料信息列表 */
    const wlSelectList = ref<any[]>([]);
    /** 获取物料信息列表 */
    async function getWlData() {
        const result = await getWlCodeDropApi({ keyword: "", type: 1 });
        wlSelectList.value = result.data.data;
    }
    /** el-select-v2的props */
    const selectProps = {
        label: "wl_code",
        value: "id",
    };

    // 选择文件改变
    const bindFile = (file: { name: string; src: string }) => {
        // console.log("file", file);
        addFormData.value.file_info = file;
    };

    const inventoryCodeList = ref<any>([]); // 库存编码列表
    const site = ref<string>("");
    const tableFarm = ref<any>(
        {
            tableData: [
                {
                    barcode: "", //物料编码
                    title: "", //物料名称
                    in_num: null, // 入库数量
                    measure_name: "CAR", // 单位
                    pro_ph_no: "", // 批次
                    box_serial_number_start: null, // 箱序列号
                    box_serial_number_end: null, // 箱序列号
                    // ws_code: "", // 库位编码
                    ws_code: undefined as FormNumType,
                    ws_code_name: undefined as FormNumType,
                    // ws_code_name: "", // 库位名称
                    site: site.value, // 库存地
                    inventoryName: [], // 库位名称列
                },
            ]
        }
    );


    const selectchange = async (value: string) => {
        // let newValue = selectchange();
        let findRes: any = factoryCodeList.value.find((el) => el.factory_code == value);
        // console.log("数据", findRes);
        site.value = findRes ? findRes.site : "";
        tableFarm.value.tableData.forEach((element: { ws_code: string; site: any; inventoryName: never[]; ws_code_name: string; ws_code_id: string; }) => {
            element.ws_code = "";
            element.site = findRes.site;
            element.inventoryName = [];
            element.ws_code_name = "";
            element.ws_code_id = "";
        });
        inventoryCodeList.value = [];
        const { data } = await getWsCodeMap({ factory_code: findRes.factory_code });
        inventoryCodeList.value = data.data;
        return data.data;
    };
    const addFormData = ref({
        pro_no: "", //生产订单
        factory_code: "", // 库存工厂编码
        delivery_no: "", //交货单号
        pro_date: "", //生产日期
        goods_id: undefined as FormNumType, //选择物料信息
        stock_type: "", //库存类型
        note: "", //入库备注
        file_info: {
            src: "",
            name: "",
        },
    });

    const addColumns: PlusColumnList = [
        {
            label: "生产订单",
            prop: "pro_no",
        },
        // clearable = { true}
        {
            label: "库存工厂编码",
            prop: "factory_code",
            valueType: "select",
            renderField: () => {
                return (
                    <ElSelect
                        v-model={addFormData.value.factory_code}
                        style="width:100%"
                        filterable={true}
                        onChange={selectchange}
                    >
                        {factoryCodeList.value.map((option) => (
                            <ElOption key={option.id} label={option.factory_code} value={option.factory_code} />
                        ))}
                    </ElSelect>
                );
            },
        },
        {
            label: "交货单号",
            prop: "delivery_no",
        },
        {
            label: "生产日期",
            prop: "pro_date",
            valueType: "date-picker",
            fieldProps: {
                type: "date",
                format: "YYYY-MM-DD",
                valueFormat: "YYYY-MM-DD",
                disabledDate: (date: string) => {
                    return dayjs().isBefore(date);
                },
            },
        },
        {
            label: "物料信息",
            prop: "goods_id",
        },
        {
            label: "库存类型",
            prop: "stock_type",
            valueType: "select",
            // 当前输入框聚焦状态，按下Enter 键提交搜索
            renderField: () => {
                return (
                    <ElSelect
                        v-model={addFormData.value.stock_type}
                        style="width:100%"
                        filterable={true}
                        clearable={true}
                    >
                        {stockType.value.map((option) => (
                            <ElOption key={option.key} label={option.name} value={option.key} />
                        ))}
                    </ElSelect>
                );
            },
        },
        {
            label: "入库备注",
            prop: "note",
        },
        {
            label: "附件信息",
            prop: "file_info",
        },
    ];

    const addRules = {
        pro_no: [
            {
                required: true,
                message: "请输入生产订单",
            },
        ],
        factory_code: [
            {
                required: true,
                message: "请选择库存工厂编码",
            },
        ],
        goods_id: [
            {
                required: true,
                message: "请选择物料信息",
            },
        ],
        stock_type: [
            {
                required: true,
                message: "请选择库存类型",
            },
        ],
    };

    const inColumns: TableColumnList = [
        {
            label: "序号",
            type: "index",
            width: 60,
            align: "center",
        },
        {
            label: "操作",
            align: "center",
            slot: "operation",
            width: 120,
        },
        {
            label: "物料编码",
            prop: "barcode",
            slot: "barcode",
            align: "center",
            minWidth: 125,
        },

        {
            label: "物料名称",
            prop: "title",
            slot: "title",
            align: "center",
            minWidth: 125,
        },
        {
            label: "入库数量",
            prop: "in_num",
            slot: "in_num",
            headerSlot: "title_in_num",
            align: "center",
            width: 170
        },
        {
            label: "单位",
            prop: "measure_name",
            align: "center",
            width: 90,
        },
        {
            label: "批次",
            prop: "batch_no",
            slot: "batch_no",
            headerSlot: "title_batch_no",
            align: "center",
            width: 170
        },
        {
            label: "箱序列号",
            prop: "box_serial_number_start",
            slot: "box_serial_number_start",
            headerSlot: "title_box_serial_number_start",
            align: "center",
            width: 350,
        },
        {
            label: "箱序列号",
            prop: "box_serial_number_end",
            align: "center",
            hide: true
        },
        {
            label: "库位编码",
            prop: "ws_code",
            slot: "ws_code",
            headerSlot: "title_ws_code",
            align: "center",
            width: 190
        },
        {
            label: "库位名称",
            prop: "ws_code_name",
            slot: "ws_code_name",
            align: "center",
            width: 190
        },
        {
            label: "库存地点",
            prop: "site",
            slot: "site",
            align: "center",
            width: 90,
        },
    ];

    return {
        addFormData,
        addColumns,
        addRules,
        getFactoryCodeList,
        getWscodeList,
        wsCodeList,
        wlSelectList,
        factoryCodeList,
        getWlData,
        selectProps,
        bindFile,
        inColumns,
        tableFarm,
        inventoryCodeList,
        site
    };
}
