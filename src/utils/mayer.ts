function shortest_edit(a: string, b: string): number | undefined {
  // shortest_edit
  const n: number = a.length;
  const m: number = b.length;

  const max: number = n + m;

  // array to store the latest value of x for each k (k in range -max...max)
  const v: number[] = Array.from({ length: 2 * max - 1 });
  v[0] = 0;

  for (let d = 0; d <= max; d++) {
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
      if (x >= n && y <= m) return d;
    }
  }
}

console.log("find_d: ", shortest_edit("abx", "abce"));
export {};
