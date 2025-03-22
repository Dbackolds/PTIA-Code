/**
 * 后台管理系统主入口文件
 * 负责初始化和加载所有模块
 */

import { initNavigation } from './utils.js';
import { initAnnouncementManager } from './announcement-manager.js';
import { initProductsManager } from './products-manager.js';
import { initFeaturesManager } from './features-manager.js';
import { initCasesManager } from './cases-manager.js';
import { initTestimonialsManager } from './testimonials-manager.js';
import { initSolutionsManager } from './solutions-manager.js';
import { initBannersManager } from './banners-manager.js';
import { initFooterManager } from './footer-manager.js';
import { initNavigationManager } from './navigation-manager.js';
import { initPartnerCasesManager } from './partner-cases-manager.js';
import { initPartnersManager } from './partners-manager.js';
import { initTeamMembersManager } from './team-members-manager.js';
import { initCompanyHistoryManager } from './company-history-manager.js';

/**
 * 确保全局变量存在并有正确的格式
 */
function ensureGlobalVariables() {
    // 公告数据
    if (typeof announcementData === 'undefined' || announcementData === null) {
        window.announcementData = { text: '' };
        console.warn('公告数据不存在，已创建空对象');
    }
    
    // 英文公告数据
    if (typeof announcementDataEn === 'undefined' || announcementDataEn === null) {
        window.announcementDataEn = { text: '' };
        console.warn('英文公告数据不存在，已创建空对象');
    }
    
    // 云产品数据
    if (typeof cloudProductsData === 'undefined' || cloudProductsData === null) {
        window.cloudProductsData = { title: '云产品', products: [] };
        console.warn('云产品数据不存在，已创建空对象');
    } else if (!cloudProductsData.products) {
        cloudProductsData.products = [];
        console.warn('云产品数据缺少products数组，已创建');
    }
    
    // 英文云产品数据
    if (typeof cloudProductsDataEn === 'undefined' || cloudProductsDataEn === null) {
        window.cloudProductsDataEn = { title: 'Cloud Products', products: [] };
        console.warn('英文云产品数据不存在，已创建空对象');
    } else if (!cloudProductsDataEn.products) {
        cloudProductsDataEn.products = [];
        console.warn('英文云产品数据缺少products数组，已创建');
    }
    
    // 特性数据
    if (typeof featuresData === 'undefined' || featuresData === null) {
        window.featuresData = { title: '特性', features: [] };
        console.warn('特性数据不存在，已创建空对象');
    } else if (!featuresData.features) {
        featuresData.features = [];
        console.warn('特性数据缺少features数组，已创建');
    }
    
    // 英文特性数据
    if (typeof featuresDataEn === 'undefined' || featuresDataEn === null) {
        window.featuresDataEn = { title: 'Features', features: [] };
        console.warn('英文特性数据不存在，已创建空对象');
    } else if (!featuresDataEn.features) {
        featuresDataEn.features = [];
        console.warn('英文特性数据缺少features数组，已创建');
    }
    
    // 案例研究数据
    if (typeof caseStudiesData === 'undefined' || caseStudiesData === null) {
        window.caseStudiesData = { title: '案例研究', cases: [] };
        console.warn('案例研究数据不存在，已创建空对象');
    } else if (!caseStudiesData.cases) {
        caseStudiesData.cases = [];
        console.warn('案例研究数据缺少cases数组，已创建');
    }
    
    // 英文案例研究数据
    if (typeof caseStudiesDataEn === 'undefined' || caseStudiesDataEn === null) {
        window.caseStudiesDataEn = { title: 'Case Studies', cases: [] };
        console.warn('英文案例研究数据不存在，已创建空对象');
    } else if (!caseStudiesDataEn.cases) {
        caseStudiesDataEn.cases = [];
        console.warn('英文案例研究数据缺少cases数组，已创建');
    }
    
    // 评价数据
    if (typeof testimonialsData === 'undefined' || testimonialsData === null) {
        window.testimonialsData = { title: '客户评价', testimonials: [] };
        console.warn('评价数据不存在，已创建空对象');
    } else if (!testimonialsData.testimonials) {
        testimonialsData.testimonials = [];
        console.warn('评价数据缺少testimonials数组，已创建');
    }
    
    // 英文评价数据
    if (typeof testimonialsDataEn === 'undefined' || testimonialsDataEn === null) {
        window.testimonialsDataEn = { title: 'Testimonials', testimonials: [] };
        console.warn('英文评价数据不存在，已创建空对象');
    } else if (!testimonialsDataEn.testimonials) {
        testimonialsDataEn.testimonials = [];
        console.warn('英文评价数据缺少testimonials数组，已创建');
    }
    
    // 解决方案数据
    if (typeof solutionsData === 'undefined' || solutionsData === null) {
        window.solutionsData = { title: '解决方案', plans: [] };
        console.warn('解决方案数据不存在，已创建空对象');
    } else if (!solutionsData.plans) {
        solutionsData.plans = [];
        console.warn('解决方案数据缺少plans数组，已创建');
    }
    
    // 英文解决方案数据
    if (typeof solutionsDataEn === 'undefined' || solutionsDataEn === null) {
        window.solutionsDataEn = { title: 'Solutions', plans: [] };
        console.warn('英文解决方案数据不存在，已创建空对象');
    } else if (!solutionsDataEn.plans) {
        solutionsDataEn.plans = [];
        console.warn('英文解决方案数据缺少plans数组，已创建');
    }
    
    // 轮播图数据
    if (typeof bannersData === 'undefined' || bannersData === null) {
        window.bannersData = { banners: [] };
        console.warn('轮播图数据不存在，已创建空对象');
    } else if (!bannersData.banners) {
        bannersData.banners = [];
        console.warn('轮播图数据缺少banners数组，已创建');
    }
    
    // 英文轮播图数据
    if (typeof bannersDataEn === 'undefined' || bannersDataEn === null) {
        window.bannersDataEn = { banners: [] };
        console.warn('英文轮播图数据不存在，已创建空对象');
    } else if (!bannersDataEn.banners) {
        bannersDataEn.banners = [];
        console.warn('英文轮播图数据缺少banners数组，已创建');
    }
    
    // 页脚数据
    if (typeof footerData === 'undefined' || footerData === null) {
        window.footerData = { 
            company_info: {},
            social_links: [],
            quick_links: [],
            solution_links: []
        };
        console.warn('页脚数据不存在，已创建空对象');
    } else {
        if (!footerData.social_links) footerData.social_links = [];
        if (!footerData.quick_links) footerData.quick_links = [];
        if (!footerData.solution_links) footerData.solution_links = [];
        if (!footerData.company_info) footerData.company_info = {};
    }
    
    // 英文页脚数据
    if (typeof footerDataEn === 'undefined' || footerDataEn === null) {
        window.footerDataEn = { 
            company_info: {},
            social_links: [],
            quick_links: [],
            solution_links: []
        };
        console.warn('英文页脚数据不存在，已创建空对象');
    } else {
        if (!footerDataEn.social_links) footerDataEn.social_links = [];
        if (!footerDataEn.quick_links) footerDataEn.quick_links = [];
        if (!footerDataEn.solution_links) footerDataEn.solution_links = [];
        if (!footerDataEn.company_info) footerDataEn.company_info = {};
    }
    
    // 导航数据
    if (typeof navigationData === 'undefined' || navigationData === null) {
        window.navigationData = { 
            main_nav: [],
            login_buttons: []
        };
        console.warn('导航数据不存在，已创建空对象');
    } else {
        if (!navigationData.main_nav) navigationData.main_nav = [];
        if (!navigationData.login_buttons) navigationData.login_buttons = [];
    }
    
    // 英文导航数据
    if (typeof navigationDataEn === 'undefined' || navigationDataEn === null) {
        window.navigationDataEn = { 
            main_nav: [],
            login_buttons: []
        };
        console.warn('英文导航数据不存在，已创建空对象');
    } else {
        if (!navigationDataEn.main_nav) navigationDataEn.main_nav = [];
        if (!navigationDataEn.login_buttons) navigationDataEn.login_buttons = [];
    }
    
    // 战略合作伙伴数据
    if (typeof strategicPartnersData === 'undefined' || strategicPartnersData === null) {
        window.strategicPartnersData = { 
            title: '战略合作伙伴',
            partners: []
        };
        console.warn('战略合作伙伴数据不存在，已创建空对象');
    } else if (!strategicPartnersData.partners) {
        strategicPartnersData.partners = [];
        console.warn('战略合作伙伴数据缺少partners数组，已创建');
    }
    
    // 英文战略合作伙伴数据
    if (typeof strategicPartnersDataEn === 'undefined' || strategicPartnersDataEn === null) {
        window.strategicPartnersDataEn = { 
            title: 'Strategic Partners',
            partners: []
        };
        console.warn('英文战略合作伙伴数据不存在，已创建空对象');
    } else if (!strategicPartnersDataEn.partners) {
        strategicPartnersDataEn.partners = [];
        console.warn('英文战略合作伙伴数据缺少partners数组，已创建');
    }
    
    // 技术合作伙伴数据
    if (typeof techPartnersData === 'undefined' || techPartnersData === null) {
        window.techPartnersData = { 
            title: '技术合作伙伴',
            partners: []
        };
        console.warn('技术合作伙伴数据不存在，已创建空对象');
    } else if (!techPartnersData.partners) {
        techPartnersData.partners = [];
        console.warn('技术合作伙伴数据缺少partners数组，已创建');
    }
    
    // 英文技术合作伙伴数据
    if (typeof techPartnersDataEn === 'undefined' || techPartnersDataEn === null) {
        window.techPartnersDataEn = { 
            title: 'Technical Partners',
            partners: []
        };
        console.warn('英文技术合作伙伴数据不存在，已创建空对象');
    } else if (!techPartnersDataEn.partners) {
        techPartnersDataEn.partners = [];
        console.warn('英文技术合作伙伴数据缺少partners数组，已创建');
    }
    
    // 团队成员数据
    if (typeof teamMembersData === 'undefined' || teamMembersData === null) {
        window.teamMembersData = { 
            title: '核心团队',
            description: '我们的团队由行业资深专家组成，拥有丰富的技术和管理经验',
            members: []
        };
        console.warn('团队成员数据不存在，已创建空对象');
    } else if (!teamMembersData.members) {
        teamMembersData.members = [];
        console.warn('团队成员数据缺少members数组，已创建');
    }
    
    // 英文团队成员数据
    if (typeof teamMembersDataEn === 'undefined' || teamMembersDataEn === null) {
        window.teamMembersDataEn = { 
            title: 'Core Team',
            description: 'Our team consists of industry experts with rich technical and management experience',
            members: []
        };
        console.warn('英文团队成员数据不存在，已创建空对象');
    } else if (!teamMembersDataEn.members) {
        teamMembersDataEn.members = [];
        console.warn('英文团队成员数据缺少members数组，已创建');
    }
    
    // 公司发展历程数据
    if (typeof companyHistoryData === 'undefined' || companyHistoryData === null) {
        window.companyHistoryData = { 
            title: '发展历程',
            description: '我们在数字解决方案领域的成长之路',
            milestones: []
        };
        console.warn('发展历程数据不存在，已创建空对象');
    } else if (!companyHistoryData.milestones) {
        companyHistoryData.milestones = [];
        console.warn('发展历程数据缺少milestones数组，已创建');
    }
    
    // 英文公司发展历程数据
    if (typeof companyHistoryDataEn === 'undefined' || companyHistoryDataEn === null) {
        window.companyHistoryDataEn = { 
            title: 'Company History',
            description: 'Our growth journey in the field of digital solutions',
            milestones: []
        };
        console.warn('英文发展历程数据不存在，已创建空对象');
    } else if (!companyHistoryDataEn.milestones) {
        companyHistoryDataEn.milestones = [];
        console.warn('英文发展历程数据缺少milestones数组，已创建');
    }
    
    return true;
}

