const Selector = ({ id, value, onChange, options, label, ariaLabel, icon }) => {
  return (
    <div className="group relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {icon && (
        <i
          className={`${icon} pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-base text-ink-3`}
          aria-hidden="true"
        />
      )}
      <select
        id={id}
        className={`control w-full appearance-none py-2 pe-8 text-start text-sm font-semibold focus:border-brand ${
          icon ? "ps-9" : "ps-3"
        }`}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <i
        className="ri-arrow-down-s-line pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-base text-ink-3 transition-colors group-hover:text-brand"
        aria-hidden="true"
      />
    </div>
  );
};

export default Selector;
