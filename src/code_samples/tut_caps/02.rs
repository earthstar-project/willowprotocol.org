use willow_25::{
    AccessMode, Area, AreaSubspace, Capability, NamespaceId25, Path, Range, SubspaceId25,
};

fn main() {
    // Owned capabilities

    let (alfie_id, alfie_key) = SubspaceId25::new();
    let (my_namespace, my_namespace_secret) = NamespaceId25::new_owned();

    let root_cap = Capability::new_owned(
        my_namespace,
        &my_namespace_secret,
        alfie_id.clone(),
        AccessMode::Read,
    )
    .unwrap();

    println!("An owned namespace capability: {:#?}", root_cap);

    let (betty_id, betty_key) = SubspaceId25::new();

    let only_blogs_area = Area::new(
        AreaSubspace::Any,
        Path::from_slices(&["blog"]).unwrap(),
        Range::new_open(0),
    );

    let cap_for_betty = root_cap
        .delegate(&alfie_key, &betty_id, &only_blogs_area)
        .unwrap();

    println!(
        "A delegated owned namespace cap for Betty: {:#?}",
        cap_for_betty
    );

    // Communal capabilities

    let communal_namespace = NamespaceId25::new_communal();

    let alfie_communal_cap =
        Capability::new_communal(communal_namespace.clone(), alfie_id, AccessMode::Write).unwrap();

    println!(
        "A communal namespace cap for Alfie: {:#?}",
        alfie_communal_cap
    );

    let betty_communal_cap = Capability::new_communal(
        communal_namespace.clone(),
        betty_id.clone(),
        AccessMode::Write,
    )
    .unwrap();

    println!(
        "A communal namespace cap for betty: {:#?}",
        betty_communal_cap
    );
}
