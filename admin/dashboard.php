<?php
/**
 * 管理面板 - 内容管理系统
 */

// 设置时区为北京时间
date_default_timezone_set('Asia/Shanghai');

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

// 生成最近活动日志
function generateRecentActivities() {
    global $username;  // 获取全局变量中的用户名
    $activities = [];
    
    // 获取data目录下所有JSON文件的修改时间
    $dataDir = '../data/';
    $files = glob($dataDir . '*.json');
    
    foreach ($files as $file) {
        $filename = basename($file);
        $modTime = filemtime($file);
        $prettyName = str_replace('_', ' ', pathinfo($filename, PATHINFO_FILENAME));
        $prettyName = ucwords($prettyName);
        
        $activities[] = [
            'type' => '更新',
            'module' => $prettyName,
            'time' => $modTime,
            'user' => $username  // 使用登录用户的用户名
        ];
    }
    
    // 按时间排序
    usort($activities, function($a, $b) {
        return $b['time'] - $a['time'];
    });
    
    // 只返回最近的10条
    return array_slice($activities, 0, 10);
}

$recentActivities = generateRecentActivities();

// 加载数据
$announcement = json_decode(file_get_contents('../data/announcement.json'), true);
$cloudProducts = json_decode(file_get_contents('../data/cloud_products.json'), true);
$features = json_decode(file_get_contents('../data/features.json'), true);
$caseStudies = json_decode(file_get_contents('../data/case_studies.json'), true);
$testimonials = json_decode(file_get_contents('../data/testimonials.json'), true);
$solutions = json_decode(file_get_contents('../data/solutions.json'), true);
$banners = json_decode(file_get_contents('../data/banners.json'), true);
$footer = json_decode(file_get_contents('../data/footer.json'), true);
$navigation = json_decode(file_get_contents('../data/navigation.json'), true);
$strategicPartners = json_decode(file_get_contents('../data/strategic_partners.json'), true);
$techPartners = json_decode(file_get_contents('../data/tech_partners.json'), true);
$partnerCases = json_decode(file_get_contents('../data/partner_cases.json'), true);
$team_members = json_decode(file_get_contents('../data/team_members.json'), true);

// 加载发展历程数据
$companyHistory = [];
if (file_exists('../data/company_history.json')) {
    $companyHistory = json_decode(file_get_contents('../data/company_history.json'), true);
}

// 加载英文内容数据
$bannersEn = [];
$announcementEn = [];
$caseStudiesEn = [];
$cloudProductsEn = [];
$companyHistoryEn = [];
$featuresEn = [];
$footerEn = [];
$navigationEn = [];
$partnerCasesEn = [];
$solutionsEn = [];
$strategicPartnersEn = [];
$teamMembersEn = [];
$techPartnersEn = [];
$testimonialsEn = [];

// 检查并加载英文内容文件
if (file_exists('../data/banners_en.json')) {
    $bannersEn = json_decode(file_get_contents('../data/banners_en.json'), true);
}
if (file_exists('../data/announcement_en.json')) {
    $announcementEn = json_decode(file_get_contents('../data/announcement_en.json'), true);
}
if (file_exists('../data/case_studies_en.json')) {
    $caseStudiesEn = json_decode(file_get_contents('../data/case_studies_en.json'), true);
}
if (file_exists('../data/cloud_products_en.json')) {
    $cloudProductsEn = json_decode(file_get_contents('../data/cloud_products_en.json'), true);
}
if (file_exists('../data/company_history_en.json')) {
    $companyHistoryEn = json_decode(file_get_contents('../data/company_history_en.json'), true);
}
if (file_exists('../data/features_en.json')) {
    $featuresEn = json_decode(file_get_contents('../data/features_en.json'), true);
}
if (file_exists('../data/footer_en.json')) {
    $footerEn = json_decode(file_get_contents('../data/footer_en.json'), true);
}
if (file_exists('../data/navigation_en.json')) {
    $navigationEn = json_decode(file_get_contents('../data/navigation_en.json'), true);
}
if (file_exists('../data/partner_cases_en.json')) {
    $partnerCasesEn = json_decode(file_get_contents('../data/partner_cases_en.json'), true);
}
if (file_exists('../data/solutions_en.json')) {
    $solutionsEn = json_decode(file_get_contents('../data/solutions_en.json'), true);
}
if (file_exists('../data/strategic_partners_en.json')) {
    $strategicPartnersEn = json_decode(file_get_contents('../data/strategic_partners_en.json'), true);
}
if (file_exists('../data/team_members_en.json')) {
    $teamMembersEn = json_decode(file_get_contents('../data/team_members_en.json'), true);
}
if (file_exists('../data/tech_partners_en.json')) {
    $techPartnersEn = json_decode(file_get_contents('../data/tech_partners_en.json'), true);
}
if (file_exists('../data/testimonials_en.json')) {
    $testimonialsEn = json_decode(file_get_contents('../data/testimonials_en.json'), true);
}

/**
 * 安全获取数据计数，处理多种可能的数据格式
 * @param mixed $data 数据
 * @param string|null $itemsKey 如果数据是关联数组且包含项目列表的键名
 * @return int 计数结果
 */
function safeCount($data, $itemsKey = 'items') {
    if (!$data) {
        return 0;
    }
    
    // 如果数据直接就是数组（不是关联数组）
    if (isset($data[0]) || empty($data)) {
        return count($data);
    }
    
    // 如果数据是包含items键的关联数组
    if ($itemsKey && isset($data[$itemsKey])) {
        return count($data[$itemsKey]);
    }
    
    // 尝试从关联数组找到第一个是数组的值
    foreach ($data as $key => $value) {
        if (is_array($value)) {
            return count($value);
        }
    }
    
    // 最后返回关联数组的键数量
    return count(array_keys($data));
}

// 计算各类数据数量
$cloudProductsCount = safeCount($cloudProducts);
$featuresCount = safeCount($features);
$caseStudiesCount = safeCount($caseStudies);
$solutionsCount = safeCount($solutions);
$testimonialsCount = safeCount($testimonials);
$bannersCount = safeCount($banners, null); // banners可能直接是数组
$strategicPartnersCount = safeCount($strategicPartners, null);
$techPartnersCount = safeCount($techPartners, null);
$partnersCount = $strategicPartnersCount + $techPartnersCount;
$teamMembersCount = safeCount($team_members, 'members');
$partnerCasesCount = safeCount($partnerCases);
$companyHistoryCount = safeCount($companyHistory, 'milestones'); // 发展历程里程碑数量
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>内容管理 - 像素科技</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/custom.css">
    <link rel="stylesheet" href="../css/bootstrap-icons/bootstrap-icons.css">
    <link href="../css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <!-- 使用CDN加载jQuery和Chart.js -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <script src="js/quick-actions-manager.js"></script>
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
            -webkit-overflow-scrolling: touch; /* 增强iOS上的滚动体验 */
            scrollbar-width: thin; /* Firefox滚动条样式 */
        }
        /* 定制滚动条样式 */
        .sidebar-sticky::-webkit-scrollbar {
            width: 5px;
        }
        .sidebar-sticky::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .sidebar-sticky::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        .sidebar-sticky::-webkit-scrollbar-thumb:hover {
            background: #555;
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
        .navbar-toggler {
            position: relative;
            margin-right: 10px;
        }
        @media (max-width: 767.98px) {
            .navbar-toggler {
                position: absolute;
                right: 10px;
                top: 10px;
            }
            .sidebar {
                width: 100%;
                height: 100%;
                overflow-y: auto;
            }
            .sidebar-sticky {
                height: auto;
                max-height: calc(100vh - 56px);
                overflow-y: auto;
            }
        }
        
        /* 确保标签页内容不重叠 */
        .tab-content > .tab-pane {
            display: none;
        }
        .tab-content > .active {
            display: block;
        }
        
        /* 确保表单区域正确显示 */
        .form-section {
            display: none;
        }
        .form-section.active {
            display: block;
        }
        
        /* 拖拽排序样式 */
        .draggable-item {
            cursor: default;
            transition: background-color 0.2s ease;
        }
        .draggable-item.ui-sortable-helper,
        .draggable-item.dragging {
            background-color: #f8f9fa;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            border-radius: 4px;
        }
        .handle {
            cursor: grab;
            color: #6c757d;
        }
        .handle:active {
            cursor: grabbing;
        }
        #sortable-actions .form-check {
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid transparent;
        }
        #sortable-actions .form-check:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
        }
    </style>
