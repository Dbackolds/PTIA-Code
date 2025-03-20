/**
 * 公告管理模块
 */

import { showAlert } from './utils.js';
import { loadAnnouncementData } from './data-loader.js';
import { saveAnnouncementData } from './data-saver.js';

// 全局变量
let announcementData = null;

/**
 * 初始化公告管理
 */
function initAnnouncementManager() {
    const announcementText = document.getElementById('announcement-text');
    const saveButton = document.getElementById('save-announcement');
    
    // 加载数据
    loadAnnouncementData().then(data => {
        if (data) {
            announcementData = data;
            renderAnnouncementForm();
        }
    });
    
    // 使用全局变量数据渲染
    if (announcementText && announcementData && announcementData.text) {
        announcementText.value = announcementData.text;
        
        // 更新预览
        const previewElement = document.querySelector('.announcement-preview');
        if (previewElement) {
            previewElement.textContent = announcementData.text;
        }
    }
    
    // 同步输入内容到预览
    if (announcementText) {
        announcementText.addEventListener('input', function() {
            const previewElement = document.querySelector('.announcement-preview');
            if (previewElement) {
                previewElement.textContent = this.value;
            }
        });
    }
    
    // 渲染表单
    function renderAnnouncementForm() {
        if (announcementText && announcementData) {
            announcementText.value = announcementData.text || '';
        }
    }
    
    // 保存按钮点击事件
    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            if (!announcementText) {
                showAlert('danger', '无法获取公告文本元素，请刷新页面重试！');
                return;
            }
            
            // 显示保存中提示
            showAlert('info', '正在保存公告数据...');
            
            try {
                // 收集表单数据
                const data = {
                    text: announcementText.value
                };
                
                // 保存数据
                const success = await saveAnnouncementData(data);
                
                if (success) {
                    // 更新本地数据
                    announcementData = data;
                    showAlert('success', '公告数据保存成功！');
                } else {
                    showAlert('danger', '保存失败，请重试！');
                }
            } catch (error) {
                console.error('保存公告数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    }
}

export { initAnnouncementManager };