// From a vector of names and an (at least triangular) matrix containing the
// scores between any two residues, generate a mapping relating each pair to 
// a penalty score.
function createScoringMatrix(names, scores) {
  var mtx = {};
  for (i = 0; i < names.length; i++) {
    mtx[names[i]] = {};
    for (j = 0; j < names.length; j++) {
      console.log(i);
      mtx[names[i]][names[j]] = scores[i][j] || scores[j][i];
    }
  }
  return mtx;
}

// Return a protein contact matrix for two amino acid residue sequences.
function contactMatrix(scoringMatrix, thresh, p, q) {
  var contact = {};
  for (i = 0; i < p.length; i++) {
    contact[i] = {};
    for (j = 0; j < q.length; j++) {
      contact[i][j] = (scoringMatrix[p[i]][q[j]] < thresh) ? 1 : 0;
    }
  }
  return contact;
}

aminoAcids = "ARNDCQEGHILKMFPSTWYVX";
// See Pearson, "Selecting the Right Similarity-Scoring Matrix"
// from Curr Protoc Bioinformatics. 2013; 43: 3.5.1-3.5.9
// DOI: 10.1002/047125093.bi0305s43
BLOSUM62Scores = [
  [ 4],
  [-1, 5],
  [-2, 0, 6],
  [-2,-2, 1, 6],
  [ 0,-3,-3,-3, 9],
  [-1, 1, 0, 0,-3, 5],
  [-1, 0, 0, 2,-4, 2, 5],
  [ 0,-2, 0,-1,-3,-2,-2, 6],
  [-2, 0, 1,-1,-3, 0, 0,-2, 8],
  [-1,-3,-3,-3,-1,-3,-3,-4,-3, 4],
  [-1,-2,-3,-4,-1,-2,-3,-4,-3, 2, 4],
  [-1, 2, 0,-1,-3, 1, 1,-2,-1,-3,-2, 5],
  [-1,-1,-2,-3,-1, 0,-2,-3,-2, 1, 2,-1, 5],
  [-2,-3,-3,-3,-2,-3,-3,-3,-1, 0, 0,-3, 0, 6],
  [-1,-2,-2,-1,-3,-1,-1,-2,-2,-3,-3,-1,-2,-4, 7],
  [ 1,-1, 1, 0,-1, 0, 0, 0,-1,-2,-2, 0,-1,-2,-1, 4],
  [ 0,-1, 0,-1,-1,-1,-1,-2,-2,-1,-1,-1,-1,-2,-1, 1, 5],
  [-3,-3,-4,-4,-2,-2,-3,-2,-2,-3,-2,-3,-1, 1,-4,-3,-2, 11],
  [-2,-2,-2,-3,-2,-1,-2,-3,-2,-1,-1,-2,-1, 3,-3,-2,-2, 2, 7],
  [0, -3,-3,-3,-1,-2,-2,-3,-3,-3, 1,-2, 1,-1,-2,-2, 0,-3,-1, 4],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
];

// Penalties for every amino acid pair
BLOSUM62 = createScoringMatrix(aminoAcids, BLOSUM62Scores);

function turn_me_into_the_entry_point_plz(seq) {
  return contactMatrix(BLOSUM62, -2, seq, seq);
}

// TEST
// var fake = "ARNRNDDRNRCQEEEQRNECQRNCQXA";
// var contact = turn_me_into_the_entry_point_plz(fake);
// console.log(contact[5]);
