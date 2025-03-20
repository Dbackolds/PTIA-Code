<?php
/**
 * 解决方案管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载解决方案数据
$solutions = json_decode(file_get_contents('../data/solutions.json'), true);
?>

<!-- 解决方案管理 -->
<div id="solutions-section" class="form-section">
    <h3>解决方案管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="solutions-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="solutions-title" value="<?php echo isset($solutions['title']) ? htmlspecialchars($solutions['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">解决方案列表</label>
                        <div id="solutions-container">
                            <!-- 解决方案项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-solution" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加解决方案
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-solutions" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化解决方案管理
    const solutionsTitle = document.getElementById('solutions-title');
    const solutionsContainer = document.getElementById('solutions-container');
    const addButton = document.getElementById('add-solution');
    const saveButton = document.getElementById('save-solutions');
    
    // 加载数据
    let solutionsData = <?php echo json_encode($solutions); ?>;
    
    // 渲染解决方案项
    function renderSolutionItems() {
        solutionsContainer.innerHTML = '';
        
        solutionsData.solutions.forEach((solution, index) => {
            const solutionItem = document.createElement('div');
            solutionItem.className = 'solution-item mb-4';
            solutionItem.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-11">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">图标</label>
                                <input type="text" class="form-control solution-icon" value="${solution.icon}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control solution-title" value="${solution.title}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">描述</label>
                                <textarea class="form-control solution-description" rows="2">${solution.description}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm delete-solution" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            solutionsContainer.appendChild(solutionItem);
        });
        
        // 添加删除事件监听
        document.querySelectorAll('.delete-solution').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                solutionsData.solutions.splice(index, 1);
                renderSolutionItems();
            });
        });
    }
    
    // 初始渲染
    renderSolutionItems();
    
    // 添加新解决方案
    addButton.addEventListener('click', function() {
        solutionsData.solutions.push({
            icon: 'bi bi-diagram-3',
            title: '新解决方案',
            description: '解决方案描述'
        });
        renderSolutionItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        solutionsData.title = solutionsTitle.value;
        
        // 更新解决方案数据
        const solutionItems = document.querySelectorAll('.solution-item');
        solutionItems.forEach((item, index) => {
            solutionsData.solutions[index] = {
                icon: item.querySelector('.solution-icon').value,
                title: item.querySelector('.solution-title').value,
                description: item.querySelector('.solution-description').value
            };
        });
        
        try {
            const response = await fetch('api/solutions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solutionsData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || '保存失败');
            }
            
            // 显示成功消息
            showAlert('success', '解决方案内容已成功保存！');
        } catch (error) {
            console.error('保存解决方案数据失败:', error);
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