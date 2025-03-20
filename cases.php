<?php
/**
 * 案例管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载案例数据
$caseStudies = json_decode(file_get_contents('../data/case_studies.json'), true);
?>

<!-- 案例管理 -->
<div id="cases-section" class="form-section">
    <h3>案例管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="cases-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="cases-title" value="<?php echo isset($caseStudies['title']) ? htmlspecialchars($caseStudies['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">案例列表</label>
                        <div id="cases-container">
                            <!-- 案例项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-case" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加案例
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-cases" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化案例管理
    const casesTitle = document.getElementById('cases-title');
    const casesContainer = document.getElementById('cases-container');
    const addButton = document.getElementById('add-case');
    const saveButton = document.getElementById('save-cases');
    
    // 加载数据
    let caseStudiesData = <?php echo json_encode($caseStudies); ?>;
    
    // 渲染案例项
    function renderCaseItems() {
        casesContainer.innerHTML = '';
        
        caseStudiesData.cases.forEach((caseItem, index) => {
            const caseElement = document.createElement('div');
            caseElement.className = 'case-item mb-4';
            caseElement.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-11">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">图片</label>
                                <input type="text" class="form-control case-image" value="${caseItem.image}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">标题</label>
                                <input type="text" class="form-control case-title" value="${caseItem.title}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">描述</label>
                                <textarea class="form-control case-description" rows="2">${caseItem.description}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm delete-case" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            casesContainer.appendChild(caseElement);
        });
        
        // 添加删除事件监听
        document.querySelectorAll('.delete-case').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                caseStudiesData.cases.splice(index, 1);
                renderCaseItems();
            });
        });
    }
    
    // 初始渲染
    renderCaseItems();
    
    // 添加新案例
    addButton.addEventListener('click', function() {
        caseStudiesData.cases.push({
            image: 'images/case1.jpg',
            title: '新案例',
            description: '案例描述'
        });
        renderCaseItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        caseStudiesData.title = casesTitle.value;
        
        // 更新案例数据
        const caseItems = document.querySelectorAll('.case-item');
        caseItems.forEach((item, index) => {
            caseStudiesData.cases[index] = {
                image: item.querySelector('.case-image').value,
                title: item.querySelector('.case-title').value,
                description: item.querySelector('.case-description').value
            };
        });
        
        try {
            const response = await fetch('api/cases.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(caseStudiesData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || '保存失败');
            }
            
            // 显示成功消息
            showAlert('success', '案例内容已成功保存！');
        } catch (error) {
            console.error('保存案例数据失败:', error);
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