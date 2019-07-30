export const PAGE_SIZES = [5, 10, 20, 30, 50];

export const FILE_TYPES = [
    {
        value: "1",
        label: "word文档"
    }, {
        value: "2",
        label: "url地址"
    }
];

export const FILE_STATUS = [
  {
      value: "1",
      label: "解析中"
  }, {
      value: "2",
      label: "爬取中"
  }, {
      value: "3",
      label: "生成索引中"
  }, {
      value: "4",
      label: "已完成"
  }, {
      value: "5",
      label: "失败"
  }
];

export const convertType = (value, typeArr, defaultNotFound) => {
    defaultNotFound = defaultNotFound ? defaultNotFound : {"label":"无匹配类型"};
    let types = typeArr.filter((item) => {
        return item.value == value;
    })
    return types.length>0 ? types[0] : defaultNotFound;
}
