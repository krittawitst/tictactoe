import "./Marked.css";

function Marked({ value, setValue, isDisable }) {
  return (
    <div
      className={`marked ${
        isDisable ? "disabled" : value === null ? "null" : "occupied"
      }`}
      onClick={() => {
        if (!isDisable && value === null) {
          setValue("X");
        }
      }}
    >
      {value}
    </div>
  );
}

export default Marked;
