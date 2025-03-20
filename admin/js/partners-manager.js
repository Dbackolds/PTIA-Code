/**
 * 合作伙伴管理模块
 * 负责管理网站的战略合作伙伴和技术合作伙伴内容
 */

import { showAlert } from './utils.js';
import { loadStrategicPartnersData, loadTechPartnersData } from './data-loader.js';
import { saveStrategicPartnersData, saveTechPartnersData } from './data-saver.js';

// 全局变量
let strategicPartnersData = null;
let techPartnersData = null;

/**
 * 初始化合作伙伴管理器
 */
function initPartnersManager() {
    console.log('初始化合作伙伴管理器');
    
    // 确保使用全局数据
    if (window.strategicPartnersData) {
        strategicPartnersData = window.strategicPartnersData;
        console.log('已从全局变量加载战略合作伙伴数据');
    } else {
        // 初始加载数据
        loadAllPartnersData();
    }
    
    if (window.techPartnersData) {
        techPartnersData = window.techPartnersData;
        console.log('已从全局变量加载技术合作伙伴数据');
    }
    
    // 绑定保存按钮事件
    const saveButtons = document.querySelectorAll('#save-partners');
    if (saveButtons && saveButtons.length > 0) {
        saveButtons.forEach(button => {
            button.addEventListener('click', saveAllPartnersData);
        });
    }
    
    // 绑定添加战略合作伙伴按钮事件
    const addStrategicPartnerButton = document.getElementById('add-strategic-partner');
    if (addStrategicPartnerButton) {
        addStrategicPartnerButton.addEventListener('click', addNewStrategicPartner);
    }
    
    // 绑定添加技术合作伙伴按钮事件
    const addTechPartnerButton = document.getElementById('add-tech-partner');
    if (addTechPartnerButton) {
        addTechPartnerButton.addEventListener('click', addNewTechPartner);
    }
    
    // 初始化Bootstrap标签页功能
    initTabsFunction();
    
    // 将关键函数暴露到全局
    window.partnersManager = {
        renderStrategicPartners,
        renderTechPartners,
        addNewStrategicPartner,
        addNewTechPartner,
        saveAllPartnersData
    };
    
    // 尝试默认渲染战略合作伙伴
    renderStrategicPartners();
}

/**
 * 初始化标签页功能
 */
