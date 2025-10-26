use willow25::prelude::*;

fn main() {
    let namespace_id = NamespaceId::from([0; NAMESPACE_ID_WIDTH]);
    let subspace_id = SubspaceId::from([1; SUBSPACE_ID_WIDTH]);

    let entry = Entry::builder()
        .namespace_id(namespace_id)
        .subspace_id(subspace_id)
        .path(path!("/blog/idea/1"))
        .now().unwrap()
        .payload(b"Dear reader, I've got a great idea")
        .build().unwrap();

    println!("{:#?}", entry);
}
