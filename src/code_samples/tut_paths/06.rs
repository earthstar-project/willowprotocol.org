use willow25::prelude::*;

fn main() {
  let empty_path = Path::new();
  println!("A path with nothing in it: {:?}", empty_path);

  let path = Path::new();
  let component1 = component!("ideas");
  let component2 = component!("game");
  let ideas_path = path.append_component(component1).unwrap();
  let ideas_game_path = ideas_path.append_component(component2).unwrap();
  println!("A path with two components: {:?}", ideas_game_path);

  let ideas_game_path2 = path.append_components(&[component1, component2]).unwrap();
  println!("Another path with two components: {:?}", ideas_game_path2);

  let component3 = component!("design");
  let long_path = Path::from_components(&[component1, component2, component3]).unwrap();
  println!("A path with three components: {:?}", long_path);

  if ideas_path.is_prefix_of(&long_path) {
    println!(
      "ideas_path ({:?}) is a prefix of long_path ({:?})!",
      ideas_path, long_path
    );
  }

  for prefix in long_path.all_prefixes() {
    println!("{:?} is a prefix of long_path!", prefix)
  }
}