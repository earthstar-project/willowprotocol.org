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

    // Area
    let alfie_subspace = SubspaceId::from([17; SUBSPACE_ID_WIDTH]);
    let betty_subspace = SubspaceId::from([64; SUBSPACE_ID_WIDTH]);

    let alfie_early_blog_entry = Entry::builder()
        .namespace_id(namespace_id.clone())
        .subspace_id(alfie_subspace.clone())
        .path(path!("/blog/breakfast"))
        .timestamp(100)
        .payload(b"I made the most delicious pancakes today.")
        .build()
        .unwrap();

    let betty_late_blog_entry = Entry::builder()
        .namespace_id(namespace_id.clone())
        .subspace_id(betty_subspace.clone())
        .path(path!("/blog/dinner"))
        .timestamp(800)
        .payload(b"Salmon is great when you're low on time.")
        .build()
        .unwrap();

    let late_time_range = TimeRange::from(500.into()..1000.into());
    let any_late_blog_area = Area::new(None, path!("/blog"), late_time_range);

    assert!(betty_late_blog_entry.is_in(&any_late_blog_area));
    assert!(!alfie_early_blog_entry.is_in(&any_late_blog_area));

    let alfie_all_area = Area::new(Some(alfie_subspace), path!("/blog"), TimeRange::full());

    assert!(!betty_late_blog_entry.is_in(&alfie_all_area));
    assert!(alfie_early_blog_entry.is_in(&alfie_all_area));
}