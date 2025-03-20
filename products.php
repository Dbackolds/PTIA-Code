<?php
/**
 * 云产品管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载云产品数据
$cloudProducts = json_decode(file_get_contents('../data/cloud_products.json'), true);
?>

<!-- 云产品管理 -->
<div id="products-section" class="form-section">
    <h3>云产品管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="products-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="products-title" value="<?php echo isset($cloudProducts['title']) ? htmlspecialchars($cloudProducts['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">产品列表</label>
                        <div id="products-container">
                            <!-- 产品项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-product" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加产品
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-products" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化云产品管理
    const productsTitle = document.getElementById('products-title');
    const productsContainer = document.getElementById('products-container');
    const addButton = document.getElementById('add-product');
    const saveButton = document.getElementById('save-products');
    
    // 加载数据
    let cloudProductsData = <?php echo json_encode($cloudProducts); ?>;
    
    // 渲染产品项
    function renderProductItems() {
        productsContainer.innerHTML = '';
        
        cloudProductsData.products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item mb-4';
            productItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-1">
                        <div class="icon-preview text-center">
                            <i class="${product.icon}"></i>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">图标</label>
                                <input type="text" class="form-control product-icon" value="${product.icon}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control product-title" value="${product.title}">
                            </div>
                            <div class="col-md-4">
                            <label class="form-label">描述</label>
                                <textarea class="form-control product-description" rows="2">${product.description}</textarea>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">链接</label>
                                <input type="text" class="form-control product-link" value="${product.link}">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm delete-product" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productItem);
            
            // 更新图标预览
            const iconInput = productItem.querySelector('.product-icon');
            const iconPreview = productItem.querySelector('.icon-preview i');
            
            iconInput.addEventListener('input', function() {
                iconPreview.className = this.value;
            });
        });
        
        // 添加删除事件监听
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cloudProductsData.products.splice(index, 1);
                renderProductItems();
            });
        });
    }
    
    // 初始渲染
    renderProductItems();
    
    // 添加新产品
    addButton.addEventListener('click', function() {
        cloudProductsData.products.push({
            icon: 'bi bi-box',
            title: '新产品',
            description: '产品描述',
            link: '#'
        });
        renderProductItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        cloudProductsData.title = productsTitle.value;
        
        // 更新产品数据
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach((item, index) => {
            cloudProductsData.products[index] = {
                icon: item.querySelector('.product-icon').value,
                title: item.querySelector('.product-title').value,
                description: item.querySelector('.product-description').value,
                link: item.querySelector('.product-link').value
            };
        });
        
        try {
            const response = await fetch('api/products.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cloudProductsData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || '保存失败');
            }
            
            // 显示成功消息
            showAlert('success', '云产品内容已成功保存！');
        } catch (error) {
            console.error('保存云产品数据失败:', error);
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