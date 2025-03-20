<?php
/**
 * 轮播图管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载轮播图数据
$banners = json_decode(file_get_contents('../data/banners.json'), true);
?>

<!-- 轮播图管理 -->
<div id="banners-section" class="form-section active">
    <h3>轮播图管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <div id="banners-container">
                            <!-- 轮播图项将通过JavaScript动态添加 -->
                        </div>
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-success" id="add-banner">添加轮播图</button>
                        <button type="button" class="btn btn-primary" id="save-banners">保存更改</button>
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
        // 加载轮播图数据
        bannersData = await loadBannersData();
        renderBannerItems();
        
        // 添加轮播图按钮点击事件
        document.getElementById('add-banner').addEventListener('click', function() {
            // 添加新的轮播图
            bannersData.banners.push({
                image: 'images/banner1.jpg',
                title: '新轮播图标题',
                description: '新轮播图描述',
                button1_text: '按钮1',
                button1_link: '#',
                button2_text: '按钮2',
                button2_link: '#'
            });
            
            // 重新渲染轮播图列表
            renderBannerItems();
        });
        
        // 保存轮播图按钮点击事件
        document.getElementById('save-banners').addEventListener('click', async function() {
            // 显示保存中提示
            showAlert('info', '正在保存轮播图数据...');
            
            try {
                // 收集表单数据
                const bannerItems = document.querySelectorAll('.banner-item');
                const banners = [];
                
                bannerItems.forEach(item => {
                    banners.push({
                        image: item.querySelector('.banner-image').value,
                        title: item.querySelector('.banner-title').value,
                        description: item.querySelector('.banner-description').value,
                        button1_text: item.querySelector('.banner-button1-text').value,
                        button1_link: item.querySelector('.banner-button1-link').value,
                        button2_text: item.querySelector('.banner-button2-text').value,
                        button2_link: item.querySelector('.banner-button2-link').value
                    });
                });
                
                // 更新数据
                bannersData.banners = banners;
                
                // 发送到服务器
                const response = await fetch('api/banners.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bannersData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert('success', result.message);
                } else {
                    showAlert('danger', result.message);
                }
            } catch (error) {
                console.error('保存轮播图数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    });
    
    // 渲染轮播图项
    function renderBannerItems() {
        const bannersContainer = document.getElementById('banners-container');
        bannersContainer.innerHTML = '';
        
        bannersData.banners.forEach((banner, index) => {
            const bannerItem = document.createElement('div');
            bannerItem.className = 'banner-item mb-4';
            bannerItem.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">轮播图 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-banner" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">图片路径</label>
                                <input type="text" class="form-control banner-image" value="${banner.image}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control banner-title" value="${banner.title}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">描述</label>
                                <input type="text" class="form-control banner-description" value="${banner.description}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">按钮1文本</label>
                                <input type="text" class="form-control banner-button1-text" value="${banner.button1_text}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">按钮1链接</label>
                                <input type="text" class="form-control banner-button1-link" value="${banner.button1_link}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">按钮2文本</label>
                                <input type="text" class="form-control banner-button2-text" value="${banner.button2_text}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">按钮2链接</label>
                                <input type="text" class="form-control banner-button2-link" value="${banner.button2_link}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            bannersContainer.appendChild(bannerItem);
            
            // 添加删除按钮事件
            bannerItem.querySelector('.delete-banner').addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                bannersData.banners.splice(index, 1);
                renderBannerItems();
            });
        });
    }
    
    // 加载轮播图数据
    async function loadBannersData() {
        try {
            const response = await fetch('../data/banners.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('加载轮播图数据失败:', error);
            showAlert('danger', '加载轮播图数据失败，请刷新页面重试！');
            return { banners: [] };
        }
    }
</script>