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

    println!("An entry: {:?}", entry);
}
