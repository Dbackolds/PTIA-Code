<?php
/**
 * 后台管理系统公共头部
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

// 获取当前页面文件名，用于高亮显示当前菜单
$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>内容管理 - 未来科技</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="../css/custom.css">
    <link rel="stylesheet" href="css/admin-styles.css">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 100;
            padding: 48px 0 0;
            box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
            background-color: #fff;
        }
        .sidebar-sticky {
            position: relative;
            top: 0;
            height: calc(100vh - 48px);
            padding-top: 0.5rem;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .nav-link {
            font-weight: 500;
            color: #333;
        }
        .nav-link.active {
            color: #0d6efd;
        }
        main {
            padding-top: 48px;
        }
        .form-section {
            display: none;
        }
        .form-section.active {
            display: block;
        }
        .content-preview {
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
            padding: 1rem;
        }
        .icon-preview {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .product-item, .feature-item, .case-item, .testimonial-item, .solution-item {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            margin-bottom: 1rem;
            padding: 1rem;
        }
        .action-buttons {
            text-align: right;
        }
    </style>
</head>
<body>
    <header class="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
            <img src="../images/logo-white.png" alt="未来科技" width="120">
        </a>
        <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="w-100"></div>
        <div class="navbar-nav">
            <div class="nav-item text-nowrap">
                <a class="nav-link px-3 text-white" href="logout.php" id="logout-btn">退出登录</a>
            </div>
        </div>
    </header>

    <div class="container-fluid">
        <div class="row">
            <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block sidebar collapse">
                <div class="sidebar-sticky pt-3">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'announcement' || $current_page == 'dashboard' ? 'active' : ''; ?>" href="announcement.php">
                                <i class="bi bi-megaphone me-2"></i>公告管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'banners' ? 'active' : ''; ?>" href="banners.php">
                                <i class="bi bi-images me-2"></i>轮播图管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'products' ? 'active' : ''; ?>" href="products.php">
                                <i class="bi bi-box me-2"></i>云产品管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'features' ? 'active' : ''; ?>" href="features.php">
                                <i class="bi bi-lightbulb me-2"></i>特性管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'cases' ? 'active' : ''; ?>" href="cases.php">
                                <i class="bi bi-briefcase me-2"></i>案例管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'testimonials' ? 'active' : ''; ?>" href="testimonials.php">
                                <i class="bi bi-chat-quote me-2"></i>评价管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'solutions' ? 'active' : ''; ?>" href="solutions.php">
                                <i class="bi bi-diagram-3 me-2"></i>解决方案管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'team_members' ? 'active' : ''; ?>" href="team_members.php">
                                <i class="bi bi-people me-2"></i>团队成员管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'company_history' ? 'active' : ''; ?>" href="company_history.php">
                                <i class="bi bi-clock-history me-2"></i>发展历程管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'footer' ? 'active' : ''; ?>" href="footer.php">
                                <i class="bi bi-layout-text-window-reverse me-2"></i>页脚管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'navigation' ? 'active' : ''; ?>" href="navigation.php">
                                <i class="bi bi-list me-2"></i>导航栏管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'strategic_partners' ? 'active' : ''; ?>" href="strategic_partners.php">
                                <i class="bi bi-people-fill me-2"></i>合作伙伴管理
                            </a>
                        </li>
0                        <li class="nav-item">
                            <a class="nav-link <?php echo $current_page == 'english_content' ? 'active' : ''; ?>" href="english_content.php">
                                <i class="bi bi-translate me-2"></i>英文内容管理
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">内容管理系统</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <div class="btn-group me-2">
                            <span class="text-muted">欢迎，<?php echo htmlspecialchars($username); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>