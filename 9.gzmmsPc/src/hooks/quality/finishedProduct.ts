/** 根据批号分组的分组数据的类型key-value */
export type GroupedPacks = {
  [groupName: string]: GroupedList[];
};

/** 定义连续性报告的数据 */
export type ContinuityResult = {
  [groupName: string]: string;
};

/** 根据批号分组数据类型的value类型 */
export type GroupedList = {
  batch_no: string; //批次
  batch_number: string; //批号
  line: string; //线别名称
  line_id: number; //线别id
  check_detail_id: number; //微生物检验记录明细id
  check_order_id: number; // 微生物检验单id
  sku: string; // 产品类型
  check_res: number; //检验结果
  is_send: number; //是否发货
  phys_net_val?: string; //可溶性固形物实测值 --战马需要
  phys_internal_pressure_val?: string; //净含量实测值--战马需要
  ph_val?: string; //PH实测值--战马需要
  soluble_solids_val?: string; //内压实测值--战马需要
  batch_info_id?: number; // 批次明细id 编辑时存在
  id?: number; // 记录id 编辑时存在
};

/** 红牛成品检验和战马成品检验使用的hooks */
export function useProductGroupedHooks() {
  /** 里面的value是做排序用的 */
  const lineOptions = [
    {
      label: "一线",
      value: 1,
    },
    {
      label: "二线",
      value: 2,
    },
    {
      label: "三线",
      value: 3,
    },
    {
      label: "四线",
      value: 4,
    },
    {
      label: "五线",
      value: 5,
    },
    {
      label: "六线",
      value: 6,
    },
  ];

  /** 根据批号分组的一个 对象分组数组 */
  const groupsData = ref<GroupedPacks>({});

  function updateGroupsWithNewData(newData: any[], data: GroupedPacks) {
    // 遍历新数据
    newData.forEach((item) => {
      let { batch_no, id, order_id, ...rest } = item;
      // 如果分组中已有该batch_no，则在对应数组中追加数据并排序
      if (data.hasOwnProperty(batch_no)) {
        // 将数据中的id设为check_detail_id字段添加到数据中
        data[batch_no].push({
          check_detail_id: id,
          batch_no,
          check_order_id: order_id,
          is_send: 0,
          ...rest,
        });
        // // 确保数组按pack_no排序
        // data[batch_no].sort((a, b) => {
        //   return getLineSort(a.line) - getLineSort(b.line);
        // });
      } else {
        // 否则，创建新的分组
        data[batch_no] = [
          { check_detail_id: id, check_order_id: order_id, batch_no, is_send: 0, ...rest },
        ];
      }
    });
  }

  function getLineSort(str: string) {
    return lineOptions.find((item) => str === item.label)?.value || 0;
  }

  /** 获取分组连续性数值和不连续性数值 */
  function formatGroupsPackNo(groups: GroupedPacks) {
    const result: ContinuityResult = {};

    Object.entries(groups).forEach(([groupName, groupPacks]) => {
      if (groupPacks.length) {
        groupPacks.sort(
          (a, b) =>
            parseInt(a.batch_number.slice(0, 3), 10) - parseInt(b.batch_number.slice(0, 3), 10),
        );

        let formattedRange: string[] = [];
        let currentRangeStart = groupPacks[0].batch_number;
        let previousPackNo = groupPacks[0].batch_number;

        groupPacks.slice(1).forEach((pack) => {
          const currentPackNo = pack.batch_number;
          const currentPackNoPrefix = currentPackNo.slice(0, 3);
          const previousPackNoPrefix = previousPackNo.slice(0, 3);

          if (parseInt(currentPackNoPrefix, 10) === parseInt(previousPackNoPrefix, 10) + 1) {
            // 连续，更新当前范围的结束点（这里其实不需要更新currentRangeStart，因为我们关心的是连续性）
          } else {
            // 非连续，检查并添加前一个范围到结果数组
            if (currentRangeStart !== previousPackNo) {
              formattedRange.push(
                currentRangeStart !== previousPackNo
                  ? `${currentRangeStart}-${previousPackNo}`
                  : currentRangeStart,
              );
            }
            // 开始新的范围
            currentRangeStart = currentPackNo;
          }
          previousPackNo = currentPackNo;
        });

        // 处理最后一个元素，无论是否连续，都应添加到结果中
        if (currentRangeStart !== previousPackNo) {
          formattedRange.push(
            currentRangeStart !== previousPackNo
              ? `${currentRangeStart}-${previousPackNo}`
              : currentRangeStart,
          );
        } else if (!formattedRange.includes(currentRangeStart)) {
          // 防止重复添加最后一个元素
          formattedRange.push(currentRangeStart);
        }

        // 转换为逗号分隔的字符串，但移除末尾可能的逗号
        result[groupName] = formattedRange.join(", ").replace(/,\s*$/, "");
      }
    });

    return result;
  }

  /** 根据groupsData数据格式化tableData表格数据 */
  function formatTable(data: GroupedPacks) {
    // 获取分组连续性数值和不连续性数值
    let packNoList = formatGroupsPackNo(data);
    const arr = Object.keys(data).map((key) => {
      if (data[key].length > 0) {
        let item = data[key][0];
        // 对于每个key，只取其对应的数组中的第一个元素作为代表
        let itemObj = {
          batch_no: item.batch_no,
          joint_batch_number: packNoList[key],
          line: item.line,
          sku: item.sku,
          line_id: item.line_id,
        };
        //该batch_info_id对应为父级的id
        // 如果batch_info_id存在，则返回包含batch_info_id的itemObj,且batch_info_id设为id，否则返回itemObj
        return item.batch_info_id ? { id: item.batch_info_id, ...itemObj } : itemObj;
      } else {
        return {
          batch_no: "",
          joint_batch_number: "",
          line: "",
          sku: "",
          line_id: 0,
        };
      }
    });

    arr.sort((a, b) => {
      return getLineSort(a.line) - getLineSort(b.line);
    });

    return arr;
  }

  return { lineOptions, groupsData, updateGroupsWithNewData, formatTable };
}
