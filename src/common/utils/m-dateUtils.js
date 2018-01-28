/**
 * Created by YangZK on 2017/4/1.
 * 获取当前时间 yyyy-MM-dd HH:mm:ss
 * @param format
 * @param targetStamp number milliseconds
 * @return {*}
 */
export function getDateStr(format, targetStamp) {
    let nowDate = targetStamp ? new Date(targetStamp) : new Date();
    let date = {
        "M+": nowDate.getMonth() + 1,                                           // 月
        "d+": nowDate.getDate(),                                                // 日
        "h+": nowDate.getHours() % 12 === 0 ? 12 : nowDate.getHours() % 12,     // 小时  12小时制
        "H+": nowDate.getHours(),                                               // 24小时制
        "m+": nowDate.getMinutes(),                                             // 分钟
        "s+": nowDate.getSeconds(),                                             // 秒钟
        "S+": nowDate.getMilliseconds()                                         // 毫秒
    };
    
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (nowDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    
    return format;
}


/**
 * 根据日期字符串获取时间戳
 *
 * @param dateStr String
 * @return Number
 */
export function getTimeStamp(dateStr) {
    let stamp = 0;
    try {
        stamp = new Date(dateStr).getTime();
    } catch (e) {
        dateStr = dateStr.replace('-', '/');
        try {
            stamp = new Date(dateStr).getTime();
        } catch (e) {
            dateStr = dateStr.replace('/', '\\');
            try {
                stamp = new Date(dateStr).getTime();
            } catch (e) {
                console.error('日期转时间戳出错', e);
            }
        }
    }
    return stamp;
}
