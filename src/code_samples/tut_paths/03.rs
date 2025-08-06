use willow_25::{Component, Path};

fn main() {
  let empty_path = Path::new_empty();
  println!("A path with nothing in it: {:?}", empty_path);

  let path = Path::new_empty();
  let component1 = Component::new(b"ideas").unwrap();
  let component2 = Component::new(b"game").unwrap();
  let ideas_path = path.append(component1).unwrap();
  let ideas_game_path = ideas_path.append(component2).unwrap();
  println!("A path with two components: {:?}", ideas_game_path);

  let ideas_game_path2 = path.append_slice(&[component1, component2]).unwrap();
  println!("Another path with two components: {:?}", ideas_game_path2);
}