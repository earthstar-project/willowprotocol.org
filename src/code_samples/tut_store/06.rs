use bab_rs::generic::storage::verifiable_streaming::SliceStreamingOptions;
use ufotofu::producer::clone_from_slice;
use willow25::prelude::*;
use willow25::storage::MemoryStore;

use rand::rngs::OsRng;
use ufotofu::prelude::*;

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

        // Retrieve the payload
        let mut vec: Vec<u8> = vec![];
        let mut vec_consumer = (&mut vec).into_consumer();

        store
            .get_payload_slice(
                &communal_namespace_id,
                &(alfie_id.clone(), path!("/ideas")),
                None,
                0,
                u64::MAX,
                &mut vec_consumer,
            )
            .await
            .unwrap();

        println!("{:?}", vec_consumer);
        println!("Oops, we didn't append the payload yet!");

        // Append the payload
        let mut payload_producer = clone_from_slice(b"chocolate with mustard");

        store
            .append_to_payload_prefix(
                &communal_namespace_id,
                &(alfie_id.clone(), path!("/ideas")),
                &mut payload_producer,
                SliceStreamingOptions::default(),
            )
            .await
            .unwrap();

        println!("We appended the payload");

        // Retrieve the payload... again.
        store
            .get_payload_slice(
                &communal_namespace_id,
                &(alfie_id.clone(), path!("/ideas")),
                None,
                0,
                u64::MAX,
                &mut vec_consumer,
            )
            .await
            .unwrap();

        println!("{:?}", vec_consumer);
        println!("That's more like it.");

        // Query by area
        let entry_vec = Vec::new();
        let mut entry_consumer = entry_vec.into_consumer();

        let alfie_area = Area::new_subspace_area(alfie_id.clone());

        store
            .get_area(&communal_namespace_id, &alfie_area, &mut entry_consumer)
            .await
            .unwrap();

        println!(
            "Fetched our entry from the area! Our vec has this many entries inside: {:?}",
            entry_consumer.as_slice().len()
        );
    })
}
