/**
 * 通用工具函数模块
 */

/**
 * 显示提示信息
 * @param {string} type - 提示类型：success, danger, warning, info
 * @param {string} message - 提示消息
 */
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // 3秒后自动关闭
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

/**
 * 初始化导航切换
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const formSections = document.querySelectorAll('.form-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新导航激活状态
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应的表单区域
            const targetSection = this.getAttribute('data-section');
            formSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// 导出工具函数
export { showAlert, initNavigation };