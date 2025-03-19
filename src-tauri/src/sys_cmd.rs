use serde::Serialize;
use sysinfo::{CpuExt, DiskExt, NetworkExt, System, SystemExt};

#[derive(Debug, Serialize)]
pub struct SystemInfo {
    cpu_usage: f32,
    cpu_cores: usize,
    memory_total: u64,
    memory_used: u64,
    disk_total: u64,
    disk_used: u64,
    network_rx: u64,
    network_tx: u64,
}

#[tauri::command]
#[allow(unused_must_use)]
pub async fn get_system_info() -> Result<SystemInfo, String> {
    let mut sys = System::new_all();
    sys.refresh_all(); // 刷新所有系统信息
                       // 获取CPU使用率
    let cpu_usage = sys.global_cpu_info().cpu_usage();
    // 获取CPU核心数
    let cpu_cores = sys.cpus().len();
    // 获取内存信息
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    // 获取磁盘信息
    let disk_total: u64 = sys.disks().iter().map(|disk| disk.total_space()).sum();
    let disk_used: u64 = sys
        .disks()
        .iter()
        .map(|disk| disk.total_space() - disk.available_space())
        .sum();
    // 获取网络信息
    let networks = sys.networks();
    let mut network_rx = 0;
    let mut network_tx = 0;
    for (_, network) in networks {
        network_rx += network.received();
        network_tx += network.transmitted();
    }
    let info = SystemInfo {
        cpu_usage,
        cpu_cores,
        memory_total,
        memory_used,
        disk_total,
        disk_used,
        network_rx,
        network_tx,
    };
    Ok(info)
}
