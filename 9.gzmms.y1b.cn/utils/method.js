export function setBarTitle(type, title) {
    let barTitle = '';
    switch (type) {
        case 1:
            barTitle = '新增';
            break;
        case 2:
            barTitle = '编辑';
            break;
        case 3:
            barTitle = '查看';
            break;
    }
    uni.setNavigationBarTitle({
        title: `${barTitle}${title}`
    });
}
