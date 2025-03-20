<?php
/**
 * 语言文件内容API
 * 用于读取和保存语言文件
 */

// 设置内容类型为JSON
header('Content-Type: application/json');

// 允许跨域请求
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// 如果是OPTIONS请求，提前返回结果
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// 根据请求方法处理
$method = $_SERVER['REQUEST_METHOD'];

// 获取语言类型
$type = isset($_GET['type']) ? $_GET['type'] : null;

// 语言文件路径
$en_file_path = '../languages/en/common.php';
$zh_file_path = '../languages/zh/common.php';

// 检查语言类型是否有效
if (!in_array($type, ['en', 'zh'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '无效的语言类型'
    ]);
    exit;
}

// 根据请求方法处理
if ($method === 'GET') {
    // 读取语言文件
    $file_path = $type === 'en' ? $en_file_path : $zh_file_path;
    
    if (!file_exists($file_path)) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => '语言文件不存在'
        ]);
        exit;
    }
    
    // 包含PHP文件并获取返回的数组
    $language_data = include($file_path);
    
    // 返回语言数据
    echo json_encode($language_data);
    exit;
} elseif ($method === 'POST') {
    // 保存语言文件
    $file_path = $type === 'en' ? $en_file_path : $zh_file_path;
    
    // 获取提交的数据
    $json_data = file_get_contents('php://input');
    $language_data = json_decode($json_data, true);
    
    if ($language_data === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => '无效的JSON数据'
        ]);
        exit;
    }
    
    // 创建PHP数组字符串
    $php_content = "<?php\n/**\n * " . ($type === 'en' ? '英文' : '中文') . "语言文件 - 通用\n */\n\nreturn [\n";
    
    // 添加数组内容
    foreach ($language_data as $key => $value) {
        $key = addslashes($key);
        $value = addslashes($value);
        $php_content .= "    '$key' => '$value',\n";
    }
    
    $php_content .= "]; \n";
    
    // 写入文件
    if (file_put_contents($file_path, $php_content) === false) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => '无法写入语言文件'
        ]);
        exit;
    }
    
    // 返回成功结果
    echo json_encode([
        'success' => true,
        'message' => '语言文件已成功保存'
    ]);
    exit;
} else {
    // 不支持的请求方法
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '不支持的请求方法'
    ]);
    exit;
} 