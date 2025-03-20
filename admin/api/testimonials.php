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
    // 确保数据格式正确
    if (!isset($data['title']) || !isset($data['reviews']) || !is_array($data['reviews'])) {
        throw new Exception('数据格式不正确，缺少必要字段');
    }
    
    // 验证评价数据
    foreach ($data['reviews'] as $review) {
        if (!isset($review['avatar']) || !isset($review['name']) || !isset($review['content'])) {
            throw new Exception('评价数据格式不正确，缺少必要字段');
        }
    }
    
    // 准备要保存的数据
    $saveData = [
        'title' => $data['title'],
        'reviews' => $data['reviews']
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