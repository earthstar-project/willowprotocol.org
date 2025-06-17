use willow_25::{Area, Entry, NamespaceId25, Path, PayloadDigest25, Range, SubspaceId25};
use willow_data_model::grouping::AreaSubspace;

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

    // Areas

    let (alfie_subspace, _key) = SubspaceId25::new();
    let (betty_subspace, _key) = SubspaceId25::new();
    let blog_path = Path::from_slices(&["blog"]).unwrap();

    let late_time_range = Range::new_closed(500, 1000).unwrap();

    let any_late_blog_area = Area::new(AreaSubspace::Any, blog_path, late_time_range);

    let alfie_early_blog_entry = Entry::new(
        NamespaceId25::new_communal(),
        alfie_subspace.clone(),
        Path::from_slices(&["blog", "breakfast"]).unwrap(),
        100,
        0,
        PayloadDigest25::default(),
    );

    let betty_late_blog_entry = Entry::new(
        NamespaceId25::new_communal(),
        betty_subspace.clone(),
        Path::from_slices(&["blog", "dinner"]).unwrap(),
        800,
        0,
        PayloadDigest25::default(),
    );

    println!(
        "any_late_blog_area includes alfie_early_blog_entry: {:?}",
        any_late_blog_area.includes_entry(&alfie_early_blog_entry)
    );

    println!(
        "any_late_blog_area includes betty_late_blog_entry: {:?}",
        any_late_blog_area.includes_entry(&betty_late_blog_entry)
    );

    let alfie_everything_area = Area::new(
        AreaSubspace::Id(alfie_subspace),
        Path::new_empty(),
        Range::new_open(0),
    );

    println!(
        "alfie_everything_area includes alfie_early_blog_entry: {:?}",
        alfie_everything_area.includes_entry(&alfie_early_blog_entry)
    );

    println!(
        "alfie_everything_area includes betty_late_blog_entry: {:?}",
        alfie_everything_area.includes_entry(&betty_late_blog_entry)
    );
}