function initTabsFunction() {
    console.log('初始化标签页功能');
    
    // 获取标签页元素
    const strategicTab = document.getElementById('strategic-partners-tab');
    const techTab = document.getElementById('tech-partners-tab');
    
    // 检查是否找到标签页元素
    if (!strategicTab) {
        console.warn('找不到战略合作伙伴标签元素');
    }
    
    if (!techTab) {
        console.warn('找不到技术合作伙伴标签元素');
    }
    
    // 处理战略合作伙伴标签
    if (strategicTab) {
        console.log('添加战略合作伙伴标签事件监听');
        
        // 点击事件处理
        strategicTab.addEventListener('click', function(e) {
            console.log('点击了战略合作伙伴标签');
            
            // 显示战略合作伙伴内容，隐藏技术合作伙伴内容
            document.getElementById('strategic-partners-content').classList.add('show', 'active');
            document.getElementById('tech-partners-content').classList.remove('show', 'active');
            
            // 激活当前标签
            this.classList.add('active');
            if (techTab) techTab.classList.remove('active');
            
            // 渲染内容
            renderStrategicPartners();
            
            // 防止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });
    }
    
    // 处理技术合作伙伴标签
    if (techTab) {
        console.log('添加技术合作伙伴标签事件监听');
        
        // 点击事件处理
        techTab.addEventListener('click', function(e) {
            console.log('点击了技术合作伙伴标签');
            
            // 显示技术合作伙伴内容，隐藏战略合作伙伴内容
            document.getElementById('tech-partners-content').classList.add('show', 'active');
            document.getElementById('strategic-partners-content').classList.remove('show', 'active');
            
            // 激活当前标签
            this.classList.add('active');
            if (strategicTab) strategicTab.classList.remove('active');
            
            // 渲染内容
            renderTechPartners();
            
            // 防止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });
    }
    
    // 确保初始状态下正确显示活动标签的内容
    console.log('检查初始活动标签并渲染相应内容');
    
    if (document.querySelector('#strategic-partners-tab.active')) {
        console.log('战略合作伙伴标签处于活动状态，渲染其内容');
        renderStrategicPartners();
    } else if (document.querySelector('#tech-partners-tab.active')) {
        console.log('技术合作伙伴标签处于活动状态，渲染其内容');
        renderTechPartners();
    } else if (strategicTab) {
        console.log('没有活动标签，默认激活战略合作伙伴标签');
        // 默认激活战略合作伙伴标签
        strategicTab.classList.add('active');
        document.getElementById('strategic-partners-content').classList.add('show', 'active');
        renderStrategicPartners();
    }
}

/**
 * 加载所有合作伙伴相关数据
 */
async function loadAllPartnersData() {
    try {
        strategicPartnersData = await loadStrategicPartnersData();
        techPartnersData = await loadTechPartnersData();
        
        console.log('合作伙伴数据加载完成:', {
            strategic: strategicPartnersData,
            tech: techPartnersData
        });
        
        // 只在当前页面需要时渲染相应的内容
        if (strategicPartnersData && document.getElementById('strategic-partners-container')) {
            renderStrategicPartners();
        }
        if (techPartnersData && document.getElementById('tech-partners-container')) {
            renderTechPartners();
        }
    } catch (error) {
        console.error('加载合作伙伴数据时出错:', error);
        showAlert('danger', '加载合作伙伴数据失败，请刷新页面重试！');
    }
}

/**
 * 渲染战略合作伙伴
 */
function renderStrategicPartners() {
    console.log('开始渲染战略合作伙伴数据');
    const partnersContainer = document.getElementById('strategic-partners-container');
    if (!partnersContainer) {
        console.warn('无法渲染战略合作伙伴，找不到容器元素，可能不在当前页面');
        return;
    }
    
    partnersContainer.innerHTML = '';
    
    // 使用全局数据
    const data = strategicPartnersData || window.strategicPartnersData;
    
    if (!data || !data.partners || !Array.isArray(data.partners)) {
        console.error('战略合作伙伴数据格式不正确:', data);
        partnersContainer.innerHTML = '<div class="alert alert-danger">数据格式不正确，无法显示战略合作伙伴</div>';
        return;
    }
    
    console.log(`正在渲染${data.partners.length}个战略合作伙伴`);
    
    data.partners.forEach((partner, index) => {
        const partnerDiv = document.createElement('div');
        partnerDiv.className = 'card mb-3';
        partnerDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">战略合作伙伴 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-strategic-partner" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">名称</label>
                    <input type="text" class="form-control strategic-partner-name" value="${partner.name || ''}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea class="form-control strategic-partner-description" rows="3" data-index="${index}">${partner.description || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Logo图片URL</label>
                    <input type="text" class="form-control strategic-partner-logo" value="${partner.logo || ''}" data-index="${index}">
                    <div class="form-text">图片URL为空时将显示图标</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">图标 (Bootstrap Icons类名)</label>
                    <input type="text" class="form-control strategic-partner-icon" value="${partner.icon || 'bi bi-building'}" data-index="${index}">
                    <div class="form-text">示例: bi bi-building, bi bi-trophy, bi bi-bank 等，查看更多图标: <a href="https://icons.getbootstrap.com/" target="_blank">Bootstrap Icons</a></div>
                </div>
            </div>
        `;
        partnersContainer.appendChild(partnerDiv);
    });
    
    console.log('战略合作伙伴渲染完成，添加事件监听器');
    
    // 添加事件监听器
    addStrategicPartnersEventListeners();
}

/**
 * 添加战略合作伙伴的事件监听器
 */
function addStrategicPartnersEventListeners() {
    // 删除按钮
    document.querySelectorAll('.remove-strategic-partner').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            strategicPartnersData.partners.splice(index, 1);
            renderStrategicPartners();
        });
    });
    
    // 名称输入
    document.querySelectorAll('.strategic-partner-name').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            strategicPartnersData.partners[index].name = this.value;
        });
    });
    
    // 描述输入
    document.querySelectorAll('.strategic-partner-description').forEach(textarea => {
        textarea.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            strategicPartnersData.partners[index].description = this.value;
        });
    });
    
    // Logo输入
    document.querySelectorAll('.strategic-partner-logo').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            strategicPartnersData.partners[index].logo = this.value;
        });
    });
    
    // 图标输入
    document.querySelectorAll('.strategic-partner-icon').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            strategicPartnersData.partners[index].icon = this.value;
        });
    });
}

/**
 * 渲染技术合作伙伴
 */
function renderTechPartners() {
    console.log('正在渲染技术合作伙伴数据');
    const partnersContainer = document.getElementById('tech-partners-container');
    if (!partnersContainer) {
        console.warn('无法渲染技术合作伙伴，找不到容器元素');
        return;
    }
    
    console.log('找到技术合作伙伴容器，清空现有内容');
    partnersContainer.innerHTML = '';
    
    if (!techPartnersData || !techPartnersData.partners || !Array.isArray(techPartnersData.partners)) {
        console.error('技术合作伙伴数据格式不正确', techPartnersData);
        // 如果数据为空，初始化一个空结构
        techPartnersData = {
            title: '技术合作伙伴',
            partners: []
        };
    }
    
    console.log(`渲染${techPartnersData.partners.length}个技术合作伙伴`);
    
    if (techPartnersData.partners.length === 0) {
        // 如果没有数据，添加一条友好的提示
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'alert alert-info';
        emptyMessage.innerHTML = '暂无技术合作伙伴数据，请点击"添加技术合作伙伴"按钮添加。';
        partnersContainer.appendChild(emptyMessage);
    }
    
    techPartnersData.partners.forEach((partner, index) => {
        const partnerDiv = document.createElement('div');
        partnerDiv.className = 'card mb-3';
        partnerDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">技术合作伙伴 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-tech-partner" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">名称</label>
                    <input type="text" class="form-control tech-partner-name" value="${partner.name || ''}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Logo图片URL</label>
                    <input type="text" class="form-control tech-partner-logo" value="${partner.logo || ''}" data-index="${index}">
                    <div class="form-text">图片URL为空时将显示图标</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">图标 (Bootstrap Icons类名)</label>
                    <input type="text" class="form-control tech-partner-icon" value="${partner.icon || 'bi bi-cpu'}" data-index="${index}">
                    <div class="form-text">示例: bi bi-cpu, bi bi-cloud, bi bi-code-square 等，查看更多图标: <a href="https://icons.getbootstrap.com/" target="_blank">Bootstrap Icons</a></div>
                </div>
            </div>
        `;
        partnersContainer.appendChild(partnerDiv);
    });
    
    // 添加事件监听器
    addTechPartnersEventListeners();
    console.log('技术合作伙伴渲染完成，并添加了事件监听器');
}

/**
 * 添加技术合作伙伴的事件监听器
 */
function addTechPartnersEventListeners() {
    // 删除按钮
    document.querySelectorAll('.remove-tech-partner').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            techPartnersData.partners.splice(index, 1);
            renderTechPartners();
        });
    });
    
    // 名称输入
    document.querySelectorAll('.tech-partner-name').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            techPartnersData.partners[index].name = this.value;
        });
    });
    
    // Logo输入
    document.querySelectorAll('.tech-partner-logo').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            techPartnersData.partners[index].logo = this.value;
        });
    });
    
    // 图标输入
    document.querySelectorAll('.tech-partner-icon').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            techPartnersData.partners[index].icon = this.value;
        });
    });
}

