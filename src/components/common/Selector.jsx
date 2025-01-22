const Selector = ({ id, value, onChange, options, label, ariaLabel }) => {
  return (
    <div className="flex items-center relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-transparent text-center border border-slate-500 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
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
    </div>
  );
};

export default Selector;
