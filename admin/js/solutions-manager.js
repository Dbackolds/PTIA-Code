/**
 * 解决方案管理模块
 */

import { showAlert } from './utils.js';
import { loadSolutionsData } from './data-loader.js';
import { saveSolutionsData } from './data-saver.js';

// 全局变量
let solutionsData = null;

/**
 * 初始化解决方案管理
 */
function initSolutionsManager() {
    const solutionsContainer = document.getElementById('solutions-container');
    const addButton = document.getElementById('add-solution');
    const saveButton = document.getElementById('save-solutions');
    
    // 加载数据
    loadSolutionsData().then(data => {
        if (data) {
            solutionsData = data;
            renderSolutionItems();
        }
    });
    
    // 渲染解决方案项
    function renderSolutionItems() {
        if (!solutionsContainer || !solutionsData) return;
        
        solutionsContainer.innerHTML = '';
        
        // 确保plans数组存在
        if (!solutionsData.plans || !Array.isArray(solutionsData.plans)) {
            solutionsData.plans = [];
            console.warn('解决方案数据格式不正确，已创建空数组');
        }
        
        solutionsData.plans.forEach((solution, index) => {
            const solutionItem = document.createElement('div');
            solutionItem.className = 'solution-item mb-4';
            solutionItem.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">解决方案 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-solution" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control solution-title" value="${solution.title || ''}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">副标题</label>
                                <input type="text" class="form-control solution-subtitle" value="${solution.subtitle || ''}">
                            </div>
                            <div class="col-md-12 mt-3">
                                <div class="form-check">
                                    <input class="form-check-input solution-popular" type="checkbox" ${solution.isPopular ? 'checked' : ''}>
                                    <label class="form-check-label">推荐方案</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">链接</label>
                                <input type="text" class="form-control solution-link" value="${solution.link || ''}">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">特性列表</label>
                                <div class="solution-features-container">
                                    ${(solution.features || []).map((feature, featureIndex) => `
                                        <div class="input-group mb-2 solution-feature-item">
                                            <input type="text" class="form-control solution-feature" value="${feature || ''}">
                                            <button class="btn btn-outline-danger delete-feature-btn" data-solution="${index}" data-feature="${featureIndex}" type="button">
                                                <i class="bi bi-dash"></i>
                                            </button>
                                        </div>
                                    `).join('')}
                                    <button class="btn btn-sm btn-outline-primary add-feature-btn" data-index="${index}">
                                        <i class="bi bi-plus"></i> 添加特性
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            solutionsContainer.appendChild(solutionItem);
            
            // 添加删除按钮事件
            solutionItem.querySelector('.delete-solution').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                solutionsData.plans.splice(index, 1);
                renderSolutionItems();
            });
            
            // 添加删除特性事件监听
            solutionItem.querySelectorAll('.delete-feature-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const solutionIndex = parseInt(this.getAttribute('data-solution'));
                    const featureIndex = parseInt(this.getAttribute('data-feature'));
                    if (solutionsData.plans[solutionIndex] && solutionsData.plans[solutionIndex].features) {
                        solutionsData.plans[solutionIndex].features.splice(featureIndex, 1);
                        renderSolutionItems();
                    }
                });
            });
            
            // 添加新特性事件监听
            solutionItem.querySelector('.add-feature-btn').addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (!solutionsData.plans[index].features) {
                    solutionsData.plans[index].features = [];
                }
                solutionsData.plans[index].features.push('新特性');
                renderSolutionItems();
            });
        });
    }
    
    // 添加解决方案按钮点击事件
    if (addButton) {
        addButton.addEventListener('click', function() {
            // 添加新的解决方案
            solutionsData.plans.push({
                title: '新方案',
                subtitle: '副标题',
                isPopular: false,
                features: ['特性1', '特性2', '特性3'],
                link: '#'
            });
            
            // 重新渲染解决方案列表
            renderSolutionItems();
        });
    }
    
    // 保存解决方案按钮点击事件
    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            // 显示保存中提示
            showAlert('info', '正在保存解决方案数据...');
            
            try {
                // 收集表单数据
                const solutionItems = document.querySelectorAll('.solution-item');
                const plans = [];
                
                solutionItems.forEach(item => {
                    const features = [];
                    item.querySelectorAll('.solution-feature').forEach(input => {
                        // 只添加非空的特性
                        if (input.value.trim()) {
                            features.push(input.value.trim());
                        }
                    });
                    
                    plans.push({
                        title: item.querySelector('.solution-title').value,
                        subtitle: item.querySelector('.solution-subtitle').value,
                        isPopular: item.querySelector('.solution-popular').checked,
                        features: features,
                        link: item.querySelector('.solution-link').value
                    });
                });
                
                // 更新数据
                solutionsData.plans = plans;
                
                // 保存数据 - 确保只保存中文版数据
                const success = await saveSolutionsData(solutionsData);
                
                if (success) {
                    showAlert('success', '解决方案数据保存成功！');
                } else {
                    showAlert('danger', '保存失败，请重试！');
                }
            } catch (error) {
                console.error('保存解决方案数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    }
}

export { initSolutionsManager };