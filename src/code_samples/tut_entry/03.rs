use std::time::{SystemTime, UNIX_EPOCH};
use willow_25::{Component, Entry, NamespaceId25, Path, PayloadDigest25, SubspaceId25};

fn main() {
    let namespace_id = NamespaceId25::new_communal();
    let (subspace_id, _key) = SubspaceId25::new();

    let path_component = Component::new(b"blog").unwrap();
    let path = Path::new_singleton(path_component).unwrap();

    let duration = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
    let timestamp = duration.as_micros();

    let payload = b"hello";
    let digest = PayloadDigest25::new_from_slice(payload);

    let entry = Entry::new(
        namespace_id,
        subspace_id,
        path,
        timestamp as u64,
        payload.len() as u64,
        digest,
    );

    let payload2 = b"bye-bye";
    let digest2 = PayloadDigest25::new_from_slice(payload2);

    let entry2 = Entry::new(
        entry.namespace_id().clone(),
        entry.subspace_id().clone(),
        entry.path().clone(),
        entry.timestamp() + 1,
        payload2.len() as u64,
        digest2,
    );

    if entry2.is_newer_than(&entry) {
        println!("entry2 is newer than entry!")
    } else {
        panic!("entry is newer than entry2?!")
    }
    
    let payload3 = b"ahem!";
    let digest3 = PayloadDigest25::new_from_slice(payload3);
    let path3 = Path::new_empty();
    
    let entry3 = Entry::new(
        entry.namespace_id().clone(),
        entry.subspace_id().clone(),
        path3,
        entry2.timestamp() + 1,
        payload3.len() as u64,
        digest3,
    );
    
    if entry2.is_pruned_by(&entry3) {
        println!("entry2 would be pruned by entry3!")
    } else {
        panic!("entry2 would not be pruned by entry3?!")
    }
}
