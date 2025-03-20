<?php
/**
 * 快速操作API
 * 处理快速操作数据的增删改查
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
$dataFile = '../../data/quick_actions.json';

// 获取所有可用操作
function getAllAvailableActions() {
    return [
        ['id' => 'announcement', 'icon' => 'bi-megaphone', 'title' => '管理公告'],
        ['id' => 'banners', 'icon' => 'bi-images', 'title' => '管理轮播图'],
        ['id' => 'products', 'icon' => 'bi-box', 'title' => '管理云产品'],
        ['id' => 'features', 'icon' => 'bi-lightbulb', 'title' => '管理特性'],
        ['id' => 'cases', 'icon' => 'bi-briefcase', 'title' => '管理案例'],
        ['id' => 'testimonials', 'icon' => 'bi-chat-quote', 'title' => '管理评价'],
        ['id' => 'solutions', 'icon' => 'bi-diagram-3', 'title' => '管理解决方案'],
        ['id' => 'strategic_partners', 'icon' => 'bi-building', 'title' => '管理合作伙伴'],
        ['id' => 'partner_cases', 'icon' => 'bi-file-earmark-text', 'title' => '管理合作案例'],
        ['id' => 'team_members', 'icon' => 'bi-people', 'title' => '管理团队成员'],
        ['id' => 'company_history', 'icon' => 'bi-clock-history', 'title' => '管理发展历程'],
        ['id' => 'footer', 'icon' => 'bi-layout-text-window-reverse', 'title' => '管理页脚'],
        ['id' => 'navigation', 'icon' => 'bi-list', 'title' => '管理导航栏']
    ];
}

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

// 根据请求方法处理不同操作
switch ($method) {
    case 'GET':
        // 读取快速操作数据
        if (isset($_GET['all']) && $_GET['all'] === 'true') {
            // 返回所有可用操作
            header('Content-Type: application/json');
            echo json_encode(['actions' => getAllAvailableActions()]);
        } else {
            // 返回当前设置的快速操作
            if (file_exists($dataFile)) {
                header('Content-Type: application/json');
                echo file_get_contents($dataFile);
            } else {
                // 默认快速操作
                $defaultActions = [
                    'actions' => [
                        ['id' => 'announcement', 'icon' => 'bi-megaphone', 'title' => '管理公告'],
                        ['id' => 'banners', 'icon' => 'bi-images', 'title' => '管理轮播图'],
                        ['id' => 'products', 'icon' => 'bi-box', 'title' => '管理云产品'],
                        ['id' => 'team_members', 'icon' => 'bi-people', 'title' => '管理团队成员'],
                        ['id' => 'footer', 'icon' => 'bi-layout-text-window-reverse', 'title' => '管理页脚']
                    ]
                ];
                header('Content-Type: application/json');
                echo json_encode($defaultActions);
            }
        }
        break;
        
    case 'POST':
        // 保存快速操作数据
        $content = file_get_contents('php://input');
        $data = json_decode($content, true);
        
        // 验证数据
        if (json_last_error() !== JSON_ERROR_NONE) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'JSON格式错误']);
            exit;
        }
        
        // 确保关键字段存在
        if (!isset($data['actions']) || !is_array($data['actions'])) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => '缺少必要的数据字段']);
            exit;
        }
        
        // 写入数据文件
        if (file_put_contents($dataFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => '快速操作设置保存成功']);
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