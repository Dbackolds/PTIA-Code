/**
 * 合作伙伴案例管理模块
 * 负责管理合作伙伴案例的内容
 */

import { showAlert } from './utils.js';
import { loadPartnerCasesData } from './data-loader.js';
import { savePartnerCasesData } from './data-saver.js';

// 全局变量
let partnerCasesData = null;

/**
 * 初始化合作伙伴案例管理器
 */
function initPartnerCasesManager() {
    console.log('初始化合作伙伴案例管理器');
    
    // 初始加载数据
    loadData();
    
    // 绑定保存按钮事件
    const saveButton = document.getElementById('save-partner-cases-btn');
    if (saveButton) {
        saveButton.addEventListener('click', saveData);
    }
    
    // 绑定添加案例按钮事件
    const addButton = document.getElementById('add-partner-case-btn');
    if (addButton) {
        addButton.addEventListener('click', addNewPartnerCase);
    }
}

/**
 * 加载合作伙伴案例数据
 */
async function loadData() {
    try {
        partnerCasesData = await loadPartnerCasesData();
        console.log('加载合作伙伴案例数据:', partnerCasesData);
        if (partnerCasesData) {
            renderPartnerCases();
        } else {
            // 如果数据为空，创建初始结构
            partnerCasesData = {
                title: '合作案例',
                cases: []
            };
            console.log('创建空合作案例数据结构');
        }
    } catch (error) {
        console.error('加载合作伙伴案例数据出错:', error);
        showAlert('danger', '加载合作伙伴案例数据失败，请刷新页面重试！');
    }
}

/**
 * 渲染合作伙伴案例
 */
