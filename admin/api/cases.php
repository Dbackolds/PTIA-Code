<?php
/**
 * 案例管理API
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
$filePath = '../../data/case_studies.json';
$enFilePath = '../../data/case_studies_en.json';

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
    // 首先加载当前的中文和英文数据
    $currentZhData = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : ['title' => '成功案例', 'cases' => []];
    $currentEnData = file_exists($enFilePath) ? json_decode(file_get_contents($enFilePath), true) : ['title' => 'Case Studies', 'cases' => []];
    
    // 处理数据以过滤英文内容
    $casesData = json_decode($postData, true);
    $chineseCases = [];
    
    // 构建英文案例标题和描述的映射，用于排除相似的英文内容
    $englishTitlesAndDescriptions = [];
    if (isset($currentEnData['cases']) && is_array($currentEnData['cases'])) {
        foreach ($currentEnData['cases'] as $case) {
            $englishTitlesAndDescriptions[] = strtolower($case['title'] . ' ' . $case['description']);
        }
    }
    
    // 过滤案例数据，只保留中文案例
    if (isset($casesData['cases']) && is_array($casesData['cases'])) {
        foreach ($casesData['cases'] as $case) {
            // 规则1: 检查是否至少有一个中文字符在标题或描述中
            $hasChinese = preg_match("/[\x{4e00}-\x{9fa5}]/u", $case['title'] . $case['description']);
            
            // 规则2: 检查是否与英文内容相似（忽略大小写）
            $isMatchingEnglish = false;
            $currentText = strtolower($case['title'] . ' ' . $case['description']);
            
            foreach ($englishTitlesAndDescriptions as $enText) {
                // 检查是否有超过70%的相似度
                similar_text($currentText, $enText, $percent);
                if ($percent > 70) {
                    $isMatchingEnglish = true;
                    break;
                }
            }
            
            // 仅当有中文内容且不匹配任何英文内容时，才保留
            if ($hasChinese && !$isMatchingEnglish) {
                // 确保没有重复添加
                $isDuplicate = false;
                foreach ($chineseCases as $existingCase) {
                    if ($existingCase['title'] === $case['title']) {
                        $isDuplicate = true;
                        break;
                    }
                }
                
                if (!$isDuplicate) {
                    $chineseCases[] = $case;
                }
            }
        }
    }
    
    // 如果没有找到中文案例，就保留当前的中文数据
    if (empty($chineseCases)) {
        // 不做任何修改，保持原始中文数据
        echo json_encode([
            'success' => true,
            'message' => '没有检测到新的中文案例数据，保持现有数据不变'
        ]);
        exit;
    } else {
        // 更新数据并保存
        $casesData['cases'] = $chineseCases;
        $result = file_put_contents($filePath, json_encode($casesData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    if ($result === false) {
        throw new Exception('写入文件失败');
    }
    
    echo json_encode([
        'success' => true,
        'message' => '案例信息已成功保存'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '保存失败: ' . $e->getMessage()
    ]);
}