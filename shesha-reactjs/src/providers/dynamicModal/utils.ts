import { IKeyValue } from "@/interfaces/keyValue";
import { isNonEmptyArray } from "@/utils/array";
import { isNullOrWhiteSpace } from "@/utils/nullables";
import { IModalInstance } from "./models";

/**
 * Converts a key/value list configured in the designer into a plain object.
 * Values are expected to be already evaluated by the action arguments evaluator.
 * Returns `undefined` when there is nothing usable, so callers can skip the property entirely.
 */
export const keyValuesToObject = (items: IKeyValue[] | undefined): object | undefined => {
  if (!isNonEmptyArray(items))
    return undefined;

  const result: Record<string, unknown> = {};
  items.forEach((item) => {
    if (!isNullOrWhiteSpace(item.key))
      result[item.key] = item.value;
  });

  return Object.keys(result).length > 0 ? result : undefined;
};

export const getLatestInstance = (instances: { [index: string]: IModalInstance }, predicate: (instance: IModalInstance) => boolean): IModalInstance | undefined => {
  let highestInstance: IModalInstance | undefined = undefined;

  for (const key of Object.keys(instances)) {
    const instance = instances[key];
    if (instance && predicate(instance) && (highestInstance === undefined || instance.index > highestInstance.index))
      highestInstance = instance;
  }
  return highestInstance;
};
