/**
 * 快速操作管理器
 * 用于管理仪表盘上的快速操作项目
 */

// 全局变量，保存当前的快速操作数据
let quickActionsData = {
    actions: []
};

/**
 * 显示提示消息
 * @param {string} title 标题
 * @param {string} message 消息内容
 * @param {string} type 消息类型 (success, info, warning, danger)
 */
function showToast(title, message, type) {
    console.log(`${title}: ${message} (${type})`);
    // 使用原生alert替代，避免递归调用
    alert(`${title}\n${message}`);
}

/**
 * 显示指定的内容区域
 * @param {string} section 需要显示的区域ID
 */
function showSection(section) {
    const sectionId = section + '-section';
    
    // 隐藏所有表单区域
    jQuery('.form-section').removeClass('active');
    
    // 显示指定区域
    jQuery('#' + sectionId).addClass('active');
    
    // 更新侧边栏导航激活状态
    jQuery('.sidebar-sticky .nav-link').removeClass('active');
    jQuery(`.sidebar-sticky .nav-link[data-section="${section}"]`).addClass('active');
}

/**
 * 初始化快速操作管理器
 */
function initQuickActionsManager() {
    console.log('初始化快速操作管理器');
    
    // 检查jQuery是否存在
    if (typeof jQuery === 'undefined') {
        console.error('快速操作管理器需要jQuery，但它未被加载');
        return;
    }
    
    const $ = jQuery;
    
    // 编辑按钮事件处理
    jQuery('#edit-quick-actions-btn').on('click', function() {
        console.log('编辑按钮被点击');
        // 切换视图
        jQuery('#quick-actions-view').hide();
        jQuery('#quick-actions-edit').show();
        
        // 加载所有可用操作并渲染编辑表单
        loadAllAvailableActions().then(allActions => {
            renderQuickActionsEditForm(allActions);
        }).catch(error => {
            showToast('错误', '加载可用操作失败', 'danger');
        });
    });
    
    // 取消按钮事件处理
    jQuery('#cancel-quick-actions-btn').on('click', function() {
        // 切换回查看模式
        jQuery('#quick-actions-edit').hide();
        jQuery('#quick-actions-view').show();
    });
    
    // 保存按钮事件处理
    jQuery('#save-quick-actions-btn').on('click', function() {
        // 收集选中的快速操作项
        const selectedActions = [];
        jQuery('.quick-action-checkbox:checked').each(function() {
            const id = jQuery(this).val();
            const title = jQuery(this).closest('.form-check').find('label').text().trim();
            const icon = jQuery(this).closest('.form-check').find('i').attr('class').replace('me-2', '').trim();
            
            selectedActions.push({
                id: id,
                title: title,
                icon: icon
            });
        });
        
        // 如果没有选择任何项，提示用户
        if (selectedActions.length === 0) {
            alert('请至少选择一个快速操作项');
            return;
        }
        
        // 验证选择的数量
        if (selectedActions.length > 5) {
            showToast('错误', '最多只能选择5个快速操作', 'danger');
            return;
        }
        
        // 更新数据
        quickActionsData.actions = selectedActions;
        
        // 使用localStorage保存数据
        try {
            localStorage.setItem('quickActionsData', JSON.stringify(quickActionsData));
            console.log('数据已保存到localStorage');
        } catch (e) {
            console.error('保存到localStorage失败:', e);
        }
        
        // 切回正常视图
        jQuery('#quick-actions-view').show();
        jQuery('#quick-actions-edit').hide();
        
        // 重新渲染快速操作
        renderQuickActions();
        showToast('成功', '快速操作设置保存成功', 'success');
    });
    
    // 加载快速操作数据
    loadQuickActions();
}

/**
 * 加载快速操作数据
 */
function loadQuickActions() {
    // 定义默认的快速操作数据
    const defaultActions = [
        {id: 'announcement', icon: 'bi-megaphone', title: '管理公告'},
        {id: 'banners', icon: 'bi-images', title: '管理轮播图'},
        {id: 'products', icon: 'bi-box', title: '管理云产品'},
        {id: 'team_members', icon: 'bi-people', title: '管理团队成员'},
        {id: 'company_history', icon: 'bi-clock-history', title: '管理发展历程'}
    ];
    
    // 尝试从localStorage加载数据
    try {
        const savedData = localStorage.getItem('quickActionsData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData && parsedData.actions && parsedData.actions.length > 0) {
                quickActionsData = parsedData;
                renderQuickActions();
                return;
            }
        }
    } catch (e) {
        console.error('从localStorage加载数据失败:', e);
    }
    
    // 如果localStorage中没有数据或加载失败，使用默认数据
    console.warn('使用默认的快速操作数据');
    quickActionsData = { actions: defaultActions };
    renderQuickActions();
}

