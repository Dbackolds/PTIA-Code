/**
 * 英文内容管理模块
 * 负责管理网站的所有英文内容JSON文件
 */

import { showAlert } from './utils.js';

// 全局变量，用于存储各种英文内容数据
let bannersData = null;
let announcementData = null;
let featuresData = null;
let caseStudiesData = null;
let cloudProductsData = null;
let solutionsData = null;
let teamMembersData = null;
let companyHistoryData = null;
let strategicPartnersData = null;
let techPartnersData = null;
let footerData = null;
let navigationData = null;
let partnerCasesData = null;
let testimonialsData = null;
let quickActionsData = null;

/**
 * 英文内容管理器
 * 用于管理网站的英文内容
 */

// 确保全局变量可用
if (typeof window.ensureGlobalVariables === 'function') {
    window.ensureGlobalVariables();
}

// 英文内容管理器对象
const englishContentManager = {
    // 初始化
    init: function() {
        console.log('英文内容管理器初始化');
        
        // 确保DOM已经加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initComponents();
            });
        } else {
            // 如果DOM已加载完成，直接初始化
            this.initComponents();
        }
        
        // 调试：输出当前轮播图数据
        console.log('当前英文轮播图数据:', window.bannersEnData);
    },
    
    // 初始化各组件
    initComponents: function() {
        console.log('开始初始化英文内容管理器组件');
        
        // 先绑定标签页事件，确保UI交互正常
        this.bindEvents();
        
        // 然后初始化各内容管理器
        this.initAnnouncementManager();
        this.initBannersManager();
        this.initTestimonialsManager();
        // 其他内容管理初始化
        
        console.log('英文内容管理器组件初始化完成');
    },

    // 绑定事件
    bindEvents: function() {
        console.log('初始化英文内容标签页功能');
        
        // 遍历所有标签页
        const allTabs = document.querySelectorAll('#englishContentTabs .nav-link');
        const allPanes = document.querySelectorAll('#englishContentTabsContent .tab-pane');
        
        if (!allTabs || allTabs.length === 0) {
            console.error('未找到英文内容标签页元素');
            return;
        }
        
        // 为每个标签添加点击事件
        allTabs.forEach(tab => {
            const targetId = tab.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetId);
            
            if (!targetPane) {
                console.warn(`找不到对应的内容面板: ${targetId}`);
                return;
            }
            
            // 添加点击事件处理
            tab.addEventListener('click', function(e) {
                console.log(`点击了标签: ${this.id}, 目标内容: ${targetId}`);
                
                // 隐藏所有面板
                allPanes.forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                
                // 取消所有标签激活状态
                allTabs.forEach(t => {
                    t.classList.remove('active');
                });
                
                // 显示当前面板并激活当前标签
                targetPane.classList.add('show', 'active');
                this.classList.add('active');
                
                // 根据当前标签页动态加载内容
                if (targetId === '#banners-content') {
                    englishContentManager.renderBanners();
                } else if (targetId === '#testimonials-content') {
                    englishContentManager.renderTestimonials();
                }
                // 可以添加其他标签页的内容加载
                
                // 防止默认行为和事件冒泡
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        // 检查初始状态，确保有一个活动标签
        const activeTab = document.querySelector('#englishContentTabs .nav-link.active');
        if (activeTab) {
            console.log(`初始活动标签: ${activeTab.id}`);
            // 模拟点击活动标签以确保内容正确显示
            activeTab.click();
        } else if (allTabs.length > 0) {
            console.log('没有活动标签，默认激活第一个标签');
            // 默认激活第一个标签
            allTabs[0].classList.add('active');
            const firstTargetId = allTabs[0].getAttribute('data-bs-target');
            const firstPane = document.querySelector(firstTargetId);
            if (firstPane) {
                firstPane.classList.add('show', 'active');
                
                // 加载第一个标签页内容
                if (firstTargetId === '#banners-content') {
                    englishContentManager.renderBanners();
                } else if (firstTargetId === '#testimonials-content') {
                    englishContentManager.renderTestimonials();
                }
            }
        }
    },

    // 初始化公告管理
    initAnnouncementManager: function() {
        console.log('初始化英文公告管理');
        
        const announcementText = document.getElementById('announcement-en-text');
        const saveButton = document.getElementById('save-announcement-en');
        
        if (announcementText && saveButton) {
            // 填充初始数据
            if (window.announcementEnData && window.announcementEnData.text) {
                announcementText.value = window.announcementEnData.text;
            }
            
            // 保存按钮点击事件
            saveButton.addEventListener('click', async function() {
                const announcementData = {
                    text: announcementText.value
                };
                
                try {
                    const response = await fetch('api/english_content.php?type=announcement', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(announcementData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    
                    if (!result.success) {
                        throw new Error(result.message || '保存失败');
                    }
                    
                    // 显示成功消息
                    englishContentManager.showAlert('success', '英文公告内容已成功保存！');
                    
                    // 更新全局数据
                    window.announcementEnData = announcementData;
                } catch (error) {
                    console.error('保存英文公告数据失败:', error);
                    englishContentManager.showAlert('danger', '保存失败，请重试！');
                }
            });
        }
    },

    // 初始化轮播图管理
    initBannersManager: function() {
        console.log('初始化英文轮播图管理');
        
        const bannersContainer = document.getElementById('banners-en-container'); 
        const addBannerButton = document.getElementById('add-banner-en'); 
        const saveBannersButton = document.getElementById('save-banners-en'); 
        
        if (bannersContainer && addBannerButton && saveBannersButton) {
            // 渲染轮播图数据
            this.renderBanners();
            
            // 添加轮播图按钮点击事件
            addBannerButton.addEventListener('click', function() {
                const newBanner = {
                    id: Date.now(),
                    title: 'New Banner Title',
                    description: 'Banner description goes here',
                    image: 'images/banner1.jpg',
                    button1_text: 'Learn More',
                    button1_link: '#',
                    button2_text: 'Contact Us',
                    button2_link: '#'
                };
                
                // 添加到数据中
                if (!window.bannersEnData) {
                    window.bannersEnData = { banners: [] };
                } else if (!window.bannersEnData.banners) {
                    window.bannersEnData.banners = [];
                }
                
                window.bannersEnData.banners.push(newBanner);
                
                // 重新渲染
                englishContentManager.renderBanners();
            });
            
            // 保存轮播图按钮点击事件
            saveBannersButton.addEventListener('click', async function() {
                try {
                    // 收集当前表单中的数据
                    const bannerItems = document.querySelectorAll('#banners-en-container .banner-item');
                    const updatedBanners = [];
                    
                    bannerItems.forEach(item => {
                        const id = item.getAttribute('data-id');
                        updatedBanners.push({
                            id: id,
                            title: item.querySelector('.banner-title').value,
                            description: item.querySelector('.banner-description').value,
                            image: item.querySelector('.banner-image').value,
                            button1_text: item.querySelector('.banner-button1-text').value,
                            button1_link: item.querySelector('.banner-button1-link').value,
                            button2_text: item.querySelector('.banner-button2-text').value,
                            button2_link: item.querySelector('.banner-button2-link').value
                        });
                    });
                    
                    // 更新全局数据
                    window.bannersEnData = { banners: updatedBanners };
                    
                    // 发送到服务器
                    const response = await fetch('api/english_content.php?type=banners', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(window.bannersEnData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    
                    if (!result.success) {
                        throw new Error(result.message || '保存失败');
                    }
                    
                    // 显示成功消息
                    englishContentManager.showAlert('success', '英文轮播图内容已成功保存！');
                } catch (error) {
                    console.error('保存英文轮播图数据失败:', error);
                    englishContentManager.showAlert('danger', '保存失败，请重试！');
                }
            });
        }
    },

    // 渲染轮播图
    renderBanners: function() {
        const bannersContainer = document.getElementById('banners-en-container'); 
        if (!bannersContainer) {
            console.error('未找到轮播图容器元素');
            return;
        }
        
        bannersContainer.innerHTML = '';
        
        // 确保window.bannersEnData有正确的结构
        if (!window.bannersEnData) {
            console.warn('轮播图数据为null，初始化为空对象');
            window.bannersEnData = { banners: [] };
        }
        
        // 确保bannersEnData有banners属性
        if (!window.bannersEnData.banners) {
            console.warn('轮播图数据缺少banners属性，初始化为空数组');
            window.bannersEnData.banners = [];
        }
        
        if (Array.isArray(window.bannersEnData.banners) && window.bannersEnData.banners.length > 0) {
            window.bannersEnData.banners.forEach((banner, index) => {
                // 确保banner对象存在
                if (!banner) banner = {};
                
                const bannerHtml = `
                    <div class="card mb-3 banner-item" data-id="${banner.id || index}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-3">
                                <h5 class="card-title">轮播图 #${index + 1}</h5>
                                <button type="button" class="btn btn-sm btn-danger delete-banner" data-id="${banner.id || index}">删除</button>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control banner-title" value="${banner.title || ''}" data-id="${banner.id || index}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">描述</label>
                                <textarea class="form-control banner-description" rows="2" data-id="${banner.id || index}">${banner.description || ''}</textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">图片URL</label>
                                <input type="text" class="form-control banner-image" value="${banner.image || ''}" data-id="${banner.id || index}">
                            </div>
                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">按钮1文本</label>
                                    <input type="text" class="form-control banner-button1-text" value="${banner.button1_text || ''}" data-id="${banner.id || index}">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">按钮1链接</label>
                                    <input type="text" class="form-control banner-button1-link" value="${banner.button1_link || ''}" data-id="${banner.id || index}">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">按钮2文本</label>
                                    <input type="text" class="form-control banner-button2-text" value="${banner.button2_text || ''}" data-id="${banner.id || index}">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">按钮2链接</label>
                                    <input type="text" class="form-control banner-button2-link" value="${banner.button2_link || ''}" data-id="${banner.id || index}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                bannersContainer.innerHTML += bannerHtml;
            });
            
            // 绑定轮播图数据更新事件
            this.bindBannerEvents();
            
            // 绑定删除轮播图事件
            this.bindDeleteBannerEvents();
        } else {
            bannersContainer.innerHTML = '<div class="alert alert-info">暂无轮播图数据，请添加。</div>';
        }
    },

    // 绑定轮播图数据更新事件
    bindBannerEvents: function() {
        const titleInputs = document.querySelectorAll('#banners-en-container .banner-title');
        const descriptionInputs = document.querySelectorAll('#banners-en-container .banner-description');
        const imageInputs = document.querySelectorAll('#banners-en-container .banner-image');
        const button1TextInputs = document.querySelectorAll('#banners-en-container .banner-button1-text');
        const button1LinkInputs = document.querySelectorAll('#banners-en-container .banner-button1-link');
        const button2TextInputs = document.querySelectorAll('#banners-en-container .banner-button2-text');
        const button2LinkInputs = document.querySelectorAll('#banners-en-container .banner-button2-link');
        
        const updateBannerData = (id, field, value) => {
            if (window.bannersEnData && Array.isArray(window.bannersEnData.banners)) {
                const index = window.bannersEnData.banners.findIndex(banner => 
                    (banner.id || '').toString() === id.toString());
                if (index !== -1) {
                    window.bannersEnData.banners[index][field] = value;
                }
            }
        };
        
        titleInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'title', this.value);
            });
        });
        
        descriptionInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'description', this.value);
            });
        });
        
        imageInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'image', this.value);
            });
        });
        
        button1TextInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'button1_text', this.value);
            });
        });
        
        button1LinkInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'button1_link', this.value);
            });
        });
        
        button2TextInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'button2_text', this.value);
            });
        });
        
        button2LinkInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateBannerData(this.getAttribute('data-id'), 'button2_link', this.value);
            });
        });
    },

    // 绑定删除轮播图事件
    bindDeleteBannerEvents: function() {
        const deleteButtons = document.querySelectorAll('#banners-en-container .delete-banner');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                
                if (window.bannersEnData && Array.isArray(window.bannersEnData.banners)) {
                    const index = window.bannersEnData.banners.findIndex(banner => 
                        (banner.id || '').toString() === id.toString());
                    
                    if (index !== -1) {
                        window.bannersEnData.banners.splice(index, 1);
                        englishContentManager.renderBanners();
                    }
                }
            });
        });
    },

    // 初始化评价管理
    initTestimonialsManager: function() {
        console.log('初始化英文评价管理');
        
        const testimonialsContainer = document.getElementById('testimonials-en-container');
        const addButton = document.getElementById('add-testimonial-en');
        const saveButton = document.getElementById('save-testimonials-en');
        
        if (testimonialsContainer && addButton && saveButton) {
            // 渲染评价数据
            this.renderTestimonials();
            
            // 添加评价按钮点击事件
            addButton.addEventListener('click', function() {
                // 创建新评价对象
                const newTestimonial = {
                    avatar: 'images/avatar1.jpg',
                    name: 'New Client Name',
                    content: 'Testimonial content goes here. Please add the actual client review.'
                };
                
                // 添加到数据中
                if (!window.testimonialsEnData) {
                    window.testimonialsEnData = { reviews: [] };
                } else if (!window.testimonialsEnData.reviews) {
                    window.testimonialsEnData.reviews = [];
                }
                
                window.testimonialsEnData.reviews.push(newTestimonial);
                
                // 重新渲染
                englishContentManager.renderTestimonials();
            });
            
            // 保存评价按钮点击事件
            saveButton.addEventListener('click', async function() {
                try {
                    // 更新评价数据
                    const testimonialItems = document.querySelectorAll('#testimonials-en-container .testimonial-admin-item');
                    const testimonials = [];
                    
                    testimonialItems.forEach(item => {
                        testimonials.push({
                            avatar: item.querySelector('.testimonial-avatar').value || 'images/avatar1.jpg',
                            name: item.querySelector('.testimonial-name').value,
                            content: item.querySelector('.testimonial-content').value
                        });
                    });
                    
                    // 更新数据结构，确保不包含title字段
                    const dataToSave = {
                        reviews: testimonials
                    };
                    
                    // 发送到服务器
                    const response = await fetch('api/english_content.php?type=testimonials', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSave)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    
                    if (!result.success) {
                        throw new Error(result.message || '保存失败');
                    }
                    
                    // 显示成功消息
                    englishContentManager.showAlert('success', '英文评价内容已成功保存！');
                } catch (error) {
                    console.error('保存英文评价数据失败:', error);
                    englishContentManager.showAlert('danger', '保存失败，请重试！');
                }
            });
        }
    },
    
    // 渲染评价列表
    renderTestimonials: function() {
        const testimonialsContainer = document.getElementById('testimonials-en-container');
        if (!testimonialsContainer) {
            console.error('未找到评价容器元素');
            return;
        }
        
        testimonialsContainer.innerHTML = '';
        
        // 确保window.testimonialsEnData有正确的结构
        if (!window.testimonialsEnData) {
            console.warn('评价数据为null，初始化为空对象');
            window.testimonialsEnData = { reviews: [] };
        }
        
        // 确保testimonialsEnData有reviews属性
        if (!window.testimonialsEnData.reviews) {
            console.warn('评价数据缺少reviews属性，初始化为空数组');
            window.testimonialsEnData.reviews = [];
        }
        
        if (Array.isArray(window.testimonialsEnData.reviews) && window.testimonialsEnData.reviews.length > 0) {
            window.testimonialsEnData.reviews.forEach((testimonial, index) => {
                // 确保testimonial对象存在
                if (!testimonial) testimonial = {};
                
                const testimonialElement = document.createElement('div');
                testimonialElement.className = 'card mb-3 testimonial-admin-item';
                
                testimonialElement.innerHTML = `
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">评价 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-testimonial" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">头像</label>
                                <input type="text" class="form-control testimonial-avatar" value="${testimonial.avatar || 'images/avatar1.jpg'}">
                            </div>
                            <div class="col-md-8 mb-3">
                                <label class="form-label">姓名</label>
                                <input type="text" class="form-control testimonial-name" value="${testimonial.name || ''}">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <label class="form-label">评价内容</label>
                                <textarea class="form-control testimonial-content" rows="3">${testimonial.content || ''}</textarea>
                            </div>
                        </div>
                    </div>
                `;
                
                testimonialsContainer.appendChild(testimonialElement);
            });
            
            // 绑定删除评价事件
            this.bindDeleteTestimonialEvents();
        } else {
            testimonialsContainer.innerHTML = '<div class="alert alert-info">暂无评价数据，请添加。</div>';
        }
    },
    
    // 绑定删除评价事件
    bindDeleteTestimonialEvents: function() {
        const deleteButtons = document.querySelectorAll('#testimonials-en-container .delete-testimonial');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                
                if (window.testimonialsEnData && Array.isArray(window.testimonialsEnData.reviews)) {
                    window.testimonialsEnData.reviews.splice(index, 1);
                    englishContentManager.renderTestimonials();
                }
            });
        });
    },

    // 显示提示消息
    showAlert: function(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // 3秒后自动关闭
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
};

/**
 * 将英文内容管理器暴露给全局作用域
 */
window.englishContentManager = englishContentManager;

// DOM加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，自动初始化英文内容管理器');
    englishContentManager.init();
});

/**
 * 初始化标签页切换事件
 */
function initTabEvents() {
    console.log('初始化标签页切换事件');
    // 获取所有标签页按钮
    const tabButtons = document.querySelectorAll('#englishContentTabs button[data-bs-toggle="tab"]');
    console.log('找到标签页按钮数量:', tabButtons.length);
    
    if (tabButtons.length === 0) {
        console.error('未找到标签页按钮，请检查HTML结构');
        return;
    }
    
    // 为每个标签页按钮添加点击事件
    tabButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // 阻止默认行为，防止Bootstrap的默认tab行为干扰我们的自定义处理
            event.preventDefault();
            
            const targetId = this.getAttribute('data-bs-target');
            console.log('点击标签页，目标ID:', targetId);
            
            if (!targetId) {
                console.error('标签页按钮缺少data-bs-target属性');
                return;
            }
            
            const targetTab = document.querySelector(targetId);
            
            if (!targetTab) {
                console.error(`未找到目标标签页内容: ${targetId}`);
                return;
            }
            
            // 隐藏所有标签页内容
            document.querySelectorAll('#englishContentTabsContent .tab-pane').forEach(tab => {
                tab.classList.remove('show', 'active');
            });
            
            // 显示目标标签页内容
            targetTab.classList.add('show', 'active');
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 根据当前标签页加载相应数据
            loadTabContent(targetId);
        });
    });
    
    // 默认加载第一个标签页内容
    loadTabContent('#banners-content');
}

/**
 * 根据标签页ID加载相应内容
 * @param {string} tabId 标签页ID
 */
function loadTabContent(tabId) {
    console.log(`加载标签页内容: ${tabId}`);
    
    switch(tabId) {
        case '#banners-content':
            renderBanners();
            break;
        case '#announcement-content':
            // 公告内容已在PHP中加载到textarea
            break;
        case '#features-content':
            renderFeatures();
            break;
        case '#cases-content':
            renderCases();
            break;
        case '#partner-cases-content':
            renderPartnerCases();
            break;
        case '#products-content':
            renderProducts();
            break;
        case '#solutions-content':
            renderSolutions();
            break;
        case '#team-content':
            renderTeamMembers();
            break;
        case '#history-content':
            renderCompanyHistory();
            break;
        case '#partners-content':
            renderPartners();
            break;
        case '#footer-content':
            renderFooterContent();
            break;
        case '#navigation-content':
            renderNavigationContent();
            break;
        default:
            console.warn(`未知的标签页ID: ${tabId}`);
    }
}

/**
 * 加载初始数据
 */
function loadInitialData() {
    // 从全局变量中获取数据（由PHP注入）
    // 添加数据有效性检查
    bannersData = window.bannersEnData || { banners: [] };
    // 确保bannersData有banners属性
    if (!bannersData.banners) {
        bannersData.banners = [];
    }
    
    announcementData = window.announcementEnData || { text: '' };
    featuresData = window.featuresEnData || { title: '', features: [] };
    caseStudiesData = window.caseStudiesEnData || { title: '', cases: [] };
    cloudProductsData = window.cloudProductsEnData || { title: '', products: [] };
    solutionsData = window.solutionsEnData || { title: '', plans: [] };
    teamMembersData = window.teamMembersEnData || { title: '', description: '', members: [] };
    companyHistoryData = window.companyHistoryEnData || { title: '', description: '', milestones: [] };
    strategicPartnersData = window.strategicPartnersEnData || { title: '', partners: [] };
    techPartnersData = window.techPartnersEnData || { title: '', partners: [] };
    footerData = window.footerEnData || {};
    navigationData = window.navigationEnData || { main_nav: [], login_buttons: [] };
    partnerCasesData = window.partnerCasesEnData || { title: '', cases: [] };
    testimonialsData = window.testimonialsEnData || { title: '', reviews: [] };
    quickActionsData = window.quickActionsEnData || { actions: [] };
}

/**
 * 绑定保存按钮事件
 */
function bindSaveEvents() {
    // 轮播图保存按钮
    const saveBannersBtn = document.getElementById('save-banners');
    if (saveBannersBtn) {
        saveBannersBtn.addEventListener('click', saveBanners);
    }
    
    // 公告保存按钮
    const saveAnnouncementBtn = document.getElementById('save-announcement');
    if (saveAnnouncementBtn) {
        saveAnnouncementBtn.addEventListener('click', saveAnnouncement);
    }
    
    // 特性保存按钮
    const saveFeaturesBtn = document.getElementById('save-features');
    if (saveFeaturesBtn) {
        saveFeaturesBtn.addEventListener('click', saveFeatures);
    }
    
    // 其他保存按钮将在各自的标签页内容渲染时绑定
}

/**
 * 绑定添加按钮事件
 */
function bindAddEvents() {
    // 添加轮播图按钮
    const addBannerBtn = document.getElementById('add-banner');
    if (addBannerBtn) {
        addBannerBtn.addEventListener('click', addBanner);
    }
    
    // 添加特性按钮
    const addFeatureBtn = document.getElementById('add-feature');
    if (addFeatureBtn) {
        addFeatureBtn.addEventListener('click', addFeature);
    }
    
    // 其他添加按钮将在各自的标签页内容渲染时绑定
}

/**
 * 渲染轮播图内容
 */
/*
function renderBanners() {
    const container = document.getElementById('banners-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 添加数据有效性检查
    if (!bannersData || !bannersData.banners) {
        console.error('轮播图数据无效:', bannersData);
        // 初始化bannersData
        bannersData = { banners: [] };
        // 尝试从window.bannersEnData获取数据
        if (window.bannersEnData) {
            bannersData = window.bannersEnData;
        }
        // 如果仍然没有banners属性，创建一个空数组
        if (!bannersData.banners) {
            bannersData.banners = [];
        }
    }
    
    bannersData.banners.forEach((banner, index) => {
        const bannerElement = document.createElement('div');
        bannerElement.className = 'banner-item card mb-3';
        bannerElement.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">轮播图 #${index + 1}</h5>
                <button class="btn btn-danger btn-sm delete-banner" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">图片路径</label>
                        <input type="text" class="form-control banner-image" value="${banner.image || ''}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">标题</label>
                        <input type="text" class="form-control banner-title" value="${banner.title || ''}">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea class="form-control banner-description" rows="2">${banner.description || ''}</textarea>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3">
                        <label class="form-label">按钮1文本</label>
                        <input type="text" class="form-control banner-button1-text" value="${banner.button1_text || ''}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">按钮1链接</label>
                        <input type="text" class="form-control banner-button1-link" value="${banner.button1_link || ''}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">按钮2文本</label>
                        <input type="text" class="form-control banner-button2-text" value="${banner.button2_text || ''}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">按钮2链接</label>
                        <input type="text" class="form-control banner-button2-link" value="${banner.button2_link || ''}">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(bannerElement);
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-banner').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            bannersData.banners.splice(index, 1);
            renderBanners();
        });
    });
}
*/

/**
 * 添加新轮播图
 */
/*
function addBanner() {
    bannersData.banners.push({
        image: 'images/banner1.jpg',
        title: 'New Banner Title',
        description: 'Banner description goes here',
        button1_text: 'Learn More',
        button1_link: '#',
        button2_text: 'Contact Us',
        button2_link: '#'
    });
    renderBanners();
}
*/

/**
 * 保存轮播图数据
 */
/*
async function saveBanners() {
    // 更新数据
    const bannerItems = document.querySelectorAll('.banner-item');
    bannersData.banners = Array.from(bannerItems).map(item => {
        return {
            image: item.querySelector('.banner-image').value,
            title: item.querySelector('.banner-title').value,
            description: item.querySelector('.banner-description').value,
            button1_text: item.querySelector('.banner-button1-text').value,
            button1_link: item.querySelector('.banner-button1-link').value,
            button2_text: item.querySelector('.banner-button2-text').value,
            button2_link: item.querySelector('.banner-button2-link').value
        };
    });
    
    // 发送到服务器
    try {
        const response = await fetch('api/english_content.php?type=banners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bannersData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', '轮播图数据保存成功！');
        } else {
            showAlert('danger', result.message || '保存失败');
        }
    } catch (error) {
        console.error('保存轮播图数据失败:', error);
        showAlert('danger', '保存失败，请重试！');
    }
}
*/

/**
 * 添加新特性
 */
function addFeature() {
    featuresData.features.push({
        icon: 'bi bi-star',
        title: 'New Feature',
        description: 'Feature description goes here'
    });
    renderFeatures();
}

/**
 * 保存特性数据
 */
async function saveFeatures() {
    // 更新标题
    const featuresTitle = document.getElementById('features-title');
    featuresData.title = featuresTitle.value;
    
    // 更新特性数据
    const featureItems = document.querySelectorAll('.feature-item');
    featuresData.features = Array.from(featureItems).map(item => {
        return {
            icon: item.querySelector('.feature-icon').value,
            title: item.querySelector('.feature-title').value,
            description: item.querySelector('.feature-description').value
        };
    });
    
    // 发送到服务器
    try {
        const response = await fetch('api/english_content.php?type=features', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(featuresData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', '特性数据保存成功！');
        } else {
            showAlert('danger', result.message || '保存失败');
        }
    } catch (error) {
        console.error('保存特性数据失败:', error);
        showAlert('danger', '保存失败，请重试！');
    }
}

/**
 * 渲染合作伙伴内容
 */
function renderPartners() {
    // 创建合作伙伴标签页内容
    const partnersContent = document.getElementById('partners-content');
    if (!partnersContent) return;
    
    // 如果内容已经渲染过，则不重复渲染
    if (partnersContent.querySelector('.nav-tabs')) return;
    
    // 创建标签页结构
    partnersContent.innerHTML = `
        <div class="card mt-3">
            <div class="card-body">
                <ul class="nav nav-tabs" id="partnersTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="strategic-partners-tab" data-bs-toggle="tab" data-bs-target="#strategic-partners-content" type="button" role="tab">战略合作伙伴</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="tech-partners-tab" data-bs-toggle="tab" data-bs-target="#tech-partners-content" type="button" role="tab">技术合作伙伴</button>
                    </li>
                </ul>
                <div class="tab-content" id="partnersTabContent">
                    <div class="tab-pane fade show active" id="strategic-partners-content" role="tabpanel">
                        <div class="mt-3">
                            <div class="mb-3">
                                <label for="strategic-partners-title" class="form-label">标题</label>
                                <input type="text" class="form-control" id="strategic-partners-title" value="">
                            </div>
                            <div class="mb-3">
                                <div id="strategic-partners-container"></div>
                                <button id="add-strategic-partner" class="btn btn-outline-primary mt-2">
                                    <i class="bi bi-plus"></i> 添加战略合作伙伴
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="tech-partners-content" role="tabpanel">
                        <div class="mt-3">
                            <div class="mb-3">
                                <label for="tech-partners-title" class="form-label">标题</label>
                                <input type="text" class="form-control" id="tech-partners-title" value="">
                            </div>
                            <div class="mb-3">
                                <div id="tech-partners-container"></div>
                                <button id="add-tech-partner" class="btn btn-outline-primary mt-2">
                                    <i class="bi bi-plus"></i> 添加技术合作伙伴
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="action-buttons mt-3">
                    <button id="save-partners" class="btn btn-primary">保存更改</button>
                </div>
            </div>
        </div>
    `;
    
    // 初始化标签页
    const strategicTab = document.getElementById('strategic-partners-tab');
    const techTab = document.getElementById('tech-partners-tab');
    
    // 绑定标签页切换事件
    strategicTab.addEventListener('click', function() {
        document.getElementById('strategic-partners-content').classList.add('show', 'active');
        document.getElementById('tech-partners-content').classList.remove('show', 'active');
        this.classList.add('active');
        techTab.classList.remove('active');
        renderStrategicPartners();
    });
    
    techTab.addEventListener('click', function() {
        document.getElementById('tech-partners-content').classList.add('show', 'active');
        document.getElementById('strategic-partners-content').classList.remove('show', 'active');
        this.classList.add('active');
        strategicTab.classList.remove('active');
        renderTechPartners();
    });
    
    // 绑定保存按钮事件
    document.getElementById('save-partners').addEventListener('click', savePartners);
    
    // 绑定添加按钮事件
    document.getElementById('add-strategic-partner').addEventListener('click', addStrategicPartner);
    document.getElementById('add-tech-partner').addEventListener('click', addTechPartner);
    
    // 初始渲染战略合作伙伴
    renderStrategicPartners();
    
    // 设置标题值
    if (strategicPartnersData && strategicPartnersData.title) {
        document.getElementById('strategic-partners-title').value = strategicPartnersData.title;
    }
    
    if (techPartnersData && techPartnersData.title) {
        document.getElementById('tech-partners-title').value = techPartnersData.title;
    }
}

/**
 * 渲染战略合作伙伴
 */
function renderStrategicPartners() {
    const container = document.getElementById('strategic-partners-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    strategicPartnersData.partners.forEach((partner, index) => {
        const partnerElement = document.createElement('div');
        partnerElement.className = 'partner-item card mb-3';
        partnerElement.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">合作伙伴 #${index + 1}</h5>
                <button class="btn btn-danger btn-sm delete-strategic-partner" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label class="form-label">图标</label>
                        <input type="text" class="form-control partner-icon" value="${partner.icon || ''}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">名称</label>
                        <input type="text" class="form-control partner-name" value="${partner.name || ''}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">描述</label>
                        <input type="text" class="form-control partner-description" value="${partner.description || ''}">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(partnerElement);
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-strategic-partner').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            strategicPartnersData.partners.splice(index, 1);
            renderStrategicPartners();
        });
    });
}

/**
 * 渲染技术合作伙伴
 */
function renderTechPartners() {
    const container = document.getElementById('tech-partners-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    techPartnersData.partners.forEach((partner, index) => {
        const partnerElement = document.createElement('div');
        partnerElement.className = 'partner-item card mb-3';
        partnerElement.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">合作伙伴 #${index + 1}</h5>
                <button class="btn btn-danger btn-sm delete-tech-partner" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">图标</label>
                        <input type="text" class="form-control partner-icon" value="${partner.icon || ''}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">名称</label>
                        <input type="text" class="form-control partner-name" value="${partner.name || ''}">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(partnerElement);
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-tech-partner').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            techPartnersData.partners.splice(index, 1);
            renderTechPartners();
        });
    });
}

/**
 * 添加新战略合作伙伴
 */
function addStrategicPartner() {
    strategicPartnersData.partners.push({
        icon: 'bi bi-building',
        name: 'New Strategic Partner',
        description: 'Partnership description'
    });
    renderStrategicPartners();
}

/**
 * 添加新技术合作伙伴
 */
function addTechPartner() {
    techPartnersData.partners.push({
        icon: 'bi bi-cpu',
        name: 'New Technology Partner'
    });
    renderTechPartners();
}

/**
 * 保存合作伙伴数据
 */
async function savePartners() {
    // 获取当前活动的标签页
    const activeTab = document.querySelector('#partnersTab .nav-link.active');
    const isStrategicActive = activeTab && activeTab.id === 'strategic-partners-tab';
    
    // 更新战略合作伙伴数据
    const strategicTitle = document.getElementById('strategic-partners-title');
    strategicPartnersData.title = strategicTitle.value;
    
    const strategicItems = document.querySelectorAll('#strategic-partners-container .partner-item');
    strategicPartnersData.partners = Array.from(strategicItems).map(item => {
        return {
            icon: item.querySelector('.partner-icon').value,
            name: item.querySelector('.partner-name').value,
            description: item.querySelector('.partner-description').value
        };
    });
    
    // 更新技术合作伙伴数据
    const techTitle = document.getElementById('tech-partners-title');
    techPartnersData.title = techTitle.value;
    
    const techItems = document.querySelectorAll('#tech-partners-container .partner-item');
    techPartnersData.partners = Array.from(techItems).map(item => {
        return {
            icon: item.querySelector('.partner-icon').value,
            name: item.querySelector('.partner-name').value
        };
    });
    
    // 保存战略合作伙伴数据
    try {
        const strategicResponse = await fetch('api/english_content.php?type=strategic_partners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(strategicPartnersData)
        });
        
        const strategicResult = await strategicResponse.json();
        
        if (!strategicResult.success) {
            throw new Error(strategicResult.message || '保存战略合作伙伴数据失败');
        }
        
        // 保存技术合作伙伴数据
        const techResponse = await fetch('api/english_content.php?type=tech_partners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(techPartnersData)
        });
        
        const techResult = await techResponse.json();
        
        if (!techResult.success) {
            throw new Error(techResult.message || '保存技术合作伙伴数据失败');
        }
        
        showAlert('success', '合作伙伴数据保存成功！');
    } catch (error) {
        console.error('保存合作伙伴数据失败:', error);
        showAlert('danger', error.message || '保存失败，请重试！');
    }
}

/**
 * 渲染特性内容
 */
function renderFeatures() {
    const container = document.getElementById('features-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    featuresData.features.forEach((feature, index) => {
        const featureElement = document.createElement('div');
        featureElement.className = 'feature-item card mb-3';
        featureElement.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">特性 #${index + 1}</h5>
                <button class="btn btn-danger btn-sm delete-feature" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label class="form-label">图标</label>
                        <input type="text" class="form-control feature-icon" value="${feature.icon || ''}">
                    </div>
                    <div class="col-md-8">
                        <label class="form-label">标题</label>
                        <input type="text" class="form-control feature-title" value="${feature.title || ''}">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea class="form-control feature-description" rows="2">${feature.description || ''}</textarea>
                </div>
            </div>
        `;
        container.appendChild(featureElement);
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-feature').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            featuresData.features.splice(index, 1);
            renderFeatures();
        });
    });
}

/**
 * 渲染页脚内容
 */
function renderFooterContent() {
    const footerContainer = document.getElementById('footer-en-container');
    if (!footerContainer) {
        console.error('未找到页脚容器元素');
        return;
    }
    
    // 确保window.footerEnData有正确的结构
    if (!window.footerEnData) {
        console.warn('页脚数据为null，初始化为空对象');
        window.footerEnData = {
            company_info: '',
            social_links: [],
            quick_links: [],
            solution_links: [],
            contact_info: {
                address: '',
                phone: '',
                email: '',
                hours: ''
            },
            copyright: '',
            icp: ''
        };
    }
    
    // 构建页脚编辑界面
    footerContainer.innerHTML = `
        <div class="card mt-3">
            <div class="card-body">
                <div class="mb-3">
                    <label for="footer-company-info" class="form-label">公司简介</label>
                    <textarea class="form-control" id="footer-company-info" rows="3">${window.footerEnData.company_info || ''}</textarea>
                </div>
                
                <div class="mb-4">
                    <h5>社交媒体链接</h5>
                    <div id="footer-social-links-container">
                        ${renderSocialLinks()}
                    </div>
                    <button id="add-social-link" class="btn btn-outline-primary btn-sm mt-2">
                        <i class="bi bi-plus"></i> 添加社交链接
                    </button>
                </div>
                
                <div class="mb-4">
                    <h5>快速链接</h5>
                    <div id="footer-quick-links-container">
                        ${renderQuickLinks()}
                    </div>
                    <button id="add-quick-link" class="btn btn-outline-primary btn-sm mt-2">
                        <i class="bi bi-plus"></i> 添加快速链接
                    </button>
                </div>
                
                <div class="mb-4">
                    <h5>解决方案链接</h5>
                    <div id="footer-solution-links-container">
                        ${renderSolutionLinks()}
                    </div>
                    <button id="add-solution-link" class="btn btn-outline-primary btn-sm mt-2">
                        <i class="bi bi-plus"></i> 添加解决方案链接
                    </button>
                </div>
                
                <div class="mb-4">
                    <h5>联系信息</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="footer-address" class="form-label">地址</label>
                            <input type="text" class="form-control" id="footer-address" value="${window.footerEnData.contact_info?.address || ''}">
                        </div>
                        <div class="col-md-6">
                            <label for="footer-phone" class="form-label">电话</label>
                            <input type="text" class="form-control" id="footer-phone" value="${window.footerEnData.contact_info?.phone || ''}">
                        </div>
                        <div class="col-md-6">
                            <label for="footer-email" class="form-label">邮箱</label>
                            <input type="text" class="form-control" id="footer-email" value="${window.footerEnData.contact_info?.email || ''}">
                        </div>
                        <div class="col-md-6">
                            <label for="footer-hours" class="form-label">工作时间</label>
                            <input type="text" class="form-control" id="footer-hours" value="${window.footerEnData.contact_info?.hours || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h5>版权信息</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="footer-copyright" class="form-label">版权文本</label>
                            <input type="text" class="form-control" id="footer-copyright" value="${window.footerEnData.copyright || ''}">
                        </div>
                        <div class="col-md-6">
                            <label for="footer-icp" class="form-label">ICP备案号</label>
                            <input type="text" class="form-control" id="footer-icp" value="${window.footerEnData.icp || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <button id="save-footer" class="btn btn-primary">保存页脚设置</button>
                </div>
            </div>
        </div>
    `;
    
    // 绑定添加链接按钮事件
    bindFooterEvents();
}

/**
 * 渲染社交链接列表
 */
function renderSocialLinks() {
    let html = '';
    
    if (Array.isArray(window.footerEnData.social_links) && window.footerEnData.social_links.length > 0) {
        window.footerEnData.social_links.forEach((link, index) => {
            html += `
                <div class="input-group mb-2 social-link-item">
                    <input type="text" class="form-control" placeholder="图标类名" value="${link.icon || ''}" data-field="icon" data-index="${index}">
                    <input type="text" class="form-control" placeholder="链接URL" value="${link.link || ''}" data-field="link" data-index="${index}">
                    <button class="btn btn-outline-danger delete-social-link" type="button" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        });
    } else {
        html = '<div class="alert alert-info">暂无社交链接，请添加。</div>';
    }
    
    return html;
}

/**
 * 渲染快速链接列表
 */
function renderQuickLinks() {
    let html = '';
    
    if (Array.isArray(window.footerEnData.quick_links) && window.footerEnData.quick_links.length > 0) {
        window.footerEnData.quick_links.forEach((link, index) => {
            html += `
                <div class="input-group mb-2 quick-link-item">
                    <input type="text" class="form-control" placeholder="链接文本" value="${link.text || ''}" data-field="text" data-index="${index}">
                    <input type="text" class="form-control" placeholder="链接URL" value="${link.link || ''}" data-field="link" data-index="${index}">
                    <button class="btn btn-outline-danger delete-quick-link" type="button" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        });
    } else {
        html = '<div class="alert alert-info">暂无快速链接，请添加。</div>';
    }
    
    return html;
}

/**
 * 渲染解决方案链接列表
 */
function renderSolutionLinks() {
    let html = '';
    
    if (Array.isArray(window.footerEnData.solution_links) && window.footerEnData.solution_links.length > 0) {
        window.footerEnData.solution_links.forEach((link, index) => {
            html += `
                <div class="input-group mb-2 solution-link-item">
                    <input type="text" class="form-control" placeholder="链接文本" value="${link.text || ''}" data-field="text" data-index="${index}">
                    <input type="text" class="form-control" placeholder="链接URL" value="${link.link || ''}" data-field="link" data-index="${index}">
                    <button class="btn btn-outline-danger delete-solution-link" type="button" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        });
    } else {
        html = '<div class="alert alert-info">暂无解决方案链接，请添加。</div>';
    }
    
    return html;
}

/**
 * 绑定页脚相关事件
 */
function bindFooterEvents() {
    // 社交链接输入事件
    const socialLinkContainer = document.getElementById('footer-social-links-container');
    if (socialLinkContainer) {
        socialLinkContainer.addEventListener('input', function(e) {
            const target = e.target;
            if (target.hasAttribute('data-field') && target.hasAttribute('data-index')) {
                const field = target.getAttribute('data-field');
                const index = parseInt(target.getAttribute('data-index'));
                
                if (window.footerEnData.social_links && index >= 0 && index < window.footerEnData.social_links.length) {
                    window.footerEnData.social_links[index][field] = target.value;
                }
            }
        });
    }
    
    // 快速链接输入事件
    const quickLinkContainer = document.getElementById('footer-quick-links-container');
    if (quickLinkContainer) {
        quickLinkContainer.addEventListener('input', function(e) {
            const target = e.target;
            if (target.hasAttribute('data-field') && target.hasAttribute('data-index')) {
                const field = target.getAttribute('data-field');
                const index = parseInt(target.getAttribute('data-index'));
                
                if (window.footerEnData.quick_links && index >= 0 && index < window.footerEnData.quick_links.length) {
                    window.footerEnData.quick_links[index][field] = target.value;
                }
            }
        });
    }
    
    // 解决方案链接输入事件
    const solutionLinkContainer = document.getElementById('footer-solution-links-container');
    if (solutionLinkContainer) {
        solutionLinkContainer.addEventListener('input', function(e) {
            const target = e.target;
            if (target.hasAttribute('data-field') && target.hasAttribute('data-index')) {
                const field = target.getAttribute('data-field');
                const index = parseInt(target.getAttribute('data-index'));
                
                if (window.footerEnData.solution_links && index >= 0 && index < window.footerEnData.solution_links.length) {
                    window.footerEnData.solution_links[index][field] = target.value;
                }
            }
        });
    }
    
    // 添加社交链接按钮
    const addSocialLinkBtn = document.getElementById('add-social-link');
    if (addSocialLinkBtn) {
        addSocialLinkBtn.addEventListener('click', function() {
            if (!window.footerEnData.social_links) {
                window.footerEnData.social_links = [];
            }
            
            window.footerEnData.social_links.push({
                icon: 'bi bi-facebook',
                link: '#'
            });
            
            document.getElementById('footer-social-links-container').innerHTML = renderSocialLinks();
            bindFooterDeleteEvents();
        });
    }
    
    // 添加快速链接按钮
    const addQuickLinkBtn = document.getElementById('add-quick-link');
    if (addQuickLinkBtn) {
        addQuickLinkBtn.addEventListener('click', function() {
            if (!window.footerEnData.quick_links) {
                window.footerEnData.quick_links = [];
            }
            
            window.footerEnData.quick_links.push({
                text: 'New Link',
                link: '#'
            });
            
            document.getElementById('footer-quick-links-container').innerHTML = renderQuickLinks();
            bindFooterDeleteEvents();
        });
    }
    
    // 添加解决方案链接按钮
    const addSolutionLinkBtn = document.getElementById('add-solution-link');
    if (addSolutionLinkBtn) {
        addSolutionLinkBtn.addEventListener('click', function() {
            if (!window.footerEnData.solution_links) {
                window.footerEnData.solution_links = [];
            }
            
            window.footerEnData.solution_links.push({
                text: 'New Solution',
                link: '#'
            });
            
            document.getElementById('footer-solution-links-container').innerHTML = renderSolutionLinks();
            bindFooterDeleteEvents();
        });
    }
    
    // 保存页脚设置按钮
    const saveFooterBtn = document.getElementById('save-footer');
    if (saveFooterBtn) {
        saveFooterBtn.addEventListener('click', saveFooterSettings);
    }
    
    // 绑定删除链接按钮事件
    bindFooterDeleteEvents();
}

/**
 * 绑定页脚删除链接按钮事件
 */
function bindFooterDeleteEvents() {
    // 删除社交链接按钮
    const deleteSocialLinkBtns = document.querySelectorAll('.delete-social-link');
    deleteSocialLinkBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.footerEnData.social_links && index >= 0 && index < window.footerEnData.social_links.length) {
                window.footerEnData.social_links.splice(index, 1);
                document.getElementById('footer-social-links-container').innerHTML = renderSocialLinks();
                bindFooterDeleteEvents();
            }
        });
    });
    
    // 删除快速链接按钮
    const deleteQuickLinkBtns = document.querySelectorAll('.delete-quick-link');
    deleteQuickLinkBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.footerEnData.quick_links && index >= 0 && index < window.footerEnData.quick_links.length) {
                window.footerEnData.quick_links.splice(index, 1);
                document.getElementById('footer-quick-links-container').innerHTML = renderQuickLinks();
                bindFooterDeleteEvents();
            }
        });
    });
    
    // 删除解决方案链接按钮
    const deleteSolutionLinkBtns = document.querySelectorAll('.delete-solution-link');
    deleteSolutionLinkBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.footerEnData.solution_links && index >= 0 && index < window.footerEnData.solution_links.length) {
                window.footerEnData.solution_links.splice(index, 1);
                document.getElementById('footer-solution-links-container').innerHTML = renderSolutionLinks();
                bindFooterDeleteEvents();
            }
        });
    });
}

/**
 * 保存页脚设置
 */
async function saveFooterSettings() {
    try {
        // 收集所有页脚数据
        const companyInfo = document.getElementById('footer-company-info').value;
        const address = document.getElementById('footer-address').value;
        const phone = document.getElementById('footer-phone').value;
        const email = document.getElementById('footer-email').value;
        const hours = document.getElementById('footer-hours').value;
        const copyright = document.getElementById('footer-copyright').value;
        const icp = document.getElementById('footer-icp').value;
        
        // 更新页脚数据对象
        const footerData = {
            company_info: companyInfo,
            social_links: window.footerEnData.social_links || [],
            quick_links: window.footerEnData.quick_links || [],
            solution_links: window.footerEnData.solution_links || [],
            contact_info: {
                address: address,
                phone: phone,
                email: email,
                hours: hours
            },
            copyright: copyright,
            icp: icp
        };
        
        // 发送到服务器
        const response = await fetch('api/english_content.php?type=footer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(footerData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        // 更新全局数据
        window.footerEnData = footerData;
        
        // 显示成功消息
        showAlert('success', '页脚设置已成功保存！');
    } catch (error) {
        console.error('保存页脚设置失败:', error);
        showAlert('danger', '保存失败: ' + error.message);
    }
}

/**
 * 渲染导航内容
 */
function renderNavigationContent() {
    const navigationContainer = document.getElementById('navigation-en-container');
    if (!navigationContainer) {
        console.error('未找到导航容器元素');
        return;
    }
    
    // 确保window.navigationEnData有正确的结构
    if (!window.navigationEnData) {
        console.warn('导航数据为null，初始化为空对象');
        window.navigationEnData = {
            main_nav: [],
            login_buttons: []
        };
    }
    
    // 构建导航编辑界面
    navigationContainer.innerHTML = `
        <div class="card mt-3">
            <div class="card-body">
                <ul class="nav nav-tabs" id="navigationTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="main-nav-tab" data-bs-toggle="tab" data-bs-target="#main-nav-content" type="button" role="tab">主导航</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="login-buttons-tab" data-bs-toggle="tab" data-bs-target="#login-buttons-content" type="button" role="tab">登录按钮</button>
                    </li>
                </ul>
                
                <div class="tab-content mt-3" id="navigationTabContent">
                    <!-- 主导航内容 -->
                    <div class="tab-pane fade show active" id="main-nav-content" role="tabpanel">
                        <div id="main-nav-container">
                            ${renderMainNavItems()}
                        </div>
                        <button id="add-main-nav-item" class="btn btn-outline-primary mt-3">
                            <i class="bi bi-plus"></i> 添加导航项
                        </button>
                    </div>
                    
                    <!-- 登录按钮内容 -->
                    <div class="tab-pane fade" id="login-buttons-content" role="tabpanel">
                        <div id="login-buttons-container">
                            ${renderLoginButtons()}
                        </div>
                        <button id="add-login-button" class="btn btn-outline-primary mt-3">
                            <i class="bi bi-plus"></i> 添加登录按钮
                        </button>
                    </div>
                </div>
                
                <div class="mt-3">
                    <button id="save-navigation" class="btn btn-primary">保存导航设置</button>
                </div>
            </div>
        </div>
    `;
    
    // 初始化Bootstrap标签页
    const navigationTab = document.getElementById('navigationTab');
    const tabs = navigationTab.querySelectorAll('button[data-bs-toggle="tab"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 隐藏所有标签页内容
            document.querySelectorAll('#navigationTabContent .tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // 取消所有标签激活状态
            tabs.forEach(t => {
                t.classList.remove('active');
            });
            
            // 显示当前标签页内容并激活当前标签
            const targetId = this.getAttribute('data-bs-target');
            document.querySelector(targetId).classList.add('show', 'active');
            this.classList.add('active');
        });
    });
    
    // 绑定导航相关事件
    bindNavigationEvents();
}

/**
 * 渲染主导航项
 */
function renderMainNavItems() {
    let html = '';
    
    if (Array.isArray(window.navigationEnData.main_nav) && window.navigationEnData.main_nav.length > 0) {
        window.navigationEnData.main_nav.forEach((item, index) => {
            let dropdownItemsHtml = '';
            
            // 如果是下拉菜单，则渲染下拉项
            if (item.dropdown && Array.isArray(item.dropdown_items)) {
                item.dropdown_items.forEach((dropdownItem, dropdownIndex) => {
                    dropdownItemsHtml += `
                        <div class="dropdown-item input-group mb-2" data-parent-index="${index}" data-dropdown-index="${dropdownIndex}">
                            <input type="text" class="form-control dropdown-item-title" value="${dropdownItem.title || ''}" placeholder="标题">
                            <input type="text" class="form-control dropdown-item-link" value="${dropdownItem.link || ''}" placeholder="链接">
                            <button class="btn btn-outline-danger delete-dropdown-item" type="button" data-parent-index="${index}" data-dropdown-index="${dropdownIndex}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    `;
                });
            }
            
            html += `
                <div class="card mb-3 nav-item" data-index="${index}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">导航项 #${index + 1}</h5>
                        <button class="btn btn-danger btn-sm delete-nav-item" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control nav-item-title" value="${item.title || ''}" data-index="${index}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">链接</label>
                                <input type="text" class="form-control nav-item-link" value="${item.link || ''}" data-index="${index}">
                            </div>
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input nav-item-active" id="nav-active-${index}" 
                                ${item.active ? 'checked' : ''} data-index="${index}">
                            <label class="form-check-label" for="nav-active-${index}">活动状态</label>
                        </div>
                        
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input nav-item-dropdown" id="nav-dropdown-${index}" 
                                ${item.dropdown ? 'checked' : ''} data-index="${index}">
                            <label class="form-check-label" for="nav-dropdown-${index}">下拉菜单</label>
                        </div>
                        
                        <div class="dropdown-container mb-3" id="dropdown-container-${index}" 
                            style="${item.dropdown ? '' : 'display: none;'}">
                            <h6>下拉菜单项</h6>
                            <div class="dropdown-items mb-2" id="dropdown-items-${index}">
                                ${dropdownItemsHtml}
                            </div>
                            <button class="btn btn-sm btn-outline-secondary add-dropdown-item" data-index="${index}">
                                <i class="bi bi-plus"></i> 添加下拉项
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<div class="alert alert-info">暂无导航项，请添加。</div>';
    }
    
    return html;
}

/**
 * 渲染登录按钮
 */
function renderLoginButtons() {
    let html = '';
    
    if (Array.isArray(window.navigationEnData.login_buttons) && window.navigationEnData.login_buttons.length > 0) {
        window.navigationEnData.login_buttons.forEach((button, index) => {
            html += `
                <div class="card mb-3 login-button" data-index="${index}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">按钮 #${index + 1}</h5>
                        <button class="btn btn-danger btn-sm delete-login-button" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control login-button-title" value="${button.title || ''}" data-index="${index}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">链接</label>
                                <input type="text" class="form-control login-button-link" value="${button.link || ''}" data-index="${index}">
                            </div>
                        </div>
                        
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <label class="form-label">样式</label>
                                <select class="form-select login-button-style" data-index="${index}">
                                    <option value="primary" ${button.style === 'primary' ? 'selected' : ''}>主要</option>
                                    <option value="secondary" ${button.style === 'secondary' ? 'selected' : ''}>次要</option>
                                    <option value="success" ${button.style === 'success' ? 'selected' : ''}>成功</option>
                                    <option value="danger" ${button.style === 'danger' ? 'selected' : ''}>危险</option>
                                    <option value="warning" ${button.style === 'warning' ? 'selected' : ''}>警告</option>
                                    <option value="info" ${button.style === 'info' ? 'selected' : ''}>信息</option>
                                    <option value="light" ${button.style === 'light' ? 'selected' : ''}>浅色</option>
                                    <option value="dark" ${button.style === 'dark' ? 'selected' : ''}>深色</option>
                                    <option value="outline-primary" ${button.style === 'outline-primary' ? 'selected' : ''}>主要轮廓</option>
                                    <option value="outline-secondary" ${button.style === 'outline-secondary' ? 'selected' : ''}>次要轮廓</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">CSS类名</label>
                                <input type="text" class="form-control login-button-class" value="${button.class || ''}" data-index="${index}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        html = '<div class="alert alert-info">暂无登录按钮，请添加。</div>';
    }
    
    return html;
}

/**
 * 绑定导航相关事件
 */
function bindNavigationEvents() {
    // 添加主导航项按钮
    const addMainNavItemBtn = document.getElementById('add-main-nav-item');
    if (addMainNavItemBtn) {
        addMainNavItemBtn.addEventListener('click', function() {
            if (!window.navigationEnData.main_nav) {
                window.navigationEnData.main_nav = [];
            }
            
            window.navigationEnData.main_nav.push({
                title: 'New Item',
                link: '#',
                active: false,
                dropdown: false,
                dropdown_items: []
            });
            
            document.getElementById('main-nav-container').innerHTML = renderMainNavItems();
            bindNavigationEventListeners();
        });
    }
    
    // 添加登录按钮
    const addLoginButtonBtn = document.getElementById('add-login-button');
    if (addLoginButtonBtn) {
        addLoginButtonBtn.addEventListener('click', function() {
            if (!window.navigationEnData.login_buttons) {
                window.navigationEnData.login_buttons = [];
            }
            
            window.navigationEnData.login_buttons.push({
                title: 'New Button',
                link: '#',
                style: 'primary',
                class: 'btn btn-primary'
            });
            
            document.getElementById('login-buttons-container').innerHTML = renderLoginButtons();
            bindNavigationEventListeners();
        });
    }
    
    // 保存导航设置按钮
    const saveNavigationBtn = document.getElementById('save-navigation');
    if (saveNavigationBtn) {
        saveNavigationBtn.addEventListener('click', saveNavigationSettings);
    }
    
    // 绑定其他事件监听器
    bindNavigationEventListeners();
}

/**
 * 绑定导航事件监听器
 */
function bindNavigationEventListeners() {
    // 删除导航项按钮
    const deleteNavItemBtns = document.querySelectorAll('.delete-nav-item');
    deleteNavItemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.navigationEnData.main_nav && index >= 0 && index < window.navigationEnData.main_nav.length) {
                window.navigationEnData.main_nav.splice(index, 1);
                document.getElementById('main-nav-container').innerHTML = renderMainNavItems();
                bindNavigationEventListeners();
            }
        });
    });
    
    // 删除登录按钮
    const deleteLoginButtonBtns = document.querySelectorAll('.delete-login-button');
    deleteLoginButtonBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.navigationEnData.login_buttons && index >= 0 && index < window.navigationEnData.login_buttons.length) {
                window.navigationEnData.login_buttons.splice(index, 1);
                document.getElementById('login-buttons-container').innerHTML = renderLoginButtons();
                bindNavigationEventListeners();
            }
        });
    });
    
    // 导航项标题和链接输入事件
    document.querySelectorAll('.nav-item-title, .nav-item-link').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const field = this.classList.contains('nav-item-title') ? 'title' : 'link';
            
            if (window.navigationEnData.main_nav && index >= 0 && index < window.navigationEnData.main_nav.length) {
                window.navigationEnData.main_nav[index][field] = this.value;
            }
        });
    });
    
    // 导航项活动状态复选框
    document.querySelectorAll('.nav-item-active').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.navigationEnData.main_nav && index >= 0 && index < window.navigationEnData.main_nav.length) {
                window.navigationEnData.main_nav[index].active = this.checked;
            }
        });
    });
    
    // 导航项下拉菜单复选框
    document.querySelectorAll('.nav-item-dropdown').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.navigationEnData.main_nav && index >= 0 && index < window.navigationEnData.main_nav.length) {
                window.navigationEnData.main_nav[index].dropdown = this.checked;
                
                // 显示或隐藏下拉菜单容器
                const dropdownContainer = document.getElementById(`dropdown-container-${index}`);
                if (dropdownContainer) {
                    dropdownContainer.style.display = this.checked ? '' : 'none';
                }
                
                // 确保dropdown_items数组存在
                if (this.checked && !Array.isArray(window.navigationEnData.main_nav[index].dropdown_items)) {
                    window.navigationEnData.main_nav[index].dropdown_items = [];
                }
            }
        });
    });
    
    // 添加下拉项按钮
    document.querySelectorAll('.add-dropdown-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.navigationEnData.main_nav && index >= 0 && index < window.navigationEnData.main_nav.length) {
                if (!Array.isArray(window.navigationEnData.main_nav[index].dropdown_items)) {
                    window.navigationEnData.main_nav[index].dropdown_items = [];
                }
                
                window.navigationEnData.main_nav[index].dropdown_items.push({
                    title: 'New Dropdown Item',
                    link: '#'
                });
                
                // 重新渲染下拉项
                const dropdownItemsContainer = document.getElementById(`dropdown-items-${index}`);
                if (dropdownItemsContainer) {
                    let html = '';
                    window.navigationEnData.main_nav[index].dropdown_items.forEach((item, dIndex) => {
                        html += `
                            <div class="dropdown-item input-group mb-2" data-parent-index="${index}" data-dropdown-index="${dIndex}">
                                <input type="text" class="form-control dropdown-item-title" value="${item.title || ''}" placeholder="标题">
                                <input type="text" class="form-control dropdown-item-link" value="${item.link || ''}" placeholder="链接">
                                <button class="btn btn-outline-danger delete-dropdown-item" type="button" data-parent-index="${index}" data-dropdown-index="${dIndex}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        `;
                    });
                    
                    dropdownItemsContainer.innerHTML = html;
                    bindDropdownItemEvents();
                }
            }
        });
    });
    
    // 登录按钮输入事件
    document.querySelectorAll('.login-button-title, .login-button-link, .login-button-class').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const field = this.classList.contains('login-button-title') ? 'title' : 
                         (this.classList.contains('login-button-link') ? 'link' : 'class');
            
            if (window.navigationEnData.login_buttons && index >= 0 && index < window.navigationEnData.login_buttons.length) {
                window.navigationEnData.login_buttons[index][field] = this.value;
            }
        });
    });
    
    // 登录按钮样式选择事件
    document.querySelectorAll('.login-button-style').forEach(select => {
        select.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            if (window.navigationEnData.login_buttons && index >= 0 && index < window.navigationEnData.login_buttons.length) {
                window.navigationEnData.login_buttons[index].style = this.value;
            }
        });
    });
    
    // 绑定下拉项事件
    bindDropdownItemEvents();
}

