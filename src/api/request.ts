import Axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from "axios";
import { message } from "ant-design-vue";
import { ContentTypeEnum } from "@/enums/requestEnum";
const configDefault = {
  headers: {
    "Content-Type": ContentTypeEnum.JSON,
  },
  timeout: 60000,
  data: {},
  // 开发环境使用代理，生产环境使用完整URL
  baseURL: import.meta.env.VITE_SYS_API
};

class Request {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Request.axiosInstance.interceptors.request.use(
      config => {
        // console.log("request", config.url, config.url.includes(config.API_OPENAI_HUB_URL), config.API_OPENAI_HUB_URL)
        // console.log(useAuthStore());
        // console.log('config', config);

        //发送请求前，可在此携带 token
        // const authStore = useAuthStore()
        // authStore.getAuthorization()
        // if (config.url?.includes(defaultConfig.API_OPENAI_HUB_URL)) {
        //   config.headers['Authorization'] = `Bearer ${defaultConfig.OPEN_AI_HUB_TOKEN}`
        // } else if (config.url?.includes(defaultConfig.API_ALIYUN_URL)) {
        //   config.headers['Authorization'] = `Bearer ${defaultConfig.API_ALIYUN_BAILIAN_KEY}`
        // } else {
        //   config.headers['Authorization'] = authStore.getAuthorization() ? authStore.getAuthorization() : authStore.$state.token;
        // }
        config.data = config.data || {};
        // if (config.data) config.data = toSnakeCase(config.data)
        // if (config.params) config.params = toSnakeCase(config.params)

        return config;
      },
      (error: AxiosError) => {
        console.log('request-error', error)
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Request.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
				// if (response.data) response.data = toCamelCase(response.data)
				// console.log('response', response.data)
        return response.data;
      },
      (error: AxiosError) => {
        /**
 * Token 失效过期 状态码是401
 * data 里面的状态码对应关系 ：5010 对不起,您已被挤下线!请重新登陆! 5011 对不起,登录已过期，请重新登录!'
 *
 *
 * **/
        // 请求被取消时不显示错误消息
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          return Promise.reject(error);
        }

        //错误处理
        let { status, response } = error;
        let msg = error.message
        console.log('status:', status);
        console.log('error:', error);
        console.log('response:', response);
        if (response) {
          switch (response.status) {
            case 400:
              msg = response?.data.message || response?.data.msg || "登录异常，请重新登陆"
              break;

            case 401:
            //   if (!useAuthStore().isLogin) {
            //     msg = "请登录"
            //   } else {
            //     msg = response?.data.message || response?.data.msg || "用户信息错误"
            //   }
            //   if (response?.data.code == 5010 || response?.data.code == 5011) {
            //     useAuthStore().logOut()
            //   }
              break;

            case 500:
              msg = response?.data.message || response?.data.msg || "服务器异常"
            //   setTimeout(() => {
            //     if (location.pathname == '/500') {
            //       return false
            //     } else {
            //       if (config.ENV != "development") {
            //         location.href = '/500'
            //       }
            //     }
            //   }, 500);
              break;

            // case 5010:
            //   msg = response?.data.message ||response?.data.msg || "对不起,您已被挤下线!请重新登陆!"
            //   useAuthStore().logOut()
            //   break;

            //   case 5010:
            //     msg =response?.data.message || response?.data.msg || "对不起,登录已过期，请重新登录!"
            //     useAuthStore().logOut()
            //     break;

            default:
              break;
          }
        }
        console.log('msg', msg);
        if (msg == 'Network Error') {
          msg = '服务器异常'
        //   setTimeout(() => {
        //     if (location.pathname == '/500') {
        //       return false
        //     } else {
        //       // location.href = '/500'  && config.ENV != "test"
        //       if (config.ENV != "development") {
        //         location.href = '/500'
        //       }
        //     }
        //   }, 500);
        }
        if(msg === 'timeout of 30000ms exceeded'){
          msg = '请求超时'
        }

        message.warning(msg)
        return Promise.reject(error);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    Request.axiosConfigDefault = config;
    Request.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 通用请求函数
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Request.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Request.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}



export const aipRequest = new Request(configDefault);