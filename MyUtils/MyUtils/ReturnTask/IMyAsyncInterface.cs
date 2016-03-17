using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyUtils
{
    /// <summary>
    /// 返回一个Task任务
    /// </summary>
    interface IMyAsyncInterface
    {
        Task<int> GetValueAsync();
    }
}
