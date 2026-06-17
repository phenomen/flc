// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    flc_lib::run()
}

#[unsafe(no_mangle)]
#[cfg(target_os = "windows")]
pub static NvOptimusEnablement: u32 = 0x00000001;

#[unsafe(no_mangle)]
#[cfg(target_os = "windows")]
pub static AmdPowerXpressRequestHighPerformance: i32 = 1;
