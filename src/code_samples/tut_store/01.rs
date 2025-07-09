use willow_25::{AuthorisationToken, NamespaceId25, PayloadDigest25, SubspaceId25};
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

    std::fs::remove_dir_all("my_db").unwrap();
}
