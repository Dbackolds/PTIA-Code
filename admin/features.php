<?php
/**
 * 特性管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载特性数据
$features = json_decode(file_get_contents('../data/features.json'), true);
?>

<!-- 特性管理 -->
<div id="features-section" class="form-section">
    <h3>特性管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="features-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="features-title" value="<?php echo isset($features['title']) ? htmlspecialchars($features['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">特性列表</label>
                        <div id="features-container">
                            <!-- 特性项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-feature" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加特性
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-features" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化特性管理
    const featuresTitle = document.getElementById('features-title');
    const featuresContainer = document.getElementById('features-container');
    const addButton = document.getElementById('add-feature');
    const saveButton = document.getElementById('save-features');
    
    // 加载数据
    let featuresData = <?php echo json_encode($features); ?>;
    
    // 渲染特性项
    function renderFeatureItems() {
        featuresContainer.innerHTML = '';
        
        featuresData.features.forEach((feature, index) => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item mb-4';
            featureItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-1">
                        <div class="icon-preview text-center">
                            <i class="${feature.icon}"></i>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">图标</label>
                                <input type="text" class="form-control feature-icon" value="${feature.icon}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control feature-title" value="${feature.title}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">描述</label>
                                <textarea class="form-control feature-description" rows="2">${feature.description}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm delete-feature" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            featuresContainer.appendChild(featureItem);
            
            // 更新图标预览
            const iconInput = featureItem.querySelector('.feature-icon');
            const iconPreview = featureItem.querySelector('.icon-preview i');
            
            iconInput.addEventListener('input', function() {
                iconPreview.className = this.value;
            });
        });
        
        // 添加删除事件监听
        document.querySelectorAll('.delete-feature').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                featuresData.features.splice(index, 1);
                renderFeatureItems();
            });
        });
    }
    
    // 初始渲染
    renderFeatureItems();
    
    // 添加新特性
    addButton.addEventListener('click', function() {
        featuresData.features.push({
            icon: 'bi bi-star',
            title: '新特性',
            description: '特性描述'
        });
        renderFeatureItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        featuresData.title = featuresTitle.value;
        
        // 更新特性数据
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            featuresData.features[index] = {
                icon: item.querySelector('.feature-icon').value,
                title: item.querySelector('.feature-title').value,
                description: item.querySelector('.feature-description').value
            };
        });
        
        try {
            const response = await fetch('api/features.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(featuresData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || '保存失败');
            }
            
            // 显示成功消息
            showAlert('success', '特性内容已成功保存！');
        } catch (error) {
            console.error('保存特性数据失败:', error);
            showAlert('danger', '保存失败，请重试！');
        }
    });
    
    // 显示提示信息
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
});
</script>

<?php
// 加载公共底部
require_once 'includes/footer.php';
?>