/**
 * 特性管理模块
 */

import { showAlert } from './utils.js';
import { loadFeaturesData } from './data-loader.js';
import { saveFeaturesData } from './data-saver.js';

// 全局变量
let featuresData = null;

/**
 * 初始化特性管理
 */
function initFeaturesManager() {
    const featuresContainer = document.getElementById('features-container');
    const addButton = document.getElementById('add-feature');
    const saveButton = document.getElementById('save-features');
    
    // 加载数据
    loadFeaturesData().then(data => {
        if (data) {
            featuresData = data;
            renderFeatureItems();
        }
    });
    
    // 渲染特性项
    function renderFeatureItems() {
        if (!featuresContainer || !featuresData) return;
        
        featuresContainer.innerHTML = '';
        
        featuresData.features.forEach((feature, index) => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item mb-4';
            featureItem.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">特性 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-feature" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control feature-title" value="${feature.title}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">图标</label>
                                <input type="text" class="form-control feature-icon" value="${feature.icon}">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">描述</label>
                                <textarea class="form-control feature-description" rows="3">${feature.description}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            featuresContainer.appendChild(featureItem);
            
            // 添加删除按钮事件
            featureItem.querySelector('.delete-feature').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                featuresData.features.splice(index, 1);
                renderFeatureItems();
            });
        });
    }
    
    // 添加特性按钮点击事件
    if (addButton) {
        addButton.addEventListener('click', function() {
            // 添加新的特性
            featuresData.features.push({
                title: '新特性',
                icon: 'bi bi-star',
                description: '新特性描述'
            });
            
            // 重新渲染特性列表
            renderFeatureItems();
        });
    }
    
    // 保存特性按钮点击事件
    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            // 显示保存中提示
            showAlert('info', '正在保存特性数据...');
            
            try {
                // 收集表单数据
                const featureItems = document.querySelectorAll('.feature-item');
                const features = [];
                
                featureItems.forEach(item => {
                    features.push({
                        title: item.querySelector('.feature-title').value,
                        icon: item.querySelector('.feature-icon').value,
                        description: item.querySelector('.feature-description').value
                    });
                });
                
                // 更新数据
                featuresData.features = features;
                
                // 保存数据
                const success = await saveFeaturesData(featuresData);
                
                if (success) {
                    showAlert('success', '特性数据保存成功！');
                } else {
                    showAlert('danger', '保存失败，请重试！');
                }
            } catch (error) {
                console.error('保存特性数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    }
}

export { initFeaturesManager };