use willow25::prelude::*;

fn main() {
    let namespace_id = NamespaceId::from([0; NAMESPACE_ID_WIDTH]);
    let subspace_id = SubspaceId::from([1; SUBSPACE_ID_WIDTH]);

    // Create an entry for comparisons, with a timestamp of 17.
    let entry = Entry::builder()
        .namespace_id(namespace_id)
        .subspace_id(subspace_id)
        .path(path!("/"))
        .timestamp(17)
        .payload(b"bla")
        .build()
        .unwrap();

    // Can create TimeRanges from arbitrary rust ranges of Timestamps.
    assert!(entry.is_in(&TimeRange::from(5.into()..19.into())));
    assert!(entry.is_in(&TimeRange::from(5.into()..)));
    assert!(entry.is_in(&TimeRange::from(..19.into())));
    assert!(entry.is_in(&TimeRange::from(5.into()..=17.into())));
    assert!(entry.is_in(&TimeRange::from(..)));
    assert!(!entry.is_in(&TimeRange::from(33.into()..)));

    let intersection = TimeRange::from(..19.into())
        .intersection(&TimeRange::from(5.into()..));
    assert_eq!(intersection, TimeRange::from(5.into()..19.into()));
    assert!(entry.is_in(&intersection));
    assert!(entry.is_in_intersection(
        &TimeRange::from(..19.into()),
        &TimeRange::from(5.into()..),
    ));
}