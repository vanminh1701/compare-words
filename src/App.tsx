import "./App.css";

import React, { useCallback, useState } from "react";

import commitAlgor from "./commitAlgor";

const words = [
  {
    word_key: "5348.0",
    word: "hello",
  },
  {
    word_key: "5348.1",
    word: "my",
  },
  {
    word_key: "5349.0",
    word: "world",
  },
];

/**
 * Define a rule to detect version of new word with original words above.
 * Handle case insert new word, delete word
 *
 */

const string = words.reduce((acc, item) => acc.concat(item.word + " "), "");

function App() {
  const [str1, setStr1] = useState(string);
  const [str2, setStr2] = useState(string);
  const [result, setResult] = useState<any>();

  const onCompare = () => {
    const { result } = findCommon(str1, str2);
    console.log("%cCommit Algor", "color: red", commitAlgor(str1, str2));
    setResult(result);
  };

  const onChange = useCallback((event) => {
    const { name, value } = event.target;
    name === "str1" ? setStr1(value) : setStr2(value);
  }, []);

  return (
    <div>
      <div className="App">
        <textarea
          onChange={onChange}
          name="str1"
          placeholder="type here text here..."
          rows={5}
          value={str1}
        />
        <textarea
          onChange={onChange}
          name="str2"
          placeholder="type text you want to compare..."
          rows={5}
          value={str2}
        />
      </div>
      <button onClick={onCompare}>Compare (longest common substring)</button>
      <div
        style={{
          color: "red",
        }}
      >
        {result}
      </div>
    </div>
  );
}

export default App;

interface Common {
  index1: number;
  index2: number;
  value: string;
}
interface Result {
  result: number;
  arrayCommon: Common[];
}

function findCommon(str1: string, str2: string): Result {
  const m = str1.length;
  const n = str2.length;

  const memo = Array.from({ length: m }, () => new Uint16Array(n));
  let arrayCommon: Common[] = [];
  const result = recursion(m - 1, n - 1);

  return { result, arrayCommon };

  function recursion(index1: number, index2: number): number {
    if (index1 < 0 || index2 < 0) return 0;

    if (memo[index1][index2]) {
      return memo[index1][index2];
    }

    let result;

    if (str1[index1] === str2[index2]) {
      arrayCommon.push({ value: str1[index1], index1, index2 });
      result = recursion(index1 - 1, index2) + 1;
    } else {
      result = Math.max(
        recursion(index1, index2 - 1),
        recursion(index1 - 1, index2)
      );
    }
    memo[index1][index2] = result;

    return result;
  }
}
