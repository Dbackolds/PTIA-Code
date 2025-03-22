/**
 * 导航管理模块
 * 负责管理网站的导航栏内容
 */

import { showAlert } from './utils.js';
import { loadNavigationData } from './data-loader.js';
import { saveNavigationData } from './data-saver.js';

// 全局变量
let navigationData = null;

/**
 * 初始化导航管理器
 */
function initNavigationManager() {
    // 初始加载数据
    loadAllNavigationData();
    
    // 绑定保存按钮事件
    const saveButton = document.getElementById('save-navigation');
    if (saveButton) {
        saveButton.addEventListener('click', saveAllNavigationData);
    }
    
    // 绑定添加导航项按钮事件
    const addNavButton = document.getElementById('add-nav-item');
    if (addNavButton) {
        addNavButton.addEventListener('click', addNewNavItem);
    }
    
    // 绑定添加登录按钮事件
    const addLoginButton = document.getElementById('add-login-button');
    if (addLoginButton) {
        addLoginButton.addEventListener('click', addNewLoginButton);
    }
}

/**
 * 加载所有导航相关数据
 */
async function loadAllNavigationData() {
    try {
        navigationData = await loadNavigationData();
        
        // 只在当前页面需要时渲染相应的内容
        if (navigationData && document.getElementById('main-nav-container')) renderNavItems();
        if (navigationData && document.getElementById('login-buttons-container')) renderLoginButtons();
    } catch (error) {
        console.warn('加载导航数据时出错:', error);
    }
}

/**
 * 渲染导航项目
 */
