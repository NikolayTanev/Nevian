# NevianMain

Nevian marketing site — rebuilt from scratch with **React + Vite + Tailwind CSS**.

## Stack

- **Vite** dev server + build
- **React 18**
- **Tailwind CSS 3** (design tokens in `tailwind.config.js`)
- No other runtime dependencies. Only external request is Google Fonts.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

```
NevianMain/
  index.html                 Vite entry
  public/logo.svg            brand mark
  src/
    main.jsx                 React bootstrap
    index.css                Tailwind layers + component classes
    App.jsx                  page composition + nav focus scrim
    hooks/useReveal.js       scroll-reveal helper
    components/
      Nav.jsx                floating nav + Solutions dropdown (hover bridge)
      Hero.jsx               headline + interactive help-desk preview
      Journey.jsx            scroll-driven keyword walkthrough
      Features.jsx           feature grid + stats
      Contact.jsx            contact form (AWS endpoint + mailto fallback)
      Footer.jsx             footer
      Icons.jsx              inline SVG icon set
```

## Contact form

`Contact.jsx` POSTs to the Nevian AWS endpoint. If that call fails
(network/CORS), it falls back to opening the visitor's email client
pre-filled to `nevian.info@gmail.com`. A hidden honeypot field drops bots.

## Notes

- The journey section pins on desktop (`lg:`) and the active keyword advances
  as you scroll; on mobile it collapses to a normal card you can tap through.
- The Solutions dropdown blurs the rest of the page via a `backdrop-filter`
  scrim so nothing is ever hidden — only softened.
```
