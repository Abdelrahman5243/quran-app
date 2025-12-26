const Selector = ({ id, value, onChange, options, label, ariaLabel }) => {
  return (
    <div className="flex items-center relative group w-full sm:w-auto">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        className="w-full sm:min-w-[240px] bg-white/10 dark:bg-black/20 backdrop-blur-md text-center border border-white/20 dark:border-white/10 rounded-2xl px-10 py-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:bg-white/20 dark:hover:bg-black/30 appearance-none cursor-pointer text-slate-800 dark:text-slate-100 font-bold text-lg"
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute left-4 pointer-events-none text-emerald-600 dark:text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">
        <i className="ri-arrow-down-s-line text-xl"></i>
      </div>
    </div>
  );
};

export default Selector;
