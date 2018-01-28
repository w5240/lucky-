/**
 * 根据 name 过滤数组元素
 * Created by naeemo on 2017/3/6.
 * @param {Array} sources
 * @param {String} name
 * @param {String} key
 * @return {Array}
 */
export default function (sources, name, key = 'name') {

    const len = sources.length;
    const keyReg = new RegExp('^' + name + '.*');
    const looseKeyReg = new RegExp(name, 'ig');

    let result = [];
    let divide_idx = 0;

    for (let i = 0; i < len; i++) {
        let source = sources[i];

        if (name === source[key]) {
            source._exact = true;
            result.unshift(source);
            divide_idx++;
        } else {
            if (keyReg.test(source[key])) {
                source._exact = true;
                result.splice(divide_idx, 0, source);
                divide_idx++;
                continue;
            }
            looseKeyReg.lastIndex = 0;
            if (looseKeyReg.test(source[key])) {
                source._exact = false;
                result.push(source);
            }
        }
    }

    return result;

}
