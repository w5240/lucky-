/**
 * Created by Administrator on 2017/7/25.
 */

import Model from "web-model";
import LINKS, {admin, contact, material} from "../../LINKS";

export default new Model({
    base: LINKS.smsservice + '/api/smsservice/v1',
    api: {

        /**
         * 发送列表获取
         * @param sendMess 包含 关键字 页码 每页获取数量 发送状态
         */
        getSendList(sendMess) {
            return this.request
                .get('/smsSend/getList')
                .query({
                    campaignName: sendMess.messageName,
                    pageNo: sendMess.pageNo,
                    pageSize: sendMess.pageSize,
                    status: sendMess.status,
                    messageType: sendMess.messageType
                })
        },
        delCampaign(campaignId) {
            return this.request
                .post('/sms-campaigns/delCampaign')
                .send({campaignId})
        },

        /**
         * 获取用户所有签名
         */
        getAutoGraph() {
            return this.request
                .get('/newMonitor/sendoutList')
        },
        /**
         * 获取报告列表根据type决定是彩信还是短信
         * @param data
         */
        getReportList(data) {
            return this.request
                .get('/dataReport/sms/list')
                .query({
                    campaignId: data.campaignId,
                    messageType: data.messageType,
                    pageNo: data.pageNo,
                    sendoutId: data.sendoutId,
                    systemType: data.systemType
                })
        },
        /**
         * 根据时间段  获取数据报告
         * @param startTime
         * @param overTime
         */
        getDataReport(startTime, overTime, type) {
            return this.request
                .get('/dataReport/file/findCampaignId')
                .query({
                    startTime: startTime,
                    overTime: overTime,
                    type: type
                })
        },
        /**
         * 获取筛选器
         */
        getContactFilter() {
            return this.request
                .get(`${contact}/api/contact/v1/contactFilter`)
        },
        /**
         * 获取联系人组
         */
        getContactGroup() {
            return this.request
                .get(`${contact}/api/contact/v1/group`)
        },
        /**
         * 检索联系人数量
         * @param filterId
         * @param groupIds
         */
        getAllContacts(excludeGroupIds,filterId, groupIds) {
            return this.request
                .get(`${contact}/api/contact/v1/contactFilter/contactCount`)
                .query({
                    excludeGroupIds:excludeGroupIds,
                    filterId: filterId,
                    groupIds: groupIds
                })
        },
        /**
         * 获取素材
         * @param materials
         */
        getMaterials(materials) {
            return this.request
                .get(`${material}/api/material/v1/material`)
                .query(materials)
        },

        /**
         * 获取素材详情
         * @param id
         */
        getMaterial(id) {
            return this.request
                .get(`${material}/api/material/v1/material/${id}`);
        },
        /**
         * 获取用户余量
         * @param email
         */
        getSurplus(email) {
            return this.request
                .get(`${admin}/api/manage/v1/account/home/profile`)
                .query({email: email})
        },

        /**
         * 创建活动
         * @param send_data
         * @returns {*|Request}
         */
        createCampaign(send_data) {
            return this.request
                .post('/sms-campaigns/createCampaign')
                .send(send_data)
        },
        /**
         * 开始发送 第一步 2，3位自动完成
         * @param campaignId 活动ID
         */
        campaignStart(campaignId) {
            return this.request
                .post('/smsSend/start')
                .send({
                    campaignId: campaignId,
                })
        },
        /**
         * 根据活动Id获取日志信息
         * @param campaignId
         */
        getSendLogs(campaignId) {
            return this.request
                .get('/smsSend/getSendLogs')
                .query({campaignId: campaignId})
        },

        /**
         * 导出API报表
         * @param derivedParameter
         */
        getExportAPIReport(derivedParameter) {
            return this.request
                .get('/dataReport/API/exportAPIReport')
                .query({
                    email: derivedParameter.email,
                    overTime: derivedParameter.overTime,
                    sendoutIds: derivedParameter.sendoutId,
                    startTime: derivedParameter.startTime,
                    type: derivedParameter.type,
                    uniCode: derivedParameter.uniCode
                })
        },
        /**
         * 导出回复数据
         * @param derivedParameter
         */
        getExportResponseData(derivedParameter) {
            return this.request
                .get('/dataReport/file/exportResponseData')
                .query({
                    email: derivedParameter.email,
                    sendoutId: derivedParameter.sendoutId,
                    overTime: derivedParameter.overTime,
                    startTime: derivedParameter.startTime,
                    uniCode: derivedParameter.uniCode
                })
        },
        /**
         *导出点击报表
         * @param derivedParameter
         */
        getExportClickData(derivedParameter) {
            return this.request
                .get('/dataReport/file/exportClickData')
                .query({
                    email: derivedParameter.email,
                    overTime: derivedParameter.overTime,
                    campaignIds: derivedParameter.campaignIds,
                    startTime: derivedParameter.startTime,
                    uniCode: derivedParameter.uniCode,
                })
        },
        /**
         *导出报表
         * @param derivedParameter
         */
        getExportDataReport(derivedParameter) {
            return this.request
                .get('/dataReport/file/exportDataReport')
                .query({
                    email: derivedParameter.email,
                    overTime: derivedParameter.overTime,
                    campaignIds: derivedParameter.campaignIds,
                    startTime: derivedParameter.startTime,
                    type: derivedParameter.type,
                    uniCode: derivedParameter.uniCode
                })
        },
        /**
         * 上行回复列表
         * @param name
         * @param pageNo
         * @param sendoutId
         */
        getExactlyMatchList(name, pageNo, sendoutId) {
            return this.request
                .get(`${LINKS.smsservice}/api/smsservice/v1/application/matchingList`)
                .query(
                    {name, pageNo, sendoutId}
                )
        },
        /**
         * 检查发送错误，当发生异常预警时查询错误信息
         * @param data
         */
        getAbnormalData(data) {
            return this.request
                .get('/statistics/abnormalData')
                .query(data)
        },
        /**
         * 根据用户，查询异常信息
         * @param data
         */
        getLogs(data) {
            return this.request
                .get('/statistics/getLogs')
                .query(data)
        },
        /**
         * 检查发送错误，当发生异常预警时查询错误信息
         * @param data
         */
        getApiLogs(data) {
            return this.request
                .get('/statistics/APIList')
                .query(data)
        },
        /**
         * 根据活动Id、开始时间以及结束时间获取活动对应的日志信息
         * @param data
         */
        getApiList(data) {
            return this.request
                .get('/statistics/export/APIList')
                .query(data)
        },
        /**
         * 根据用户，sendoutId导出退订列表（sms_response）
         * @param data
         */
        unsubscribeList(data) {
            return this.request
                .get('/statistics/export/unsubscribeList')
                .query(data)
        }
    }
})
