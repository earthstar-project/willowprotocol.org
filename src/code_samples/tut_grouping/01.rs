use willow25::prelude::*;

fn main() {
  let namespace_id = NamespaceId::from([0; NAMESPACE_ID_WIDTH]);
  let subspace_id = SubspaceId::from([1; SUBSPACE_ID_WIDTH]);

  // Create an entry for comparisons, with a timestamp of 17.
  let entry = Entry::builder()
    .namespace_id(namespace_id.clone())
    .subspace_id(subspace_id)
    .path(path!("/"))
    .timestamp(17)
    .payload(b"bla")
    .build().unwrap();

  // Check inclusion in some ranges of timestamps.
  assert!(entry.is_in(&TimeRange::new(5.into(), Some(19.into()))));
  assert!(entry.is_in(&TimeRange::new(12.into(), None)));
  assert!(entry.is_in(&TimeRange::new_closed(5.into(), 19.into())));
  assert!(entry.is_in(&TimeRange::new_open(12.into())));
  assert!(!entry.is_in(&TimeRange::new_open(33.into())));

  let intersection = 
      TimeRange::new_closed(5.into(), 19.into())
      .intersection(&TimeRange::new_open(12.into()))
      .expect("intersection is nonempty");
  assert_eq!(intersection, TimeRange::new_closed(12.into(), 19.into()));
  assert!(entry.is_in(&intersection));
  assert!(entry.is_in_intersection(
    &TimeRange::new_closed(5.into(), 19.into()),
    &TimeRange::new_open(12.into()),
  ));
}