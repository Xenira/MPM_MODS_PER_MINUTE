use druid::im::{vector, Vector};
use druid::widget::{Button, Flex, Label, List, Scroll};
use druid::FileDialogOptions;
use druid::FileSpec;
use druid::WindowConfig;
use druid::{
    AppLauncher, Data, Lens, LocalizedString, PlatformError, Widget, WidgetExt, WindowDesc,
};
use serde::{Deserialize, Serialize};
use std::fmt::format;
use std::fs::File;
use std::path::Path;
use std::sync::Arc;

#[derive(Clone, Data, Lens)]
struct AppData {
    mods: Vector<Mod>,
}

#[derive(Clone, Data, Lens, Serialize, Deserialize)]
struct Mod {
    name: String,
    active: bool,
}

fn main() -> Result<(), PlatformError> {
    let main_window = WindowDesc::new(ui_builder)
        .title("MPM: MODS PER MINUTE")
        .window_size((400.0, 400.0));
    let mod_list = load_mods();
    AppLauncher::with_window(main_window)
        .use_simple_logger()
        .launch(AppData {
            mods: Vector::from(mod_list),
        })
}

fn ui_builder() -> impl Widget<AppData> {
    Flex::column().with_flex_child(Flex::row().with_flex_child(build_mod_list(), 1.0), 1.0)
}

fn build_mod_list() -> impl Widget<AppData> {
    let mut root = Flex::column().with_child(Label::new("Mods"));
    let mod_list = Flex::row().with_flex_child(
        Scroll::new(List::new(|| {
            Label::new(|item: &Mod, _env: &_| format!("#{}", item.name))
        }))
        .vertical()
        .lens(AppData::mods),
        1.0,
    );

    let tar_gz = FileSpec::new("Mod archive file", &["tar.gz"]);
    let open_dialog_options = FileDialogOptions::new()
        .allowed_types(vec![tar_gz])
        .default_type(tar_gz)
        .name_label("Source")
        .title("Import Mod archive")
        .button_text("Import");
    let create_button = Button::new("Create").on_click(|ctx, data: &mut AppData, env| {
        ctx.create_sub_window(
            WindowConfig::default(),
            Flex::column(),
            data.clone(),
            env.clone(),
        );
        data.mods.push_back(Mod {
            name: "New Mod".to_string(),
            active: true,
        });
    });
    let add_button = Button::new("Import").on_click(move |ctx, _, _| {
        ctx.submit_command(druid::commands::SHOW_OPEN_PANEL.with(open_dialog_options.clone()));
    });

    root.add_flex_child(mod_list, 1.0);
    root.add_child(
        Flex::row()
            .with_flex_child(create_button, 1.0)
            .with_flex_child(add_button, 1.0),
    );

    return root;
}

fn create_mod_folder() {
    if !std::path::Path::new("mods").exists() {
        std::fs::create_dir("mods").expect("Failed to create mod directory");
    }
}

fn load_mods() -> Vec<Mod> {
    if !std::path::Path::new("mod_list.json").exists() {
        std::fs::write("mod_list.json", "[]").expect("Failed to create mod list file");
    }
    let mod_list_json = Path::new("mod_list.json");
    let file = File::open(mod_list_json).expect("Mod list not found");
    return serde_json::from_reader(file).expect("Failed reading mod list");
}
