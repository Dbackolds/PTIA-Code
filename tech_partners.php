<?php
/**
 * 技术合作伙伴管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载技术合作伙伴数据
$techPartners = json_decode(file_get_contents('../data/tech_partners.json'), true);
?>

<!-- 技术合作伙伴管理 -->
<div id="tech-partners-section" class="form-section">
    <h3>技术合作伙伴管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="tech-partners-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="tech-partners-title" value="<?php echo isset($techPartners['title']) ? htmlspecialchars($techPartners['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">合作伙伴列表</label>
                        <div id="tech-partners-container">
                            <!-- 合作伙伴项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-tech-partner" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加技术合作伙伴
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-tech-partners" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化技术合作伙伴管理
    const partnersTitle = document.getElementById('tech-partners-title');
    const partnersContainer = document.getElementById('tech-partners-container');
    const addButton = document.getElementById('add-tech-partner');
    const saveButton = document.getElementById('save-tech-partners');
    
    // 加载数据
    let techPartnersData = <?php echo json_encode($techPartners); ?>;
    
    // 渲染合作伙伴项
    function renderPartnerItems() {
        partnersContainer.innerHTML = '';
        
        techPartnersData.partners.forEach((partner, index) => {
            const partnerElement = document.createElement('div');
            partnerElement.className = 'partner-item mb-4';
            partnerElement.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-11">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">图标</label>
                                <input type="text" class="form-control partner-icon" value="${partner.icon}">
                            </div>
                            <div class="col-md-8">
                                <label class="form-label">名称</label>
                                <input type="text" class="form-control partner-name" value="${partner.name}">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm delete-partner" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            partnersContainer.appendChild(partnerElement);
        });
        
        // 添加删除事件监听
        document.querySelectorAll('.delete-partner').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                techPartnersData.partners.splice(index, 1);
                renderPartnerItems();
            });
        });
    }
    
    // 初始渲染
    renderPartnerItems();
    
    // 添加新合作伙伴
    addButton.addEventListener('click', function() {
        techPartnersData.partners.push({
            icon: 'bi bi-cpu',
            name: '新技术合作伙伴'
        });
        renderPartnerItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        techPartnersData.title = partnersTitle.value;
        
        // 更新合作伙伴数据
        const partnerItems = document.querySelectorAll('.partner-item');
        techPartnersData.partners = Array.from(partnerItems).map((item, index) => {
            return {
                icon: item.querySelector('.partner-icon').value,
                name: item.querySelector('.partner-name').value
            };
        });
        
        // 发送到服务器
        try {
            const response = await fetch('api/tech_partners.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(techPartnersData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('success', result.message);
            } else {
                showAlert('danger', result.message);
            }
        } catch (error) {
            console.error('保存失败:', error);
            showAlert('danger', '保存失败，请重试！');
        }
    });
});
</script>