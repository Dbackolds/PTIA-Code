<?php
/**
 * 评价管理API
 */

// 设置响应头为JSON
header('Content-Type: application/json');

// 允许跨域请求
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 如果是OPTIONS请求（预检请求），直接返回成功
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => '只支持POST请求'
    ]);
    exit;
}

// 获取POST数据
$postData = file_get_contents('php://input');

// 验证是否为有效的JSON
if (!$postData || !($data = json_decode($postData, true))) {
    echo json_encode([
        'success' => false,
        'message' => '无效的JSON数据'
    ]);
    exit;
}

// 内容文件路径
$filePath = '../../data/testimonials.json';
$enFilePath = '../../data/testimonials_en.json';

// 检查文件是否可写
if (!is_writable(dirname($filePath)) && !file_exists($filePath)) {
    echo json_encode([
        'success' => false,
        'message' => '目录不可写入，请检查权限'
    ]);
    exit;
}

// 写入文件
try {
    // 确保数据格式正确 - 兼容前端管理器使用reviews字段
    if (!isset($data['title'])) {
        throw new Exception('数据格式不正确，缺少标题字段');
    }
    
    // 验证评价数据，兼容reviews或testimonials字段
    $reviews = isset($data['reviews']) ? $data['reviews'] : (isset($data['testimonials']) ? $data['testimonials'] : []);
    
    if (!is_array($reviews)) {
        throw new Exception('评价数据格式不正确，缺少必要字段');
    }
    
    // 首先加载当前的中文和英文数据
    $currentZhData = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : ['title' => '客户评价', 'reviews' => []];
    $currentEnData = file_exists($enFilePath) ? json_decode(file_get_contents($enFilePath), true) : ['title' => 'Testimonials', 'reviews' => []];
    
    // 构建英文评价的映射，用于排除相似的英文内容
    $englishReviewsContent = [];
    $englishReviewsNames = [];
    if (isset($currentEnData['reviews']) && is_array($currentEnData['reviews'])) {
        foreach ($currentEnData['reviews'] as $review) {
            $englishReviewsContent[] = strtolower($review['content']);
            $englishReviewsNames[] = strtolower($review['name']);
        }
    } else if (isset($currentEnData['testimonials']) && is_array($currentEnData['testimonials'])) {
        foreach ($currentEnData['testimonials'] as $review) {
            $englishReviewsContent[] = strtolower($review['content']);
            $englishReviewsNames[] = strtolower($review['name']);
        }
    }
    
    // 过滤出中文评价
    $chineseReviews = [];
    foreach ($reviews as $review) {
        if (!isset($review['avatar']) || !isset($review['name']) || !isset($review['content'])) {
            throw new Exception('评价数据格式不正确，缺少必要字段');
        }
        
        // 规则1: 检查是否至少有一个中文字符在名称或内容中
        $hasChinese = preg_match("/[\x{4e00}-\x{9fa5}]/u", $review['name'] . $review['content']);
        
        // 规则2: 检查是否与英文内容相似（忽略大小写）
        $isMatchingEnglish = false;
        $currentName = strtolower($review['name']);
        $currentContent = strtolower($review['content']);
        
        // 检查名称
        foreach ($englishReviewsNames as $enName) {
            similar_text($currentName, $enName, $percentName);
            if ($percentName > 70) {
                $isMatchingEnglish = true;
                break;
            }
        }
        
        // 检查内容
        if (!$isMatchingEnglish) {
            foreach ($englishReviewsContent as $enContent) {
                similar_text($currentContent, $enContent, $percentContent);
                if ($percentContent > 70) {
                    $isMatchingEnglish = true;
                    break;
                }
            }
        }
        
        // 仅当有中文内容且不匹配任何英文内容时，才保留
        if ($hasChinese && !$isMatchingEnglish) {
            // 确保没有重复添加
            $isDuplicate = false;
            foreach ($chineseReviews as $existingReview) {
                if ($existingReview['name'] === $review['name'] && $existingReview['content'] === $review['content']) {
                    $isDuplicate = true;
                    break;
                }
            }
            
            if (!$isDuplicate) {
                $chineseReviews[] = $review;
            }
        }
    }
    
    // 如果没有找到中文评价，就保留当前的中文数据
    if (empty($chineseReviews)) {
        // 不做任何修改，保持原始中文数据
        echo json_encode([
            'success' => true,
            'message' => '没有检测到新的中文评价数据，保持现有数据不变'
        ]);
        exit;
    }
    
    // 准备要保存的数据 - 使用reviews字段
    $saveData = [
        'title' => $data['title'],
        'reviews' => $chineseReviews
    ];
    
    $result = file_put_contents($filePath, json_encode($saveData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    
    if ($result === false) {
        throw new Exception('写入文件失败');
    }
    
    echo json_encode([
        'success' => true,
        'message' => '评价内容已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}