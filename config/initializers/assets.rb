require 'closure-compiler'

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

Rails.application.config.assets.js_compressor = Closure::Compiler.new(
  compilation_level: 'ADVANCED_OPTIMIZATIONS',
  language_in: 'ECMASCRIPT5_STRICT',
  process_closure_primitives: true,
  only_closure_dependencies: true,
  closure_entry_point: 'zx',
  debug: true
)

# Add additional assets to the asset load path
vendor_assets = File.realpath(File.join(File.dirname(__FILE__), '..', '..', 'vendor', 'assets'))
Rails.application.config.assets.paths << vendor_assets

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.debug = false
Rails.application.config.assets.compress = true
Rails.application.config.assets.precompile += %w[zx.js zx-worker.js zx.css payloads/contact_matrix.js]
