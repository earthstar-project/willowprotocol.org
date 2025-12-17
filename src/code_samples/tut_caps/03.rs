use rand::rngs::OsRng;
use willow25::prelude::*;

fn main() {
    let mut csprng = OsRng;

    let (alfie_id, alfie_secret) = randomly_generate_subspace(&mut csprng);
    let communal_namespace_id = NamespaceId::from_bytes(&[17; 32]);

    // Create a new communal capability.
    // To use it, we'll need Alfie's secret.
    let communal_cap =
        WriteCapability::new_communal(communal_namespace_id.clone(), alfie_id.clone());

    println!("A communal capability: {:#?}", communal_cap);

    let entry_communal = Entry::builder()
        .namespace_id(communal_namespace_id.clone())
        .subspace_id(alfie_id.clone())
        .path(path!("/ideas"))
        .timestamp(12345)
        .payload(b"chocolate with mustard")
        .build()
        .unwrap();

    // Authorise the entry using the communal capability and Alfie's secret.
    let communal_authed = entry_communal.into_authorised_entry(&communal_cap, &alfie_secret);

    assert!(communal_authed.is_ok());
    println!("Entry for communal namespace was authorised!");

    // Create the keypair of an owned namespace.
    let (owned_namespace_id, namespace_secret) = randomly_generate_owned_namespace(&mut csprng);

    // Create a new owned capability using the namespace secret.
    // To use it, we'll need Alfie's secret.
    let mut owned_cap = WriteCapability::new_owned(&namespace_secret, alfie_id);

    // Create a keypair for Betty.
    let (betty_id, betty_secret) = randomly_generate_subspace(&mut csprng);

    // Delegate our owned cap to Betty, restricting her to her own subspace.
    // To use it, we'll need Betty's secret.
    owned_cap.delegate(
        &alfie_secret,
        Area::new_subspace_area(betty_id.clone()),
        betty_id.clone(),
    );

    println!("A delegated owned capability: {:#?}", owned_cap);

    let entry_owned = Entry::builder()
        .namespace_id(owned_namespace_id.clone())
        .subspace_id(betty_id)
        .path(path!("/blog"))
        .timestamp(45689)
        .payload(b"worried about alfie...")
        .build()
        .unwrap();

    // Authorise the entry using the owned capability and Betty's secret.
    let owned_authed = entry_owned.into_authorised_entry(&owned_cap, &betty_secret);

    assert!(owned_authed.is_ok());
    println!("Entry for owned namespace was authorised!")
}
