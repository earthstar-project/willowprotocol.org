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

  let oops = Entry::prefilled_builder(&entry)
    .path(path!("/blog/idea"))
    .timestamp(entry.timestamp() + 10.minutes())
    .payload(b"")
    .build().unwrap();

  println!("{:#?}", oops);

  assert_eq!(entry.namespace_id(), oops.namespace_id());
  assert_ne!(entry, oops);
  assert!(oops.is_newer_than(&entry));
  assert!(entry.is_pruned_by(&oops));
}