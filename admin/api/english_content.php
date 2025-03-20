<?php
/**
 * 英文内容管理API
 * 负责处理所有英文JSON文件的保存请求
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

// 获取内容类型
$type = isset($_GET['type']) ? $_GET['type'] : '';

// 验证内容类型
if (!$type) {
    echo json_encode([
        'success' => false,
        'message' => '缺少内容类型参数'
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

// 根据内容类型确定文件路径
$filePath = '';
switch ($type) {
    case 'banners':
        $filePath = '../../data/banners_en.json';
        break;
    case 'announcement':
        $filePath = '../../data/announcement_en.json';
        break;
    case 'features':
        $filePath = '../../data/features_en.json';
        break;
    case 'cases':
        $filePath = '../../data/case_studies_en.json';
        break;
    case 'products':
        $filePath = '../../data/cloud_products_en.json';
        break;
    case 'solutions':
        $filePath = '../../data/solutions_en.json';
        break;
    case 'team':
        $filePath = '../../data/team_members_en.json';
        break;
    case 'history':
        $filePath = '../../data/company_history_en.json';
        break;
    case 'strategic_partners':
        $filePath = '../../data/strategic_partners_en.json';
        break;
    case 'tech_partners':
        $filePath = '../../data/tech_partners_en.json';
        break;
    case 'footer':
        $filePath = '../../data/footer_en.json';
        break;
    case 'navigation':
        $filePath = '../../data/navigation_en.json';
        break;
    case 'partner_cases':
        $filePath = '../../data/partner_cases_en.json';
        break;
    case 'testimonials':
        $filePath = '../../data/testimonials_en.json';
        break;
    case 'quick_actions':
        $filePath = '../../data/quick_actions_en.json';
        break;
    default:
        echo json_encode([
            'success' => false,
            'message' => '未知的内容类型'
        ]);
        exit;
}

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
        'message' => '英文内容已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}