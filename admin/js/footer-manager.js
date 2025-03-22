/**
 * 页脚管理模块
 * 负责管理网站的页脚内容
 */

import { showAlert } from './utils.js';
import { loadFooterData } from './data-loader.js';
import { saveFooterData } from './data-saver.js';

// 全局变量
let footerData = null;

/**
 * 初始化页脚管理器
 */
function initFooterManager() {
    // 初始加载数据
    loadData();
    
    // 绑定保存按钮事件
    const saveButton = document.getElementById('save-footer');
    if (saveButton) {
        saveButton.addEventListener('click', saveData);
    }
    
    // 绑定添加社交链接按钮事件
    const addSocialButton = document.getElementById('add-social');
    if (addSocialButton) {
        addSocialButton.addEventListener('click', addNewSocialLink);
    }
    
    // 绑定添加快速链接按钮事件
    const addQuickLinkButton = document.getElementById('add-quick-link');
    if (addQuickLinkButton) {
        addQuickLinkButton.addEventListener('click', addNewQuickLink);
    }
    
    // 绑定添加解决方案链接按钮事件
    const addSolutionLinkButton = document.getElementById('add-solution-link');
    if (addSolutionLinkButton) {
        addSolutionLinkButton.addEventListener('click', addNewSolutionLink);
    }
}

/**
 * 加载页脚数据
 */
async function loadData() {
    footerData = await loadFooterData();
    if (footerData) {
        renderSocialLinks();
        renderQuickLinks();
        renderSolutionLinks();
        renderCompanyInfo();
    }
}

/**
 * 渲染社交链接
 */
function renderSocialLinks() {
    const container = document.getElementById('social-links-container');
    if (!container || !footerData || !footerData.social_links || !Array.isArray(footerData.social_links)) {
        console.error('无法渲染社交链接，缺少必要数据', { container, footerData });
        return;
    }
    
    container.innerHTML = '';
    
    footerData.social_links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'card mb-3';
        linkDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">社交链接 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-social-link" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">图标</label>
                    <input type="text" class="form-control social-link-icon" value="${link.icon}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control social-link-url" value="${link.link}" data-index="${index}">
                </div>
            </div>
        `;
        container.appendChild(linkDiv);
    });
    
    // 添加事件监听器
    addSocialLinksEventListeners();
}

/**
 * 添加社交链接的事件监听器
 */
function addSocialLinksEventListeners() {
    // 删除按钮
    document.querySelectorAll('.remove-social-link').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            footerData.social_links.splice(index, 1);
            renderSocialLinks();
        });
    });
    
    // 图标输入
    document.querySelectorAll('.social-link-icon').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            footerData.social_links[index].icon = this.value;
        });
    });
    
    // URL输入
    document.querySelectorAll('.social-link-url').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            footerData.social_links[index].link = this.value;
        });
    });
}

/**
 * 渲染快速链接
 */
function renderQuickLinks() {
    const container = document.getElementById('quick-links-container');
    if (!container || !footerData || !footerData.quick_links || !Array.isArray(footerData.quick_links)) {
        console.error('无法渲染快速链接，缺少必要数据', { container, footerData });
        return;
    }
    
    container.innerHTML = '';
    
    footerData.quick_links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'card mb-3';
        linkDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">快速链接 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-quick-link" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">文本</label>
                    <input type="text" class="form-control quick-link-text" value="${link.text}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control quick-link-url" value="${link.link}" data-index="${index}">
                </div>
            </div>
        `;
        container.appendChild(linkDiv);
    });
    
    addQuickLinksEventListeners();
}

/**
 * 添加快速链接的事件监听器
 */
function addQuickLinksEventListeners() {
    // 删除按钮
    document.querySelectorAll('.remove-quick-link').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            footerData.quick_links.splice(index, 1);
            renderQuickLinks();
        });
    });
    
    // 文本输入
    document.querySelectorAll('.quick-link-text').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            footerData.quick_links[index].text = this.value;
        });
    });
    
    // URL输入
    document.querySelectorAll('.quick-link-url').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            footerData.quick_links[index].link = this.value;
        });
    });
}

/**
 * 渲染解决方案链接
 */
