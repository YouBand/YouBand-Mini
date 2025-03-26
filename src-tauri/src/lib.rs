mod cmd;
mod tray;
mod webserver;

use tauri::{Manager, WindowEvent};
use cmd::{user_cmd,sys_cmd,web_cmd};
use tauri_plugin_autostart::MacosLauncher;

use std::sync::Arc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state = Arc::new(webserver::AppState::default());
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--flag1", "--flag2"])))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .setup(move |app| {
            tray::create_tray(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event: &WindowEvent| match event {
            WindowEvent::Focused(flag) => {
                if !window.label().eq("tray") && *flag {
                    window
                        .app_handle()
                        .get_webview_window("tray")
                        .unwrap()
                        .hide()
                        .unwrap();
                }
                if window.label().eq("tray") && !flag {
                    window.hide().unwrap();
                }
            }
            _ => (),
        })
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            user_cmd::get_user_info,
            user_cmd::save_user_info,
            sys_cmd::get_system_info,
            web_cmd::start_webserver,
            web_cmd::stop_webserver
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
