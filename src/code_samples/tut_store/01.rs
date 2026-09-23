use willow25::prelude::*;
use willow25::storage::MemoryStore;

fn main() {
    // Store operations are async
    smol::block_on(async {
        // Instantiate an in-memory store.
        let mut store = MemoryStore::new();
    })
}