/**
 * 绑定下拉项事件
 */
function bindDropdownItemEvents() {
    // 下拉项输入事件
    document.querySelectorAll('.dropdown-item-title, .dropdown-item-link').forEach(input => {
        input.addEventListener('input', function() {
            const parentIndex = parseInt(this.closest('.dropdown-item').getAttribute('data-parent-index'));
            const dropdownIndex = parseInt(this.closest('.dropdown-item').getAttribute('data-dropdown-index'));
            const field = this.classList.contains('dropdown-item-title') ? 'title' : 'link';
            
            if (window.navigationEnData.main_nav && 
                parentIndex >= 0 && parentIndex < window.navigationEnData.main_nav.length &&
                window.navigationEnData.main_nav[parentIndex].dropdown_items &&
                dropdownIndex >= 0 && dropdownIndex < window.navigationEnData.main_nav[parentIndex].dropdown_items.length) {
                window.navigationEnData.main_nav[parentIndex].dropdown_items[dropdownIndex][field] = this.value;
            }
        });
    });
    
    // 删除下拉项按钮
    document.querySelectorAll('.delete-dropdown-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const parentIndex = parseInt(this.getAttribute('data-parent-index'));
            const dropdownIndex = parseInt(this.getAttribute('data-dropdown-index'));
            
            if (window.navigationEnData.main_nav && 
                parentIndex >= 0 && parentIndex < window.navigationEnData.main_nav.length &&
                window.navigationEnData.main_nav[parentIndex].dropdown_items &&
                dropdownIndex >= 0 && dropdownIndex < window.navigationEnData.main_nav[parentIndex].dropdown_items.length) {
                
                window.navigationEnData.main_nav[parentIndex].dropdown_items.splice(dropdownIndex, 1);
                
                // 重新渲染下拉项
                const dropdownItemsContainer = document.getElementById(`dropdown-items-${parentIndex}`);
                if (dropdownItemsContainer) {
                    let html = '';
                    window.navigationEnData.main_nav[parentIndex].dropdown_items.forEach((item, dIndex) => {
                        html += `
                            <div class="dropdown-item input-group mb-2" data-parent-index="${parentIndex}" data-dropdown-index="${dIndex}">
                                <input type="text" class="form-control dropdown-item-title" value="${item.title || ''}" placeholder="标题">
                                <input type="text" class="form-control dropdown-item-link" value="${item.link || ''}" placeholder="链接">
                                <button class="btn btn-outline-danger delete-dropdown-item" type="button" data-parent-index="${parentIndex}" data-dropdown-index="${dIndex}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        `;
                    });
                    
                    dropdownItemsContainer.innerHTML = html;
                    bindDropdownItemEvents();
                }
            }
        });
    });
}

