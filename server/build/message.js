let pointH = 0;
const messageHistory = [];
const saveHistory = (data) => {
    if (pointH > 499) {
        pointH = 0;
    }
    messageHistory[pointH] = data;
    pointH++;
};
const jsonBigFile = (item) => {
    return `{
"type": ${JSON.stringify(item.type)},
"data": {
  "name": ${JSON.stringify(item.data.name)},
  "uid": ${JSON.stringify(item.data.uid)},
  "content": ${JSON.stringify(item.data.content)},${item.data.contentType !== undefined
        ? `\n"contentType": ${JSON.stringify(item.data.contentType)},`
        : ''}
  "time": ${JSON.stringify(item.data.time)},
  "mid": ${JSON.stringify(item.data.mid)}
}
}`;
};
const getHistory = () => {
    const resultList = [
        ...messageHistory.slice(pointH, 500).map(jsonBigFile),
        ...messageHistory.slice(0, pointH).map(jsonBigFile)
    ];
    let r = '';
    for (let i = 0; i < resultList.length; i++) {
        r = r + resultList[i] + ',';
    }
    if (r.length > 0) {
        r = r.substring(0, r.length - 1);
    }
    return `[${r}]`;
};
export default {
    saveHistory,
    getHistory
};
