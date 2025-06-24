use ufotofu::{Producer, producer::FromSlice};
use willow_25::{
    AccessMode, Area, AreaSubspace, AuthorisationToken, AuthorisedEntry, Capability, Entry,
    NamespaceId25, Path, PayloadDigest25, Range, SubspaceId25,
    data_model::{EntryIngestionSuccess, EntryOrigin, QueryIgnoreParams, Store},
};
use willow_store_simple_sled::StoreSimpleSled;

fn main() {
    // Instantiate a store
    let namespace_id = NamespaceId25::new_communal();
    let db = sled::open("my_db").unwrap();

    let store = StoreSimpleSled::<
        1024,
        1024,
        1024,
        NamespaceId25,
        SubspaceId25,
        PayloadDigest25,
        AuthorisationToken,
    >::new(&namespace_id, db)
    .unwrap();
    
    println!("Instantiated the store!");

    // Create an entry and authorise it
    let (alfie_id, alfie_secret) = SubspaceId25::new();

    let write_cap =
        Capability::new_communal(namespace_id.clone(), alfie_id.clone(), AccessMode::Write)
            .unwrap();

    let path = Path::from_slices(&["ideas", "clock"]).unwrap();
    let payload = b"An emoji clock";
    let digest = PayloadDigest25::new_from_slice(payload);

    let entry = Entry::new(
        namespace_id.clone(),
        alfie_id.clone(),
        path.clone(),
        100,
        payload.len() as u64,
        digest.clone(),
    );

    let token = write_cap.authorisation_token(&entry, alfie_secret).unwrap();

    let authed_entry = AuthorisedEntry::new(entry, token).unwrap();

    smol::block_on(async {
        // Ingest an entry...
        if let Ok(EntryIngestionSuccess::Success) = store
            .ingest_entry(authed_entry, false, EntryOrigin::Local)
            .await
        {
            println!("We ingested the entry!")
        }

        // ... and retrieve it.
        if let Some(_entry) = store
            .entry(&alfie_id, &path, QueryIgnoreParams::default())
            .await
            .unwrap()
        {
            println!("We got our entry back out!")
        }

        // Try to retrieve its payload...
        match store.payload(&alfie_id, &path, 0, None).await {
            Ok(_payload) => println!("We have the payload!"),
            Err(_) => println!("We haven't ingested the payload yet!"),
        }

        // ... append some data to the payload...
        if let Ok(_success) = store
            .append_payload(&alfie_id, &path, Some(digest), &mut FromSlice::new(payload))
            .await
        {
            println!("Appended the payload!")
        }

        // ... and try to retrieve it again.
        match store.payload(&alfie_id, &path, 0, None).await {
            Ok(_payload) => println!("We have the payload!"),
            Err(_) => println!("We haven't ingested the payload yet!"),
        }

        // Query by area
        let ideas_area = Area::new(
            AreaSubspace::Id(alfie_id.clone()),
            path.clone(),
            Range::new_open(0),
        );

        if let Ok(mut entry_producer) = store
            .query_area(&ideas_area, QueryIgnoreParams::default())
            .await
        {
            while let Ok(_lengthy_authed_entry) = entry_producer.produce_item().await {
                println!("Found an entry in the area!")
            }
        }
    });

    std::fs::remove_dir_all("my_db").unwrap();
}
