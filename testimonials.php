<?php
/**
 * 评价管理页面
 */

// 加载公共头部
require_once 'includes/header.php';

// 加载评价数据
$testimonials = json_decode(file_get_contents('../data/testimonials.json'), true);
?>

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

<script>
// 将PHP数据传递给JavaScript
const testimonialsData = <?php echo json_encode($testimonials); ?>;
</script>

<!-- 引入Bootstrap和管理脚本-->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script type="module" src="js/main.js"></script>

<?php
// 加载公共底部
require_once 'includes/footer.php';
?>