"use client";

import { useState, useEffect, useCallback } from "react";

import randomizeArray from "~/utils/randomizeArray";

import type { MainArray } from "~/types/MainArray";
import type { AllowedNumber } from "~/types/AllowedNumber";
import type { IndexObject } from "~/types/IndexObject";

export default function HomePage() {
  const [arr, setArr] = useState<MainArray>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<(ReturnType<typeof setTimeout>) | null>(null);

  const modifyArr = useCallback((indices: IndexObject[]) => {
    const a = [...arr];
    indices.forEach((obj) => {
      let x: AllowedNumber[] = a[obj.i] as AllowedNumber[];
      let val: AllowedNumber = x[obj.j]!;
      if (val === 1 as AllowedNumber)
        val = 0 as AllowedNumber;
      else
        val = 1 as AllowedNumber;
      x = [...(a[obj.i] as AllowedNumber[])];
      x[obj.j] = val;
      a[obj.i] = x;
    });
    setArr(a);
  }, [arr]);

  const handleClick = (i: number, j: number) => {
    modifyArr([{ i, j }]);
  };

  const getNumberOfLivingNeighbours = useCallback((i: number, j: number) => {
    let count = 0;
    if (i >= 1 && j >= 1 && ((arr[i - 1] as AllowedNumber[])[j - 1] === 1 as AllowedNumber))
      count++;
    if (j >= 1 && ((arr[i] as AllowedNumber[])[j - 1] === 1 as AllowedNumber))
      count++;
    if (i < arr.length - 1 && j >= 1 && ((arr[i + 1] as AllowedNumber[])[j - 1] === 1 as AllowedNumber))
      count++;
    if (i >= 1 && ((arr[i - 1] as AllowedNumber[])[j] === 1 as AllowedNumber))
      count++;
    if (i < arr.length - 1 && ((arr[i + 1] as AllowedNumber[])[j] === 1 as AllowedNumber))
      count++;
    if (i >= 1 && j < arr.length - 1 && ((arr[i - 1] as AllowedNumber[])[j + 1] === 1 as AllowedNumber))
      count++;
    if (j < arr.length - 1 && ((arr[i] as AllowedNumber[])[j + 1] === 1 as AllowedNumber))
      count++;
    if (i < arr.length - 1 && j < arr.length - 1 && ((arr[i + 1] as AllowedNumber[])[j + 1] === 1 as AllowedNumber))
      count++;
    return count;
  }, [arr]);

  const handleStart = useCallback(() => {
    const modificationIndices: IndexObject[] = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < (arr[i] as AllowedNumber[]).length; j++) {
        const n = getNumberOfLivingNeighbours(i, j);
        if (((arr[i] as AllowedNumber[])[j] === 0 as AllowedNumber) && n === 3)
          modificationIndices.push({ i, j });
        else if (((arr[i] as AllowedNumber[])[j] === 1 as AllowedNumber) && (n < 2 || n >= 4))
          modificationIndices.push({ i, j });
      }
    }
    modifyArr(modificationIndices);
  }, [arr, getNumberOfLivingNeighbours, modifyArr]);

  useEffect(() => {
    setArr(randomizeArray());
  }, []);

  useEffect(() => {
    if (isRunning) {
      setTimer(setTimeout(handleStart, 1000));
    }
    else {
      if (timer)
        clearTimeout(timer);
      setTimer(null);
    }
  }, [arr, isRunning, handleStart]);

  return (
    <main className="flex flex-col min-h-screen justify-center font-mono w-screen">
      <p className="font-bold text-lg sm:text-2xl md:text-5xl text-center">Conway&apos;s Game of Life</p>
      <table className="my-10 border border-black border-collapse bg-stone-400 flex items-center max-w-[80%] mx-auto">
        <tbody className="w-full">
          {
            arr.map((row, i) => (
              <tr key={i}>
                {
                  row.map((item, j) => (
                    <td key={`${i}-${j}`} className={`border border-black w-[8px] h-[10px] sm:w-[15px] sm:h-[15px] p-0.5 md:p-2 hover:cursor-pointer ${item === 1 && "bg-yellow-300"}`} onClick={() => handleClick(i, j)}></td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="my-5 flex items-center justify-center w-[50%] mx-auto gap-x-3">
        <button className="bg-blue-700 rounded-lg p-2 min-w-[80px] text-white font-bold" onClick={() => {
          setIsRunning(curr => !curr);
        }}>
          {
            isRunning ? "STOP" : "START"
          }
        </button>
        <button className="bg-blue-700 rounded-lg p-2 min-w-[80px] text-white font-bold" onClick={() => {
          setArr(randomizeArray());
        }}>
          RANDOMIZE
        </button>
      </div>
    </main>
  );
}
