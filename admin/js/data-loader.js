/**
 * 数据加载模块
 * 负责从服务器加载各种数据
 */

import { showAlert } from './utils.js';

// 加载公告数据
async function loadAnnouncementData() {
    try {
        const response = await fetch('../data/announcement.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载公告数据失败:', error);
        showAlert('danger', '加载公告数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文公告数据
async function loadAnnouncementDataEn() {
    try {
        const response = await fetch('../data/announcement_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文公告数据失败:', error);
        showAlert('danger', '加载英文公告数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载云产品数据
async function loadCloudProductsData() {
    try {
        const response = await fetch('../data/cloud_products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载云产品数据失败:', error);
        showAlert('danger', '加载云产品数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文云产品数据
async function loadCloudProductsDataEn() {
    try {
        const response = await fetch('../data/cloud_products_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文云产品数据失败:', error);
        showAlert('danger', '加载英文云产品数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载特性数据
async function loadFeaturesData() {
    try {
        const response = await fetch('../data/features.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载特性数据失败:', error);
        showAlert('danger', '加载特性数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文特性数据
async function loadFeaturesDataEn() {
    try {
        const response = await fetch('../data/features_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文特性数据失败:', error);
        showAlert('danger', '加载英文特性数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载案例数据
async function loadCaseStudiesData() {
    try {
        const response = await fetch('../data/case_studies.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载案例数据失败:', error);
        showAlert('danger', '加载案例数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文案例数据
async function loadCaseStudiesDataEn() {
    try {
        const response = await fetch('../data/case_studies_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文案例数据失败:', error);
        showAlert('danger', '加载英文案例数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载评价数据
async function loadTestimonialsData() {
    try {
        const response = await fetch('../data/testimonials.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载评价数据失败:', error);
        showAlert('danger', '加载评价数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文评价数据
async function loadTestimonialsDataEn() {
    try {
        const response = await fetch('../data/testimonials_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文评价数据失败:', error);
        showAlert('danger', '加载英文评价数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载解决方案数据
async function loadSolutionsData() {
    try {
        const response = await fetch('../data/solutions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载解决方案数据失败:', error);
        showAlert('danger', '加载解决方案数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文解决方案数据
async function loadSolutionsDataEn() {
    try {
        const response = await fetch('../data/solutions_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文解决方案数据失败:', error);
        showAlert('danger', '加载英文解决方案数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载轮播图数据
async function loadBannersData() {
    try {
        const response = await fetch('../data/banners.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载轮播图数据失败:', error);
        showAlert('danger', '加载轮播图数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文轮播图数据
async function loadBannersDataEn() {
    try {
        const response = await fetch('../data/banners_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文轮播图数据失败:', error);
        showAlert('danger', '加载英文轮播图数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载页脚数据
async function loadFooterData() {
    try {
        const response = await fetch('../data/footer.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载页脚数据失败:', error);
        showAlert('danger', '加载页脚数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文页脚数据
async function loadFooterDataEn() {
    try {
        const response = await fetch('../data/footer_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文页脚数据失败:', error);
        showAlert('danger', '加载英文页脚数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载导航数据
async function loadNavigationData() {
    try {
        const response = await fetch('../data/navigation.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载导航数据失败:', error);
        showAlert('danger', '加载导航数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文导航数据
async function loadNavigationDataEn() {
    try {
        const response = await fetch('../data/navigation_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文导航数据失败:', error);
        showAlert('danger', '加载英文导航数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载战略合作伙伴数据
async function loadStrategicPartnersData() {
    try {
        const response = await fetch('../data/strategic_partners.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载战略合作伙伴数据失败:', error);
        showAlert('danger', '加载战略合作伙伴数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文战略合作伙伴数据
async function loadStrategicPartnersDataEn() {
    try {
        const response = await fetch('../data/strategic_partners_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文战略合作伙伴数据失败:', error);
        showAlert('danger', '加载英文战略合作伙伴数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载技术合作伙伴数据
async function loadTechPartnersData() {
    try {
        const response = await fetch('../data/tech_partners.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载技术合作伙伴数据失败:', error);
        showAlert('danger', '加载技术合作伙伴数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文技术合作伙伴数据
async function loadTechPartnersDataEn() {
    try {
        const response = await fetch('../data/tech_partners_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文技术合作伙伴数据失败:', error);
        showAlert('danger', '加载英文技术合作伙伴数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载合作伙伴案例数据
async function loadPartnerCasesData() {
    try {
        const response = await fetch('../data/partner_cases.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载合作伙伴案例数据失败:', error);
        showAlert('danger', '加载合作伙伴案例数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文合作伙伴案例数据
async function loadPartnerCasesDataEn() {
    try {
        const response = await fetch('../data/partner_cases_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文合作伙伴案例数据失败:', error);
        showAlert('danger', '加载英文合作伙伴案例数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载团队成员数据
async function loadTeamMembersData() {
    try {
        const response = await fetch('../data/team_members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载团队成员数据失败:', error);
        showAlert('danger', '加载团队成员数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文团队成员数据
async function loadTeamMembersDataEn() {
    try {
        const response = await fetch('../data/team_members_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文团队成员数据失败:', error);
        showAlert('danger', '加载英文团队成员数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载公司发展历程数据
async function loadCompanyHistoryData() {
    try {
        const response = await fetch('../data/company_history.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载公司发展历程数据失败:', error);
        showAlert('danger', '加载公司发展历程数据失败，请刷新页面重试！');
        return null;
    }
}

// 加载英文公司发展历程数据
async function loadCompanyHistoryDataEn() {
    try {
        const response = await fetch('../data/company_history_en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('加载英文公司发展历程数据失败:', error);
        showAlert('danger', '加载英文公司发展历程数据失败，请刷新页面重试！');
        return null;
    }
}

// 导出所有加载函数
export {
    loadAnnouncementData,
    loadAnnouncementDataEn,
    loadCloudProductsData,
    loadCloudProductsDataEn,
    loadFeaturesData,
    loadFeaturesDataEn,
    loadCaseStudiesData,
    loadCaseStudiesDataEn,
    loadTestimonialsData,
    loadTestimonialsDataEn,
    loadSolutionsData,
    loadSolutionsDataEn,
    loadBannersData,
    loadBannersDataEn,
    loadFooterData,
    loadFooterDataEn,
    loadNavigationData,
    loadNavigationDataEn,
    loadStrategicPartnersData,
    loadStrategicPartnersDataEn,
    loadTechPartnersData,
    loadTechPartnersDataEn,
    loadPartnerCasesData,
    loadPartnerCasesDataEn,
    loadTeamMembersData,
    loadTeamMembersDataEn,
    loadCompanyHistoryData,
    loadCompanyHistoryDataEn
};