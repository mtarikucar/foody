import{BiChevronLeft,BiChevronsLeft,BiChevronRight,BiChevronsRight} from "react-icons/bi"

function CustomPagination(props) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      <button
        className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50"
        disabled={props.isWaiting || props.isEmpty}
        onClick={() => {
          let result = 1;
          props.setCurrentPage((_) => result);
          props.getByFilter(result);
        }}
      >
        <BiChevronsLeft/>
      </button>

      <button
        className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50"
        disabled={props.isWaiting || props.isEmpty}
        onClick={() => {
          let result = props.current > 1 ? props.current - 1 : props.current;
          props.setCurrentPage((_) => result);
          props.getByFilter(result);
        }}
      >
        <BiChevronLeft/>
      </button>

      {[props.current - 1, props.current, props.current + 1].map((x) => {
        return x <= props.limit && x > 0 && !props.isEmpty ? (
          <button
            key={x}
            className={`px-3 py-2 rounded-md  disabled:opacity-50 ${
              props.current === x ? 'bg-indigo-700 text-white' : 'bg-gray-200'
            }`}
            disabled={props.isWaiting || props.isEmpty}
            onClick={() => {
              props.setCurrentPage((_) => x);
              props.getByFilter(x);
            }}
          >
            {x}
          </button>
        ) : null;
      })}

      <button
        className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50"
        disabled={props.isWaiting || props.isEmpty}
        onClick={() => {
          let result =
            props.current < props.limit ? props.current + 1 : props.current;
          props.setCurrentPage((_) => result);
          props.getByFilter(result);
        }}
      >
        <BiChevronRight/>
      </button>

      <button
        className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50"
        disabled={props.isWaiting || props.isEmpty}
        onClick={() => {
          let result = props.limit;
          props.setCurrentPage((_) => result);
          props.getByFilter(result);
        }}
      >
        <BiChevronsRight/>
      </button>
    </div>
  );
}

export default CustomPagination;
