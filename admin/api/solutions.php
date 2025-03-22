<?php
/**
 * 解决方案管理API
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
$filePath = '../../data/solutions.json';
$enFilePath = '../../data/solutions_en.json';

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
    if (!isset($data['title']) || !isset($data['plans']) || !is_array($data['plans'])) {
        throw new Exception('数据格式不正确，缺少必要字段');
    }
    
    // 首先加载当前的中文和英文数据
    $currentZhData = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : ['title' => '解决方案', 'plans' => []];
    $currentEnData = file_exists($enFilePath) ? json_decode(file_get_contents($enFilePath), true) : ['title' => 'Solutions', 'plans' => []];
    
    // 处理数据以过滤英文内容
    $plansData = json_decode($postData, true);
    $chinesePlans = [];
    
    // 构建英文解决方案标题的映射，用于排除相似的英文内容
    $englishTitles = [];
    if (isset($currentEnData['plans']) && is_array($currentEnData['plans'])) {
        foreach ($currentEnData['plans'] as $plan) {
            $englishTitles[] = strtolower($plan['title']);
        }
    }
    
    // 验证解决方案数据
    foreach ($data['plans'] as $plan) {
        if (!isset($plan['title']) || !isset($plan['subtitle']) || 
            !isset($plan['isPopular']) || !isset($plan['features']) || 
            !isset($plan['link']) || !is_array($plan['features'])) {
            throw new Exception('解决方案数据格式不正确，缺少必要字段');
        }
        
        // 确保所有features项都是字符串
        foreach ($plan['features'] as $feature) {
            if (!is_string($feature)) {
                throw new Exception('特性项必须是字符串');
            }
        }
        
        // 规则1: 检查是否至少有一个中文字符在标题或副标题中
        $hasChinese = preg_match("/[\x{4e00}-\x{9fa5}]/u", $plan['title'] . $plan['subtitle']);
        
        // 规则2: 检查是否与英文内容相似（忽略大小写）
        $isMatchingEnglish = false;
        $currentTitle = strtolower($plan['title']);
        
        foreach ($englishTitles as $enTitle) {
            // 检查是否有超过70%的相似度
            similar_text($currentTitle, $enTitle, $percent);
            if ($percent > 70) {
                $isMatchingEnglish = true;
                break;
            }
        }
        
        // 仅当有中文内容且不匹配任何英文内容时，才保留
        if ($hasChinese && !$isMatchingEnglish) {
            // 确保没有重复添加
            $isDuplicate = false;
            foreach ($chinesePlans as $existingPlan) {
                if ($existingPlan['title'] === $plan['title']) {
                    $isDuplicate = true;
                    break;
                }
            }
            
            if (!$isDuplicate) {
                $chinesePlans[] = $plan;
            }
        }
    }
    
    // 如果没有找到中文解决方案，就保留当前的中文数据
    if (empty($chinesePlans)) {
        // 不做任何修改，保持原始中文数据
        echo json_encode([
            'success' => true,
            'message' => '没有检测到新的中文解决方案数据，保持现有数据不变'
        ]);
        exit;
    } else {
        // 更新数据并保存
        $saveData = [
            'title' => $data['title'],
            'plans' => $chinesePlans
        ];
        $result = file_put_contents($filePath, json_encode($saveData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    if ($result === false) {
        throw new Exception('写入文件失败');
    }
    
    echo json_encode([
        'success' => true,
        'message' => '解决方案内容已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}