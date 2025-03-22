<?php
/**
 * 轮播图管理API
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
$filePath = '../../data/banners.json';

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
    // 剔除可能被自动添加的英文轮播图数据
    // 只保留中文轮播图数据
    $bannersData = json_decode($postData, true);
    $chineseBanners = [];
    
    // 过滤轮播图数据，只保留中文轮播图
    // 通常中文轮播图的标题和描述包含中文字符
    foreach ($bannersData['banners'] as $banner) {
        // 检查是否至少有一个中文字符在标题或描述中
        if (preg_match("/[\x{4e00}-\x{9fa5}]/u", $banner['title'] . $banner['description'])) {
            $chineseBanners[] = $banner;
        }
    }
    
    // 如果没有找到中文轮播图，就使用原始数据
    if (empty($chineseBanners) && !empty($bannersData['banners'])) {
        $result = file_put_contents($filePath, $postData);
    } else {
        // 重构数据并保存
        $bannersData['banners'] = $chineseBanners;
        $result = file_put_contents($filePath, json_encode($bannersData));
    }
    
    if ($result === false) {
        throw new Exception('写入文件失败');
    }
    
    echo json_encode([
        'success' => true,
        'message' => '轮播图信息已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}