const Selector = ({ id, value, onChange, options, label, ariaLabel }) => {
  return (
    <div className="flex items-center">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        className="text-center select"
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <i className="ri-arrow-down-s-fill ml-2" aria-hidden="true"></i>
    </div>
  );
};

export default Selector;
