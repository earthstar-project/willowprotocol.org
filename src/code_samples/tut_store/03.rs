use willow25::prelude::*;
use willow25::storage::MemoryStore;

use rand::rngs::OsRng;

fn main() {
    // Store operations are async
    smol::block_on(async {
        // Instantiate an in-memory store.
        let mut store = MemoryStore::new();

        // Create an entry and authorise it.
        let mut csprng = OsRng;

        let (alfie_id, alfie_secret) = randomly_generate_subspace(&mut csprng);
        let communal_namespace_id = NamespaceId::from_bytes(&[17; 32]);

        let communal_cap =
            WriteCapability::new_communal(communal_namespace_id.clone(), alfie_id.clone());

        let entry_communal = Entry::builder()
            .namespace_id(communal_namespace_id.clone())
            .subspace_id(alfie_id.clone())
            .path(path!("/ideas"))
            .timestamp(12345)
            .payload(b"chocolate with mustard")
            .build();

        // Authorise the entry using the communal
        // capability and Alfie's secret.
        let communal_authed = entry_communal
            .into_authorised_entry(&communal_cap, &alfie_secret)
            .unwrap();

        // Insert an entry
        store.insert_entry(communal_authed).await.unwrap();
        println!("Successully inserted entry");

        // ... and retrieve it.
        if let Some(_entry) = store
            .get_entry(
                &communal_namespace_id,
                &(alfie_id.clone(), path!("/ideas")),
                None,
            )
            .await
            .unwrap()
        {
            println!("We got our entry back out!")
        }
    })
}