function renderNavItems() {
    const navItemsContainer = document.getElementById('main-nav-container');
    if (!navItemsContainer) {
        console.warn('无法渲染导航项目，找不到导航容器元素，可能不在当前页面');
        return;
    }
    
    navItemsContainer.innerHTML = '';
    
    if (!navigationData.main_nav) {
        console.error('导航数据格式不正确，缺少main_nav字段');
        return;
    }
    
    navigationData.main_nav.forEach((item, index) => {
        const navItemDiv = document.createElement('div');
        navItemDiv.className = 'card mb-3';
        navItemDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">导航项 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-nav-item" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">文本</label>
                    <input type="text" class="form-control nav-item-text" value="${item.title || ''}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control nav-item-link" value="${item.link || '#'}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input nav-item-dropdown" type="checkbox" ${item.dropdown ? 'checked' : ''} data-index="${index}">
                        <label class="form-check-label">包含下拉菜单</label>
                    </div>
                </div>
                <div class="dropdown-items-container ${item.dropdown ? '' : 'd-none'}" data-parent-index="${index}">
                    <h6>下拉菜单项</h6>
                    <div class="dropdown-items-list">
                        ${renderDropdownItems(item.dropdown_items || [], index)}
                    </div>
                    <button type="button" class="btn btn-sm btn-primary add-dropdown-item mt-2" data-parent-index="${index}">
                        <i class="bi bi-plus-circle"></i> 添加下拉项
                    </button>
                </div>
            </div>
        `;
        navItemsContainer.appendChild(navItemDiv);
    });
    
    // 添加事件监听器
    addNavItemsEventListeners();
}

/**
 * 渲染下拉菜单项
 */
function renderDropdownItems(items, parentIndex) {
    let html = '';
    items.forEach((item, index) => {
        html += `
            <div class="card mb-2 dropdown-item-card">
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>下拉项 #${index + 1}</span>
                        <button type="button" class="btn btn-danger btn-sm remove-dropdown-item" data-parent-index="${parentIndex}" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="mb-2">
                        <input type="text" class="form-control form-control-sm dropdown-item-text" 
                               placeholder="文本" value="${item.title || ''}" 
                               data-parent-index="${parentIndex}" data-index="${index}">
                    </div>
                    <div class="mb-2">
                        <input type="text" class="form-control form-control-sm dropdown-item-link" 
                               placeholder="链接" value="${item.link || '#'}" 
                               data-parent-index="${parentIndex}" data-index="${index}">
                    </div>
                </div>
            </div>
        `;
    });
    return html;
}

/**
 * 添加导航项目的事件监听器
 */
function addNavItemsEventListeners() {
    // 删除导航项按钮
    document.querySelectorAll('.remove-nav-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            navigationData.main_nav.splice(index, 1);
            renderNavItems();
        });
    });
    
    // 导航项文本输入
    document.querySelectorAll('.nav-item-text').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            navigationData.main_nav[index].title = this.value;
        });
    });
    
    // 导航项链接输入
    document.querySelectorAll('.nav-item-link').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            navigationData.main_nav[index].link = this.value;
        });
    });
    
    // 下拉菜单选项切换
    document.querySelectorAll('.nav-item-dropdown').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            navigationData.main_nav[index].dropdown = this.checked;
            if (this.checked && !navigationData.main_nav[index].dropdown_items) {
                navigationData.main_nav[index].dropdown_items = [];
            }
            renderNavItems();
        });
    });
    
    // 添加下拉项按钮
    document.querySelectorAll('.add-dropdown-item').forEach(button => {
        button.addEventListener('click', function() {
            const parentIndex = parseInt(this.dataset.parentIndex);
            if (!navigationData.main_nav[parentIndex].dropdown_items) {
                navigationData.main_nav[parentIndex].dropdown_items = [];
            }
            navigationData.main_nav[parentIndex].dropdown_items.push({ title: '新下拉项', link: '#' });
            renderNavItems();
        });
    });
    
    // 删除下拉项按钮
    document.querySelectorAll('.remove-dropdown-item').forEach(button => {
        button.addEventListener('click', function() {
            const parentIndex = parseInt(this.dataset.parentIndex);
            const index = parseInt(this.dataset.index);
            navigationData.main_nav[parentIndex].dropdown_items.splice(index, 1);
            renderNavItems();
        });
    });
    
    // 下拉项文本输入
    document.querySelectorAll('.dropdown-item-text').forEach(input => {
        input.addEventListener('change', function() {
            const parentIndex = parseInt(this.dataset.parentIndex);
            const index = parseInt(this.dataset.index);
            navigationData.main_nav[parentIndex].dropdown_items[index].title = this.value;
        });
    });
    
    // 下拉项链接输入
    document.querySelectorAll('.dropdown-item-link').forEach(input => {
        input.addEventListener('change', function() {
            const parentIndex = parseInt(this.dataset.parentIndex);
            const index = parseInt(this.dataset.index);
            navigationData.main_nav[parentIndex].dropdown_items[index].link = this.value;
        });
    });
}

/**
 * 渲染登录按钮
 */
function renderLoginButtons() {
    const loginButtonsContainer = document.getElementById('login-buttons-container');
    if (!loginButtonsContainer) {
        console.warn('无法渲染登录按钮，找不到容器元素，可能不在当前页面');
        return;
    }
    
    loginButtonsContainer.innerHTML = '';
    
    if (!navigationData.login_buttons) {
        navigationData.login_buttons = [];
        console.warn('导航数据缺少login_buttons字段，已创建空数组');
    }
    
    navigationData.login_buttons.forEach((button, index) => {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'card mb-3';
        buttonDiv.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">按钮 #${index + 1}</h5>
                <button type="button" class="btn btn-danger btn-sm remove-login-button" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">文本</label>
                    <input type="text" class="form-control login-button-text" value="${button.title}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control login-button-link" value="${button.link}" data-index="${index}">
                </div>
                <div class="mb-3">
                    <label class="form-label">样式</label>
                    <select class="form-select login-button-style" data-index="${index}">
                        <option value="primary" ${button.style === 'primary' ? 'selected' : ''}>主要按钮</option>
                        <option value="secondary" ${button.style === 'secondary' ? 'selected' : ''}>次要按钮</option>
                        <option value="success" ${button.style === 'success' ? 'selected' : ''}>成功按钮</option>
                        <option value="danger" ${button.style === 'danger' ? 'selected' : ''}>危险按钮</option>
                        <option value="warning" ${button.style === 'warning' ? 'selected' : ''}>警告按钮</option>
                        <option value="info" ${button.style === 'info' ? 'selected' : ''}>信息按钮</option>
                        <option value="light" ${button.style === 'light' ? 'selected' : ''}>亮色按钮</option>
                        <option value="dark" ${button.style === 'dark' ? 'selected' : ''}>深色按钮</option>
                        <option value="outline-primary" ${button.style === 'outline-primary' ? 'selected' : ''}>主要轮廓按钮</option>
                        <option value="outline-secondary" ${button.style === 'outline-secondary' ? 'selected' : ''}>次要轮廓按钮</option>
                        <option value="outline-success" ${button.style === 'outline-success' ? 'selected' : ''}>成功轮廓按钮</option>
                        <option value="outline-danger" ${button.style === 'outline-danger' ? 'selected' : ''}>危险轮廓按钮</option>
                        <option value="outline-warning" ${button.style === 'outline-warning' ? 'selected' : ''}>警告轮廓按钮</option>
                        <option value="outline-info" ${button.style === 'outline-info' ? 'selected' : ''}>信息轮廓按钮</option>
                        <option value="outline-light" ${button.style === 'outline-light' ? 'selected' : ''}>亮色轮廓按钮</option>
                        <option value="outline-dark" ${button.style === 'outline-dark' ? 'selected' : ''}>深色轮廓按钮</option>
                    </select>
                </div>
                <div class="mb-3">
                    <div class="form-text">预览</div>
                    <div class="mt-2 login-button-preview">
                        <button class="btn btn-${button.style}">${button.title}</button>
                    </div>
                </div>
            </div>
        `;
        loginButtonsContainer.appendChild(buttonDiv);
    });
    
    // 添加事件监听器
    addLoginButtonsEventListeners();
}

