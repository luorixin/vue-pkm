export const PAGE_SIZES = [5, 10, 20, 30, 50];

export const FILE_TYPES = [
    {
        value: "0",
        label: "word文档"
    }, {
        value: "1",
        label: "url地址"
    }
];

export const FILE_STATUS = [
  {
      value: "0",
      label: "解析中",
      type: 'info'
  }, {
      value: "1",
      label: "爬取中",
      type: 'info'
  }, {
      value: "2",
      label: "生成索引中",
      type: 'primary'
  }, {
      value: "3",
      label: "已完成",
      type: 'success'
  }, {
      value: "4",
      label: "失败",
      type: 'danger'
  }
];

export const convertType = (value, typeArr, defaultNotFound) => {
    defaultNotFound = defaultNotFound ? defaultNotFound : {"label":"无匹配类型"};
    let types = typeArr.filter((item) => {
        return item.value == value;
    })
    return types.length>0 ? types[0] : defaultNotFound;
}
