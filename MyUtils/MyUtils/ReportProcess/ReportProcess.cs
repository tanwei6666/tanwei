using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyUtils.ReportProcess
{
    class ReportProcess
    {
        static async Task MyMethodAsync(IProgress<double> progress = null) {
            bool done = false;
            double percentComplete = 0;
            while (!done) {
                //do something
                await new Task();   //做某些异步任务

                if (progress != null)
                    progress.Report(percentComplete);
            }
        }

        static async Task CallMyMethodAsync() {
            var progress = new Progress<double>();
            progress.ProgressChanged += (sender, args) => {
                //do something
            };
            await MyMethodAsync(progress);
        }
    }
}
