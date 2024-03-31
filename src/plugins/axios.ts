import qs from "qs";
import axios from "axios";
const myRequest = (options: any) => {
  return new Promise((resolve, reject) => {
    let url = options.url;
    let method = options.method || "GET";
    let data = options.data || {};
    if (method === "GET") {
      // 将data对象转化成字符串
      data = qs.stringify(data);
    }
    axios({
      method,
      url,
      data,
    })
      .then((res) => {
        console.log("响应 res.data = ")
        console.log(res.data)
        // 请求错误 res.data为空，或者res.data.status为空
        if (!(res.data && res.data.status)) {
          resolve(res);
        } else {
          // 其他情况 正确情况下
          resolve(res);
        }
      })
      .catch(() => {
        resolve({
          data: {
            msg: "请求错误",
            status: -1,
          },
        });
      });
  });
};

export default myRequest;