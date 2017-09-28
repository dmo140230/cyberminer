'use strict'

function Alpha(circ_lines) {
    this.alpha_lines = mergeSort(circ_lines.slice());
}

Alpha.prototype.getAlphaLines = function(){
  return this.alpha_lines;
}
/* exports.alphabetize = function(circ_lines, callback){
    var alpha_lines = mergeSort(circ_lines.slice());
    callback(alpha_lines)
} */


var mergeSort = function(array) {
    function merge(arr, aux, lo, mid, hi) {
      for (var k = lo; k <= hi; k++) {
        aux[k] = arr[k];
      }
  
      var i = lo;
      var j = mid + 1;
      for (var k = lo; k <= hi; k++) {
        if (i > mid) {
          arr[k] = aux[j++];
        } else if (j > hi) {
          arr[k] = aux[i++];
        } else if (aux[i] < aux[j]) {
          arr[k] = aux[i++];
        } else {
          arr[k] = aux[j++];
        }
      }
    }
  
    function sort(array, aux, lo, hi) {
      if (hi <= lo) return;
      var mid = Math.floor(lo + (hi - lo) / 2);
      sort(array, aux, lo, mid);
      sort(array, aux, mid + 1, hi);
  
      merge(array, aux, lo, mid, hi);
    }
  
    function merge_sort(array) {
      var aux = array.slice(0);
      sort(array, aux, 0, array.length - 1);
      return array;
    }
  
    return merge_sort(array);
  }
  
  module.exports = Alpha;