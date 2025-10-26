use willow_25::Range;

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
}
