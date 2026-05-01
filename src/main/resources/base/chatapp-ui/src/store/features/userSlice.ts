import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../@types/user";

type NestedKeyOf<T extends object> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & string];

type NestedValueOf<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValueOf<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

const initialState = null as User | null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<User>) => action.payload,

    clearUser: () => null,

    updateField: <K extends NestedKeyOf<User>>(
      state: User | null,
      action: PayloadAction<{ field: K; value: NestedValueOf<User, K> }>,
    ) => {
      if (!state) return state;

      const { field, value } = action.payload;
      const keys = field.split(".");

      if (keys.length === 1) {
        (state as unknown as Record<string, unknown>)[field] = value;
        return;
      }

      const lastKey = keys.pop()!;
      const target = keys.reduce(
        (acc: Record<string, unknown>, key) => {
          if (!acc[key] || typeof acc[key] !== "object") {
            acc[key] = {};
          }
          return acc[key] as Record<string, unknown>;
        },
        state as unknown as Record<string, unknown>,
      );
      target[lastKey] = value;
    },
  },
});

export const { setUser, clearUser, updateField } = userSlice.actions;
export default userSlice.reducer;