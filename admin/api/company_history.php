<?php
/**
 * 发展历程数据API
 * 处理发展历程数据的增删改查
 */

// 启动会话
session_start();

// 检查是否已登录
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => '未授权访问']);
    exit;
}

// 数据文件路径
$dataFile = '../../data/company_history.json';

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

// 根据请求方法处理不同操作
switch ($method) {
    case 'GET':
        // 读取数据
        if (file_exists($dataFile)) {
            header('Content-Type: application/json');
            echo file_get_contents($dataFile);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['title' => '发展历程', 'description' => '我们在数字解决方案领域的成长之路', 'milestones' => []]);
        }
        break;
        
    case 'POST':
        // 接收数据
        $content = file_get_contents('php://input');
        $data = json_decode($content, true);
        
        // 验证数据
        if (json_last_error() !== JSON_ERROR_NONE) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'JSON格式错误']);
            exit;
        }
        
        // 确保关键字段存在
        if (!isset($data['title']) || !isset($data['description']) || !isset($data['milestones'])) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => '缺少必要的数据字段']);
            exit;
        }
        
        // 写入数据文件
        if (file_put_contents($dataFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => '发展历程数据保存成功']);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => '数据保存失败，请检查文件权限']);
        }
        break;
        
    default:
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => '不支持的请求方法']);
        break;
} 