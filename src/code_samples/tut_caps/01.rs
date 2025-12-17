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
}
