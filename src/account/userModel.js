/**
 * Created by YHy on 17/3/22.
 */

import Model from 'web-model'
import {admin} from '../LINKS'


export default new Model({
    base: admin + '/api/manage/v1',
    api: {
        // * 首页用检测结果信息
        getUserTest(id) {
            return this.request
                .get('/admin/user/testBefore/' + id)
        },
    }

})
