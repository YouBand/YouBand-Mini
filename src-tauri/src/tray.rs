use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, PhysicalPosition, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let _ = TrayIconBuilder::with_id("youband")
        .tooltip("YouBand")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                id: _,
                position,
                rect: _,
                button,
                button_state,
            } => match button {
                MouseButton::Left {} => {
                    let windows = tray.app_handle().webview_windows();
                    for (key, value) in windows {
                        if key == "login" || key == "home" {
                            value.show().unwrap();
                            value.unminimize().unwrap();
                            value.set_focus().unwrap();
                        }
                    }
                }
                MouseButton::Right if MouseButtonState::Down == button_state => {
                    let tray_window = tray.app_handle().get_webview_window("tray").unwrap();
                    if let Ok(outer_size) = tray_window.outer_size() {
                        tray_window
                            .set_position(PhysicalPosition::new(
                                position.x,
                                position.y - outer_size.height as f64,
                            ))
                            .unwrap();
                        tray_window.set_always_on_top(true).unwrap();
                        tray_window.show().unwrap();
                        tray_window.set_focus().unwrap();
                    }
                    tray.app_handle().emit("tray_menu", position).unwrap();
                }
                _ => {}
            },
            TrayIconEvent::Enter {
                id: _,
                position,
                rect: _,
            } => {
                tray.app_handle().emit("tray_enter", position).unwrap();
            }
            TrayIconEvent::Leave {
                id: _,
                position,
                rect: _,
            } => {
                tray.app_handle().emit("tray_leave", position).unwrap();
            }
            _ => {}
        })
        .build(app);
    Ok(())
}