/**
 * 添加新战略合作伙伴
 */
function addNewStrategicPartner() {
    if (!strategicPartnersData) {
        strategicPartnersData = {
            title: '战略合作伙伴',
            partners: []
        };
    } else if (!strategicPartnersData.partners) {
        strategicPartnersData.partners = [];
    }
    
    strategicPartnersData.partners.push({
        name: '新战略合作伙伴',
        description: '',
        logo: '',
        icon: 'bi bi-building'
    });
    renderStrategicPartners();
}

/**
 * 添加新技术合作伙伴
 */
function addNewTechPartner() {
    if (!techPartnersData) {
        techPartnersData = {
            title: '技术合作伙伴',
            partners: []
        };
    } else if (!techPartnersData.partners) {
        techPartnersData.partners = [];
    }
    
    techPartnersData.partners.push({
        name: '新技术合作伙伴',
        logo: '',
        icon: 'bi bi-cpu'
    });
    renderTechPartners();
}

/**
 * 保存所有合作伙伴相关数据
 */
async function saveAllPartnersData() {
    const strategicPartnersSaveResult = await saveStrategicPartnersData(strategicPartnersData);
    const techPartnersSaveResult = await saveTechPartnersData(techPartnersData);
    
    if (strategicPartnersSaveResult && techPartnersSaveResult) {
        showAlert('success', '合作伙伴数据保存成功！');
    } else {
        showAlert('warning', '部分合作伙伴数据保存失败，请检查并重试！');
    }
}

export { initPartnersManager }; 