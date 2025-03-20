/**
 * 团队成员管理模块
 */

import { showAlert } from './utils.js';
import { loadTeamMembersData } from './data-loader.js';
import { saveTeamMembersData } from './data-saver.js';

// 全局变量
let teamMembersData = null;

/**
 * 初始化团队成员管理
 */
function initTeamMembersManager() {
    const teamMembersContainer = document.getElementById('team-members-container');
    const teamTitle = document.getElementById('team-title');
    const teamDescription = document.getElementById('team-description');
    const addButton = document.getElementById('add-team-member');
    const saveButton = document.getElementById('save-team-members');
    
    // 社交媒体平台选项
    const socialMediaOptions = [
        { value: 'QQ', text: 'QQ', icon: 'bi-chat-fill' },
        { value: 'WeChat', text: '微信', icon: 'bi-wechat' },
        { value: 'LinkedIn', text: '领英', icon: 'bi-linkedin' },
        { value: 'GitHub', text: 'GitHub', icon: 'bi-github' },
        { value: 'Weibo', text: '微博', icon: 'bi-sina-weibo' }
    ];
    
    // 加载数据
    loadTeamMembersData().then(data => {
        if (data) {
            teamMembersData = data;
            renderTeamMemberItems();
            
            // 设置标题和描述
            if (teamTitle) teamTitle.value = teamMembersData.title || '';
            if (teamDescription) teamDescription.value = teamMembersData.description || '';
        }
    });
    
    // 生成社交媒体选择下拉菜单的HTML
    function generateSocialMediaSelectHtml(selectedValue) {
        return socialMediaOptions.map(option => 
            `<option value="${option.value}" ${option.value === selectedValue ? 'selected' : ''}>${option.text}</option>`
        ).join('');
    }
    
    // 渲染团队成员项
    function renderTeamMemberItems() {
        if (!teamMembersContainer || !teamMembersData || !teamMembersData.members) return;
        
        teamMembersContainer.innerHTML = '';
        
        teamMembersData.members.forEach((member, index) => {
            const memberItem = document.createElement('div');
            memberItem.className = 'team-member-item mb-4';
            memberItem.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">成员 #${index + 1}</h5>
                        <button type="button" class="btn btn-sm btn-danger delete-team-member" data-index="${index}">删除</button>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">头像</label>
                                <input type="text" class="form-control team-member-avatar" value="${member.avatar || ''}">
                                <small class="text-muted">图片路径，例如：images/avatar1.jpg</small>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">姓名</label>
                                <input type="text" class="form-control team-member-name" value="${member.name || ''}">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">职位</label>
                                <input type="text" class="form-control team-member-position" value="${member.position || ''}">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">个人简介</label>
                                <textarea class="form-control team-member-description" rows="2">${member.description || ''}</textarea>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">社交媒体类型</label>
                                <select class="form-select team-member-social-type">
                                    ${generateSocialMediaSelectHtml(member.social_type || 'QQ')}
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">社交媒体链接</label>
                                <input type="text" class="form-control team-member-social-media" value="${member.social_media || '#'}">
                                <small class="text-muted">社交媒体账号链接或ID</small>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">邮箱</label>
                                <input type="text" class="form-control team-member-email" value="${member.email || '#'}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            teamMembersContainer.appendChild(memberItem);
        });
        
        // 添加删除按钮事件监听
        document.querySelectorAll('.delete-team-member').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (teamMembersData.members) {
                    teamMembersData.members.splice(index, 1);
                    renderTeamMemberItems();
                }
            });
        });
    }
    
    // 添加团队成员按钮点击事件
    if (addButton) {
        addButton.addEventListener('click', function() {
            // 获取新成员ID
            const newMemberId = teamMembersData.members.length > 0 ? 
                Math.max(...teamMembersData.members.map(m => m.id || 0)) + 1 : 1;
                
            // 创建新成员对象
            const newMember = {
                id: newMemberId,
                avatar: 'images/avatar1.jpg',
                name: '新成员',
                position: '职位',
                description: '个人简介',
                social_type: 'QQ',
                social_media: '#',
                email: '#'
            };
            
            // 添加到数据中
            teamMembersData.members.push(newMember);
            
            // 重新渲染
            renderTeamMemberItems();
        });
    }
    
    // 保存团队成员按钮点击事件
    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            // 显示保存中提示
            showAlert('info', '正在保存团队成员数据...');
            
            try {
                // 更新标题和描述
                if (teamTitle) teamMembersData.title = teamTitle.value;
                if (teamDescription) teamMembersData.description = teamDescription.value;
                
                // 收集表单数据
                const memberItems = document.querySelectorAll('.team-member-item');
                const members = [];
                
                memberItems.forEach((item, index) => {
                    members.push({
                        id: index + 1,
                        avatar: item.querySelector('.team-member-avatar').value,
                        name: item.querySelector('.team-member-name').value,
                        position: item.querySelector('.team-member-position').value,
                        description: item.querySelector('.team-member-description').value,
                        social_type: item.querySelector('.team-member-social-type').value,
                        social_media: item.querySelector('.team-member-social-media').value,
                        email: item.querySelector('.team-member-email').value
                    });
                });
                
                // 更新数据
                teamMembersData.members = members;
                
                // 保存数据
                const success = await saveTeamMembersData(teamMembersData);
                
                if (success) {
                    showAlert('success', '团队成员数据保存成功！');
                } else {
                    showAlert('danger', '保存失败，请重试！');
                }
            } catch (error) {
                console.error('保存团队成员数据失败:', error);
                showAlert('danger', '保存失败，请重试！');
            }
        });
    }
}

export { initTeamMembersManager }; 