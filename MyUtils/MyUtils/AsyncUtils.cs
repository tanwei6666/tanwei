using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MyUtils
{   
    /// <summary>
    /// 异步编程时的工具类
    /// </summary>
    public static class AsyncUtils
    {
        /// <summary>
        /// 用于单元测试，定义了一个异步完成的任
        /// </summary>
        public static async Task<T> DelayResult<T>(T result, TimeSpan delay) {
            await Task.Delay(delay);
            return result;
        }

        /// <summary>
        /// 异步方法获取指定URL字符串，带有指数退避的重试策略。
        /// </summary>
        public static async Task<string> DownloadStringWithRetries(string uri) {
            using (var client = new HttpClient()) {
                // 第1次重试前等1秒，第2次等2 秒，第3次等4 秒。
                var nextDelay = TimeSpan.FromSeconds(1);
                for (int i = 0; i != 3; ++i) {
                    try {
                        return await client.GetStringAsync(uri);
                    } catch {
                    }
                    await Task.Delay(nextDelay);
                    nextDelay = nextDelay + nextDelay;
                }
                // 最后重试一次，以便让调用者知道出错信息。
                return await client.GetStringAsync(uri);
            }
        }
    }
}
