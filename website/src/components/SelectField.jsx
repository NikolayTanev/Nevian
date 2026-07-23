import { useEffect, useRef, useState } from 'react';

// A lightweight, theme-matched dropdown that replaces the native <select> whose
// option list can't be styled to match the dark form. A hidden input carries
// the value so the surrounding <form> still submits it normally.
export default function SelectField({ name, options, defaultValue, required }) {
  const [value, setValue] = useState(defaultValue ?? options[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (option, event) => {
    // The field is wrapped in a <label>; without this, clicking an option makes
    // the label forward a synthetic click to the trigger and reopen the list.
    event.preventDefault();
    setValue(option);
    setOpen(false);
  };

  return (
    <div className={`nv-select ${open ? 'is-open' : ''}`} ref={ref}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        className="nv-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <svg className="nv-select-caret" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="nv-select-list" role="listbox">
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={option === value ? 'is-selected' : ''}
              onClick={(event) => choose(option, event)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
