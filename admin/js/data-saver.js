/**
 * 数据保存模块
 * 负责将数据保存到服务器
 */

import { showAlert } from './utils.js';

// 保存公告数据
async function saveAnnouncementData(data) {
    try {
        const response = await fetch('api/announcement.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '公告数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存公告数据失败:', error);
        showAlert('danger', '保存公告数据失败，请重试！');
        return false;
    }
}

// 保存英文公告数据
async function saveAnnouncementDataEn(data) {
    try {
        const response = await fetch('api/announcement_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文公告数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文公告数据失败:', error);
        showAlert('danger', '保存英文公告数据失败，请重试！');
        return false;
    }
}

// 保存云产品数据
async function saveCloudProductsData(data) {
    try {
        const response = await fetch('api/products.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '云产品数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存云产品数据失败:', error);
        showAlert('danger', '保存云产品数据失败，请重试！');
        return false;
    }
}

// 保存英文云产品数据
async function saveCloudProductsDataEn(data) {
    try {
        const response = await fetch('api/products_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文云产品数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文云产品数据失败:', error);
        showAlert('danger', '保存英文云产品数据失败，请重试！');
        return false;
    }
}

// 保存特性数据
async function saveFeaturesData(data) {
    try {
        // 先保存特性数据到标准的features.json文件
        const response = await fetch('api/features.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '特性数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存特性数据失败:', error);
        showAlert('danger', '保存特性数据失败，请重试！');
        return false;
    }
}

// 保存英文特性数据
async function saveFeaturesDataEn(data) {
    try {
        // 保存英文特性数据到features_en.json文件
        const response = await fetch('api/features_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文特性数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文特性数据失败:', error);
        showAlert('danger', '保存英文特性数据失败，请重试！');
        return false;
    }
}

// 保存案例数据
async function saveCaseStudiesData(data) {
    try {
        const response = await fetch('api/cases.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '案例数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存案例数据失败:', error);
        showAlert('danger', '保存案例数据失败，请重试！');
        return false;
    }
}

// 保存英文案例数据
async function saveCaseStudiesDataEn(data) {
    try {
        const response = await fetch('api/cases_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文案例数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文案例数据失败:', error);
        showAlert('danger', '保存英文案例数据失败，请重试！');
        return false;
    }
}

// 保存评价数据
async function saveTestimonialsData(data) {
    try {
        const response = await fetch('api/testimonials.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '评价数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存评价数据失败:', error);
        showAlert('danger', '保存评价数据失败，请重试！');
        return false;
    }
}

// 保存英文评价数据
async function saveTestimonialsDataEn(data) {
    try {
        const response = await fetch('api/english_content.php?type=testimonials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文评价数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文评价数据失败:', error);
        showAlert('danger', '保存英文评价数据失败，请重试！');
        return false;
    }
}

// 保存解决方案数据
async function saveSolutionsData(data) {
    try {
        const response = await fetch('api/solutions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '解决方案数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存解决方案数据失败:', error);
        showAlert('danger', '保存解决方案数据失败，请重试！');
        return false;
    }
}

// 保存英文解决方案数据
async function saveSolutionsDataEn(data) {
    try {
        const response = await fetch('api/english_content.php?type=solutions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文解决方案数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文解决方案数据失败:', error);
        showAlert('danger', '保存英文解决方案数据失败，请重试！');
        return false;
    }
}

// 保存轮播图数据
async function saveBannersData(data) {
    try {
        // 先保存轮播图数据到标准的banners.json文件
        const response = await fetch('api/banners.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '轮播图数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存轮播图数据失败:', error);
        showAlert('danger', '保存轮播图数据失败，请重试！');
        return false;
    }
}

// 保存英文轮播图数据
async function saveBannersDataEn(data) {
    try {
        // 保存英文轮播图数据到banners_en.json文件
        const response = await fetch('api/banners_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文轮播图数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文轮播图数据失败:', error);
        showAlert('danger', '保存英文轮播图数据失败，请重试！');
        return false;
    }
}

// 保存页脚数据
async function saveFooterData(data) {
    try {
        const response = await fetch('api/footer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '页脚数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存页脚数据失败:', error);
        showAlert('danger', '保存页脚数据失败，请重试！');
        return false;
    }
}

// 保存英文页脚数据
async function saveFooterDataEn(data) {
    try {
        const response = await fetch('api/footer_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文页脚数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文页脚数据失败:', error);
        showAlert('danger', '保存英文页脚数据失败，请重试！');
        return false;
    }
}

// 保存导航数据
async function saveNavigationData(data) {
    try {
        const response = await fetch('api/navigation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '导航数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存导航数据失败:', error);
        showAlert('danger', '保存导航数据失败，请重试！');
        return false;
    }
}

// 保存英文导航数据
async function saveNavigationDataEn(data) {
    try {
        const response = await fetch('api/navigation_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文导航数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文导航数据失败:', error);
        showAlert('danger', '保存英文导航数据失败，请重试！');
        return false;
    }
}

// 保存战略合作伙伴数据
async function saveStrategicPartnersData(data) {
    try {
        const response = await fetch('api/strategic_partners.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '战略合作伙伴数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存战略合作伙伴数据失败:', error);
        showAlert('danger', '保存战略合作伙伴数据失败，请重试！');
        return false;
    }
}

// 保存英文战略合作伙伴数据
async function saveStrategicPartnersDataEn(data) {
    try {
        const response = await fetch('api/strategic_partners_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文战略合作伙伴数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文战略合作伙伴数据失败:', error);
        showAlert('danger', '保存英文战略合作伙伴数据失败，请重试！');
        return false;
    }
}

// 保存技术合作伙伴数据
async function saveTechPartnersData(data) {
    try {
        const response = await fetch('api/tech_partners.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '技术合作伙伴数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存技术合作伙伴数据失败:', error);
        showAlert('danger', '保存技术合作伙伴数据失败，请重试！');
        return false;
    }
}

// 保存英文技术合作伙伴数据
async function saveTechPartnersDataEn(data) {
    try {
        const response = await fetch('api/tech_partners_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文技术合作伙伴数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文技术合作伙伴数据失败:', error);
        showAlert('danger', '保存英文技术合作伙伴数据失败，请重试！');
        return false;
    }
}

// 保存合作伙伴案例数据
async function savePartnerCasesData(data) {
    try {
        // 先保存合作伙伴案例数据到标准的partner_cases.json文件
        const response = await fetch('api/partner_cases.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '合作案例数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存合作案例数据失败:', error);
        showAlert('danger', '保存合作案例数据失败，请重试！');
        return false;
    }
}

// 保存英文合作伙伴案例数据
async function savePartnerCasesDataEn(data) {
    try {
        // 保存英文合作伙伴案例数据到partner_cases_en.json文件
        const response = await fetch('api/partner_cases_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文合作案例数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文合作案例数据失败:', error);
        showAlert('danger', '保存英文合作案例数据失败，请重试！');
        return false;
    }
}

// 保存团队成员数据
async function saveTeamMembersData(data) {
    try {
        const response = await fetch('api/team_members.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '团队成员数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存团队成员数据失败:', error);
        showAlert('danger', '保存团队成员数据失败，请重试！');
        return false;
    }
}

// 保存英文团队成员数据
async function saveTeamMembersDataEn(data) {
    try {
        const response = await fetch('api/team_members_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文团队成员数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文团队成员数据失败:', error);
        showAlert('danger', '保存英文团队成员数据失败，请重试！');
        return false;
    }
}

// 保存发展历程数据
async function saveCompanyHistoryData(data) {
    try {
        const response = await fetch('api/company_history.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '发展历程数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存发展历程数据失败:', error);
        showAlert('danger', '保存发展历程数据失败，请重试！');
        return false;
    }
}

// 保存英文发展历程数据
async function saveCompanyHistoryDataEn(data) {
    try {
        const response = await fetch('api/company_history_en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        showAlert('success', '英文发展历程数据保存成功！');
        return true;
    } catch (error) {
        console.error('保存英文发展历程数据失败:', error);
        showAlert('danger', '保存英文发展历程数据失败，请重试！');
        return false;
    }
}

// 导出所有保存函数
export {
    saveAnnouncementData,
    saveAnnouncementDataEn,
    saveCloudProductsData,
    saveCloudProductsDataEn,
    saveFeaturesData,
    saveFeaturesDataEn,
    saveCaseStudiesData,
    saveCaseStudiesDataEn,
    saveTestimonialsData,
    saveTestimonialsDataEn,
    saveSolutionsData,
    saveSolutionsDataEn,
    saveBannersData,
    saveBannersDataEn,
    saveFooterData,
    saveFooterDataEn,
    saveNavigationData,
    saveNavigationDataEn,
    saveStrategicPartnersData,
    saveStrategicPartnersDataEn,
    saveTechPartnersData,
    saveTechPartnersDataEn,
    savePartnerCasesData,
    savePartnerCasesDataEn,
    saveTeamMembersData,
    saveTeamMembersDataEn,
    saveCompanyHistoryData,
    saveCompanyHistoryDataEn
};