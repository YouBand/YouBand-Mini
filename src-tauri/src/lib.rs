use tauri::{Manager, WindowEvent};
mod user_cmd;
use user_cmd::{get_user_info, save_user_info};
mod sys_cmd;
use sys_cmd::get_system_info;
mod tray;
use tauri_plugin_autostart::MacosLauncher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
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
        .invoke_handler(tauri::generate_handler![
            get_user_info,
            save_user_info,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
