/**
 * 案例管理模块
 * 负责管理网站的案例展示内容
 */

import { showAlert } from './utils.js';
import { loadCaseStudiesData } from './data-loader.js';
import { saveCaseStudiesData } from './data-saver.js';

// 全局变量
let caseStudiesData = null;

/**
 * 初始化案例管理
 */
function initCasesManager() {
    const casesContainer = document.getElementById('cases-container');
    const addButton = document.getElementById('add-case');
    const saveButton = document.getElementById('save-cases');
    
    // 加载数据
    loadCaseStudiesData().then(data => {
        if (data) {
            caseStudiesData = data;
            renderCaseItems();
        }
    });
    
    // 渲染案例项
    function renderCaseItems() {
        if (!casesContainer || !caseStudiesData) return;
        
        casesContainer.innerHTML = '';
        
        caseStudiesData.cases.forEach((caseItem, index) => {
            // 不再需要简介、客户和行业字段
            
            const caseElement = document.createElement('div');
            caseElement.className = 'case-item mb-4';
            caseElement.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">案例 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-case" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control case-title" value="${caseItem.title}" data-index="${index}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">图片</label>
                                <input type="text" class="form-control case-image" value="${caseItem.image}" data-index="${index}">
                            </div>

                            <div class="col-md-12">
                                <label class="form-label">详细描述</label>
                                <textarea class="form-control case-description" rows="4" data-index="${index}">${caseItem.description}</textarea>
                            </div>

                        </div>
                    </div>
                </div>
            `;
            casesContainer.appendChild(caseElement);
            
            // 添加删除按钮事件
            caseElement.querySelector('.delete-case').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                caseStudiesData.cases.splice(index, 1);
                renderCaseItems();
            });
            
            // 添加字段变更事件监听器
            addFieldChangeListeners(caseElement, index);
        });
    }
    
    /**
     * 为案例项添加字段变更事件监听器
     */
    function addFieldChangeListeners(caseElement, index) {
        // 标题变更
        caseElement.querySelector('.case-title').addEventListener('change', function() {
            caseStudiesData.cases[index].title = this.value;
        });
        
        // 图片变更
        caseElement.querySelector('.case-image').addEventListener('change', function() {
            caseStudiesData.cases[index].image = this.value;
        });
        
        // 详细描述变更
        caseElement.querySelector('.case-description').addEventListener('change', function() {
            caseStudiesData.cases[index].description = this.value;
        });
    }
    
    // 添加案例按钮点击事件
    if (addButton) {
        addButton.addEventListener('click', function() {
            // 添加新的案例
            caseStudiesData.cases.push({
                title: '新案例',
                image: 'images/case1.jpg',
                description: '新案例详细描述'
            });
            
            // 重新渲染案例列表
            renderCaseItems();
        });
    }
    
    // 保存案例按钮点击事件
    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            // 显示保存中提示
            showAlert('info', '正在保存案例数据...');
            
            try {
                // 收集表单数据
                const caseItems = document.querySelectorAll('.case-item');
                const cases = [];
                
                caseItems.forEach(item => {
                    cases.push({
                        title: item.querySelector('.case-title').value,
                        image: item.querySelector('.case-image').value,
                        description: item.querySelector('.case-description').value
                    });
                });
                
                // 更新数据
                caseStudiesData.cases = cases;
                
                // 保存数据
                const success = await saveCaseStudiesData(caseStudiesData);
                
                if (success) {
                    showAlert('success', '案例数据保存成功！');
                } else {
                    showAlert('danger', '保存失败，请重试！');
                }
            } catch (error) {
                console.error('保存案例数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    }
}

export { initCasesManager };