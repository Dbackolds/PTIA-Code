<?php
/**
 * 发展历程管理页面
 */

// 启动会话
session_start();

// 检查是否已登录
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // 未登录，重定向到登录页面
    header('Location: /admin/login.php');
    exit;
}

// 获取用户名
$username = isset($_SESSION['admin_username']) ? $_SESSION['admin_username'] : 'Admin';
?>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>发展历程管理 - 管理面板</title>
    <!-- Bootstrap CSS -->
    <link href="css/vendor/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="css/vendor/font-awesome.min.css">
    <!-- 自定义样式 -->
    <link rel="stylesheet" href="includes/css/admin.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <div class="container-fluid">
        <div class="row">
            <?php include 'includes/sidebar.php'; ?>
            
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">发展历程管理</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <button id="save-history" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <form id="history-form">
                            <div class="mb-3">
                                <label for="history-title" class="form-label">标题</label>
                                <input type="text" class="form-control" id="history-title" placeholder="输入发展历程标题">
                            </div>
                            <div class="mb-3">
                                <label for="history-description" class="form-label">描述</label>
                                <textarea class="form-control" id="history-description" rows="2" placeholder="输入发展历程描述"></textarea>
                            </div>
                            
                            <h5 class="mt-4 mb-3">里程碑</h5>
                            <div id="milestones-container" class="mb-3">
                                <!-- 里程碑条目将由JS动态添加 -->
                            </div>
                            <button type="button" id="add-milestone" class="btn btn-success">添加里程碑</button>
                        </form>
                    </div>
                </div>
                
                <?php include 'includes/footer.php'; ?>
            </main>
        </div>
    </div>
    
    <!-- 里程碑模板 -->
    <template id="milestone-template">
        <div class="milestone-item card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between mb-3">
                    <h6 class="card-title">里程碑</h6>
                    <button type="button" class="btn btn-sm btn-danger remove-milestone">删除</button>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">年份</label>
                        <input type="text" class="form-control milestone-year" placeholder="例如: 2010">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">标签</label>
                        <input type="text" class="form-control milestone-label" placeholder="例如: 起步">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">标题</label>
                    <input type="text" class="form-control milestone-title" placeholder="例如: 公司成立">
                </div>
                <div class="mb-3">
                    <label class="form-label">内容</label>
                    <textarea class="form-control milestone-content" rows="3" placeholder="输入里程碑详细内容"></textarea>
                </div>
            </div>
        </div>
    </template>
    
    <!-- jQuery -->
    <script src="js/vendor/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <!-- 自定义脚本 -->
    <script src="js/utils.js"></script>
    <script src="js/data-loader.js"></script>
    <script src="js/data-saver.js"></script>
    <script src="js/company-history-manager.js"></script>
</body>
</html>
