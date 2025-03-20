<?php
/**
 * 公告管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载公告数据
$announcement = json_decode(file_get_contents('../data/announcement.json'), true);
?>

<!-- 公告管理 -->
<div id="announcement-section" class="form-section">
    <h3>公告管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="announcement-text" class="form-label">公告内容</label>
                        <textarea class="form-control" id="announcement-text" rows="3"><?php echo isset($announcement['text']) ? htmlspecialchars($announcement['text']) : ''; ?></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">预览</label>
                        <div class="content-preview announcement-preview"><?php echo isset($announcement['text']) ? htmlspecialchars($announcement['text']) : ''; ?></div>
                    </div>
                    <div class="action-buttons">
                        <button id="save-announcement" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化公告管理
    const announcementText = document.getElementById('announcement-text');
    const announcementPreview = document.querySelector('.announcement-preview');
    const saveButton = document.getElementById('save-announcement');
    
    // 实时预览
    announcementText.addEventListener('input', function() {
        announcementPreview.innerHTML = this.value;
    });
    
    // 保存更改
    saveButton.addEventListener('click', async function() {
        const announcementData = {
            text: announcementText.value
        };
        
        try {
            const response = await fetch('api/announcement.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(announcementData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || '保存失败');
            }
            
            // 显示成功消息
            showAlert('success', '公告内容已成功保存！');
        } catch (error) {
            console.error('保存公告数据失败:', error);
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