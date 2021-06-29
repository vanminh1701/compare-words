function findMaxDiff(root: string, compareText: string): number {
  let i: number = 0;
  let idx: number = 0;

  while (i < root.length) {
    if (root[i] !== compareText[i]) {
      idx = i;
      ++i;
    } else {
      break;
    }
  }

  return idx;
}

type TResultObject = {
  index: number;
  add?: string;
  remove?: string;
};
function commitAlgor(initial: string, commit: string): TResultObject[] {
  let i_initial: number = 0, i_commit: number = 0;
  let result: TResultObject[] = [];

  while (i_initial < initial.length) {
    if (initial[i_initial] !== commit[i_commit]) {
      const idx = findMaxDiff(initial.slice(i_initial), commit.slice(i_commit));

      result.push({
        index: i_initial + idx,
        add: initial.slice(i_initial, i_initial + idx),
      });

      i_initial += idx;
      ++i_commit;
    } else {
      ++i_commit;
      ++i_initial;
    }
  }

  if (initial.length < commit.length) {
    result.push({
      index: initial.length,
      add: commit.slice(initial.length)
    })
  }

  return result;
}

export default commitAlgor;