/**
 * 保存导航设置
 */
async function saveNavigationSettings() {
    try {
        // 发送到服务器
        const response = await fetch('api/english_content.php?type=navigation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(window.navigationEnData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '保存失败');
        }
        
        // 显示成功消息
        showAlert('success', '导航设置已成功保存！');
    } catch (error) {
        console.error('保存导航设置失败:', error);
        showAlert('danger', '保存失败: ' + error.message);
    }
}

/**
 * 渲染合作案例内容
 */
function renderPartnerCases() {
    const container = document.getElementById('partner-cases-en-container');
    const titleInput = document.getElementById('partner-cases-en-title');
    
    if (!container || !titleInput) return;
    
    container.innerHTML = '';
    
    // 设置标题
    if (partnerCasesData && partnerCasesData.title) {
        titleInput.value = partnerCasesData.title;
    }
    
    // 添加数据有效性检查
    if (!partnerCasesData || !partnerCasesData.cases) {
        console.error('合作案例数据无效:', partnerCasesData);
        partnerCasesData = { title: '', cases: [] };
    }
    
    partnerCasesData.cases.forEach((caseItem, index) => {
        const caseElement = document.createElement('div');
        caseElement.className = 'case-item card mb-3';
        caseElement.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">合作案例 #${index + 1}</h5>
                <button class="btn btn-danger btn-sm delete-partner-case" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">图片路径</label>
                        <input type="text" class="form-control case-image" value="${caseItem.image || ''}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">标题</label>
                        <input type="text" class="form-control case-title" value="${caseItem.title || ''}">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea class="form-control case-description" rows="3">${caseItem.description || ''}</textarea>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">合作伙伴名称</label>
                        <input type="text" class="form-control case-partner-name" value="${caseItem.partner_name || ''}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">合作伙伴图标</label>
                        <input type="text" class="form-control case-partner-icon" value="${caseItem.partner_icon || ''}">
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(caseElement);
    });
    
    // 绑定删除合作案例按钮事件
    bindDeletePartnerCaseEvents();
    
    // 绑定添加合作案例按钮事件
    const addPartnerCaseBtn = document.getElementById('add-partner-case-en');
    if (addPartnerCaseBtn) {
        addPartnerCaseBtn.removeEventListener('click', addPartnerCase);
        addPartnerCaseBtn.addEventListener('click', addPartnerCase);
    }
    
    // 绑定保存合作案例按钮事件
    const savePartnerCasesBtn = document.getElementById('save-partner-cases-en');
    if (savePartnerCasesBtn) {
        savePartnerCasesBtn.removeEventListener('click', savePartnerCases);
        savePartnerCasesBtn.addEventListener('click', savePartnerCases);
    }
}

