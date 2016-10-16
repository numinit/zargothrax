require "#{Rails.root}/lib/proteomics/fasta"
require "#{Rails.root}/lib/dispatch/dispatcher"

namespace :protein do

  desc "Batch n tasks at random from the FASTA data at path. 1 protein per client."
  task :fastabatch, [:n, :path, :timeout] => [:environment] do |t, args|

    args.with_defaults(timeout: "30000")

    proteins = ProteinCollection.new args[:path]
    named_proteins = proteins.toHashBy(:name)

    stamp = Random.new.random_number(1000000000).to_s
    # XXX Maybe remove stamp once it becomes unnecessary.
    name  = "fasta_manycontact_#{stamp}"
    chosen_names = named_proteins.keys.sample(args[:n].to_i) 
    js_args = chosen_names.map{|n| [n, named_proteins[n]]}

    # Populate database
    dispatch(name, "contact_matrix.js", js_args, args[:timeout].to_i, redundancy=1)	

  end

  desc "Batch all tasks from FASTA data at path. 1 protein per client. Be careful."
  task :batchall, [:path, :timeout] => [:environment] do |t, args|

    args.with_defaults(timeout: "30000")

    proteins = ProteinCollection.new args[:path]
    named_proteins = proteins.toHashBy(:name)
    name = "fasta_contact_all"
    js_args = named_proteins.to_a 
    dispatch(name, "contact_matrix.js", js_args, args[:timeout].to_i, redundancy=1)
  end
end
