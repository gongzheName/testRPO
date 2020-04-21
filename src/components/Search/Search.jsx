import React, { useCallback, useRef } from "react";
import {
  // useSelector,
  useDispatch,
} from "react-redux";
import { debounce } from '../..//util';

import {UPDATE_TEMP_VARS } from "../../constant/TreeActionType";

const Search = () => {
  const dispatch = useDispatch();
  const refSearch = useRef(null);

  const handleChangeSearch = useCallback(
    debounce(() => {
        if (!refSearch) return;
        dispatch({
          type: UPDATE_TEMP_VARS,
          payload: refSearch.current.value
        });
    }, 500),
    [dispatch, refSearch]
  );

  return (
    <div className="kd-search-wrap">
      <input
        type="text"
        ref={refSearch}
        onChange={handleChangeSearch}
        placeholder="仅支持名称查询"
      />
    </div>
  );
};

export default Search;