/**
 * 绑定删除合作案例按钮事件
 */
function bindDeletePartnerCaseEvents() {
    const deleteButtons = document.querySelectorAll('.delete-partner-case');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (!isNaN(index) && partnerCasesData.cases && index >= 0 && index < partnerCasesData.cases.length) {
                partnerCasesData.cases.splice(index, 1);
                renderPartnerCases();
            }
        });
    });
}

/**
 * 添加新的合作案例
 */
function addPartnerCase() {
    // 确保partnerCasesData被正确初始化
    if (!partnerCasesData) {
        partnerCasesData = { title: '', cases: [] };
    }
    if (!partnerCasesData.cases) {
        partnerCasesData.cases = [];
    }
    
    // 添加新案例
    partnerCasesData.cases.push({
        title: '新合作案例',
        description: '案例详细描述...',
        image: 'images/case1.jpg',
        partner_name: '合作伙伴名称',
        partner_icon: 'bi bi-building'
    });
    
    // 重新渲染案例列表
    renderPartnerCases();
}

/**
 * 保存合作案例数据
 */
async function savePartnerCases() {
    try {
        // 收集合作案例数据
        const titleInput = document.getElementById('partner-cases-en-title');
        const casesData = { 
            title: titleInput ? titleInput.value : '',
            cases: []
        };
        
        // 收集每个案例的数据
        const caseItems = document.querySelectorAll('.case-item');
        caseItems.forEach(item => {
            const caseData = {
                image: item.querySelector('.case-image').value,
                title: item.querySelector('.case-title').value,
                description: item.querySelector('.case-description').value,
                partner_name: item.querySelector('.case-partner-name').value,
                partner_icon: item.querySelector('.case-partner-icon').value
            };
            
            casesData.cases.push(caseData);
        });
        
        // 发送数据到服务器
        const response = await fetch('api/save-partner-cases-en.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(casesData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('success', '合作案例数据保存成功！');
            // 更新本地数据
            partnerCasesData = casesData;
        } else {
            showAlert('danger', `保存失败: ${result.message}`);
        }
    } catch (error) {
        console.error('保存合作案例数据出错:', error);
        showAlert('danger', '保存失败，请查看控制台获取详细错误信息。');
    }
}

// 导出模块
export default englishContentManager;