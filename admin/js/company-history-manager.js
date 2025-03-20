/**
 * 发展历程管理模块
 */

import { loadCompanyHistoryData } from './data-loader.js';
import { saveCompanyHistoryData } from './data-saver.js';
import { showAlert } from './utils.js';

/**
 * 初始化发展历程管理模块
 */
function initCompanyHistoryManager() {
    // 获取DOM元素
    const historySection = document.getElementById('company_history-section');
    if (!historySection) {
        console.error('找不到发展历程管理DOM元素');
        return;
    }
    
    const historyTitle = historySection.querySelector('#history-title');
    const historyDescription = historySection.querySelector('#history-description');
    const milestonesContainer = historySection.querySelector('#milestones-container');
    const addMilestoneBtn = historySection.querySelector('#add-milestone');
    const saveHistoryBtn = historySection.querySelector('#save-history');
    const milestoneTemplate = document.getElementById('milestone-template');
    
    // 如果任一必需元素不存在，中止初始化
    if (!historyTitle || !historyDescription || !milestonesContainer || !addMilestoneBtn || !saveHistoryBtn || !milestoneTemplate) {
        console.error('发展历程管理缺少必要的DOM元素');
        return;
    }
    
    // 加载发展历程数据
    let historyData = window.companyHistoryData || { 
        title: '发展历程', 
        description: '我们在数字解决方案领域的成长之路',
        milestones: [] 
    };
    
    // 渲染发展历程数据
    function renderHistoryData() {
        // 设置标题和描述
        historyTitle.value = historyData.title || '';
        historyDescription.value = historyData.description || '';
        
        // 清空里程碑容器
        milestonesContainer.innerHTML = '';
        
        // 渲染里程碑
        if (Array.isArray(historyData.milestones)) {
            historyData.milestones.forEach(milestone => {
                addMilestone(milestone);
            });
        }
    }
    
    // 添加里程碑
    function addMilestone(milestone = null) {
        // 克隆模板
        const milestoneNode = document.importNode(milestoneTemplate.content, true);
        const milestoneElement = milestoneNode.querySelector('.milestone-item');
        
        // 获取输入元素
        const yearInput = milestoneElement.querySelector('.milestone-year');
        const labelInput = milestoneElement.querySelector('.milestone-label');
        const titleInput = milestoneElement.querySelector('.milestone-title');
        const contentInput = milestoneElement.querySelector('.milestone-content');
        
        // 如果有数据，则填充
        if (milestone) {
            yearInput.value = milestone.year || '';
            labelInput.value = milestone.label || '';
            titleInput.value = milestone.title || '';
            contentInput.value = milestone.content || '';
        }
        
        // 添加到容器
        milestonesContainer.appendChild(milestoneElement);
    }
    
    // 收集表单数据
    function collectFormData() {
        const formData = {
            title: historyTitle.value.trim(),
            description: historyDescription.value.trim(),
            milestones: []
        };
        
        // 收集所有里程碑
        const milestoneItems = milestonesContainer.querySelectorAll('.milestone-item');
        milestoneItems.forEach(item => {
            const milestone = {
                year: item.querySelector('.milestone-year').value.trim(),
                label: item.querySelector('.milestone-label').value.trim(),
                title: item.querySelector('.milestone-title').value.trim(),
                content: item.querySelector('.milestone-content').value.trim()
            };
            
            formData.milestones.push(milestone);
        });
        
        return formData;
    }
    
    // 保存发展历程数据
    async function saveHistory() {
        // 收集表单数据
        const formData = collectFormData();
        
        // 验证数据
        if (!formData.title) {
            showAlert('warning', '请输入发展历程标题');
            return;
        }
        
        // 保存数据
        const success = await saveCompanyHistoryData(formData);
        if (success) {
            // 更新本地数据
            historyData = formData;
            window.companyHistoryData = formData;
        }
    }
    
    // 初始化事件监听器
    
    // 添加里程碑按钮点击事件
    addMilestoneBtn.addEventListener('click', () => {
        addMilestone();
    });
    
    // 保存按钮点击事件
    saveHistoryBtn.addEventListener('click', () => {
        saveHistory();
    });
    
    // 事件委托，处理删除里程碑
    milestonesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-milestone')) {
            const milestoneItem = event.target.closest('.milestone-item');
            if (milestoneItem) {
                milestoneItem.remove();
            }
        }
    });
    
    // 尝试从服务器获取最新数据
    (async function fetchData() {
        const data = await loadCompanyHistoryData();
        if (data) {
            historyData = data;
            window.companyHistoryData = data;
            renderHistoryData();
        } else {
            renderHistoryData(); // 如果加载失败，也渲染已有数据
        }
    })();
}

export { initCompanyHistoryManager }; 