function renderSolutionLinks() {
    const container = document.getElementById('solution-links-container');
    if (!container || !footerData || !footerData.solution_links || !Array.isArray(footerData.solution_links)) {
        console.error('无法渲染解决方案链接，缺少必要数据', { container, footerData });
        return;
    }
    
    container.innerHTML = '';
    
    footerData.solution_links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'card mb-3';
        linkDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">解决方案链接 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-solution-link" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">文本</label>
                    <input type="text" class="form-control solution-link-text" value="${link.text}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control solution-link-url" value="${link.link}" data-index="${index}">
                </div>
            </div>
        `;
        container.appendChild(linkDiv);
    });
    
    addSolutionLinksEventListeners();
}

/**
 * 添加解决方案链接的事件监听器
 */
function addSolutionLinksEventListeners() {
    // 删除按钮
    document.querySelectorAll('.remove-solution-link').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            footerData.solution_links.splice(index, 1);
            renderSolutionLinks();
        });
    });
    
    // 文本输入
    document.querySelectorAll('.solution-link-text').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            footerData.solution_links[index].text = this.value;
        });
    });
    
    // URL输入
    document.querySelectorAll('.solution-link-url').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            footerData.solution_links[index].link = this.value;
        });
    });
}

/**
 * 渲染公司信息
 */
function renderCompanyInfo() {
    // 公司简介
    const companyInfoElement = document.getElementById('company-info');
    if (companyInfoElement) {
        companyInfoElement.value = footerData.company_info || '';
    }
    
    // 联系信息
    if (footerData.contact_info) {
        // 公司地址
        const addressElement = document.getElementById('contact-address');
        if (addressElement) {
            addressElement.value = footerData.contact_info.address || '';
        }
        
        // 公司邮箱
        const emailElement = document.getElementById('contact-email');
        if (emailElement) {
            emailElement.value = footerData.contact_info.email || '';
        }
        
        // 公司电话
        const phoneElement = document.getElementById('contact-phone');
        if (phoneElement) {
            phoneElement.value = footerData.contact_info.phone || '';
        }
        
        // 工作时间
        const hoursElement = document.getElementById('contact-hours');
        if (hoursElement) {
            hoursElement.value = footerData.contact_info.hours || '';
        }
    }
    
    // 版权信息
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        copyrightElement.value = footerData.copyright || '';
    }
    
    // ICP备案号
    const icpElement = document.getElementById('icp');
    if (icpElement) {
        icpElement.value = footerData.icp || '';
    }
    
    // 添加事件监听器
    addCompanyInfoEventListeners();
}

/**
 * 添加公司信息的事件监听器
 */
function addCompanyInfoEventListeners() {
    // 确保contact_info对象存在
    if (!footerData.contact_info) {
        footerData.contact_info = {};
    }
    
    // 公司简介
    const companyInfoElement = document.getElementById('company-info');
    if (companyInfoElement) {
        companyInfoElement.addEventListener('change', function() {
            footerData.company_info = this.value;
        });
    }
    
    // 公司地址
    const addressElement = document.getElementById('contact-address');
    if (addressElement) {
        addressElement.addEventListener('change', function() {
            footerData.contact_info.address = this.value;
        });
    }
    
    // 公司邮箱
    const emailElement = document.getElementById('contact-email');
    if (emailElement) {
        emailElement.addEventListener('change', function() {
            footerData.contact_info.email = this.value;
        });
    }
    
    // 公司电话
    const phoneElement = document.getElementById('contact-phone');
    if (phoneElement) {
        phoneElement.addEventListener('change', function() {
            footerData.contact_info.phone = this.value;
        });
    }
    
    // 工作时间
    const hoursElement = document.getElementById('contact-hours');
    if (hoursElement) {
        hoursElement.addEventListener('change', function() {
            footerData.contact_info.hours = this.value;
        });
    }
    
    // 版权信息
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        copyrightElement.addEventListener('change', function() {
            footerData.copyright = this.value;
        });
    }
    
    // ICP备案号
    const icpElement = document.getElementById('icp');
    if (icpElement) {
        icpElement.addEventListener('change', function() {
            footerData.icp = this.value;
        });
    }
}

/**
 * 添加新社交链接
 */
function addNewSocialLink() {
    if (!footerData.social_links) {
        footerData.social_links = [];
    }
    
    footerData.social_links.push({
        icon: 'bi bi-link',
        link: '#'
    });
    renderSocialLinks();
}

/**
 * 添加新快速链接
 */
function addNewQuickLink() {
    if (!footerData.quick_links) {
        footerData.quick_links = [];
    }
    
    footerData.quick_links.push({
        text: '新链接',
        link: '#'
    });
    renderQuickLinks();
}

/**
 * 添加新解决方案链接
 */
function addNewSolutionLink() {
    if (!footerData.solution_links) {
        footerData.solution_links = [];
    }
    
    footerData.solution_links.push({
        text: '新解决方案',
        link: '#'
    });
    renderSolutionLinks();
}

/**
 * 保存页脚数据
 */
async function saveData() {
    const result = await saveFooterData(footerData);
    if (result) {
        showAlert('success', '页脚数据保存成功！');
    }
}

export { initFooterManager };