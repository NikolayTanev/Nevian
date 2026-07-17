import { useEffect, useId, useRef, useState } from 'react';

function SelectChevron() {
  return (
    <svg className="contact-page-select-chevron" viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
    </svg>
  );
}

export default function ContactSelect({ name, label, placeholder, options, className = '' }) {
  const id = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const form = rootRef.current?.closest('form');
    if (!form) return undefined;

    const handleReset = () => {
      setValue('');
      setOpen(false);
      setInvalid(false);
    };

    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsidePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsidePointer);
    return () => document.removeEventListener('pointerdown', handleOutsidePointer);
  }, [open]);


  const chooseOption = (option) => {
    setValue(option);
    setActiveIndex(options.indexOf(option));
    setOpen(false);
    setInvalid(false);
    triggerRef.current?.focus();
    window.requestAnimationFrame(() => {
      rootRef.current?.closest('form')?.dispatchEvent(new Event('input', { bubbles: true }));
    });
  };

  const showMenu = () => {
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        showMenu();
        return;
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + direction + options.length) % options.length);
      return;
    }

    if (event.key === 'Home' && open) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End' && open) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      chooseOption(options[activeIndex]);
    }
  };

  const listboxId = `${id}-options`;
  const activeOptionId = `${id}-option-${activeIndex}`;

  return (
    <div className={`contact-page-field ${className}`}>
      <span id={`${id}-label`}>{label}</span>
      <div
        ref={rootRef}
        className={`contact-page-select ${open ? 'is-open' : ''} ${value ? 'has-value' : 'is-empty'} ${invalid ? 'is-invalid' : ''}`}
      >
        <select
          className="contact-page-select-native"
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onInvalid={(event) => {
            event.preventDefault();
            setInvalid(true);
            triggerRef.current?.focus();
          }}
          required
          tabIndex={-1}
          aria-hidden="true"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>

        <button
          ref={triggerRef}
          className="contact-page-select-trigger"
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-activedescendant={open ? activeOptionId : undefined}
          aria-invalid={invalid || undefined}
          onClick={() => (open ? setOpen(false) : showMenu())}
          onKeyDown={handleKeyDown}
        >
          <span>{value || placeholder}</span>
          <SelectChevron />
        </button>

        <div className="contact-page-select-menu" id={listboxId} role="listbox" hidden={!open}>
          {options.map((option, index) => (
            <div
              id={`${id}-option-${index}`}
              className={`contact-page-select-option ${index === activeIndex ? 'is-active' : ''}`}
              role="option"
              aria-selected={value === option}
              key={option}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerDown={(event) => {
                event.preventDefault();
                chooseOption(option);
              }}
            >
              <span>{option}</span>
              <i aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}