</head>
<body>
    <header class="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
            <img src="../images/logo-white.png" alt="像素科技" width="120">
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
                            <a class="nav-link active" href="#" data-section="dashboard">
                                <i class="bi bi-speedometer2 me-2"></i>仪表盘
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="announcement">
                                <i class="bi bi-megaphone me-2"></i>公告管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="banners">
                                <i class="bi bi-images me-2"></i>轮播图管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="products">
                                <i class="bi bi-box me-2"></i>云产品管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="features">
                                <i class="bi bi-lightbulb me-2"></i>特性管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="cases">
                                <i class="bi bi-briefcase me-2"></i>案例管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="testimonials">
                                <i class="bi bi-chat-quote me-2"></i>评价管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="solutions">
                                <i class="bi bi-diagram-3 me-2"></i>解决方案管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="strategic_partners">
                                <i class="bi bi-people-fill me-2"></i>合作伙伴管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="partner_cases">
                                <i class="bi bi-file-earmark-text me-2"></i>合作案例管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="team_members">
                                <i class="bi bi-people me-2"></i>团队成员管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="company_history">
                                <i class="bi bi-clock-history me-2"></i>发展历程管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="footer">
                                <i class="bi bi-layout-text-window-reverse me-2"></i>页脚管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="navigation">
                                <i class="bi bi-list me-2"></i>导航栏管理
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-section="english_content">
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

                <!-- 仪表盘内容区域 -->
                <div id="dashboard-section" class="form-section active">
                    <h3 class="mb-4">系统概览</h3>
                    
                    <!-- 数据统计卡片 -->
                    <div class="row mb-4">
                        <div class="col-md-3 col-sm-6 mb-3">
                            <div class="card border-primary h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-box-seam fs-1 text-primary mb-2"></i>
                                    <h5 class="card-title">云产品模块</h5>
                                    <p class="card-text h3"><?php echo $cloudProductsCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-lightbulb fs-1 text-success mb-2"></i>
                                    <h5 class="card-title">特性模块</h5>
                                    <p class="card-text h3"><?php echo $featuresCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 mb-3">
                            <div class="card border-info h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-briefcase fs-1 text-info mb-2"></i>
                                    <h5 class="card-title">案例模块</h5>
                                    <p class="card-text h3"><?php echo $caseStudiesCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 mb-3">
                            <div class="card border-warning h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-diagram-3 fs-1 text-warning mb-2"></i>
                                    <h5 class="card-title">解决方案模块</h5>
                                    <p class="card-text h3"><?php echo $solutionsCount; ?></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 统计图表 -->
                    <div class="row mb-4">
                        <!-- 模块分布饼图 -->
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>内容模块分布</h5>
                                </div>
                                <div class="card-body d-flex justify-content-center">
                                    <div style="height: 300px; width: 100%;">
                                        <canvas id="modulesDistributionChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 内容增长柱状图 -->
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-bar-chart me-2"></i>模块内容数量比较</h5>
                                </div>
                                <div class="card-body">
                                    <canvas id="moduleContentsChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 第二行统计卡片 -->
                    <div class="row mb-4">
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-secondary h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-images fs-1 text-secondary mb-2"></i>
                                    <h5 class="card-title">轮播图</h5>
                                    <p class="card-text h3"><?php echo $bannersCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-danger h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-chat-quote fs-1 text-danger mb-2"></i>
                                    <h5 class="card-title">客户评价</h5>
                                    <p class="card-text h3"><?php echo $testimonialsCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-dark h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-people-fill fs-1 text-dark mb-2"></i>
                                    <h5 class="card-title">合作伙伴</h5>
                                    <p class="card-text h3"><?php echo $partnersCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-primary h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-people fs-1 text-primary mb-2"></i>
                                    <h5 class="card-title">团队成员</h5>
                                    <p class="card-text h3"><?php echo $teamMembersCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-info h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-file-earmark-text fs-1 text-info mb-2"></i>
                                    <h5 class="card-title">合作案例</h5>
                                    <p class="card-text h3"><?php echo $partnerCasesCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-clock-history fs-1 text-success mb-2"></i>
                                    <h5 class="card-title">发展里程碑</h5>
                                    <p class="card-text h3"><?php echo $companyHistoryCount; ?></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <i class="bi bi-database-check fs-1 text-success mb-2"></i>
                                    <h5 class="card-title">总模块数</h5>
                                    <p class="card-text h3"><?php echo $cloudProductsCount + $featuresCount + $caseStudiesCount + $solutionsCount + $testimonialsCount + $bannersCount + $partnersCount + $teamMembersCount + $partnerCasesCount + $companyHistoryCount; ?></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 系统信息和快速操作 -->
                    <div class="row">
                        <!-- 系统信息 -->
                        <div class="col-md-7 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>系统信息</h5>
                                </div>
                                <div class="card-body">
                                    <table class="table table-striped">
                                        <tbody>
                                            <tr>
                                                <th>PHP 版本</th>
                                                <td><?php echo phpversion(); ?></td>
                                            </tr>
                                            <tr>
                                                <th>服务器软件</th>
                                                <td><?php echo $_SERVER['SERVER_SOFTWARE']; ?></td>
                                            </tr>
                                            <tr>
                                                <th>操作系统</th>
                                                <td><?php echo php_uname('s') . ' ' . php_uname('r'); ?></td>
                                            </tr>
                                            <tr>
                                                <th>数据存储路径</th>
                                                <td>../data/</td>
                                            </tr>
                                            <tr>
                                                <th>当前时间</th>
                                                <td><?php echo date('Y-m-d H:i:s'); ?></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 快速操作 -->
                        <div class="col-md-5 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0"><i class="bi bi-lightning-charge me-2"></i>快速操作</h5>
                                    <button id="edit-quick-actions-btn" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-pencil-square"></i> 编辑
                                    </button>
                                </div>
                                <div class="card-body">
                                    <!-- 正常查看模式 -->
                                    <div id="quick-actions-view">
                                        <div id="quick-actions-container" class="list-group">
                                            <?php
                                            // 加载快速操作配置
                                            $quickActions = [];
                                            if (file_exists('../data/quick_actions.json')) {
                                                $quickActions = json_decode(file_get_contents('../data/quick_actions.json'), true);
                                            }
                                            
                                            // 如果没有配置或配置无效，使用默认配置
                                            if (!isset($quickActions['actions']) || !is_array($quickActions['actions']) || empty($quickActions['actions'])) {
                                                $quickActions = [
                                                    'actions' => [
                                                        ['id' => 'announcement', 'icon' => 'bi-megaphone', 'title' => '管理公告'],
                                                        ['id' => 'banners', 'icon' => 'bi-images', 'title' => '管理轮播图'],
                                                        ['id' => 'products', 'icon' => 'bi-box', 'title' => '管理云产品'],
                                                        ['id' => 'team_members', 'icon' => 'bi-people', 'title' => '管理团队成员'],
                                                        ['id' => 'company_history', 'icon' => 'bi-clock-history', 'title' => '管理发展历程'],
                                                        ['id' => 'footer', 'icon' => 'bi-layout-text-window-reverse', 'title' => '管理页脚']
                                                    ]
                                                ];
                                            }
                                            
                                            // 显示快速操作
                                            foreach ($quickActions['actions'] as $action) {
                                                echo '<a href="#" data-section="' . $action['id'] . '" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">';
                                                echo '<span><i class="bi ' . $action['icon'] . ' me-2"></i>' . $action['title'] . '</span>';
                                                echo '<i class="bi bi-chevron-right"></i>';
                                                echo '</a>';
                                            }
                                            ?>
                                        </div>
                                    </div>
                                    
                                    <!-- 编辑模式 -->
                                    <div id="quick-actions-edit" style="display: none;">
                                        <div class="mb-3">
                                            <div id="quick-actions-edit-container">
                                                <!-- 这里将动态加载所有可用操作 -->
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <button id="cancel-quick-actions-btn" class="btn btn-secondary me-2">取消</button>
                                            <button id="save-quick-actions-btn" class="btn btn-primary">保存</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 最近活动日志（新增加的面板） -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>最近活动</h5>
                                </div>
                                <div class="card-body p-0">
                                    <div class="table-responsive">
                                        <table class="table table-hover mb-0">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>活动类型</th>
                                                    <th>模块</th>
                                                    <th>时间</th>
                                                    <th>用户</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php foreach ($recentActivities as $activity): ?>
                                                <tr>
                                                    <td>
                                                        <span class="badge bg-primary"><?php echo htmlspecialchars($activity['type']); ?></span>
                                                    </td>
                                                    <td><?php echo htmlspecialchars($activity['module']); ?></td>
                                                    <td><?php echo date('Y-m-d H:i:s', $activity['time']); ?></td>
                                                    <td><?php echo htmlspecialchars($activity['user']); ?></td>
                                                </tr>
                                                <?php endforeach; ?>
                                                <?php if (empty($recentActivities)): ?>
                                                <tr>
                                                    <td colspan="4" class="text-center">暂无活动记录</td>
                                                </tr>
                                                <?php endif; ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 系统状态监控 -->
                    <div class="row mb-4">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-activity me-2"></i>系统状态监控</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <!-- CPU负载 -->
                                        <div class="col-md-4 col-sm-6 mb-3">
                                            <div class="card border-success h-100">
                                                <div class="card-body">
                                                    <h5 class="card-title text-center">
                                                        <i class="bi bi-cpu fs-3 text-success"></i>
                                                        <span class="ms-2">服务器负载</span>
                                                    </h5>
                                                    <?php
                                                    if (function_exists('sys_getloadavg')) {
                                                        $load = sys_getloadavg();
                                                        $loadPercent = min(100, $load[0] * 100 / 4); // 假设4核CPU
                                                    } else {
                                                        $loadPercent = rand(10, 30); // 随机值用于演示
                                                        $load = [$loadPercent / 25, 0, 0];
                                                    }
                                                    ?>
                                                    <div class="progress mb-2" style="height: 20px;">
                                                        <div class="progress-bar bg-success" 
                                                             role="progressbar" 
                                                             style="width: <?php echo $loadPercent; ?>%;" 
                                                             aria-valuenow="<?php echo $loadPercent; ?>" 
                                                             aria-valuemin="0" 
                                                             aria-valuemax="100">
                                                            <?php echo number_format($loadPercent, 1); ?>%
                                                        </div>
                                                    </div>
                                                    <div class="text-center text-muted">
                                                        负载值: <?php echo number_format($load[0], 2); ?> (1分钟) | 
                                                        <?php echo number_format($load[1], 2); ?> (5分钟)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- 内存使用 -->
                                        <div class="col-md-4 col-sm-6 mb-3">
                                            <div class="card border-primary h-100">
                                                <div class="card-body">
                                                    <h5 class="card-title text-center">
                                                        <i class="bi bi-memory fs-3 text-primary"></i>
                                                        <span class="ms-2">内存使用率</span>
                                                    </h5>
                                                    <?php
                                                    if (function_exists('memory_get_usage')) {
                                                        $memoryUsage = memory_get_usage();
                                                        $memoryLimit = ini_get('memory_limit');
                                                        if (preg_match('/^(\d+)(.)$/', $memoryLimit, $matches)) {
                                                            $memoryLimit = $matches[1];
                                                            switch (strtoupper($matches[2])) {
                                                                case 'G': $memoryLimit *= 1024;
                                                                case 'M': $memoryLimit *= 1024;
                                                                case 'K': $memoryLimit *= 1024;
                                                            }
                                                        }
                                                        $memoryPercent = min(100, $memoryUsage * 100 / $memoryLimit);
                                                    } else {
                                                        $memoryPercent = rand(20, 50); // 随机值用于演示
                                                        $memoryUsage = $memoryPercent * 1024 * 1024 * 128 / 100;
                                                        $memoryLimit = 1024 * 1024 * 128;
                                                    }
                                                    ?>
                                                    <div class="progress mb-2" style="height: 20px;">
                                                        <div class="progress-bar bg-primary" 
                                                             role="progressbar" 
                                                             style="width: <?php echo $memoryPercent; ?>%;" 
                                                             aria-valuenow="<?php echo $memoryPercent; ?>" 
                                                             aria-valuemin="0" 
                                                             aria-valuemax="100">
                                                            <?php echo number_format($memoryPercent, 1); ?>%
                                                        </div>
                                                    </div>
                                                    <div class="text-center text-muted">
                                                        <?php echo number_format($memoryUsage / 1024 / 1024, 2); ?> MB / 
                                                        <?php echo number_format($memoryLimit / 1024 / 1024, 2); ?> MB
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- 磁盘空间 -->
                                        <div class="col-md-4 col-sm-6 mb-3">
                                            <div class="card border-warning h-100">
                                                <div class="card-body">
                                                    <h5 class="card-title text-center">
                                                        <i class="bi bi-hdd fs-3 text-warning"></i>
                                                        <span class="ms-2">磁盘空间</span>
                                                    </h5>
                                                    <?php
                                                    if (function_exists('disk_free_space') && function_exists('disk_total_space')) {
                                                        $diskFree = disk_free_space('.');
                                                        $diskTotal = disk_total_space('.');
                                                        $diskUsed = $diskTotal - $diskFree;
                                                        $diskPercent = ($diskUsed / $diskTotal) * 100;
                                                    } else {
                                                        $diskPercent = rand(30, 70); // 随机值用于演示
                                                        $diskTotal = 100 * 1024 * 1024 * 1024;
                                                        $diskUsed = $diskPercent * $diskTotal / 100;
                                                    }
                                                    ?>
                                                    <div class="progress mb-2" style="height: 20px;">
                                                        <div class="progress-bar bg-warning" 
                                                             role="progressbar" 
                                                             style="width: <?php echo $diskPercent; ?>%;" 
                                                             aria-valuenow="<?php echo $diskPercent; ?>" 
                                                             aria-valuemin="0" 
                                                             aria-valuemax="100">
                                                            <?php echo number_format($diskPercent, 1); ?>%
                                                        </div>
                                                    </div>
                                                    <div class="text-center text-muted">
                                                        已用: <?php echo number_format($diskUsed / 1024 / 1024 / 1024, 2); ?> GB / 
                                                        总计: <?php echo number_format($diskTotal / 1024 / 1024 / 1024, 2); ?> GB
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

                <!-- 云产品管理 -->
                <div id="products-section" class="form-section">
                    <h3>云产品管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="products-title" class="form-label">标题</label>
                                        <input type="text" class="form-control" id="products-title" value="<?php echo isset($cloudProducts['title']) ? htmlspecialchars($cloudProducts['title']) : ''; ?>">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">产品列表</label>
                                        <div id="products-container">
                                            <!-- 产品项将通过JavaScript动态添加 -->
                                        </div>
                                        <button id="add-product" class="btn btn-outline-primary mt-2">
                                            <i class="bi bi-plus"></i> 添加产品
                                        </button>
                                    </div>
                                    <div class="action-buttons">
                                        <button id="save-products" class="btn btn-primary">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 特性管理 -->
                <div id="features-section" class="form-section">
                    <h3>特性管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="features-title" class="form-label">标题</label>
                                        <input type="text" class="form-control" id="features-title" value="<?php echo isset($features['title']) ? htmlspecialchars($features['title']) : ''; ?>">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">特性列表</label>
                                        <div id="features-container">
                                            <!-- 特性项将通过JavaScript动态添加 -->
                                        </div>
                                        <button id="add-feature" class="btn btn-outline-primary mt-2">
                                            <i class="bi bi-plus"></i> 添加特性
                                        </button>
                                    </div>
                                    <div class="action-buttons">
                                        <button id="save-features" class="btn btn-primary">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

                <!-- 评价管理 -->
                <div id="testimonials-section" class="form-section">
                    <h3>评价管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="testimonials-title" class="form-label">标题</label>
                                        <input type="text" class="form-control" id="testimonials-title" value="<?php echo isset($testimonials['title']) ? htmlspecialchars($testimonials['title']) : ''; ?>">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">评价列表</label>
                                        <div id="testimonials-container">
                                            <!-- 评价项将通过JavaScript动态添加 -->
                                        </div>
                                        <button id="add-testimonial" class="btn btn-outline-primary mt-2">
                                            <i class="bi bi-plus"></i> 添加评价
                                        </button>
                                    </div>
                                    <div class="action-buttons">
                                        <button id="save-testimonials" class="btn btn-primary">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

                <!-- 轮播图管理 -->
                <div id="banners-section" class="form-section">
                    <h3>轮播图管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <div id="banners-container">
                                            <!-- 轮播图项将通过JavaScript动态添加 -->
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-outline-primary" id="add-banner">
                                            <i class="bi bi-plus"></i> 添加轮播图
                                        </button>
                                    </div>
                                    <div class="action-buttons">
                                        <button id="save-banners" class="btn btn-primary">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 页脚管理 -->
                <div id="footer-section" class="form-section">
                    <h3>页脚管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="company-info" class="form-label">公司简介</label>
                                        <textarea class="form-control" id="company-info" rows="3"><?php echo isset($footer['company_info']) ? htmlspecialchars($footer['company_info']) : ''; ?></textarea>
                                    </div>
                                    
                                    <h5 class="mt-4 mb-3">社交媒体链接</h5>
                                    <div id="social-links-container">
                                        <!-- 社交媒体链接将通过JavaScript动态添加 -->
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-sm btn-outline-primary" id="add-social">
                                            <i class="bi bi-plus"></i> 添加社交媒体
                                        </button>
                                    </div>
                                    
                                    <h5 class="mt-4 mb-3">快速链接</h5>
                                    <div id="quick-links-container">
                                        <!-- 快速链接将通过JavaScript动态添加 -->
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-sm btn-outline-primary" id="add-quick-link">
                                            <i class="bi bi-plus"></i> 添加快速链接
                                        </button>
                                    </div>
                                    
                                    <h5 class="mt-4 mb-3">解决方案链接</h5>
                                    <div id="solution-links-container">
                                        <!-- 解决方案链接将通过JavaScript动态添加 -->
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-sm btn-outline-primary" id="add-solution-link">
                                            <i class="bi bi-plus"></i> 添加解决方案链接
                                        </button>
                                    </div>
                                    
                                    <h5 class="mt-4 mb-3">联系信息</h5>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">地址</label>
                                            <input type="text" class="form-control" id="contact-address" value="<?php echo isset($footer['contact_info']['address']) ? htmlspecialchars($footer['contact_info']['address']) : ''; ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">电话</label>
                                            <input type="text" class="form-control" id="contact-phone" value="<?php echo isset($footer['contact_info']['phone']) ? htmlspecialchars($footer['contact_info']['phone']) : ''; ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">邮箱</label>
                                            <input type="text" class="form-control" id="contact-email" value="<?php echo isset($footer['contact_info']['email']) ? htmlspecialchars($footer['contact_info']['email']) : ''; ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">工作时间</label>
                                            <input type="text" class="form-control" id="contact-hours" value="<?php echo isset($footer['contact_info']['hours']) ? htmlspecialchars($footer['contact_info']['hours']) : ''; ?>">
                                        </div>
                                    </div>
                                    
                                    <h5 class="mt-4 mb-3">版权信息</h5>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">版权文本</label>
                                            <input type="text" class="form-control" id="copyright" value="<?php echo isset($footer['copyright']) ? htmlspecialchars($footer['copyright']) : ''; ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">ICP备案号</label>
                                            <input type="text" class="form-control" id="icp" value="<?php echo isset($footer['icp']) ? htmlspecialchars($footer['icp']) : ''; ?>">
                                        </div>
                                    </div>
                                    
                                    <div class="action-buttons mt-4">
                                        <button id="save-footer" class="btn btn-primary">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 导航栏管理 -->
                <div id="navigation-section" class="form-section">
                    <h3>导航栏管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <h4 class="mb-3">主导航菜单</h4>
                                    <div class="mb-3">
                                        <div id="main-nav-container">
                                            <!-- 主导航项将通过JavaScript动态添加 -->
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-success" id="add-nav-item">添加导航项</button>
                                    </div>
                                    
                                    <hr class="my-4">
                                    
                                    <h4 class="mb-3">登录按钮</h4>
                                    <div class="mb-3">
                                        <div id="login-buttons-container">
                                            <!-- 登录按钮将通过JavaScript动态添加 -->
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-success" id="add-login-button">添加按钮</button>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <button type="button" class="btn btn-primary" id="save-navigation">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 合作案例管理 -->
                <div id="partner_cases-section" class="form-section">
                    <h3>合作案例管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="mb-3">
                                        <div id="partner-cases-container">
                                            <!-- 合作案例将通过JavaScript动态添加 -->
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <button type="button" class="btn btn-success" id="add-partner-case-btn">添加合作案例</button>
                                    </div>
                                    <div class="mt-4">
                                        <button type="button" class="btn btn-primary" id="save-partner-cases-btn">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 团队成员管理 -->
                <div id="team_members-section" class="form-section">
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
                                            <!-- 团队成员项将通过JavaScript动态添加 -->
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
                
                <!-- 发展历程管理 -->
                <div id="company_history-section" class="form-section">
                    <h3>发展历程管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
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

                                    <div class="mt-4">
                                        <button type="button" class="btn btn-primary" id="save-history">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 战略合作伙伴管理 -->
                <div id="strategic_partners-section" class="form-section">
                    <h3>合作伙伴管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <ul class="nav nav-tabs mb-3" id="partners-tabs" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="strategic-partners-tab" data-bs-toggle="tab" data-bs-target="#strategic-partners-content" type="button" role="tab" aria-controls="strategic-partners-content" aria-selected="true" onclick="return false;">战略合作伙伴</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="tech-partners-tab" data-bs-toggle="tab" data-bs-target="#tech-partners-content" type="button" role="tab" aria-controls="tech-partners-content" aria-selected="false" onclick="return false;">技术合作伙伴</button>
                                        </li>
                                    </ul>
                                    
                                    <div class="tab-content" id="partners-tabs-content">
                                        <div class="tab-pane fade show active" id="strategic-partners-content" role="tabpanel" aria-labelledby="strategic-partners-tab">
                                            <div class="mb-3">
                                                <div id="strategic-partners-container">
                                                    <!-- 战略合作伙伴将通过JavaScript动态添加 -->
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <button type="button" class="btn btn-success" id="add-strategic-partner">添加战略合作伙伴</button>
                                            </div>
                                        </div>
                                        
                                        <div class="tab-pane fade" id="tech-partners-content" role="tabpanel" aria-labelledby="tech-partners-tab">
                                            <div class="mb-3">
                                                <div id="tech-partners-container">
                                                    <!-- 技术合作伙伴将通过JavaScript动态添加 -->
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <button type="button" class="btn btn-success" id="add-tech-partner">添加技术合作伙伴</button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <button type="button" class="btn btn-primary" id="save-partners">保存更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 英文内容管理 -->
                <div id="english_content-section" class="form-section">
                    <h3>英文内容管理</h3>
                    <div class="row mb-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <!-- 标签页导航 -->
                                    <ul class="nav nav-tabs" id="englishContentTabs" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="banners-en-tab" data-bs-target="#banners-en-content" type="button" role="tab" aria-controls="banners-en-content" aria-selected="true" onclick="return false;">轮播图</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="announcement-en-tab" data-bs-target="#announcement-en-content" type="button" role="tab" aria-controls="announcement-en-content" aria-selected="false" onclick="return false;">公告</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="features-en-tab" data-bs-target="#features-en-content" type="button" role="tab" aria-controls="features-en-content" aria-selected="false" onclick="return false;">特性</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="cases-en-tab" data-bs-target="#cases-en-content" type="button" role="tab" aria-controls="cases-en-content" aria-selected="false" onclick="return false;">案例</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="partner-cases-en-tab" data-bs-target="#partner-cases-en-content" type="button" role="tab" aria-controls="partner-cases-en-content" aria-selected="false" onclick="return false;">合作案例</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="products-en-tab" data-bs-target="#products-en-content" type="button" role="tab" aria-controls="products-en-content" aria-selected="false" onclick="return false;">产品</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="solutions-en-tab" data-bs-target="#solutions-en-content" type="button" role="tab" aria-controls="solutions-en-content" aria-selected="false" onclick="return false;">解决方案</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="testimonials-en-tab" data-bs-target="#testimonials-en-content" type="button" role="tab" aria-controls="testimonials-en-content" aria-selected="false" onclick="return false;">评价管理</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="team-en-tab" data-bs-target="#team-en-content" type="button" role="tab" aria-controls="team-en-content" aria-selected="false" onclick="return false;">团队成员</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="history-en-tab" data-bs-target="#history-en-content" type="button" role="tab" aria-controls="history-en-content" aria-selected="false" onclick="return false;">发展历程</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="partners-en-tab" data-bs-target="#partners-en-content" type="button" role="tab" aria-controls="partners-en-content" aria-selected="false" onclick="return false;">合作伙伴</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="footer-en-tab" data-bs-target="#footer-en-content" type="button" role="tab" aria-controls="footer-en-content" aria-selected="false" onclick="return false;">页脚</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="navigation-en-tab" data-bs-target="#navigation-en-content" type="button" role="tab" aria-controls="navigation-en-content" aria-selected="false" onclick="return false;">导航</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="language-en-tab" data-bs-target="#language-en-content" type="button" role="tab" aria-controls="language-en-content" aria-selected="false" onclick="return false;">语言</button>
                                        </li>
                                    </ul>
                                    
                                    <!-- 标签页内容 -->
                                    <div class="tab-content mt-3" id="englishContentTabsContent">
                                        <!-- 轮播图管理 -->
                                        <div class="tab-pane fade show active" id="banners-en-content" role="tabpanel" aria-labelledby="banners-en-tab">
                                            <div class="mb-3">
                                                <div id="banners-en-container">
                                                    <!-- 轮播图项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-banner-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加轮播图
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-banners-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 公告管理 -->
                                        <div class="tab-pane fade" id="announcement-en-content" role="tabpanel" aria-labelledby="announcement-en-tab">
                                            <div class="mb-3">
                                                <label for="announcement-en-text" class="form-label">公告内容</label>
                                                <textarea class="form-control" id="announcement-en-text" rows="3"></textarea>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-announcement-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 特性管理 -->
                                        <div class="tab-pane fade" id="features-en-content" role="tabpanel" aria-labelledby="features-en-tab">
                                            <div class="mb-3">
                                                <div id="features-en-container">
                                                    <!-- 特性项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-feature-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加特性
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-features-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 案例管理 -->
                                        <div class="tab-pane fade" id="cases-en-content" role="tabpanel" aria-labelledby="cases-en-tab">
                                            <div class="mb-3">
                                                <div id="cases-en-container">
                                                    <!-- 案例项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-case-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加案例
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-cases-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 合作案例管理 -->
                                        <div class="tab-pane fade" id="partner-cases-en-content" role="tabpanel" aria-labelledby="partner-cases-en-tab">
                                            <div class="mb-3">
                                                <div id="partner-cases-en-container">
                                                    <!-- 合作案例项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-partner-case-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加合作案例
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-partner-cases-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 产品管理 -->
                                        <div class="tab-pane fade" id="products-en-content" role="tabpanel" aria-labelledby="products-en-tab">
                                            <div class="mb-3">
                                                <div id="products-en-container">
                                                    <!-- 产品项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-product-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加产品
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-products-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 解决方案管理 -->
                                        <div class="tab-pane fade" id="solutions-en-content" role="tabpanel" aria-labelledby="solutions-en-tab">
                                            <div class="mb-3">
                                                <div id="solutions-en-container">
                                                    <!-- 解决方案项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-solution-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加解决方案
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-solutions-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 评价管理 -->
                                        <div class="tab-pane fade" id="testimonials-en-content" role="tabpanel" aria-labelledby="testimonials-en-tab">
                                            <div class="mb-3">
                                                <div id="testimonials-en-container" class="testimonials-container">
                                                    <!-- 评价项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-testimonial-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加评价
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-testimonials-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 团队成员管理 -->
                                        <div class="tab-pane fade" id="team-en-content" role="tabpanel" aria-labelledby="team-en-tab">
                                            <div class="mb-3">
                                                <div id="team-members-en-container">
                                                    <!-- 团队成员项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-team-member-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加团队成员
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-team-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 发展历程管理 -->
                                        <div class="tab-pane fade" id="history-en-content" role="tabpanel" aria-labelledby="history-en-tab">
                                            <div class="mb-3">
                                                <div id="history-en-container">
                                                    <!-- 发展历程项将通过JavaScript动态添加 -->
                                                </div>
                                                <button id="add-history-en" class="btn btn-outline-primary mt-2">
                                                    <i class="bi bi-plus"></i> 添加里程碑
                                                </button>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-history-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 合作伙伴管理 -->
                                        <div class="tab-pane fade" id="partners-en-content" role="tabpanel" aria-labelledby="partners-en-tab">
                                            <div class="mb-3">
                                                <div id="partners-en-container">
                                                    <!-- 合作伙伴项将通过JavaScript动态添加 -->
                                                </div>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-partners-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 页脚管理 -->
                                        <div class="tab-pane fade" id="footer-en-content" role="tabpanel" aria-labelledby="footer-en-tab">
                                            <div class="mb-3">
                                                <div id="footer-en-container">
                                                    <!-- 页脚项将通过JavaScript动态添加 -->
                                                </div>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-footer-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 导航管理 -->
                                        <div class="tab-pane fade" id="navigation-en-content" role="tabpanel" aria-labelledby="navigation-en-tab">
                                            <div class="mb-3">
                                                <div id="navigation-en-container">
                                                    <!-- 导航项将通过JavaScript动态添加 -->
                                                </div>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-navigation-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 语言管理 -->
                                        <div class="tab-pane fade" id="language-en-content" role="tabpanel" aria-labelledby="language-en-tab">
                                            <div class="mb-3">
                                                <div id="language-en-container">
                                                    <!-- 语言项将通过JavaScript动态添加 -->
                                                </div>
                                            </div>
                                            <div class="action-buttons">
                                                <button id="save-language-en" class="btn btn-primary">保存更改</button>
                                            </div>
                                            
                                            <!-- 语言键教程 -->
                                            <div class="card mt-4">
                                                <div class="card-header bg-primary text-white">
                                                    <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>语言键使用教程</h5>
                                                </div>
                                                <div class="card-body">
                                                    <div class="accordion" id="languageKeyTutorial">
                                                        <!-- 什么是语言键 -->
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingOne">
                                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                    什么是语言键（Language Key）？
                                                                </button>
                                                            </h2>
                                                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#languageKeyTutorial">
                                                                <div class="accordion-body">
                                                                    <p>语言键是多语言系统中用于标识特定文本内容的唯一标识符。通过使用语言键，系统可以根据用户选择的语言自动加载相应的文本内容，实现网站的多语言支持。</p>
                                                                    <p>例如：</p>
                                                                    <ul>
                                                                        <li><code>site_name</code> - 网站名称键</li>
                                                                        <li><code>home</code> - 首页导航键</li>
                                                                        <li><code>learn_more</code> - "了解更多"按钮文本键</li>
                                                                    </ul>
                                                                    <p>当系统需要显示这些文本时，会根据当前选择的语言自动查找对应的翻译内容。</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- 如何查找语言键 -->
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingTwo">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                    如何查找语言键？
                                                                </button>
                                                            </h2>
                                                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#languageKeyTutorial">
                                                                <div class="accordion-body">
                                                                    <p>查找现有的语言键有以下几种方法：</p>
                                                                    <ol>
                                                                        <li>
                                                                            <strong>查看语言文件</strong>：
                                                                            <ul>
                                                                                <li>中文语言文件位于: <code>languages/zh/common.php</code></li>
                                                                                <li>英文语言文件位于: <code>languages/en/common.php</code></li>
                                                                            </ul>
                                                                        </li>
                                                                        <li>
                                                                            <strong>通过代码搜索</strong>：在项目代码中搜索 <code>__('关键字')</code> 或 <code>_e('关键字')</code> 函数调用
                                                                        </li>
                                                                        <li>
                                                                            <strong>在本页面查看</strong>：在上方"键"和"值"表格中可以查看所有已定义的语言键
                                                                        </li>
                                                                    </ol>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- 如何添加语言键 -->
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingThree">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                    如何添加新的语言键？
                                                                </button>
                                                            </h2>
                                                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#languageKeyTutorial">
                                                                <div class="accordion-body">
                                                                    <p>添加新的语言键需要在多个语言版本中都添加对应的翻译：</p>
                                                                    <ol>
                                                                        <li>
                                                                            <strong>在中文语言文件中添加</strong>:
                                                                            <pre class="bg-light p-2"><code>'new_key' => '中文内容',</code></pre>
                                                                        </li>
                                                                        <li>
                                                                            <strong>在英文语言文件中添加</strong>:
                                                                            <pre class="bg-light p-2"><code>'new_key' => 'English Content',</code></pre>
                                                                        </li>
                                                                        <li>
                                                                            <strong>注意事项</strong>:
                                                                            <ul>
                                                                                <li>键名应使用小写字母和下划线</li>
                                                                                <li>键名应具有描述性，便于理解其用途</li>
                                                                                <li>所有语言版本都必须包含相同的键</li>
                                                                            </ul>
                                                                        </li>
                                                                    </ol>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- 如何使用语言键 -->
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingFour">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                                    如何使用语言键？
                                                                </button>
                                                            </h2>
                                                            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#languageKeyTutorial">
                                                                <div class="accordion-body">
                                                                    <p>在不同环境中使用语言键的方法：</p>
                                                                    
                                                                    <h5>1. 在PHP文件中：</h5>
                                                                    <pre class="bg-light p-2"><code>// 获取翻译后的文本
