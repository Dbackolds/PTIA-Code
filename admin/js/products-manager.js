/**
 * 云产品管理模块
 */

import { showAlert } from './utils.js';
import { saveCloudProductsData } from './data-saver.js';

// 全局变量（声明但不初始化，使用外部传入的值）
// let cloudProductsData = null;

/**
 * 初始化产品管理
 */
function initProductsManager() {
    const productsContainer = document.getElementById('products-container');
    const addButton = document.getElementById('add-product');
    const saveButton = document.getElementById('save-products');
    const productsTitle = document.getElementById('products-title');
    
    // 确保title字段正确设置
    if (productsTitle && cloudProductsData && cloudProductsData.title) {
        productsTitle.value = cloudProductsData.title;
    }
    
    // 已经在全局中加载了数据，直接渲染
    renderProductItems();
    
    // 绑定添加按钮事件
    addButton.addEventListener('click', () => {
        // 添加新产品
        if (!cloudProductsData.products) {
            cloudProductsData.products = [];
        }
        
        cloudProductsData.products.push({
            icon: 'bi bi-cloud',
            title: '新产品',
            description: '这是一个新产品，请编辑详细信息。',
            link: '#'
        });
        
        renderProductItems();
    });
    
    // 绑定保存按钮事件
    saveButton.addEventListener('click', async () => {
        // 更新标题
        if (productsTitle) {
            cloudProductsData.title = productsTitle.value;
        }
        
        const result = await saveCloudProductsData(cloudProductsData);
        if (result) {
            showAlert('success', '云产品数据保存成功！');
        }
    });
}

/**
 * 渲染产品项
 */
function renderProductItems() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer || !cloudProductsData) return;
    
    productsContainer.innerHTML = '';
    
    if (!cloudProductsData.products || !Array.isArray(cloudProductsData.products)) {
        console.error('云产品数据格式不正确:', cloudProductsData);
        return;
    }
    
    cloudProductsData.products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'card mb-3';
        productCard.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">产品 #${index + 1}</h5>
                <button type="button" class="btn btn-sm btn-danger delete-product" data-index="${index}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">图标</label>
                        <input type="text" class="form-control product-icon" value="${product.icon || 'bi bi-cloud'}" data-index="${index}">
                        <div class="mt-2 icon-preview">
                            <i class="${product.icon || 'bi bi-cloud'}"></i>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">标题</label>
                        <input type="text" class="form-control product-title" value="${product.title || ''}" data-index="${index}">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea class="form-control product-description" rows="3" data-index="${index}">${product.description || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control product-link" value="${product.link || '#'}" data-index="${index}">
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // 添加事件监听器
    addProductEventListeners();
}

/**
 * 为产品元素添加事件监听器
 */
function addProductEventListeners() {
    // 删除按钮事件
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cloudProductsData.products.splice(index, 1);
            renderProductItems();
        });
    });
    
    // 图标输入事件
    document.querySelectorAll('.product-icon').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cloudProductsData.products[index].icon = this.value;
            
            // 更新图标预览
            const preview = this.closest('.card-body').querySelector('.icon-preview i');
            if (preview) {
                preview.className = this.value;
            }
        });
    });
    
    // 标题输入事件
    document.querySelectorAll('.product-title').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cloudProductsData.products[index].title = this.value;
        });
    });
    
    // 描述输入事件
    document.querySelectorAll('.product-description').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cloudProductsData.products[index].description = this.value;
        });
    });
    
    // 链接输入事件
    document.querySelectorAll('.product-link').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cloudProductsData.products[index].link = this.value;
        });
    });
}

// 确保只导出init函数
export { initProductsManager };