/**
 * 加载所有可用的快速操作选项
 */
function loadAllAvailableActions() {
    return new Promise((resolve, reject) => {
        // 预定义的所有可用快速操作
        const allAvailableActions = [
            {id: 'announcement', icon: 'bi-megaphone', title: '管理公告'},
            {id: 'banners', icon: 'bi-images', title: '管理轮播图'},
            {id: 'products', icon: 'bi-box', title: '管理云产品'},
            {id: 'features', icon: 'bi-lightbulb', title: '管理特性'},
            {id: 'cases', icon: 'bi-briefcase', title: '管理案例'},
            {id: 'testimonials', icon: 'bi-chat-quote', title: '管理评价'},
            {id: 'solutions', icon: 'bi-diagram-3', title: '管理解决方案'},
            {id: 'strategic_partners', icon: 'bi-people-fill', title: '管理合作伙伴'},
            {id: 'partner_cases', icon: 'bi-file-earmark-text', title: '管理合作案例'},
            {id: 'team_members', icon: 'bi-people', title: '管理团队成员'},
            {id: 'company_history', icon: 'bi-clock-history', title: '管理发展历程'},
            {id: 'footer', icon: 'bi-layout-text-window-reverse', title: '管理页脚'},
            {id: 'navigation', icon: 'bi-list', title: '管理导航栏'}
        ];
        
        // 直接返回所有可用操作
        resolve(allAvailableActions);
    });
}

/**
 * 渲染快速操作列表
 */
function renderQuickActions() {
    const container = jQuery('#quick-actions-container');
    container.empty();
    
    // 渲染快速操作链接
    if (quickActionsData && quickActionsData.actions) {
        quickActionsData.actions.forEach(action => {
            const actionItem = jQuery(`
                <a href="#" data-section="${action.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <span><i class="bi ${action.icon} me-2"></i>${action.title}</span>
                    <i class="bi bi-chevron-right"></i>
                </a>
            `);
            container.append(actionItem);
        });
    }
    
    // 为新生成的链接添加事件
    container.find('a[data-section]').on('click', function(e) {
        e.preventDefault();
        const section = jQuery(this).data('section');
        showSection(section);
    });
}

/**
 * 渲染快速操作编辑表单
 */
function renderQuickActionsEditForm(allActions) {
    const editContainer = $('#quick-actions-edit-container');
    editContainer.empty();
    
    // 创建已选择操作的列表
    const selectedIds = quickActionsData.actions.map(action => action.id);
    const selectedCount = selectedIds.length;
    
    // 添加提示信息
    editContainer.append(`<p class="text-muted mb-3">选择想要在快速操作中显示的功能（最多5个）：<span class="badge bg-${selectedCount > 5 ? 'danger' : 'primary'}">${selectedCount}/5</span></p>`);
    
    // 创建可排序容器
    const sortableContainer = $('<div id="sortable-actions" class="mb-3"></div>');
    editContainer.append(sortableContainer);
    
    // 添加所有可用操作
    allActions.forEach(action => {
        const isChecked = selectedIds.includes(action.id);
        const isDisabled = !isChecked && selectedCount >= 5;
        
        const actionItem = jQuery(`
            <div class="form-check mb-2 draggable-item" data-id="${action.id}">
                <input class="form-check-input quick-action-checkbox" type="checkbox" value="${action.id}" id="action-${action.id}" 
                    ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                <label class="form-check-label d-flex align-items-center ${isDisabled ? 'text-muted' : ''}" for="action-${action.id}">
                    <i class="bi ${action.icon} me-2"></i>${action.title}
                    ${isChecked ? '<span class="ms-2 text-muted"><i class="bi bi-grip-vertical handle"></i></span>' : ''}
                </label>
            </div>
        `);
        sortableContainer.append(actionItem);
    });
    
    // 监听复选框变化，控制最大可选数量
    $('.quick-action-checkbox').on('change', function() {
        updateCheckboxesState();
        
        // 当选中状态改变时，添加或移除拖动手柄
        const checkboxId = $(this).attr('id');
        const label = $(`label[for="${checkboxId}"]`);
        
        if ($(this).is(':checked')) {
            if (!label.find('.handle').length) {
                label.append('<span class="ms-2 text-muted"><i class="bi bi-grip-vertical handle"></i></span>');
            }
        } else {
            label.find('.handle').parent().remove();
        }
    });
    
    // 实现拖拽排序功能
    makeEditListSortable();
}

