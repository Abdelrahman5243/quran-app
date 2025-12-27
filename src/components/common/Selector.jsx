const Selector = ({ id, value, onChange, options, label, ariaLabel }) => {
  return (
    <div className="flex flex-col relative group w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-right border border-white/20 dark:border-white/10 rounded-2xl px-6 py-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:bg-white/20 dark:hover:bg-black/30 appearance-none cursor-pointer text-slate-800 dark:text-slate-100 font-bold text-lg md:text-xl"
          value={value}
          onChange={onChange}
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-4"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 dark:text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">
          <i className="ri-arrow-down-s-line text-2xl"></i>
        </div>
      </div>
    </div>
  );
};

export default Selector;