function renderPartnerCases() {
    const container = document.getElementById('partner-cases-container');
    if (!container) {
        console.warn('无法渲染合作伙伴案例，找不到容器元素，可能不在当前页面');
        return;
    }
    
    container.innerHTML = '';
    
    // 首先添加标题输入
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-4';
    titleDiv.innerHTML = `
        <label class="form-label">标题</label>
        <input type="text" class="form-control" id="partner-cases-title" value="${partnerCasesData.title || '合作案例'}">
    `;
    container.appendChild(titleDiv);
    
    // 如果没有cases数组，创建一个空数组
    if (!partnerCasesData.cases || !Array.isArray(partnerCasesData.cases)) {
        partnerCasesData.cases = [];
        console.warn('合作伙伴案例数据格式不正确，已创建空案例数组');
    }
    
    if (partnerCasesData.cases.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'alert alert-info';
        emptyMessage.textContent = '暂无合作案例，请点击"添加合作案例"按钮添加。';
        container.appendChild(emptyMessage);
        return;
    }
    
    partnerCasesData.cases.forEach((partnerCase, index) => {
        const caseDiv = document.createElement('div');
        caseDiv.className = 'card mb-3';
        
        // 检查是单个合作伙伴还是多个合作伙伴
        const hasMultiplePartners = Array.isArray(partnerCase.partners) && partnerCase.partners.length > 0;
        
        let partnersContent = '';
        if (hasMultiplePartners) {
            // 多个合作伙伴
            partnersContent = `
                <div class="mb-3 multi-partners-section">
                    <label class="form-label">合作伙伴列表</label>
                    <div class="partners-list" data-index="${index}">
                        ${partnerCase.partners.map((partner, partnerIndex) => `
                            <div class="card mb-2 partner-item">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0">合作伙伴 #${partnerIndex + 1}</h6>
                                        <button type="button" class="btn btn-sm btn-danger remove-partner" data-case-index="${index}" data-partner-index="${partnerIndex}">
                                            <i class="bi bi-trash"></i> 删除
                                        </button>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <label class="form-label">名称</label>
                                            <input type="text" class="form-control partner-name" value="${partner.name || ''}" data-case-index="${index}" data-partner-index="${partnerIndex}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">图标</label>
                                            <input type="text" class="form-control partner-icon" value="${partner.icon || ''}" data-case-index="${index}" data-partner-index="${partnerIndex}">
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <label class="form-label">Logo URL</label>
                                        <input type="text" class="form-control partner-logo" value="${partner.logo || ''}" data-case-index="${index}" data-partner-index="${partnerIndex}">
                                        <div class="form-text">如果提供Logo URL，则优先显示Logo而非图标</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-primary mt-2 add-partner" data-index="${index}">
                        <i class="bi bi-plus"></i> 添加合作伙伴
                    </button>
                </div>
            `;
        } else {
            // 单个合作伙伴
            partnersContent = `
                <div class="mb-3 single-partner-section">
                    <div class="row g-2">
                        <div class="col-md-6">
                            <label class="form-label">合作伙伴名称</label>
                            <input type="text" class="form-control partner-case-partner-name" value="${partnerCase.partner_name || ''}" data-index="${index}">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">合作伙伴图标</label>
                            <input type="text" class="form-control partner-case-partner-icon" value="${partnerCase.partner_icon || ''}" data-index="${index}">
                        </div>
                    </div>
                    <div class="form-text mb-3">使用Bootstrap图标类，例如: bi bi-microsoft, bi bi-google</div>
                    <div class="mb-3">
                        <label class="form-label">合作伙伴Logo URL</label>
                        <input type="text" class="form-control partner-case-partner-logo" value="${partnerCase.partner_logo || ''}" data-index="${index}">
                        <div class="form-text">如果提供Logo URL，则优先显示Logo而非图标</div>
                    </div>
                </div>
            `;
        }
        
        caseDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">合作案例 #${index + 1}</h5>
                <div>
                    <button type="button" class="btn btn-outline-primary btn-sm me-2 toggle-partner-type" data-index="${index}">
                        ${hasMultiplePartners ? '切换为单个合作伙伴' : '切换为多个合作伙伴'}
                    </button>
                    <button type="button" class="btn btn-danger btn-sm remove-partner-case" data-index="${index}">
                        <i class="bi bi-trash"></i> 删除
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">标题</label>
                    <input type="text" class="form-control partner-case-title" value="${partnerCase.title || ''}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea class="form-control partner-case-description" rows="3" data-index="${index}">${partnerCase.description || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">图片URL</label>
                    <input type="text" class="form-control partner-case-image" value="${partnerCase.image || ''}" data-index="${index}">
                </div>
                
                ${partnersContent}
                
            </div>
        `;
        container.appendChild(caseDiv);
    });
    
    // 添加事件监听器
    addPartnerCasesEventListeners();
}

/**
 * 添加合作伙伴案例的事件监听器
 */
function addPartnerCasesEventListeners() {
    // 标题输入
    const titleInput = document.getElementById('partner-cases-title');
    if (titleInput) {
        titleInput.addEventListener('change', function() {
            partnerCasesData.title = this.value;
        });
    }

    // 删除案例按钮
    document.querySelectorAll('.remove-partner-case').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases.splice(index, 1);
            renderPartnerCases();
        });
    });
    
    // 切换合作伙伴类型按钮
    document.querySelectorAll('.toggle-partner-type').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const partnerCase = partnerCasesData.cases[index];
            
            // 检查当前类型
            const hasMultiplePartners = Array.isArray(partnerCase.partners) && partnerCase.partners.length > 0;
            
            if (hasMultiplePartners) {
                // 转换为单个合作伙伴
                // 取第一个合作伙伴作为单个合作伙伴
                const firstPartner = partnerCase.partners[0];
                partnerCase.partner_name = firstPartner ? firstPartner.name : '';
                partnerCase.partner_icon = firstPartner ? firstPartner.icon : '';
                partnerCase.partner_logo = firstPartner ? firstPartner.logo : '';
                delete partnerCase.partners;
            } else {
                // 转换为多个合作伙伴
                partnerCase.partners = [{
                    name: partnerCase.partner_name || '',
                    icon: partnerCase.partner_icon || '',
                    logo: partnerCase.partner_logo || ''
                }];
                delete partnerCase.partner_name;
                delete partnerCase.partner_icon;
                delete partnerCase.partner_logo;
            }
            
            renderPartnerCases();
        });
    });
    
    // 标题输入
    document.querySelectorAll('.partner-case-title').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases[index].title = this.value;
        });
    });
    
    // 描述输入
    document.querySelectorAll('.partner-case-description').forEach(textarea => {
        textarea.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases[index].description = this.value;
        });
    });
    
    // 图片URL输入
    document.querySelectorAll('.partner-case-image').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases[index].image = this.value;
        });
    });
    
    // 单个合作伙伴名称输入
    document.querySelectorAll('.partner-case-partner-name').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases[index].partner_name = this.value;
        });
    });
    
    // 单个合作伙伴图标输入
    document.querySelectorAll('.partner-case-partner-icon').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases[index].partner_icon = this.value;
        });
    });
    
    // 单个合作伙伴Logo输入
    document.querySelectorAll('.partner-case-partner-logo').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            partnerCasesData.cases[index].partner_logo = this.value;
        });
    });
    
    // 多个合作伙伴 - 添加合作伙伴按钮
    document.querySelectorAll('.add-partner').forEach(button => {
        button.addEventListener('click', function() {
            const caseIndex = parseInt(this.dataset.index);
            const partnerCase = partnerCasesData.cases[caseIndex];
            
            if (!partnerCase.partners) {
                partnerCase.partners = [];
            }
            
            partnerCase.partners.push({
                name: '新合作伙伴',
                icon: 'bi bi-building'
            });
            
            renderPartnerCases();
        });
    });
    
    // 多个合作伙伴 - 删除合作伙伴按钮
    document.querySelectorAll('.remove-partner').forEach(button => {
        button.addEventListener('click', function() {
            const caseIndex = parseInt(this.dataset.caseIndex);
            const partnerIndex = parseInt(this.dataset.partnerIndex);
            
            const partnerCase = partnerCasesData.cases[caseIndex];
            if (partnerCase.partners && partnerCase.partners.length > partnerIndex) {
                partnerCase.partners.splice(partnerIndex, 1);
                
                // 如果删除后没有合作伙伴，自动切换为单个合作伙伴模式
                if (partnerCase.partners.length === 0) {
                    partnerCase.partner_name = '';
                    partnerCase.partner_icon = '';
                    delete partnerCase.partners;
                }
                
                renderPartnerCases();
            }
        });
    });
    
    // 多个合作伙伴 - 名称输入
    document.querySelectorAll('.partner-name').forEach(input => {
        input.addEventListener('change', function() {
            const caseIndex = parseInt(this.dataset.caseIndex);
            const partnerIndex = parseInt(this.dataset.partnerIndex);
            
            const partnerCase = partnerCasesData.cases[caseIndex];
            if (partnerCase.partners && partnerCase.partners.length > partnerIndex) {
                partnerCase.partners[partnerIndex].name = this.value;
            }
        });
    });
    
    // 多个合作伙伴 - 图标输入
    document.querySelectorAll('.partner-icon').forEach(input => {
        input.addEventListener('change', function() {
            const caseIndex = parseInt(this.dataset.caseIndex);
            const partnerIndex = parseInt(this.dataset.partnerIndex);
            
            const partnerCase = partnerCasesData.cases[caseIndex];
            if (partnerCase.partners && partnerCase.partners.length > partnerIndex) {
                partnerCase.partners[partnerIndex].icon = this.value;
            }
        });
    });
    
    // 多个合作伙伴 - Logo输入
    document.querySelectorAll('.partner-logo').forEach(input => {
        input.addEventListener('change', function() {
            const caseIndex = parseInt(this.dataset.caseIndex);
            const partnerIndex = parseInt(this.dataset.partnerIndex);
            
            const partnerCase = partnerCasesData.cases[caseIndex];
            if (partnerCase.partners && partnerCase.partners.length > partnerIndex) {
                partnerCase.partners[partnerIndex].logo = this.value;
            }
        });
    });
}

/**
 * 添加新合作伙伴案例
 */
function addNewPartnerCase() {
    if (!partnerCasesData) {
        partnerCasesData = {
            title: '合作案例',
            cases: []
        };
    } else if (!partnerCasesData.cases) {
        partnerCasesData.cases = [];
    }
    
    partnerCasesData.cases.push({
        title: '新合作案例',
        description: '描述该合作案例的详细信息...',
        image: 'images/case1.jpg',
        partner_name: '合作伙伴名称',
        partner_icon: 'bi bi-building',
        partner_logo: ''
    });
    
    renderPartnerCases();
}

/**
 * 保存合作伙伴案例数据
 */
async function saveData() {
    try {
        const result = await savePartnerCasesData(partnerCasesData);
        if (result) {
            showAlert('success', '合作伙伴案例数据保存成功！');
        } else {
            showAlert('danger', '保存失败！请重试。');
        }
    } catch (error) {
        console.error('保存合作伙伴案例数据出错:', error);
        showAlert('danger', '保存时发生错误，请检查控制台获取详细信息。');
    }
}

export { initPartnerCasesManager };