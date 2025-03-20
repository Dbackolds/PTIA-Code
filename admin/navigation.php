<?php
/**
 * 导航栏管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载导航栏数据
$navigation = json_decode(file_get_contents('../data/navigation.json'), true);
?>

<!-- 导航栏管理 -->
<div id="navigation-section" class="form-section active">
    <h3>导航栏管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="mb-3">主导航菜单</h4>
                    <div class="mb-3">
                        <div id="nav-items-container">
                            <!-- 主导航项将通过JavaScript动态添加 -->
                        </div>
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-success" id="add-nav-item">添加导航项</button>
                    </div>
                    
                    <hr class="my-4">
                    
                    <h4 class="mb-3">登录按钮</h4>
                    <div class="mb-3">
                        <div id="login-buttons-container">
                            <!-- 登录按钮将通过JavaScript动态添加 -->
                        </div>
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-success" id="add-login-button">添加按钮</button>
                    </div>
                    
                    <div class="mt-4">
                        <button type="button" class="btn btn-primary" id="save-navigation">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后直接初始化导航栏管理功能
document.addEventListener('DOMContentLoaded', function() {
    // 直接调用导航栏管理初始化函数
    if (typeof initNavigationManager === 'function') {
        initNavigationManager();
    } else {
        console.error('initNavigationManager函数未定义');
    }
});
</script>

<!-- 加载公共底部 -->
<?php require_once 'includes/footer.php'; ?>