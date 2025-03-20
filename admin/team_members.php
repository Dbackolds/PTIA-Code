<?php
/**
 * 团队成员管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载团队成员数据
$team_members = json_decode(file_get_contents('../data/team_members.json'), true);
?>

<!-- 团队成员管理 -->
<div id="team-members-section" class="form-section">
    <h3>团队成员管理</h3>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="team-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="team-title" value="<?php echo isset($team_members['title']) ? htmlspecialchars($team_members['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <label for="team-description" class="form-label">描述</label>
                        <textarea class="form-control" id="team-description" rows="2"><?php echo isset($team_members['description']) ? htmlspecialchars($team_members['description']) : ''; ?></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">团队成员列表</label>
                        <div id="team-members-container">
                            <!-- 团队成员项将通过JavaScript动态添加-->
                        </div>
                        <button id="add-team-member" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加团队成员
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-team-members" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// 将PHP数据传递给JavaScript
const teamMembersData = <?php echo json_encode($team_members); ?>;
</script>

<!-- 引入Bootstrap和管理脚本-->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script type="module" src="js/main.js"></script>

<?php
// 加载公共底部
require_once 'includes/footer.php';
?> 
