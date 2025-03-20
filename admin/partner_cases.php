<?php
/**
 * 合作案例管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载合作案例数据
$partnerCases = json_decode(file_get_contents('../data/partner_cases.json'), true);
?>

<!-- 合作案例管理 -->
<div id="partner-cases-section" class="form-section">
    <h3>合作案例管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="partner-cases-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="partner-cases-title" value="<?php echo isset($partnerCases['title']) ? htmlspecialchars($partnerCases['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">案例列表</label>
                        <div id="partner-cases-container">
                            <!-- 案例项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-partner-case" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加合作案例
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-partner-cases" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化合作案例管理
    const casesTitle = document.getElementById('partner-cases-title');
    const casesContainer = document.getElementById('partner-cases-container');
    const addButton = document.getElementById('add-partner-case');
    const saveButton = document.getElementById('save-partner-cases');
    
    // 加载数据
    let partnerCasesData = <?php echo json_encode($partnerCases); ?>;
    
    // 渲染案例项
    function renderCaseItems() {
        casesContainer.innerHTML = '';
        
        partnerCasesData.cases.forEach((caseItem, index) => {
            const caseElement = document.createElement('div');
            caseElement.className = 'case-item mb-4';
            
            // 判断是单个合作伙伴还是多个合作伙伴
            let partnersHTML = '';
            if (caseItem.partners) {
                // 多个合作伙伴
                partnersHTML = `
                    <div class="mb-3">
                        <label class="form-label">合作伙伴</label>
                        <div class="partners-container" data-index="${index}">
                            ${caseItem.partners.map((partner, partnerIndex) => `
                                <div class="partner-item mb-2">
                                    <div class="row g-2">
                                        <div class="col-md-5">
                                            <input type="text" class="form-control partner-icon" placeholder="图标类名" value="${partner.icon}">
                                        </div>
                                        <div class="col-md-5">
                                            <input type="text" class="form-control partner-name" placeholder="合作伙伴名称" value="${partner.name}">
                                        </div>
                                        <div class="col-md-2">
                                            <button class="btn btn-danger btn-sm remove-partner" data-index="${partnerIndex}">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-sm btn-outline-secondary add-partner" data-index="${index}">
                            <i class="bi bi-plus"></i> 添加合作伙伴
                        </button>
                    </div>
                `;
            } else {
                // 单个合作伙伴
                partnersHTML = `
                    <div class="mb-3">
                        <label class="form-label">合作伙伴</label>
                        <div class="row g-2">
                            <div class="col-md-6">
                                <input type="text" class="form-control partner-icon" placeholder="图标类名" value="${caseItem.partner_icon || ''}">
                            </div>
                            <div class="col-md-6">
                                <input type="text" class="form-control partner-name" placeholder="合作伙伴名称" value="${caseItem.partner_name || ''}">
                            </div>
                        </div>
                    </div>
                `;
            }
            
            caseElement.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">案例 #${index + 1}</h5>
                        <button class="btn btn-danger btn-sm delete-case" data-index="${index}">
                            <i class="bi bi-trash"></i> 删除
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">图片路径</label>
                                    <input type="text" class="form-control case-image" value="${caseItem.image}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">标题</label>
                                    <input type="text" class="form-control case-title" value="${caseItem.title}">
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">描述</label>
                                    <textarea class="form-control case-description" rows="3">${caseItem.description}</textarea>
                                </div>
                            </div>
                            <div class="col-md-12">
                                ${partnersHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            casesContainer.appendChild(caseElement);
        });
        
        // 添加删除案例事件监听
        document.querySelectorAll('.delete-case').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                partnerCasesData.cases.splice(index, 1);
                renderCaseItems();
            });
        });
        
        // 添加删除合作伙伴事件监听
        document.querySelectorAll('.remove-partner').forEach(button => {
            button.addEventListener('click', function() {
                const caseIndex = parseInt(this.closest('.partners-container').getAttribute('data-index'));
                const partnerIndex = parseInt(this.getAttribute('data-index'));
                partnerCasesData.cases[caseIndex].partners.splice(partnerIndex, 1);
                renderCaseItems();
            });
        });
        
        // 添加新合作伙伴事件监听
        document.querySelectorAll('.add-partner').forEach(button => {
            button.addEventListener('click', function() {
                const caseIndex = parseInt(this.getAttribute('data-index'));
                if (!partnerCasesData.cases[caseIndex].partners) {
                    partnerCasesData.cases[caseIndex].partners = [];
                }
                partnerCasesData.cases[caseIndex].partners.push({
                    icon: 'bi bi-building',
                    name: '新合作伙伴'
                });
                renderCaseItems();
            });
        });
    }
    
    // 初始渲染
    renderCaseItems();
    
    // 添加新案例
    addButton.addEventListener('click', function() {
        partnerCasesData.cases.push({
            image: 'images/case1.jpg',
            title: '新合作案例',
            description: '案例描述内容',
            partner_icon: 'bi bi-building',
            partner_name: '合作伙伴'
        });
        renderCaseItems();
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        // 更新标题
        partnerCasesData.title = casesTitle.value;
        
        // 更新案例数据
        const caseItems = document.querySelectorAll('.case-item');
        partnerCasesData.cases = Array.from(caseItems).map((item, index) => {
            const caseData = {
                image: item.querySelector('.case-image').value,
                title: item.querySelector('.case-title').value,
                description: item.querySelector('.case-description').value
            };
            
            // 处理合作伙伴数据
            const partnersContainer = item.querySelector('.partners-container');
            if (partnersContainer) {
                // 多个合作伙伴
                const partnerItems = partnersContainer.querySelectorAll('.partner-item');
                caseData.partners = Array.from(partnerItems).map(partnerItem => {
                    return {
                        icon: partnerItem.querySelector('.partner-icon').value,
                        name: partnerItem.querySelector('.partner-name').value
                    };
                });
            } else {
                // 单个合作伙伴
                caseData.partner_icon = item.querySelector('.partner-icon').value;
                caseData.partner_name = item.querySelector('.partner-name').value;
            }
            
            return caseData;
        });
        
        // 发送到服务器
        try {
            const response = await fetch('api/partner_cases.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(partnerCasesData)
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