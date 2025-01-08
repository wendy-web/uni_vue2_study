/**
 * 返回到指定的页面层数
 * @param {string} targetPage 需要返回页面的完整路径最前面没有/
 */
export function navigateBackTo(targetPage) {
    const pages = getCurrentPages(); // 获取当前页面栈
    const currentPageIndex = pages.length - 1; // 当前页面的索引
    // 获取传入路径的索引
    let targetPageIndex = pages.findIndex((item) => {
        return item.route == "pages/warehouseModule/getSupplier/list/list"
    })
    const targetIndex = currentPageIndex - targetPageIndex; // 目标页面的索引

    if (targetIndex >= 0) {
        wx.navigateBack({
            delta: currentPageIndex - targetIndex // 返回的层数
        });
    } else {
        wx.navigateBack();
    }
}

/**
 * 根据传入的页面,看看页面栈是否存在,判断是执行navigateBack(存在)还是redirectTo(不存在)
 * @param {string} targetPage 需要返回页面的完整路径最前面没有/
 */
export function checkTargetType(targetPage) {
    const pagesRoute = getCurrentPages().map((item) => item.route); // 获取当前页面栈的Route数组
    let isInclude = pagesRoute.includes(targetPage) ? true : false;
    if (isInclude) {
        navigateBackTo(targetPage)
    } else {
        uni.redirectTo({
            url: `/${targetPage}`
        })
    }
}