/**
 * 添加登录按钮的事件监听器
 */
function addLoginButtonsEventListeners() {
    // 删除按钮
    document.querySelectorAll('.remove-login-button').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            navigationData.login_buttons.splice(index, 1);
            renderLoginButtons();
        });
    });
    
    // 按钮文本输入
    document.querySelectorAll('.login-button-text').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            navigationData.login_buttons[index].title = this.value;
            updateLoginButtonPreview(index);
        });
    });
    
    // 按钮链接输入
    document.querySelectorAll('.login-button-link').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            navigationData.login_buttons[index].link = this.value;
        });
    });
    
    // 按钮样式选择
    document.querySelectorAll('.login-button-style').forEach(select => {
        select.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            navigationData.login_buttons[index].style = this.value;
            // 更新class属性以反映新样式
            navigationData.login_buttons[index].class = `btn btn-${this.value}`;
            updateLoginButtonPreview(index);
        });
    });
}

/**
 * 更新登录按钮预览
 */
function updateLoginButtonPreview(index) {
    const previewContainers = document.querySelectorAll('.login-button-preview');
    if (previewContainers && previewContainers[index]) {
        const button = navigationData.login_buttons[index];
        previewContainers[index].innerHTML = `<button class="btn btn-${button.style}">${button.title}</button>`;
    }
}

/**
 * 添加新导航项
 */
function addNewNavItem() {
    if (!navigationData || !navigationData.main_nav) {
        console.error('无法添加导航项，导航数据不存在');
        return;
    }
    navigationData.main_nav.push({
        title: '新导航项',
        link: '#',
        dropdown: false
    });
    renderNavItems();
}

/**
 * 添加新登录按钮
 */
function addNewLoginButton() {
    if (!navigationData.login_buttons) {
        navigationData.login_buttons = [];
    }
    
    navigationData.login_buttons.push({
        title: '新按钮',
        link: '#',
        style: 'primary',
        class: 'btn btn-primary'
    });
    
    renderLoginButtons();
}

/**
 * 保存所有导航相关数据
 */
async function saveAllNavigationData() {
    const navSaveResult = await saveNavigationData(navigationData);
    
    if (navSaveResult) {
        showAlert('success', '导航数据保存成功！');
    } else {
        showAlert('warning', '导航数据保存失败，请检查并重试！');
    }
}

export { initNavigationManager };