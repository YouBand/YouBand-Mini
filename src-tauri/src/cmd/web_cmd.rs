use std::sync::Arc;
use crate::webserver;

// 启动Web服务器
#[tauri::command]
pub async fn start_webserver(app: tauri::AppHandle, state: tauri::State<'_, Arc<webserver::AppState>>, port: u16) -> Result<(), String> {
    webserver::start_server(app, state.inner().clone(), port).await
}

// 停止Web服务器
#[tauri::command]
pub async fn stop_webserver(state: tauri::State<'_, Arc<webserver::AppState>>) -> Result<(), String> {
    webserver::stop_server(state.inner().clone()).await
}