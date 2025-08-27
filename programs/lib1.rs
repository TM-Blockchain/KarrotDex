[package]
name = "bridge"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"

# Optional: for ZK verifier or Merkle logic (only include if needed)
# sha2 = "0.10"              # If you use SHA256 hashes
# serde = { version = "1.0", features = ["derive"] }

[features]
no-entrypoint = []
