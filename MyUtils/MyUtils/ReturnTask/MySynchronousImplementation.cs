using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyUtils
{
    /// <summary>
    /// 返回一个正常完成的Task任务的实现
    /// </summary>
    class MySynchronousImplementation : IMyAsyncInterface
    {
        public Task<int> GetValueAsync() {
            return Task.FromResult(13);
        }

        /// <summary>
        /// 返回一个带异常的任务
        /// </summary>
        static Task<T> NotImplementedAsync<T>() {
            var tcs = new TaskCompletionSource<T>();
            tcs.SetException(new NotImplementedException());
            return tcs.Task;
        }
    }


}
