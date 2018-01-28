/**
 * Created by naeemo on 2017/3/29.
 */

import Model from 'web-model'
import {gate, admin ,smsservice, contact ,material} from '../../LINKS'

export default new Model({
    api: {
        changeOperate(url){
            return this.request
                .post(`${url}`)
        },
    }
});
