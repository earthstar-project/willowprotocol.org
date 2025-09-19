use ufotofu::consumer::IntoVec;
use willow_25::{
    AccessMode, Area, AuthorisationToken, AuthorisedEntry, Capability, Entry, NamespaceId25, Path,
    PayloadDigest25, SubspaceId25, create_drop,
    data_model::{EntryIngestionSuccess, EntryOrigin, Store},
};
use willow_store_simple_sled::StoreSimpleSled;

fn main() {
    smol::block_on(async {
        // Instantiate a store
        let namespace_id = NamespaceId25::new_communal();
        let export_db = sled::open("import_db").unwrap();

        let export_store = StoreSimpleSled::<
            1024,
            1024,
            1024,
            NamespaceId25,
            SubspaceId25,
            PayloadDigest25,
            AuthorisationToken,
        >::new(&namespace_id, export_db)
        .unwrap();

        println!("Instantiated the export store!");

        // Create an entry
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
            // Ingest the entry...
            if let Ok(EntryIngestionSuccess::Success) = export_store
                .ingest_entry(authed_entry, false, EntryOrigin::Local)
                .await
            {
                println!("We ingested the entry!")
            }

            // Encode a sideloading drop into a Vec<u8>
            let full_area = Area::new_full();
            let drop_destination = IntoVec::<u8>::new();
            let intovec_with_drop = create_drop(
                drop_destination,
                namespace_id.clone(),
                vec![full_area],
                &export_store,
            )
            .await
            .unwrap();
            let drop_vec = intovec_with_drop.into_vec();
            println!("We created the drop!");

            std::fs::remove_dir_all("import_db").unwrap();
        });
    });
}
