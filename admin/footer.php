<?php
/**
 * 页脚管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载页脚数据
$footer = json_decode(file_get_contents('../data/footer.json'), true);
?>

<!-- 页脚管理 -->
<div id="footer-section" class="form-section active">
    <h3>页脚管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="company-info" class="form-label">公司简介</label>
                        <textarea class="form-control" id="company-info" rows="3"><?php echo isset($footer['company_info']) ? htmlspecialchars($footer['company_info']) : ''; ?></textarea>
                    </div>
                    
                    <h5 class="mt-4 mb-3">社交媒体链接</h5>
                    <div id="social-links-container">
                        <!-- 社交媒体链接将通过JavaScript动态添加 -->
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-sm btn-success" id="add-social">添加社交媒体</button>
                    </div>
                    
                    <h5 class="mt-4 mb-3">快速链接</h5>
                    <div id="quick-links-container">
                        <!-- 快速链接将通过JavaScript动态添加 -->
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-sm btn-success" id="add-quick-link">添加快速链接</button>
                    </div>
                    
                    <h5 class="mt-4 mb-3">解决方案链接</h5>
                    <div id="solution-links-container">
                        <!-- 解决方案链接将通过JavaScript动态添加 -->
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-sm btn-success" id="add-solution-link">添加解决方案链接</button>
                    </div>
                    
                    <h5 class="mt-4 mb-3">联系信息</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">地址</label>
                            <input type="text" class="form-control" id="contact-address" value="<?php echo isset($footer['contact_info']['address']) ? htmlspecialchars($footer['contact_info']['address']) : ''; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">电话</label>
                            <input type="text" class="form-control" id="contact-phone" value="<?php echo isset($footer['contact_info']['phone']) ? htmlspecialchars($footer['contact_info']['phone']) : ''; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">邮箱</label>
                            <input type="text" class="form-control" id="contact-email" value="<?php echo isset($footer['contact_info']['email']) ? htmlspecialchars($footer['contact_info']['email']) : ''; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">工作时间</label>
                            <input type="text" class="form-control" id="contact-hours" value="<?php echo isset($footer['contact_info']['hours']) ? htmlspecialchars($footer['contact_info']['hours']) : ''; ?>">
                        </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">版权信息</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">版权文本</label>
                            <input type="text" class="form-control" id="copyright" value="<?php echo isset($footer['copyright']) ? htmlspecialchars($footer['copyright']) : ''; ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">ICP备案号</label>
                            <input type="text" class="form-control" id="icp" value="<?php echo isset($footer['icp']) ? htmlspecialchars($footer['icp']) : ''; ?>">
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <button type="button" class="btn btn-primary" id="save-footer">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 加载公共底部 -->
<?php require_once 'includes/footer.php'; ?>

<script>
    // 当页面加载完成后执行
    document.addEventListener('DOMContentLoaded', async function() {
        // 加载页脚数据
        footerData = await loadFooterData();
        
        // 渲染社交媒体链接
        renderSocialLinks();
        
        // 渲染快速链接
        renderQuickLinks();
        
        // 渲染解决方案链接
        renderSolutionLinks();
        
        // 添加社交媒体链接按钮点击事件
        document.getElementById('add-social').addEventListener('click', function() {
            footerData.social_links.push({
                icon: 'bi bi-facebook',
                link: '#'
            });
            renderSocialLinks();
        });
        
        // 添加快速链接按钮点击事件
        document.getElementById('add-quick-link').addEventListener('click', function() {
            footerData.quick_links.push({
                text: '新链接',
                link: '#'
            });
            renderQuickLinks();
        });
        
        // 添加解决方案链接按钮点击事件
        document.getElementById('add-solution-link').addEventListener('click', function() {
            footerData.solution_links.push({
                text: '新解决方案',
                link: '#'
            });
            renderSolutionLinks();
        });
        
        // 保存页脚按钮点击事件
        document.getElementById('save-footer').addEventListener('click', async function() {
            // 显示保存中提示
            showAlert('info', '正在保存页脚数据...');
            
            try {
                // 收集表单数据
                footerData.company_info = document.getElementById('company-info').value;
                
                // 社交媒体链接
                const socialItems = document.querySelectorAll('.social-item');
                const socialLinks = [];
                
                socialItems.forEach(item => {
                    socialLinks.push({
                        icon: item.querySelector('.social-icon').value,
                        link: item.querySelector('.social-link').value
                    });
                });
                
                footerData.social_links = socialLinks;
                
                // 快速链接
                const quickLinkItems = document.querySelectorAll('.quick-link-item');
                const quickLinks = [];
                
                quickLinkItems.forEach(item => {
                    quickLinks.push({
                        text: item.querySelector('.quick-link-text').value,
                        link: item.querySelector('.quick-link-url').value
                    });
                });
                
                footerData.quick_links = quickLinks;
                
                // 解决方案链接
                const solutionLinkItems = document.querySelectorAll('.solution-link-item');
                const solutionLinks = [];
                
                solutionLinkItems.forEach(item => {
                    solutionLinks.push({
                        text: item.querySelector('.solution-link-text').value,
                        link: item.querySelector('.solution-link-url').value
                    });
                });
                
                footerData.solution_links = solutionLinks;
                
                // 联系信息
                footerData.contact_info = {
                    address: document.getElementById('contact-address').value,
                    phone: document.getElementById('contact-phone').value,
                    email: document.getElementById('contact-email').value,
                    hours: document.getElementById('contact-hours').value
                };
                
                // 版权信息
                footerData.copyright = document.getElementById('copyright').value;
                footerData.icp = document.getElementById('icp').value;
                
                // 发送到服务器
                const response = await fetch('api/footer.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(footerData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert('success', result.message);
                } else {
                    showAlert('danger', result.message);
                }
            } catch (error) {
                console.error('保存页脚数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    });
    
    // 渲染社交媒体链接
    function renderSocialLinks() {
        const container = document.getElementById('social-links-container');
        container.innerHTML = '';
        
        footerData.social_links.forEach((social, index) => {
            const item = document.createElement('div');
            item.className = 'social-item row g-3 mb-2';
            item.innerHTML = `
                <div class="col-md-5">
                    <label class="form-label">图标</label>
                    <input type="text" class="form-control social-icon" value="${social.icon}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control social-link" value="${social.link}">
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button type="button" class="btn btn-sm btn-danger delete-social" data-index="${index}">删除</button>
                </div>
            `;
            container.appendChild(item);
            
            // 添加删除按钮事件
            item.querySelector('.delete-social').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                footerData.social_links.splice(index, 1);
                renderSocialLinks();
            });
        });
    }
    
    // 渲染快速链接
    function renderQuickLinks() {
        const container = document.getElementById('quick-links-container');
        container.innerHTML = '';
        
        footerData.quick_links.forEach((link, index) => {
            const item = document.createElement('div');
            item.className = 'quick-link-item row g-3 mb-2';
            item.innerHTML = `
                <div class="col-md-5">
                    <label class="form-label">文本</label>
                    <input type="text" class="form-control quick-link-text" value="${link.text}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control quick-link-url" value="${link.link}">
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button type="button" class="btn btn-sm btn-danger delete-quick-link" data-index="${index}">删除</button>
                </div>
            `;
            container.appendChild(item);
            
            // 添加删除按钮事件
            item.querySelector('.delete-quick-link').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                footerData.quick_links.splice(index, 1);
                renderQuickLinks();
            });
        });
    }
    
    // 渲染解决方案链接
    function renderSolutionLinks() {
        const container = document.getElementById('solution-links-container');
        container.innerHTML = '';
        
        footerData.solution_links.forEach((link, index) => {
            const item = document.createElement('div');
            item.className = 'solution-link-item row g-3 mb-2';
            item.innerHTML = `
                <div class="col-md-5">
                    <label class="form-label">文本</label>
                    <input type="text" class="form-control solution-link-text" value="${link.text}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">链接</label>
                    <input type="text" class="form-control solution-link-url" value="${link.link}">
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button type="button" class="btn btn-sm btn-danger delete-solution-link" data-index="${index}">删除</button>
                </div>
            `;
            container.appendChild(item);
            
            // 添加删除按钮事件
            item.querySelector('.delete-solution-link').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                footerData.solution_links.splice(index, 1);
                renderSolutionLinks();
            });
        });
    }
    
    // 加载页脚数据
    async function loadFooterData() {
        try {
            const response = await fetch('../data/footer.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('加载页脚数据失败:', error);
            showAlert('danger', '加载页脚数据失败，请刷新页面重试！');
            return {
                company_info: '',
                social_links: [],
                quick_links: [],
                solution_links: [],
                contact_info: {
                    address: '',
                    phone: '',
                    email: '',
                    hours: ''
                },
                copyright: '',
                icp: ''
            };
        }
    }