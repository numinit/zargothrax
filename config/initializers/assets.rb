require 'closure-compiler'

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

Rails.application.config.assets.js_compressor = Closure::Compiler.new(
  compilation_level: 'ADVANCED_OPTIMIZATIONS',
  language_in: 'ECMASCRIPT5_STRICT',
  process_closure_primitives: true,
  only_closure_dependencies: true,
  closure_entry_point: 'zargothrax'
)

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.debug = false
Rails.application.config.assets.compress = true
Rails.application.config.assets.precompile += %w[zx.js zx.css]
