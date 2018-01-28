export default {
    sms: [
        {
            name: '发送列表获取', id: 'getSendList', data: {
            messageName: '',
            pageNo: 1,
            pageSize: 1,
            status: 1,
            messageType: 1
        }, remind: {
            messageName: 'campaignName',
            pageNo: '页码',
            pageSize: '每一页的数量',
            status: '0未发送，1发送中，2完成发送，3发送失败，4暂停，5预处理，-1全部',
            messageType: '0:营销短信 1:行业短信 2:营销彩信 3 海外营销短信 4海外行业短信'
        }
        },
        {name: '获取所有签名', id: 'getAutoGraph', data: null},
        {
            name: '检查发送错误，当发生异常预警时查询错误信息',
            id: 'getAbnormalData',
            data: {
                sendoutId: '',
                start_date: '',
                end_date: '',
                isAPI: '',
                status: '',
                pageNo: '',
                errorCode: '',
                campaignId: ''
            },
            remind: {
                sendoutId: '批次ID',
                start_date: '开始时间',
                end_date: '结束时间',
                isAPI: '是否为API',
                status: '状态',
                pageNo: '页码',
                errorCode: '错误码',
                campaignId: '活动ID'
            }
        },
        {
            name: '根据用户，查询异常信息', id: 'getLogs', data: {
            campaignId: '',
            remark: '',
            tableName: '',
            typeState: '',
            abnormal: '',
            type: ''
        }, remind: {
            campaignId: '活动ID',
            remark: '是否为正常流程',
            tableName: '',
            typeState: '',
            abnormal: '',
            type: ''
        }
        },
        {
            name: '根据活动Id、开始时间以及结束时间获取活动对应API发送记录', id: 'getApiLogs', data: {
            sendoutId: '',
            startTime: '',
            endTime: '',
            pageNo: '',
            pageSize: ''
        }, remind: {sendoutId: '批次ID', startTime: '开始时间', endTime: '结束时间', pageNo: '页码', pageSize: '每一页的数据量'}
        },
        {
            name: '根据活动Id、开始时间以及结束时间获取活动对应的日志信息', id: 'getApiList', data: {
            sendoutId: '',
            startTime: '',
            endTime: '',
            email: '',
            code: ''
        }, remind: {
            sendoutId: '批次ID',
            startTime: '开始时间',
            endTime: '结束时间',
            email: '邮箱',
            code: ''
        }
        },
        {
            name: '根据用户，sendoutId导出退订列表（sms_response）', id: 'unsubscribeList', data: {
            userName: '',
            password: '',
            email: '',
            code: ''
        }, remind: {
            userName: '用户名',
            password: '密码',
            email: '邮箱',
            code: ''
        }
        },
        {
            name: '查询mongo日志', id: 'getLogs', data: {
            campaignId: '',
            remark: '',
            tableName: '',
            typeState: '',
            abnormal: '',
            pageNo: '',
            type: ''
        }, remind: {
            campaignId: '任务Id*',
            remark: '异常类型（正常流程、系统异常、数据错误）',
            tableName: '表名*',
            typeState: '异常状态',
            abnormal: '详细描述',
            pageNo: '页码',
            type: '系统类别'
        }
        }
    ]
};