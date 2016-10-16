#!/usr/bin/ruby

# Suggested source of FASTA data:
# ftp://ftp.ncbi.nih.gov/refseq/H_sapiens/H_sapiens/protein/

class ProteinCollection
  attr_reader :proteins

  def initialize(path)
    #Ignore comments.
    source = File.readlines(path, 'r').select{|l| !(l.match("/W+;.*"))}.join
    #Divide into statements.
    @proteins = source.split(">").select{|x| !(x.empty?)}.map{|x| Protein.new x}
  end

  # Create a hash mapping some attribute of a protein to its sequence from a
  # collection.
  def toHashBy(attr)
    return @proteins.reduce({}) {|h, p| h.update({p.send(attr)=>p.seq})}
  end
end

class Protein
  attr_reader :id, :accession, :name, :seq
  
  def initialize(fasta_descriptor)
    # FASTA descriptors take the form:
    # >gi|IDENT|ref|ACCESSION|Name name name name \n SEQUENCE

    if fasta_descriptor[0] == ">"
      fasta_descriptor = fasta_descriptor[1..-1]
    end

    if fasta_descriptor.include? ">"
      throw "Your FASTA descriptor contains a non-initial '>'."
    end

    fields = fasta_descriptor.split("|")
    if fields.length < 5
      throw "FASTA descriptor needs at least 5 fields and a sequence."
    end

    # Entrez GI for peptide seq should have these in the headers.
    # Nobody agrees on which identifiers to use, so if we're in doubt, don't use.
    @id        = fields[0] == "gi"  ? fields[1] : nil
    @accession = fields[2] == "ref" ? fields[3] : nil
    # Name and sequence aren't delimited.
    @name      = fields[4].split("\n")[0].strip
    @seq       = fields[4].split("\n")[1..-1].join
  end

  def validate()
    @seq.all? {|c| "ARNDCQEGHILKMFPSTWYVX".include? c}
  end
end
