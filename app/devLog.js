/**
 * Created by naeemo on 16/4/21.
 */

function logger(format) {
    format = format || ':method:url:origin';
    return function *(next){
        let start = new Date();
        yield next;

        let str = format
            .replace(':method', this.method)
            .replace(':url', this.url)
            .replace(':origin',this.origin)
            .replace(':status', this.status);

        let duration = new Date() - start;


        let year = start.getFullYear();
        let moth = start.getMonth() + 1;
        let day = start.getDate();
        let hour = start.getHours();
        let minute = start.getMinutes();
        let second = start.getSeconds();
        console.log(`${year}-${checkItem(moth)}-${checkItem(day)} ${checkItem(hour)}:${checkItem(minute)}:${checkItem(second)}  ${str}[${duration}ms]`);
    }
}

function checkItem(i){
    return i < 10 ? '0'+i : i;
}

module.exports = logger('<:method> - :origin:url [:status] - ');