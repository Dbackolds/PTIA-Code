/**
 * 评价管理模块
 */

import { showAlert } from './utils.js';
import { loadTestimonialsData } from './data-loader.js';
import { saveTestimonialsData } from './data-saver.js';

// 全局变量
let testimonialsData = null;

/**
 * 初始化评价管理
 */
function initTestimonialsManager() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    const testimonialsTitle = document.getElementById('testimonials-title');
    const addButton = document.getElementById('add-testimonial');
    const saveButton = document.getElementById('save-testimonials');
    
    // 加载数据
    loadTestimonialsData().then(data => {
        if (data) {
            testimonialsData = data;
            renderTestimonialItems();
        }
    });
    
    // 渲染评价项
    function renderTestimonialItems() {
        if (!testimonialsContainer || !testimonialsData) return;
        
        testimonialsContainer.innerHTML = '';
        
        // 兼容两种数据格式，优先使用reviews字段
        const testimonialsList = testimonialsData.reviews || testimonialsData.testimonials;
        
        if (!testimonialsList || !Array.isArray(testimonialsList)) {
            console.error('评价数据格式不正确:', testimonialsData);
            return;
        }
        
        testimonialsList.forEach((testimonial, index) => {
            const testimonialItem = document.createElement('div');
            testimonialItem.className = 'testimonial-admin-item mb-4';
            testimonialItem.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">评价 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-testimonial" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-lg-3 col-md-6 col-sm-12 mb-2">
                                <label class="form-label">头像</label>
                                <input type="text" class="form-control testimonial-avatar" value="${testimonial.avatar || 'images/avatar1.jpg'}">
                            </div>
                            <div class="col-lg-9 col-md-6 col-sm-12 mb-2">
                                <label class="form-label">姓名</label>
                                <input type="text" class="form-control testimonial-name" value="${testimonial.name || ''}">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <label class="form-label">评价内容</label>
                                <textarea class="form-control testimonial-content" rows="3" style="resize: vertical;">${testimonial.content || ''}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            testimonialsContainer.appendChild(testimonialItem);
        });
        
        // 添加删除按钮事件监听
        document.querySelectorAll('.delete-testimonial').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                // 检查数据结构，兼容不同的数据格式
                if (testimonialsData.testimonials) {
                    testimonialsData.testimonials.splice(index, 1);
                } else if (testimonialsData.reviews) {
                    testimonialsData.reviews.splice(index, 1);
                }
                renderTestimonialItems();
            });
        });
    }
    
    // 添加新评价
    addButton.addEventListener('click', function() {
        testimonialsData.testimonials.push({
            avatar: 'images/avatar1.jpg',
            name: '新用户',
            content: '评价内容'
        });
        renderTestimonialItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        testimonialsData.title = testimonialsTitle.value;
        
        // 更新评价数据
        const testimonialItems = document.querySelectorAll('.testimonial-admin-item');
        testimonialsData.testimonials = Array.from(testimonialItems).map(item => {
            return {
                avatar: item.querySelector('.testimonial-avatar').value,
                name: item.querySelector('.testimonial-name').value,
                content: item.querySelector('.testimonial-content').value
            };
        });
        
        // 显示保存中提示
        showAlert('info', '正在保存评价数据...');
        
        try {
            // 保存数据
            const success = await saveTestimonialsData(testimonialsData);
            
            if (success) {
                showAlert('success', '评价数据保存成功！');
            } else {
                showAlert('danger', '保存失败，请重试！');
            }
        } catch (error) {
            console.error('保存评价数据失败:', error);
            showAlert('danger', '保存失败，请重试！');
        }
    });
}

export { initTestimonialsManager };