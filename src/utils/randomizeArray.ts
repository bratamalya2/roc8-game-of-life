import type { AllowedNumber } from "~/types/AllowedNumber";
import type { MainArray } from "~/types/MainArray";

export default function randomizeArray() {
    const size = 30;
    const arr: MainArray = [];

    for (let i = 0; i < size; i++) {
        arr[i] = [];
        for (let j = 0; j < size; j++)
            arr[i]?.push((Math.random() > 0.75 ? 1 : 0) as AllowedNumber);
    }

    return arr;
}