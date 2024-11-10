import "./Marked.css";

function Marked({ value, setValue, isDisable, setIsUserTurn }) {
  return (
    <div
      className={`marked ${
        isDisable ? "disabled" : value === null ? "null" : "occupied"
      }`}
      onClick={() => {
        if (!isDisable && value === null) {
          setValue("X");
          setIsUserTurn(false);
        }
      }}
    >
      {value}
    </div>
  );
}

export default Marked;