/**
 * 初始化所有管理模块
 */
function initAllManagers() {
    // 确保全局变量已加载
    console.log('初始化管理模块...');
    console.log('已加载数据：', {
        announcement: announcementData,
        announcementEn: announcementDataEn,
        cloudProducts: cloudProductsData,
        cloudProductsEn: cloudProductsDataEn,
        features: featuresData,
        featuresEn: featuresDataEn,
        caseStudies: caseStudiesData,
        caseStudiesEn: caseStudiesDataEn,
        testimonials: testimonialsData,
        testimonialsEn: testimonialsDataEn,
        solutions: solutionsData,
        solutionsEn: solutionsDataEn,
        banners: bannersData,
        bannersEn: bannersDataEn,
        footer: footerData,
        footerEn: footerDataEn,
        navigation: navigationData,
        navigationEn: navigationDataEn,
        strategicPartners: strategicPartnersData,
        strategicPartnersEn: strategicPartnersDataEn,
        techPartners: techPartnersData,
        techPartnersEn: techPartnersDataEn,
        teamMembers: teamMembersData,
        teamMembersEn: teamMembersDataEn,
        companyHistory: companyHistoryData,
        companyHistoryEn: companyHistoryDataEn
    });
    
    // 初始化导航切换
    initNavigation();
    
    // 初始化所有管理器模块
    initAnnouncementManager();
    initProductsManager();
    initFeaturesManager();
    initCasesManager();
    initTestimonialsManager();
    initSolutionsManager();
    initBannersManager();
    initFooterManager();
    initNavigationManager();
    initPartnerCasesManager();
    initPartnersManager();
    initTeamMembersManager();
    initCompanyHistoryManager();
    
    // 初始化快速操作管理器（如果存在）
    if (typeof initQuickActionsManager === 'function') {
        initQuickActionsManager();
    }
    
    console.log('所有管理模块已初始化');
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保全局变量已加载并格式正确
    if (ensureGlobalVariables()) {
        // 全局变量已加载，初始化管理模块
        initAllManagers();
    } else {
        console.error('全局数据初始化失败，请检查dashboard.php中的数据传递');
    }
});