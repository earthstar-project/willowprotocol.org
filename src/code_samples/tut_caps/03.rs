use willow_25::{
    AccessMode, Area, AreaSubspace, AuthorisedEntry, Capability, Entry, NamespaceId25, Path,
    PayloadDigest25, Range, SubspaceId25,
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

    // Authorised entries

    let betty_entry = Entry::new(
        communal_namespace.clone(),
        betty_id.clone(),
        Path::new_empty(),
        100,
        0,
        PayloadDigest25::default(),
    );

    let valid_token = betty_communal_cap
        .authorisation_token(&betty_entry, betty_key)
        .unwrap();

    let authorised_entry = AuthorisedEntry::new(betty_entry, valid_token).unwrap();

    println!("An authorised entry: {:?}", authorised_entry);

    let (_muriarty_id, muriarty_key) = SubspaceId25::new();

    let malicious_entry = Entry::new(
        communal_namespace,
        betty_id,
        Path::from_slices(&["i", "stink"]).unwrap(),
        100,
        0,
        PayloadDigest25::default(),
    );

    let signing_error = betty_communal_cap.authorisation_token(&malicious_entry, muriarty_key);

    println!("A signing error: {:?}", signing_error);
}
