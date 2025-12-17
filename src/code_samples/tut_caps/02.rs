use rand::rngs::OsRng;
use willow25::prelude::*;

fn main() {
  let mut csprng = OsRng;

  let (alfie_id, alfie_secret) =
    randomly_generate_subspace(&mut csprng);
  let communal_namespace_id =
    NamespaceId::from_bytes(&[17; 32]);

  // Create a new communal capability.
  // To use it, we'll need Alfie's secret.
  let communal_cap =
    WriteCapability::new_communal(
      communal_namespace_id.clone(),
      alfie_id.clone(),
    );

  println!("A communal capability: {:#?}", communal_cap);

  let entry_communal = Entry::builder()
    .namespace_id(communal_namespace_id.clone())
    .subspace_id(alfie_id.clone())
    .path(path!("/ideas"))
    .timestamp(12345)
    .payload(b"chocolate with mustard")
    .build().unwrap();

  // Authorise the entry using the communal
  // capability and Alfie's secret.
  let communal_authed = entry_communal
    .into_authorised_entry(
      &communal_cap,
      &alfie_secret,
    );

  assert!(communal_authed.is_ok());
  println!("Entry for communal namespace was authorised!");
}