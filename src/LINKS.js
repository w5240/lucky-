/**
 * development\deployment links
 * Created by naeemo on 2017/4/5.
 */

const LINKS = {};
switch (process.env.NODE_ENV) {

    /**
     * 1.52 服务器
     */
    case '52':
        LINKS.DOMAIN = '192.168.1.52';
        LINKS.ORIGIN = 'http://192.168.1.52';
        LINKS.SMS = LINKS.ORIGIN + '/sms';
        LINKS.ADMIN_BASE = LINKS.ORIGIN + '/admin';
        LINKS.WEB_BASE = '/sms';

        // 页面跳转用链接
        LINKS.login = LINKS.ORIGIN + '/login';
        LINKS.home = LINKS.ORIGIN + '/home';
        LINKS.setting = LINKS.ORIGIN + '/setting';
        // 小电商
        LINKS.admin = 'http://192.168.1.52:8080/manage';
        // 素材
        LINKS.material = 'http://192.168.1.164:8080/material';
        // 联系人
        LINKS.contact = 'http://192.168.1.164:8080/contact';
        // journey
        LINKS.journey = 'http://192.168.1.164:8080/journey';
        // sms
        LINKS.smsservice = 'http://192.168.1.52:8080/smsservice';
        break;

    /**
     * beta 服务器
     */
    case 'beta':
        LINKS.DOMAIN = 'dmacloud.com';
        LINKS.ORIGIN = 'https://sms-beta.dmacloud.com';
        LINKS.SMS = LINKS.ORIGIN + '/sms';
        LINKS.ADMIN_BASE = 'https://admin-beta.dmacloud.com';
        LINKS.WEB_BASE = '';

        // 页面跳转用链接
        LINKS.login = LINKS.ORIGIN + '/login';
        LINKS.home = LINKS.ORIGIN + '/home';
        LINKS.setting = LINKS.ORIGIN + '/setting';

        // gate
        LINKS.gate = 'https://gate-beta.dmacloud.com';
        // 小电商
        LINKS.admin = 'https://gate-beta.dmacloud.com/manage';
        // 素材
        LINKS.material = 'https://gate-beta.dmacloud.com/material';
        // 联系人
        LINKS.contact = 'https://gate-beta.dmacloud.com/contact';
        // journey
        LINKS.journey = 'https://gate-beta.dmacloud.com/journey';
        // sms
        LINKS.smsservice = 'https://gate-beta.dmacloud.com/smsservice';
        break;

    /**
     * beta 服务器
     */
    case 'production':
        LINKS.DOMAIN = 'dmacloud.com';
        LINKS.ORIGIN = 'https://sms.dmacloud.com';
        // LINKS.CONTACT_ORIGIN = 'https://contacts.dmacloud.com';
        // LINKS.MATERIAL_ORIGIN = 'https://contents.dmacloud.com';
        LINKS.ADMIN_BASE = 'https://admin.dmacloud.com';
        LINKS.WEB_BASE = '';

        // 页面跳转用链接
        LINKS.login = LINKS.ORIGIN + '/login';
        LINKS.home = LINKS.ORIGIN + '/home';
        LINKS.setting = LINKS.ORIGIN + '/setting';

        // gate
        LINKS.gate = 'https://gate.dmacloud.com';
        // 小电商
        LINKS.admin = 'https://gate.dmacloud.com/manage';
        // 素材
        LINKS.material = 'https://gate.dmacloud.com/material';
        // 联系人
        LINKS.contact = 'https://gate.dmacloud.com/contact';
        // journey
        LINKS.journey = 'https://gate.dmacloud.com/journey';
        // sms
        LINKS.smsservice = 'https://gate.dmacloud.com/smsservice';
        break;

    /**
     * develop\local messing
     */
    default:
        LINKS.DOMAIN = '';
        LINKS.ORIGIN = 'localhost:8080';
        LINKS.SMS = 'localhost:8008';
        LINKS.ADMIN_BASE = 'localhost:8000/admin';
        LINKS.WEB_BASE = '';

        // 页面跳转用链接
        LINKS.login = LINKS.SMS + '/login';
        LINKS.home = LINKS.SMS + '/home';
        LINKS.setting = LINKS.SMS + '/setting';
        // gate
        LINKS.gate = 'https://gate-beta.dmacloud.com';
        // 小电商
        LINKS.admin = 'https://gate-beta.dmacloud.com/manage';
        // 素材
        LINKS.material = 'https://gate-beta.dmacloud.com/material';
        // 联系人
        LINKS.contact = 'https://gate-beta.dmacloud.com/contact';
        // sms
        LINKS.smsservice = 'https://gate-beta.dmacloud.com/smsservice';
        break;
}

module.exports = LINKS;
