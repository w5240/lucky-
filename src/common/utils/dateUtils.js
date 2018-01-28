import {format, isAfter} from 'date-fns'

/**
 * Created by YangZK on 2017/4/1.
 * 获取当前时间 YYYY-MM-DD HH:mm:ss, detail in date-fns
 * @param {String} pattern
 * @param {Number} timeStamp milliseconds
 * @return {String}
 */
export function getDateStr(pattern, timeStamp = 0) {
    let date = timeStamp ? new Date(timeStamp) : new Date();
    return format(date, pattern);
}


/**
 * 根据日期字符串获取日期对象
 * @param {String} dateStr
 * @return {Date}
 */
export function getDateInstance(dateStr) {
    let dayStr, hourStr,
        year, month, day,
        hour = 0, minute = 0;
    
    [dayStr, hourStr] = dateStr.split(' ');
    [year, month, day] = dayStr.split('-').map(str => parseInt(str));
    if (hourStr) {
        [hour, minute] = hourStr.split(':').map(str => parseInt(str));
    }
    
    try {
        return new Date(year, month - 1, day, hour, minute);
    } catch (e) {
        console.error('日期转时间戳出错', e);
    }
}


/**
 * 根据日期字符串获取时间戳
 * @param dateStr String
 * @return Number
 */
export function getTimeStamp(dateStr) {
    return getDateInstance(dateStr).getTime();
}


/**
 * 将时间戳推后一小时，取整到半个小时
 * @param {Number} stamp
 * @return {Number}
 */
export function leastOneHourLater(stamp) {
    const raw = stamp + 60 * 60 * 1000;
    return Math.ceil(raw / (30 * 60 * 1000)) * 30 * 60 * 1000;
}


/**
 *
 * @param {Array<Date>} dates
 * @return {Array<Date>}
 */
export function sortDates(dates) {
    return dates.sort((a, b) =>
        isAfter(a, b) ? 1 : -1
    );
}


/**
 * 把日期数组变成日期字符串数组
 * @param {Array<Date>} dates
 * @return {Array<String>}
 */
export function stringify(dates) {
    return dates.map(date => {
        if (date instanceof Date) {
            return format(date, 'YYYY-MM-DD');
        }
        return date
    })
}