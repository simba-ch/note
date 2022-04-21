# 探究function（）{}或setTimeout()
1. 现象：
* 用setTimeout实现setInterval正确写法：

        function interval(callback, duration) {
            callback();
            setTimeout(function(){
            interval(callback, duration);
            }, duration)
        }
* 用setTimeout实现setInterval失败写法：
此方法将会忽略定时器进程实现类似于for循环的无限调用

        function interval(callback, duration) {
            callback();
            setTimeout(interval(callback, duration), duration)
        }

2. 为什么添加一个fn会出现如此天差地别的效果。到底是fn的原因还是setTimeout的原因

        function interval(callback, duration) {
            callback();
            setTimeout(
                function(){
                    try{
                        interval(callback, duration)
                    }
                    catch(err){
                        throw err.toString();
                    }
                }, duration)
        }
是否因为callback函数被setTimeout认定为不是一个函数