/**
 * 更新复选框状态，控制最大可选数量
 */
function updateCheckboxesState() {
    const checkedCount = $('.quick-action-checkbox:checked').length;
    
    // 更新计数器
    $('#quick-actions-edit-container .badge')
        .text(checkedCount + '/5')
        .removeClass('bg-danger bg-primary bg-warning')
        .addClass(checkedCount > 5 ? 'bg-danger' : checkedCount === 5 ? 'bg-warning' : 'bg-primary');
    
    // 如果已选数量达到5个，禁用未选中的复选框
    if (checkedCount >= 5) {
        $('.quick-action-checkbox:not(:checked)').prop('disabled', true);
        $('.quick-action-checkbox:not(:checked)').closest('.form-check').find('label').addClass('text-muted');
    } else {
        // 否则启用所有复选框
        $('.quick-action-checkbox').prop('disabled', false);
        $('.form-check label').removeClass('text-muted');
    }
}

/**
 * 使编辑列表可拖拽排序
 */
function makeEditListSortable() {
    // 如果jQuery UI可用，使用Sortable功能
    if (jQuery.ui && jQuery.ui.sortable) {
        jQuery('#sortable-actions').sortable({
            handle: '.handle',
            axis: 'y',
            containment: 'parent',
            tolerance: 'pointer'
        });
    } else {
        // 如果jQuery UI不可用，使用HTML5原生拖拽API
        const sortableContainer = document.getElementById('sortable-actions');
        if (!sortableContainer) return;
        
        // 添加拖拽功能样式
        const style = document.createElement('style');
        style.textContent = `
            .draggable-item.dragging {
                opacity: 0.5;
                background-color: #f8f9fa;
            }
            .handle {
                cursor: grab;
            }
            .handle:active {
                cursor: grabbing;
            }
        `;
        document.head.appendChild(style);
        
        // 获取所有可拖拽项
        const draggableItems = sortableContainer.querySelectorAll('.draggable-item');
        
        draggableItems.forEach(item => {
            // 只对选中的项添加拖拽功能
            const checkbox = item.querySelector('.quick-action-checkbox');
            const handle = item.querySelector('.handle');
            
            if (checkbox && checkbox.checked && handle) {
                item.setAttribute('draggable', 'true');
                
                item.addEventListener('dragstart', function(e) {
                    this.classList.add('dragging');
                    e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
                    e.dataTransfer.effectAllowed = 'move';
                });
                
                item.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                });
                
                // 拖拽手柄控制
                handle.addEventListener('mousedown', function() {
                    item.setAttribute('draggable', 'true');
                });
                
                handle.addEventListener('mouseup', function() {
                    item.setAttribute('draggable', 'false');
                });
            }
        });
        
        // 拖拽放置区域处理
        sortableContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const draggingItem = document.querySelector('.dragging');
            if (!draggingItem) return;
            
            const closestItem = findClosestItem(e.clientY);
            if (closestItem) {
                sortableContainer.insertBefore(draggingItem, closestItem);
            } else {
                sortableContainer.appendChild(draggingItem);
            }
        });
        
        // 查找最近的元素
        function findClosestItem(yPosition) {
            const draggableItems = [...sortableContainer.querySelectorAll('.draggable-item:not(.dragging)')];
            
            return draggableItems.reduce((closest, item) => {
                const box = item.getBoundingClientRect();
                const offset = yPosition - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: item };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }
}

/**
 * 取消编辑快速操作
 */
function cancelQuickActionsEdit() {
    console.log('取消编辑');
    // 直接切换视图，不使用toggleQuickActionsEditMode以避免重新加载数据
    $('#quick-actions-view').show();
    $('#quick-actions-edit').hide();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查jQuery是否可用
    if (typeof jQuery === 'undefined') {
        console.error('快速操作管理器需要jQuery，但jQuery未能加载');
        return;
    }
    
    // 如果存在快速操作编辑按钮，则初始化管理器
    if (jQuery('#edit-quick-actions-btn').length > 0) {
        // 延迟初始化，确保DOM完全加载
        setTimeout(function() {
            initQuickActionsManager();
        }, 500);
    }
}); 