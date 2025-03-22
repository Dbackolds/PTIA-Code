<?php
/**
 * 特性管理API
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
$filePath = '../../data/features.json';

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
    // 处理数据以过滤英文内容
    $featuresData = json_decode($postData, true);
    $chineseFeatures = [];
    
    // 如果已存在features_en.json，加载英文特性的ID
    $enFilePath = '../../data/features_en.json';
    $englishFeatureIds = [];
    if (file_exists($enFilePath)) {
        $featuresEn = json_decode(file_get_contents($enFilePath), true);
        if (isset($featuresEn['features']) && is_array($featuresEn['features'])) {
            foreach ($featuresEn['features'] as $feature) {
                if (isset($feature['id'])) {
                    $englishFeatureIds[] = $feature['id'];
                }
            }
        }
    }
    
    // 过滤特性数据，只保留中文特性
    foreach ($featuresData['features'] as $feature) {
        // 检查是否至少有一个中文字符在标题或描述中
        if (preg_match("/[\x{4e00}-\x{9fa5}]/u", $feature['title'] . $feature['description']) && 
            (!isset($feature['id']) || !in_array($feature['id'], $englishFeatureIds))) {
            // 移除可能存在的ID，以免影响英文版数据
            if (isset($feature['id'])) {
                unset($feature['id']);
            }
            $chineseFeatures[] = $feature;
        }
    }
    
    // 如果没有找到中文特性，就保持原始数据
    if (empty($chineseFeatures) && !empty($featuresData['features'])) {
        $result = file_put_contents($filePath, $postData);
    } else {
        // 更新数据并保存
        $featuresData['features'] = $chineseFeatures;
        $result = file_put_contents($filePath, json_encode($featuresData));
    }
    
    if ($result === false) {
        throw new Exception('写入文件失败');
    }
    
    echo json_encode([
        'success' => true,
        'message' => '特性信息已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}