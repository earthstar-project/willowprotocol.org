use willow_25::{Entry, NamespaceId25, Path, PayloadDigest25, Range, Range3d, SubspaceId25};
use willow_data_model::{SubspaceId};

fn main() {
    // Ranges
    let open_range = Range::new_open(10);
    let closed_range = Range::new_closed(15, 20).unwrap();
    let closed_range2 = Range::new_closed(5, 15).unwrap();

    println!("open_range includes 5: {:?}", open_range.includes(&5));
    println!("open_range includes 15: {:?}", open_range.includes(&10));

    println!(
        "open range includes closed_range: {:?}",
        open_range.includes_range(&closed_range)
    );

    println!(
        "open range includes closed_range2: {:?}",
        open_range.includes_range(&closed_range2)
    );

    let intersection = open_range.intersection(&closed_range2);

    match intersection {
        Some(new_range) => {
            println!("The intersection of open_range and closed_range2 is:");
            println!("{:#?}", new_range);
        }
        None => panic!("There is no intersection between open_range and closed_range2?!"),
    }

    // Range3d

    // The subspace dimension
    let (alfie_subspace, _key) = SubspaceId25::new();
    let only_alfie_range = alfie_subspace.singleton_range();

    // The path dimension
    let blog_path = Path::from_slices(&["blog"]).unwrap();
    let only_blog_range = blog_path.singleton_range();

    // The time dimension
    let early_range = Range::new_closed(0, 500).unwrap();

    let early_blog_range3d = Range3d::new(only_alfie_range, only_blog_range, early_range);

    let alfie_early_blog_entry = Entry::new(
        NamespaceId25::new_communal(),
        alfie_subspace.clone(),
        Path::from_slices(&["blog", "breakfast"]).unwrap(),
        100,
        0,
        PayloadDigest25::default(),
    );

    println!(
        "early_blog_range includes alfie_early_blog_entry: ${:?}",
        early_blog_range3d.includes_entry(&alfie_early_blog_entry)
    );

    let alfie_late_blog_entry = Entry::new(
        NamespaceId25::new_communal(),
        alfie_subspace.clone(),
        Path::from_slices(&["blog", "dinner"]).unwrap(),
        800,
        0,
        PayloadDigest25::default(),
    );

    println!(
        "early_blog_range includes alfie_late_blog_entry: ${:?}",
        early_blog_range3d.includes_entry(&alfie_late_blog_entry)
    );
}
