import classNames from "classnames";
import { isFunction } from "lodash";
import type { Ref } from "react";
import React, { forwardRef, useState, useCallback } from "react";

import { ENTITY_EXPLORER_SEARCH_ID } from "constants/Explorer";
import { importSvg } from "design-system-old";

const CrossIcon = importSvg(async () => import("assets/icons/ads/cross.svg"));
const SearchIcon = importSvg(async () => import("assets/icons/ads/search.svg"));

/*eslint-disable react/display-name */
export const ExplorerSearch = forwardRef(
  (
    props: {
      clear: () => void;
      placeholder?: string;
      autoFocus?: boolean;
      isHidden?: boolean;
      onChange?: (e: any) => void;
      id?: string;
    },
    ref: Ref<HTMLInputElement>,
  ) => {
    const [value, setValue] = useState("");
    const [focussed, setFocussed] = useState(false);

    /**
     * on change of input
     */
    const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
      e.persist();

      setValue(e.currentTarget.value);

      if (isFunction(props.onChange)) {
        props.onChange(e);
      }
    }, []);

    /**
     * on click of cross button
     */
    const onClear = useCallback(() => {
      setValue("");

      if (isFunction(props.onChange)) {
        props.clear();
      }
    }, []);

    return (
      <div
        className={classNames({
          "sticky top-0 bg-gray-50": true,
          hidden: props.isHidden,
        })}
      >
        <div
          className={classNames({
            "flex px-3 items-center": true,
          })}
        >
          <SearchIcon className="box-content w-3 h-3 mr-3" />
          <input
            autoComplete="off"
            autoFocus
            className="flex-grow py-2 text-gray-800 bg-transparent placeholder-trueGray-500"
            id={props.id || ENTITY_EXPLORER_SEARCH_ID}
            onBlur={() => setFocussed(false)}
            onChange={onChange}
            onFocus={() => setFocussed(true)}
            placeholder="搜索组件"
            ref={ref}
            type="text"
          />
          {value && (
            <button className="mr-1  hover:bg-trueGray-200" onClick={onClear}>
              <CrossIcon className="w-3 h-3 text-trueGray-100" />
            </button>
          )}
        </div>
        <div
          className={classNames({
            "border-b border-primary-500 absolute bottom-0": true,
            "w-full": focussed,
          })}
        />
      </div>
    );
  },
);

export default ExplorerSearch;
