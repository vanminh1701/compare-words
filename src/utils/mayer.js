function shortest_edit(a, b) {
  // shortest_edit
  const n = a.length;
  const m = b.length;

  const max = n + m;

  // array to store the latest value of x for each k (k in range -max...max)
  const v = Array.from({ length: 2 * max - 1 });

  v[1] = 0;
  let trace = [];

  for (let d = 0; d <= max; d++) {
    trace.push([...v]);

    for (let k = -d; k <= d; k += 2) {
      let x, y;

      if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
        x = v[k + 1];
      } else {
        x = v[k - 1] + 1;
      }

      y = x - k;

      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }

      v[k] = x;

      if (x >= n && y >= m) return trace;
    }
  }
}

function backtrack(a, b) {
  let x = a.length,
    y = b.length;

  shortest_edit(a, b).forEach((v, d) => {
    v.reverse();
    const k = x - y;
    let prev_k, prev_x, prev_y;

    if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
      prev_k = k + 1;
    } else {
      prev_k = k - 1;
    }

    prev_x = v[prev_k];
    prev_y = prev_x - prev_k;

    while (x > prev_x && y > prev_y) {
      console.log(d, " : ", x - 1, y - 1, x, y);
      x--;
      y--;
    }
  });
}

console.log("find_d: ", shortest_edit("ABCABBA", "CBABAC"));
