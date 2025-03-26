use std::sync::{Arc, Mutex};
use axum::{
    routing::post,
    Router, Json,
    extract::{State, Path},
    response::IntoResponse,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tokio::net::TcpListener;
use tower_http::cors::{CorsLayer, Any};
use std::net::SocketAddr;
use tokio::task::JoinHandle;
use tokio::sync::oneshot;
use std::time::Duration;
use serde_json::Value as JsonValue;

// 定义请求和响应的数据结构
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiRequest {
    pub params: serde_json::Value,
    pub timestamp: Option<String>,
    pub path: Option<String>,
}

// 定义服务器控制结构
pub struct ServerControl {
    pub shutdown_tx: Option<oneshot::Sender<()>>,
    pub task_handle: Option<JoinHandle<()>>,
}

impl Default for ServerControl {
    fn default() -> Self {
        Self {
            shutdown_tx: None,
            task_handle: None,
        }
    }
}

// 定义应用状态
#[derive(Default)]
pub struct AppState {
    pub server_control: Mutex<ServerControl>,
    pub is_running: Mutex<bool>,
}

// 定义Web服务器状态
#[derive(Clone)]
struct WebServerState {
    app_handle: tauri::AppHandle,
}

// 处理API请求的处理函数
async fn handle_api_request(
    State(state): State<WebServerState>,
    Path(path): Path<String>,
    Json(body): Json<JsonValue>,
) -> impl IntoResponse {

    let request = ApiRequest {
        params: body.clone(),
        timestamp: Some(chrono::Local::now().to_rfc3339()),
        path:  Some(path.clone()),
    };

    // 通过事件发送到前端
    let _ = state.app_handle.emit("new-api-call", &request);

    // 返回成功响应
    (StatusCode::OK, Json(serde_json::json!({ "status": "success" })))
}

// 启动Web服务器
pub async fn start_server(app_handle: tauri::AppHandle, app_state: Arc<AppState>, port: u16) -> Result<(), String> {
    // 检查服务器是否已经在运行
    {
        let server_control = app_state.server_control.lock().unwrap();
        if server_control.task_handle.is_some() || server_control.shutdown_tx.is_some() {
            return Err("服务器已经在运行".to_string());
        }
    }

    // 设置服务器运行状态
    {
        let mut is_running = app_state.is_running.lock().unwrap();
        *is_running = true;
    }

    // 创建CORS中间件
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // 创建Web服务器状态
    let state = WebServerState {
        app_handle: app_handle.clone(),
    };

    // 创建路由
    let app = Router::new()
        .route("/*path", post(handle_api_request))
        .with_state(state)
        .layer(cors);

    // 绑定地址
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    // 创建关闭信号通道
    let (shutdown_tx, shutdown_rx) = oneshot::channel();

    // 尝试绑定TcpListener
    let listener = match TcpListener::bind(addr).await {
        Ok(listener) => {
            println!("Web服务器启动在 http://{}", addr);
            listener
        },
        Err(e) => {
            // 如果绑定失败，设置状态为未运行
            {
                let mut is_running = app_state.is_running.lock().unwrap();
                *is_running = false;
            }
            return Err(format!("绑定端口 {} 失败: {}", port, e));
        }
    };

    // 在新线程中运行服务器
    let app_clone = app.clone();
    let handle = tokio::spawn(async move {
        axum::serve(listener, app_clone.into_make_service())
            .with_graceful_shutdown(async {
                shutdown_rx.await.ok();
                println!("正在优雅地关闭服务器...");
            })
            .await
            .unwrap_or_else(|e| {
                println!("服务器错误: {}", e);
            });
        println!("服务器已完全关闭");
    });

    // 保存服务器控制结构
    {
        let mut server_control = app_state.server_control.lock().unwrap();
        server_control.shutdown_tx = Some(shutdown_tx);
        server_control.task_handle = Some(handle);
    }

    Ok(())
}

// 停止Web服务器
pub async fn stop_server(app_state: Arc<AppState>) -> Result<(), String> {
    // 设置服务器停止状态
    {
        let mut is_running = app_state.is_running.lock().unwrap();
        *is_running = false;
    }

    // 获取关闭通道和任务句柄
    let (shutdown_tx, task_handle) = {
        let mut server_control = app_state.server_control.lock().unwrap();
        (server_control.shutdown_tx.take(), server_control.task_handle.take())
    };

    // 发送关闭信号
    if let Some(tx) = shutdown_tx {
        if tx.send(()).is_err() {
            println!("服务器已经关闭，无法发送关闭信号");
        }
    } else {
        return Err("服务器未在运行".to_string());
    }

    // 等待任务完成
    if let Some(handle) = task_handle {
        // 给服务器一些时间来优雅地关闭
        match tokio::time::timeout(Duration::from_secs(5), handle).await {
            Ok(result) => {
                match result {
                    Ok(_) => println!("服务器已成功关闭"),
                    Err(e) => println!("服务器关闭时发生错误: {}", e),
                }
            },
            Err(_) => {
                println!("服务器关闭超时，强制终止");
                // 超时后仍然没有关闭，则强制终止
                // 但保持状态为已经清理
            }
        }
    }

    Ok(())
}