echo __('site_name');

// 直接输出翻译后的文本
_e('learn_more');</code></pre>
                                                                    
                                                                    <h5>2. 在JavaScript中：</h5>
                                                                    <pre class="bg-light p-2"><code>// 使用getLanguageText函数获取翻译
let text = getLanguageText('view_details');</code></pre>
                                                                    
                                                                    <h5>3. 在HTML模板中：</h5>
                                                                    <pre class="bg-light p-2"><code>&lt;button class="btn btn-primary"&gt;
    &lt;?php _e('submit'); ?&gt;
&lt;/button&gt;</code></pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- 常见问题 -->
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingFive">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                                    常见问题
                                                                </button>
                                                            </h2>
                                                            <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#languageKeyTutorial">
                                                                <div class="accordion-body">
                                                                    <div class="mb-3">
                                                                        <h5>1. 我添加了新键，但在前台看不到翻译内容</h5>
                                                                        <ul>
                                                                            <li>确保键名在所有语言文件中都完全相同（包括大小写）</li>
                                                                            <li>检查是否清除了浏览器缓存</li>
                                                                            <li>确保语言文件没有语法错误</li>
                                                                        </ul>
                                                                    </div>
                                                                    
                                                                    <div class="mb-3">
                                                                        <h5>2. 如何处理包含变量的文本？</h5>
                                                                        <p>使用占位符和替换：</p>
                                                                        <pre class="bg-light p-2"><code>// 在语言文件中
