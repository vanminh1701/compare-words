import { useCallback, useRef } from "react";
import "./App.css";

const INS = "ins";
const DEL = "del";
const INITIAL = "He";
const seqChars = [
  { text: "H", id: "10_0.-1" },
  { text: "e", id: "10_0.0" },
];
// const seqWords = [{ value: "He", id: "10" }];

function App() {
  // const [str1, setStr1] = useState(string);
  // const [str2, setStr2] = useState(string);
  const originalRef = useRef();
  const changeRef = useRef();
  const prevChangeValue = useRef(INITIAL);

  const onCompare = () => {
    const { arrayCommon } = findCommon("aced", "abc");
    console.log("arrayCommon", arrayCommon);
  };

  const _generateId = useCallback((index) => {
    const lastIndex = seqChars.length - 1;
    // new char at the end
    if (index > lastIndex) {
      const { id } = seqChars[lastIndex];
      const [wordKey, index] = id.split("_");
      const newIndex = `${wordKey}_${+index + 1}`;
      return newIndex;
    }
    // new char at start
    if (index === 0) {
      const { id } = seqChars[0];
      const [wordKey, index] = id.split("_");
      const newIndex = `${wordKey}_${+index - 1}`;
      return newIndex;
    }

    // want to add index among (index -1 , index)
    const { id: idBefore } = seqChars[index - 1];
    const [wordKeyBefore, indexCharBefore] = idBefore.split("_");
    const { id: idAfter } = seqChars[index];
    const [wordKeyAfter, indexCharAfter] = idAfter.split("_");

    let arrIndexBefore = indexCharBefore.split(".");
    let arrIndexAfter = indexCharAfter.split(".");

    // handle (2 , 3) => 2.0
    if (arrIndexBefore.length === arrIndexAfter.length) {
      // 1_1 - 1_2 => 1_1.0
      return `${wordKeyBefore}_${indexCharBefore}.0`;
    } else if (indexCharBefore.length < indexCharAfter.length) {
      // 1_2 - 1_2.0  => 1_2.-1

      const lastDecimalPath = arrIndexAfter.pop();
      arrIndexAfter.push(+lastDecimalPath - 1);
      return `${wordKeyAfter}_${arrIndexAfter.join(".")}`;
    } else {
      //  1_2.0  -  1_3 => 1_2.1
      const lastDecimalPath = arrIndexBefore.pop();
      arrIndexBefore.push(+lastDecimalPath + 1);
      return `${wordKeyAfter}_${arrIndexBefore.join(".")}`;
    }
  }, []);

  const onUpdateSequence = useCallback(
    (value, action) => {
      // const prevValue = prevChangeValue.current;
      // let action = value.length > prevValue.length ? INS : DEL;
      console.log("update", value, action);

      let vIndex = 0;
      let seqIndex = 0;

      while (seqChars[seqIndex]?.text === "") seqIndex++;
      while (seqChars[seqIndex]?.text === value[vIndex]) {
        while (seqChars[seqIndex + 1]?.text === "") seqIndex++;
        // update both
        vIndex++;
        seqIndex++;
      }

      let handlingIndex = seqIndex;
      if (action === DEL) {
        const deletedChar = seqChars[handlingIndex];

        if (deletedChar.text === "") {
          console.warn("Error:: Delete empty char");
        } else {
          deletedChar.text = "";
        }
      } else {
        let id = _generateId(handlingIndex);
        let newIndex = _findNewIndexInArray(id, seqChars);
        const newChar = { text: value[vIndex], id };
        seqChars.splice(newIndex, 0, newChar);

        // if (new Set(seqChars.map((i) => i.id)).size < seqChars.length) {
        //   console.warn("wrong::", vIndex, handlingIndex);
        // }
      }

      originalRef.current.value = prevChangeValue.current;
      prevChangeValue.current = value;

      console.log(JSON.parse(JSON.stringify(seqChars)));
    },
    [_generateId]
  );

  const onChange = useCallback(
    (event) => {
      const { value } = event.target;

      const numberOfChanges = value.length - prevChangeValue.current.length;
      if (numberOfChanges < -1) {
        const prevValue = prevChangeValue.current;
        let i = 0; // index of first deleted char
        //prettier-ignore
        while (value[value.length - 1 - i] === prevValue[prevValue.length - 1 - i]) i++;

        // reverse i from end of string
        i = prevValue.length - 1 - i;
        for (let index = i; index >= 0; index--) {
          const valueEachChar =
            prevValue.substring(0, index) + prevValue.substring(i + 1);
          onUpdateSequence(valueEachChar, DEL);
        }
      } else if (numberOfChanges === -1) {
        onUpdateSequence(value, DEL);
      } else if (numberOfChanges === 1) {
        onUpdateSequence(value, INS);
      } else {
        const prevValue = prevChangeValue.current;
        let i = 0; // index of first change char
        while (value[i] === prevValue[i]) i++;

        if (i === prevValue.length) {
          // add new at the end
          for (let index = 1; index <= numberOfChanges; index++) {
            const valueEachChange = prevValue + value.slice(i, i + index);
            onUpdateSequence(valueEachChange, INS);
          }
        } else {
          for (let index = 1; index <= numberOfChanges; index++) {
            const valueEachChange =
              prevValue.slice(0, i) +
              value.slice(i, i + index) +
              prevValue.slice(i);
            onUpdateSequence(valueEachChange, INS);
          }
        }
      }
    },
    [onUpdateSequence]
  );

  return (
    <div>
      <div className="App">
        <textarea
          name="str1"
          placeholder="type here text here..."
          rows={5}
          ref={originalRef}
          defaultValue={INITIAL}
        />
        <textarea
          id="str2"
          name="str2"
          onChange={onChange}
          placeholder="type text you want to compare..."
          rows={5}
          ref={changeRef}
          defaultValue={INITIAL}
        />
      </div>
      <button onClick={onCompare}>Compare (longest common substring)</button>
    </div>
  );
}

export default App;

function findCommon(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  const memo = Array.from({ length: m }, () => new Uint16Array(n));
  let arrayCommon = [];
  const result = recursion(m - 1, n - 1);

  return { result, arrayCommon };

  function recursion(index1, index2) {
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

const _sortKey = (arr1, arr2, index = 0) => {
  if (arr1[index] === undefined && arr2[index] === undefined) return 0;

  if (arr1[index] === undefined) return -1;
  if (arr2[index] === undefined) return 1;
  if (+arr1[index] > +arr2[index]) return 1;
  if (+arr1[index] < +arr2[index]) return -1;

  return _sortKey(arr1, arr2, index + 1);
};
const _compareSequenceIndexChar = (char1, char2) => {
  const [wordKey1, index1] = char1.id.split("_");
  const [wordKey2, index2] = char2.id.split("_");

  const resultWordKey = _sortKey(wordKey1.split("."), wordKey2.split("."));
  if (resultWordKey !== 0) return resultWordKey;

  return _sortKey(index1.split("."), index2.split("."));
};
const _findNewIndexInArray = (newId, arr) => {
  let index = 0;

  // find position where new Index > current in array
  //prettier-ignore
  while (arr[index]?.id && _compareSequenceIndexChar({ id: newId }, arr[index]) !== -1) {
    index++;
  }

  return index;
};

// bôi đen delete bc
/// abcdf loop => del c
/// abdf continue loop => del b
/// adf
