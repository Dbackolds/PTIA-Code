<?php
/**
 * 导航栏管理API
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

// 验证并清理导航数据
if (isset($data['main_nav']) && is_array($data['main_nav'])) {
    // 过滤掉空标题的导航项
    $data['main_nav'] = array_filter($data['main_nav'], function($item) {
        return isset($item['title']) && trim($item['title']) !== '';
    });
    
    // 重新索引数组
    $data['main_nav'] = array_values($data['main_nav']);
    
    // 处理每个导航项的下拉菜单
    foreach ($data['main_nav'] as $key => $nav) {
        if (isset($nav['dropdown']) && $nav['dropdown'] && isset($nav['dropdown_items']) && is_array($nav['dropdown_items'])) {
            // 过滤掉空标题的下拉项
            $data['main_nav'][$key]['dropdown_items'] = array_filter($nav['dropdown_items'], function($item) {
                return isset($item['title']) && trim($item['title']) !== '';
            });
            
            // 重新索引数组
            $data['main_nav'][$key]['dropdown_items'] = array_values($data['main_nav'][$key]['dropdown_items']);
        }
    }
}

// 验证并清理登录按钮数据
if (isset($data['login_buttons']) && is_array($data['login_buttons'])) {
    // 过滤掉空标题的按钮
    $data['login_buttons'] = array_filter($data['login_buttons'], function($item) {
        return isset($item['title']) && trim($item['title']) !== '';
    });
    
    // 重新索引数组
    $data['login_buttons'] = array_values($data['login_buttons']);
}

// 更新JSON数据
$postData = json_encode($data);

// 内容文件路径
$filePath = '../../data/navigation.json';

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
    $result = file_put_contents($filePath, $postData);
    
    if ($result === false) {
        throw new Exception('写入文件失败');
    }
    
    echo json_encode([
        'success' => true,
        'message' => '导航栏信息已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}