'welcome_user' => '欢迎，{username}！',

// 在PHP代码中使用
echo __('welcome_user', 'common', ['username' => $userName]);</code></pre>
                                                                    </div>
                                                                    
                                                                    <div class="mb-3">
                                                                        <h5>3. 我应该为每个文本都创建语言键吗？</h5>
                                                                        <p>建议为以下内容创建语言键：</p>
                                                                        <ul>
                                                                            <li>UI界面元素（按钮、标签、提示文本等）</li>
                                                                            <li>频繁使用的文本</li>
                                                                            <li>可能需要针对不同语言进行文化适应的内容</li>
                                                                        </ul>
                                                                        <p>动态内容（如用户创建的内容）通常不需要使用语言键。</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- 其他英文内容标签页 -->
                                        <!-- 将由JavaScript动态加载处理 -->
                                    </div>
                                    
                                    <div class="mt-4">
                                        <p class="text-muted">注意：英文内容管理包含英文版网站的所有内容，请确保翻译准确无误。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        // 在页面加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            // 检查jQuery是否正确加载
            if (typeof jQuery !== 'undefined') {
                console.log('jQuery版本:', jQuery.fn.jquery);
                
                // 初始化jQuery相关功能
                // 手动绑定点击事件（调试用）
                jQuery('#edit-quick-actions-btn').on('click', function() {
                    console.log('编辑按钮被点击（通过调试代码）');
                    // 手动切换视图
                    jQuery('#quick-actions-view').toggle();
                    jQuery('#quick-actions-edit').toggle();
                });

                // 确保侧边栏滚动功能在移动设备上工作
                function updateSidebarScroll() {
                    const sidebar = document.querySelector('.sidebar-sticky');
                    if (sidebar) {
                        if (window.innerWidth < 768) {
                            // 移动设备上确保内容超过高度才可滚动
                            const sidebarHeight = sidebar.scrollHeight;
                            const windowHeight = window.innerHeight - 56; // 减去导航栏高度
                            if (sidebarHeight > windowHeight) {
                                sidebar.style.overflowY = 'auto';
                                sidebar.style.height = 'auto';
                                sidebar.style.maxHeight = `${windowHeight}px`;
                            }
                        } else {
                            // 桌面设备上重置高度
                            sidebar.style.height = 'calc(100vh - 48px)';
                            sidebar.style.maxHeight = 'none';
                        }
                    }
                }

                // 页面加载和窗口大小变化时更新侧边栏
                updateSidebarScroll();
                window.addEventListener('resize', updateSidebarScroll);
            } else {
                console.error('jQuery未能正确加载！');
            }

            // 初始化全局变量，确保在main.js等其他脚本中可用
            window.ensureGlobalVariables = function() {
                window.announcementData = <?php echo json_encode($announcement); ?>;
                window.cloudProductsData = <?php echo json_encode($cloudProducts); ?>;
                window.featuresData = <?php echo json_encode($features); ?>;
                window.caseStudiesData = <?php echo json_encode($caseStudies); ?>;
                window.testimonialsData = <?php echo json_encode($testimonials); ?>;
                window.solutionsData = <?php echo json_encode($solutions); ?>;
                window.bannersData = <?php echo json_encode($banners); ?>;
                window.footerData = <?php echo json_encode($footer); ?>;
                window.navigationData = <?php echo json_encode($navigation); ?>;
                window.strategicPartnersData = <?php echo json_encode($strategicPartners); ?>;
                window.techPartnersData = <?php echo json_encode($techPartners); ?>;
                window.partnerCasesData = <?php echo json_encode($partnerCases); ?>;
                window.teamMembersData = <?php echo json_encode($team_members); ?>;
                window.companyHistoryData = <?php echo json_encode($companyHistory); ?>;
                
                // 添加英文内容数据
                window.bannersEnData = <?php echo json_encode($bannersEn); ?>;
                window.announcementEnData = <?php echo json_encode($announcementEn); ?>;
                window.caseStudiesEnData = <?php echo json_encode($caseStudiesEn); ?>;
                window.cloudProductsEnData = <?php echo json_encode($cloudProductsEn); ?>;
                window.companyHistoryEnData = <?php echo json_encode($companyHistoryEn); ?>;
                window.featuresEnData = <?php echo json_encode($featuresEn); ?>;
                window.footerEnData = <?php echo json_encode($footerEn); ?>;
                window.navigationEnData = <?php echo json_encode($navigationEn); ?>;
                window.partnerCasesEnData = <?php echo json_encode($partnerCasesEn); ?>;
                window.solutionsEnData = <?php echo json_encode($solutionsEn); ?>;
                window.strategicPartnersEnData = <?php echo json_encode($strategicPartnersEn); ?>;
                window.teamMembersEnData = <?php echo json_encode($teamMembersEn); ?>;
                window.techPartnersEnData = <?php echo json_encode($techPartnersEn); ?>;
                window.testimonialsEnData = <?php echo json_encode($testimonialsEn); ?>;
            };
            
            // 立即执行一次初始化
            window.ensureGlobalVariables();
            
            // 确保退出登录按钮正常工作
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    window.location.href = 'logout.php';
                });
            }
            
            // 特殊处理战略合作伙伴标签
            const strategicPartnerTab = document.getElementById('strategic-partners-tab');
            if (strategicPartnerTab) {
                // 使用捕获阶段监听事件，确保先于其他处理程序执行
                strategicPartnerTab.addEventListener('click', function(e) {
                    console.log('战略合作伙伴标签点击被捕获');
                    // 强制阻止事件传播和默认行为
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 手动激活对应的标签内容
                    document.getElementById('strategic-partners-content').classList.add('show', 'active');
                    this.classList.add('active');
                    document.getElementById('tech-partners-tab').classList.remove('active');
                    document.getElementById('tech-partners-content').classList.remove('show', 'active');
                    
                    // 触发内容渲染，如果partners-manager.js已加载
                    if (window.partnersManager && typeof window.partnersManager.renderStrategicPartners === 'function') {
                        window.partnersManager.renderStrategicPartners();
                    }
                    
                    return false; // 确保返回false
                }, true); // true表示在捕获阶段处理，优先级更高
            }
            
            // 特殊处理技术合作伙伴标签
            const techPartnerTab = document.getElementById('tech-partners-tab');
            if (techPartnerTab) {
                // 使用捕获阶段监听事件，确保先于其他处理程序执行
                techPartnerTab.addEventListener('click', function(e) {
                    console.log('技术合作伙伴标签点击被捕获');
                    // 强制阻止事件传播和默认行为
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 手动激活对应的标签内容
                    document.getElementById('tech-partners-content').classList.add('show', 'active');
                    this.classList.add('active');
                    document.getElementById('strategic-partners-tab').classList.remove('active');
                    document.getElementById('strategic-partners-content').classList.remove('show', 'active');
                    
                    // 触发内容渲染，如果partners-manager.js已加载
                    if (window.partnersManager && typeof window.partnersManager.renderTechPartners === 'function') {
                        window.partnersManager.renderTechPartners();
                    }
                    
                    return false; // 确保返回false
                }, true); // true表示在捕获阶段处理，优先级更高
            }
            
            // 确保初始状态正确
            var activeTab = document.querySelector('#partners-tabs .active');
            if (activeTab) {
                var targetId = activeTab.getAttribute('data-bs-target');
                var targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.classList.add('show', 'active');
                }
            }
            
            // 侧边栏管理部分
            const sidebarLinks = document.querySelectorAll('.sidebar-sticky .nav-link');
            const quickActionLinks = document.querySelectorAll('.card-body .list-group-item');
            
            // 处理侧边栏链接点击
            if (sidebarLinks) {
                sidebarLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        // 移除所有链接的激活状态
                        sidebarLinks.forEach(l => l.classList.remove('active'));
                        // 激活当前链接
                        this.classList.add('active');
                        
                        // 隐藏所有表单区域
                        const formSections = document.querySelectorAll('.form-section');
                        formSections.forEach(section => section.classList.remove('active'));
                        
                        // 显示相应的表单区域
                        const sectionId = this.getAttribute('data-section');
                        const targetSection = document.getElementById(sectionId + '-section');
                        if (targetSection) {
                            targetSection.classList.add('active');
                        }
                    });
                });
            }
            
            // 处理快速操作链接点击
            if (quickActionLinks) {
                quickActionLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // 获取目标部分
                        const sectionId = this.getAttribute('data-section');
                        
                        // 激活对应的侧边栏项
                        sidebarLinks.forEach(l => {
                            if (l.getAttribute('data-section') === sectionId) {
                                l.click(); // 触发点击事件
                            }
                        });
                    });
                });
            }
            
            // 检查Chart对象是否存在
            if (typeof Chart !== 'undefined') {
                // 初始化模块分布饼图
                const modulesDistCtx = document.getElementById('modulesDistributionChart');
                if (modulesDistCtx) {
                    const ctx = modulesDistCtx.getContext('2d');
                    const modulesDistChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['云产品', '特性', '案例', '解决方案', '客户评价', '合作伙伴', '团队成员', '合作案例', '发展里程碑'],
                            datasets: [{
                                data: [
                                    <?php echo $cloudProductsCount; ?>,
                                    <?php echo $featuresCount; ?>,
                                    <?php echo $caseStudiesCount; ?>,
                                    <?php echo $solutionsCount; ?>,
                                    <?php echo $testimonialsCount; ?>,
                                    <?php echo $partnersCount; ?>,
                                    <?php echo $teamMembersCount; ?>,
                                    <?php echo $partnerCasesCount; ?>,
                                    <?php echo $companyHistoryCount; ?>
                                ],
                                backgroundColor: [
                                    'rgba(13, 110, 253, 0.7)',  // Primary
                                    'rgba(25, 135, 84, 0.7)',   // Success
                                    'rgba(13, 202, 240, 0.7)',  // Info
                                    'rgba(255, 193, 7, 0.7)',   // Warning
                                    'rgba(220, 53, 69, 0.7)',   // Danger
                                    'rgba(108, 117, 125, 0.7)', // Secondary
                                    'rgba(33, 37, 41, 0.7)',    // Dark
                                    'rgba(102, 16, 242, 0.7)',  // Purple
                                    'rgba(0, 172, 105, 0.7)'    // Green
                                ],
                                borderColor: [
                                    'rgba(13, 110, 253, 1)',
                                    'rgba(25, 135, 84, 1)',
                                    'rgba(13, 202, 240, 1)',
                                    'rgba(255, 193, 7, 1)',
                                    'rgba(220, 53, 69, 1)',
                                    'rgba(108, 117, 125, 1)',
                                    'rgba(33, 37, 41, 1)',
                                    'rgba(102, 16, 242, 1)',
                                    'rgba(0, 172, 105, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: '各类内容模块分布情况'
                                }
                            }
                        }
                    });
                }
                
                // 初始化模块内容柱状图
                const moduleContentsCtx = document.getElementById('moduleContentsChart');
                if (moduleContentsCtx) {
                    const ctx = moduleContentsCtx.getContext('2d');
                    const moduleContentsChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['云产品', '特性', '案例', '解决方案', '客户评价', '合作伙伴', '团队成员', '合作案例', '发展里程碑'],
                            datasets: [{
                                label: '内容数量',
                                data: [
                                    <?php echo $cloudProductsCount; ?>,
                                    <?php echo $featuresCount; ?>,
                                    <?php echo $caseStudiesCount; ?>,
                                    <?php echo $solutionsCount; ?>,
                                    <?php echo $testimonialsCount; ?>,
                                    <?php echo $partnersCount; ?>,
                                    <?php echo $teamMembersCount; ?>,
                                    <?php echo $partnerCasesCount; ?>,
                                    <?php echo $companyHistoryCount; ?>
                                ],
                                backgroundColor: [
                                    'rgba(13, 110, 253, 0.7)',  // Primary
                                    'rgba(25, 135, 84, 0.7)',   // Success
                                    'rgba(13, 202, 240, 0.7)',  // Info
                                    'rgba(255, 193, 7, 0.7)',   // Warning
                                    'rgba(220, 53, 69, 0.7)',   // Danger
                                    'rgba(108, 117, 125, 0.7)', // Secondary
                                    'rgba(33, 37, 41, 0.7)',    // Dark
                                    'rgba(102, 16, 242, 0.7)',  // Purple
                                    'rgba(0, 172, 105, 0.7)'    // Green
                                ],
                                borderColor: [
                                    'rgba(13, 110, 253, 1)',
                                    'rgba(25, 135, 84, 1)',
                                    'rgba(13, 202, 240, 1)',
                                    'rgba(255, 193, 7, 1)',
                                    'rgba(220, 53, 69, 1)',
                                    'rgba(108, 117, 125, 1)',
                                    'rgba(33, 37, 41, 1)',
                                    'rgba(102, 16, 242, 1)',
                                    'rgba(0, 172, 105, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: '各模块内容数量对比'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                console.error('Chart.js库未能正确加载！');
            }
        });
    </script>
    <script type="module" src="js/main.js"></script>
    <script type="module" src="js/english-content-manager.js"></script>
    <script src="js/english-content-fix.js"></script>
    
    <script>
        // 确保页面加载完成后修复英文内容管理
        document.addEventListener('DOMContentLoaded', function() {
            // 等待所有资源加载完毕后执行修复
            setTimeout(function() {
                // 调用修复函数
                if (typeof fixEnglishContentManager === 'function') {
                    console.log('开始修复英文内容管理页面...');
                    fixEnglishContentManager();
                } else {
                    console.error('修复函数未找到，请检查english-content-fix.js是否正确加载');
                }
                
                // 手动绑定英文内容管理标签页点击事件
                const tabs = document.querySelectorAll('#englishContentTabs .nav-link');
                tabs.forEach(tab => {
                    tab.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const targetId = this.getAttribute('data-bs-target');
                        const targetPane = document.querySelector(targetId);
                        
                        // 隐藏所有面板
                        document.querySelectorAll('#englishContentTabsContent .tab-pane').forEach(pane => {
                            pane.classList.remove('show', 'active');
                        });
                        
                        // 取消所有标签激活状态
                        tabs.forEach(t => {
                            t.classList.remove('active');
                        });
                        
                        // 激活当前标签和面板
                        this.classList.add('active');
                        if(targetPane) {
                            targetPane.classList.add('show', 'active');
                        }
                        
                        // 触发内容加载
                        const tabId = this.id;
                        console.log('切换到标签页: ' + tabId);
                        
                        switch(tabId) {
                            case 'footer-en-tab':
                                if(typeof renderEnFooter === 'function') renderEnFooter();
                                break;
                            case 'navigation-en-tab':
                                if(typeof renderEnNavigation === 'function') renderEnNavigation();
                                break;
                            // 其他标签页可以根据需要添加
                        }
                        
                        return false;
                    }, true); // 使用捕获阶段
                });
                
                // 检查当前是否在英文内容管理页面
                const urlParams = new URLSearchParams(window.location.search);
                const section = urlParams.get('section');
                
                if (section === 'english_content') {
                    // 获取当前激活的标签页
                    const activeTab = document.querySelector('#englishContentTabs .nav-link.active');
                    if (activeTab) {
                        const tabId = activeTab.id;
                        console.log('当前激活的标签页ID:', tabId);
                        
                        // 根据不同标签加载相应数据
                        switch(tabId) {
                            case 'banners-en-tab':
                                if(typeof renderEnBanners === 'function') renderEnBanners();
                                break;
                            case 'features-en-tab':
                                if(typeof renderEnFeatures === 'function') renderEnFeatures();
                                break;
                            case 'cases-en-tab':
                                if(typeof renderEnCases === 'function') renderEnCases();
                                break;
                            case 'partner-cases-en-tab':
                                if(typeof renderEnPartnerCases === 'function') renderEnPartnerCases();
                                break;
                            case 'products-en-tab':
                                if(typeof renderEnProducts === 'function') renderEnProducts();
                                break;
                            case 'solutions-en-tab':
                                if(typeof renderEnSolutions === 'function') renderEnSolutions();
                                break;
                            case 'team-en-tab':
                                if(typeof renderEnTeamMembers === 'function') renderEnTeamMembers();
                                break;
                            case 'history-en-tab':
                                if(typeof renderEnCompanyHistory === 'function') renderEnCompanyHistory();
                                break;
                            case 'partners-en-tab':
                                if(typeof renderEnPartners === 'function') renderEnPartners();
                                break;
                            case 'navigation-en-tab':
                                if(typeof renderEnNavigation === 'function') renderEnNavigation();
                                break;
                            case 'footer-en-tab':
                                if(typeof renderEnFooter === 'function') renderEnFooter();
                                break;
                            case 'language-en-tab':
                                if(typeof renderEnLanguage === 'function') renderEnLanguage();
                                break;
                        }
                    }
                }
                
                // 添加监听器，检测菜单项点击
                document.querySelectorAll('.nav-link[data-section="english_content"]').forEach(link => {
                    link.addEventListener('click', function() {
                        // 延迟执行，确保DOM已更新
                        setTimeout(function() {
                            // 检查当前激活的标签页
                            const activeTab = document.querySelector('#englishContentTabs .nav-link.active');
                            if (activeTab) {
                                const tabId = activeTab.id;
                                console.log('菜单点击后激活的标签页:', tabId);
                                
                                // 根据不同标签加载相应数据
                                switch(tabId) {
                                    case 'banners-en-tab':
                                        if(typeof renderEnBanners === 'function') renderEnBanners();
                                        break;
                                    case 'features-en-tab':
                                        if(typeof renderEnFeatures === 'function') renderEnFeatures();
                                        break;
                                    case 'cases-en-tab':
                                        if(typeof renderEnCases === 'function') renderEnCases();
                                        break;
                                    case 'partner-cases-en-tab':
                                        if(typeof renderEnPartnerCases === 'function') renderEnPartnerCases();
                                        break;
                                    case 'products-en-tab':
                                        if(typeof renderEnProducts === 'function') renderEnProducts();
                                        break;
                                    case 'solutions-en-tab':
                                        if(typeof renderEnSolutions === 'function') renderEnSolutions();
                                        break;
                                    case 'team-en-tab':
                                        if(typeof renderEnTeamMembers === 'function') renderEnTeamMembers();
                                        break;
                                    case 'history-en-tab':
                                        if(typeof renderEnCompanyHistory === 'function') renderEnCompanyHistory();
                                        break;
                                    case 'partners-en-tab':
                                        if(typeof renderEnPartners === 'function') renderEnPartners();
                                        break;
                                    case 'navigation-en-tab':
                                        if(typeof renderEnNavigation === 'function') renderEnNavigation();
                                        break;
                                    case 'footer-en-tab':
                                        if(typeof renderEnFooter === 'function') renderEnFooter();
                                        break;
                                    case 'language-en-tab':
                                        if(typeof renderEnLanguage === 'function') renderEnLanguage();
                                        break;
                                }
                            }
                        }, 500);
                    });
                });
            }, 1000); // 延迟1秒，确保所有资源都加载完毕
        });
    </script>

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
</body>
</html>
