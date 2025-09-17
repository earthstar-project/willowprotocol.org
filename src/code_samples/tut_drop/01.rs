use willow_25::{
    AccessMode, AuthorisationToken, AuthorisedEntry, Capability, Entry, NamespaceId25, Path,
    PayloadDigest25, SubspaceId25,
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
        }
        
        std::fs::remove_dir_all("my_db").unwrap();
    }
}