<?php
/**
 * 英文内容管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载英文内容数据
$bannersEn = json_decode(file_get_contents('../data/banners_en.json'), true);
$announcementEn = json_decode(file_get_contents('../data/announcement_en.json'), true);
$caseStudiesEn = json_decode(file_get_contents('../data/case_studies_en.json'), true);
$cloudProductsEn = json_decode(file_get_contents('../data/cloud_products_en.json'), true);
$companyHistoryEn = json_decode(file_get_contents('../data/company_history_en.json'), true);
$featuresEn = json_decode(file_get_contents('../data/features_en.json'), true);
$footerEn = json_decode(file_get_contents('../data/footer_en.json'), true);
$navigationEn = json_decode(file_get_contents('../data/navigation_en.json'), true);
$partnerCasesEn = json_decode(file_get_contents('../data/partner_cases_en.json'), true);
$quickActionsEn = json_decode(file_get_contents('../data/quick_actions_en.json'), true);
$solutionsEn = json_decode(file_get_contents('../data/solutions_en.json'), true);
$strategicPartnersEn = json_decode(file_get_contents('../data/strategic_partners_en.json'), true);
$teamMembersEn = json_decode(file_get_contents('../data/team_members_en.json'), true);
$techPartnersEn = json_decode(file_get_contents('../data/tech_partners_en.json'), true);
$testimonialsEn = json_decode(file_get_contents('../data/testimonials_en.json'), true);
?>

<!-- 英文内容管理 -->
<div class="container-fluid">
    <h3 class="mb-4">英文内容管理</h3>
    
    <!-- 标签页导航 -->
    <ul class="nav nav-tabs" id="englishContentTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="banners-tab" data-bs-toggle="tab" data-bs-target="#banners-content" type="button" role="tab" aria-controls="banners-content" aria-selected="true">轮播图</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="announcement-tab" data-bs-toggle="tab" data-bs-target="#announcement-content" type="button" role="tab" aria-controls="announcement-content" aria-selected="false">公告</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="features-tab" data-bs-toggle="tab" data-bs-target="#features-content" type="button" role="tab" aria-controls="features-content" aria-selected="false">特性</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="cases-tab" data-bs-toggle="tab" data-bs-target="#cases-content" type="button" role="tab" aria-controls="cases-content" aria-selected="false">案例</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="partner-cases-tab" data-bs-toggle="tab" data-bs-target="#partner-cases-content" type="button" role="tab" aria-controls="partner-cases-content" aria-selected="false">合作案例</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#products-content" type="button" role="tab" aria-controls="products-content" aria-selected="false">产品</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="solutions-tab" data-bs-toggle="tab" data-bs-target="#solutions-content" type="button" role="tab" aria-controls="solutions-content" aria-selected="false">解决方案</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="testimonials-tab" data-bs-toggle="tab" data-bs-target="#testimonials-content" type="button" role="tab" aria-controls="testimonials-content" aria-selected="false">评价管理</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="team-tab" data-bs-toggle="tab" data-bs-target="#team-content" type="button" role="tab" aria-controls="team-content" aria-selected="false">团队成员</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#history-content" type="button" role="tab" aria-controls="history-content" aria-selected="false">发展历程</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="partners-tab" data-bs-toggle="tab" data-bs-target="#partners-content" type="button" role="tab" aria-controls="partners-content" aria-selected="false">合作伙伴</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="footer-tab" data-bs-toggle="tab" data-bs-target="#footer-content" type="button" role="tab" aria-controls="footer-content" aria-selected="false">页脚</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="navigation-tab" data-bs-toggle="tab" data-bs-target="#navigation-content" type="button" role="tab" aria-controls="navigation-content" aria-selected="false">导航</button>
        </li>
    </ul>
    
    <!-- 标签页内容 -->
    <div class="tab-content" id="englishContentTabsContent">
        <!-- 轮播图管理 -->
        <div class="tab-pane fade show active" id="banners-content" role="tabpanel" aria-labelledby="banners-tab">
            <div class="card mt-3">
                <div class="card-body">
                    <div class="mb-3">
                        <div id="banners-container">
                            <!-- 轮播图项将通过JavaScript动态添加 -->
                        </div>
                        <button id="add-banner" class="btn btn-outline-primary mt-2">
                            <i class="bi bi-plus"></i> 添加轮播图
                        </button>
                    </div>
                    <div class="action-buttons">
                        <button id="save-banners" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 公告管理 -->
        <div class="tab-pane fade" id="announcement-content" role="tabpanel" aria-labelledby="announcement-tab">
            <div class="card mt-3">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="announcement-text" class="form-label">公告内容</label>
                        <textarea class="form-control" id="announcement-text" rows="3"><?php echo isset($announcementEn['text']) ? htmlspecialchars($announcementEn['text']) : ''; ?></textarea>
                    </div>
                    <div class="action-buttons">
                        <button id="save-announcement" class="btn btn-primary">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 特性管理 -->
        <div class="tab-pane fade" id="features-content" role="tabpanel" aria-labelledby="features-tab">
            <div class="card mt-3">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="features-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="features-title" value="<?php echo isset($featuresEn['title']) ? htmlspecialchars($featuresEn['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
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
        
        <!-- 其他标签页内容 -->
        <!-- 这里省略其他标签页的内容，将在JavaScript中动态处理 -->
        
        <!-- 合作案例管理 -->
        <div class="tab-pane fade" id="partner-cases-content" role="tabpanel" aria-labelledby="partner-cases-tab">
            <div class="card mt-3">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="partner-cases-en-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="partner-cases-en-title" value="<?php echo isset($partnerCasesEn['title']) ? htmlspecialchars($partnerCasesEn['title']) : ''; ?>">
                    </div>
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
            </div>
        </div>
        
        <!-- 评价管理 -->
        <div class="tab-pane fade" id="testimonials-content" role="tabpanel" aria-labelledby="testimonials-tab">
            <div class="card mt-3">
                <div class="card-body">
                    <div class="mb-3">
                        <label for="testimonials-en-title" class="form-label">标题</label>
                        <input type="text" class="form-control" id="testimonials-en-title" value="<?php echo isset($testimonialsEn['title']) ? htmlspecialchars($testimonialsEn['title']) : ''; ?>">
                    </div>
                    <div class="mb-3">
                        <div id="testimonials-en-container">
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
            </div>
        </div>
        
        <!-- 页脚管理 -->
        <div class="tab-pane fade" id="footer-content" role="tabpanel" aria-labelledby="footer-tab">
            <div id="footer-en-container">
                <!-- 页脚内容将通过JavaScript动态添加 -->
            </div>
        </div>
        
        <!-- 导航管理 -->
        <div class="tab-pane fade" id="navigation-content" role="tabpanel" aria-labelledby="navigation-tab">
            <div id="navigation-en-container">
                <!-- 导航内容将通过JavaScript动态添加 -->
            </div>
        </div>
    </div>
</div>

<!-- 将PHP变量传递给JavaScript -->
<script>
    // 初始化全局变量
    window.bannersEnData = <?php echo json_encode($bannersEn); ?>;
    window.announcementEnData = <?php echo json_encode($announcementEn); ?>;
    window.caseStudiesEnData = <?php echo json_encode($caseStudiesEn); ?>;
    window.cloudProductsEnData = <?php echo json_encode($cloudProductsEn); ?>;
    window.companyHistoryEnData = <?php echo json_encode($companyHistoryEn); ?>;
    window.featuresEnData = <?php echo json_encode($featuresEn); ?>;
    window.footerEnData = <?php echo json_encode($footerEn); ?>;
    window.navigationEnData = <?php echo json_encode($navigationEn); ?>;
    window.partnerCasesEnData = <?php echo json_encode($partnerCasesEn); ?>;
    window.quickActionsEnData = <?php echo json_encode($quickActionsEn); ?>;
    window.solutionsEnData = <?php echo json_encode($solutionsEn); ?>;
    window.strategicPartnersEnData = <?php echo json_encode($strategicPartnersEn); ?>;
    window.teamMembersEnData = <?php echo json_encode($teamMembersEn); ?>;
    window.techPartnersEnData = <?php echo json_encode($techPartnersEn); ?>;
    window.testimonialsEnData = <?php echo json_encode($testimonialsEn); ?>;
</script>

<script type="module" src="js/english-content-manager.js"></script>