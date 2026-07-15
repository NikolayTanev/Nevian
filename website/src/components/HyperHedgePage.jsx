const dataPaths = [
  'M190 0V493C190 584 246 637 489 637',
  'M228 0V466C228 558 286 612 489 612',
  'M264 0V445C264 535 319 590 489 590',
  'M300 0V428C300 512 346 568 489 568',
  'M335 0V415C335 493 374 541 503 542',
  'M370 0V401C370 472 406 510 531 525',
  'M404 0V377C404 452 434 487 563 507',
  'M476 0V286C476 348 489 357 539 374C583 389 600 421 600 476',
];

function BitLeaseMark() {
  return (
    <g transform="translate(110 1100)" aria-label="BitLease">
      <g fill="none" stroke="#efbc7d" strokeWidth="3.1" strokeLinejoin="round">
        <path d="M22 2 42 8l9 20-13 19-23-1L3 27 12 8Z" />
        <path d="m22 7 15 6 8 15-10 13-17-2-9-13 8-13Z" opacity=".82" />
        <path d="m14 34 9-22 13 22Z" />
      </g>
      <text x="55" y="38" fill="#f5f1ef" fontSize="34" fontWeight="500" letterSpacing="-1.1">BitLease</text>
    </g>
  );
}

export default function HyperHedgePage() {
  return (
    <main className="hyperhedge-page">
      <svg
        className="hyperhedge-artwork"
        viewBox="0 0 1200 1200"
        role="img"
        aria-labelledby="hyperhedge-title hyperhedge-description"
      >
        <title id="hyperhedge-title">The HyperHedge Flow</title>
        <desc id="hyperhedge-description">
          Raw market data travels through eight gold paths into the HyperHedge Filter and exits as clean, calibrated risk data.
        </desc>

        <defs>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8d4e16" />
            <stop offset=".22" stopColor="#e8a33a" />
            <stop offset=".58" stopColor="#ffe17c" />
            <stop offset="1" stopColor="#ca711c" />
          </linearGradient>
          <linearGradient id="titleSilver" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#707072" />
            <stop offset=".58" stopColor="#c8c5c7" />
            <stop offset="1" stopColor="#f1eff0" />
          </linearGradient>
          <radialGradient id="filterFill" cx="50%" cy="48%" r="62%">
            <stop offset="0" stopColor="#20150c" />
            <stop offset=".72" stopColor="#0d0906" />
            <stop offset="1" stopColor="#030303" />
          </radialGradient>
          <radialGradient id="filterAura">
            <stop offset="0" stopColor="#f8a727" stopOpacity=".47" />
            <stop offset=".35" stopColor="#dc7919" stopOpacity=".2" />
            <stop offset="1" stopColor="#d46e11" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pageVignette" cx="50%" cy="48%" r="70%">
            <stop offset="0" stopColor="#16130d" stopOpacity=".22" />
            <stop offset=".62" stopColor="#050504" stopOpacity=".06" />
            <stop offset="1" stopColor="#000" stopOpacity=".52" />
          </radialGradient>
          <linearGradient id="adapterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffcf59" />
            <stop offset="1" stopColor="#fff1b0" />
          </linearGradient>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="lineTexture" x="-8%" y="-3%" width="116%" height="106%">
            <feTurbulence type="fractalNoise" baseFrequency=".014 .55" numOctaves="1" seed="13" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.05" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <rect width="1200" height="1200" fill="#010303" />
        <rect x="0" y="0" width="1200" height="1200" fill="url(#pageVignette)" opacity=".28" />

        <g className="hyperhedge-output-line" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M592 721V1037C592 1096 617 1122 682 1122H938C984 1122 1007 1144 1007 1198" stroke="#d67b20" strokeWidth="17" opacity=".14" filter="url(#softGlow)" />
          <path d="M592 721V1037C592 1096 617 1122 682 1122H938C984 1122 1007 1144 1007 1198" stroke="url(#goldStroke)" strokeWidth="8" />
          <path d="M592 721V1037C592 1096 617 1122 682 1122H938C984 1122 1007 1144 1007 1198" stroke="#ffe888" strokeWidth="1.3" opacity=".6" />
        </g>

        <g className="hyperhedge-raw-lines" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke="#c26f1e" strokeWidth="14" opacity=".16" filter="url(#softGlow)">
            {dataPaths.map((path, index) => <path d={path} key={`glow-${index}`} />)}
          </g>
          <g stroke="url(#goldStroke)" strokeWidth="5.1" filter="url(#lineTexture)">
            {dataPaths.map((path, index) => <path d={path} key={`line-${index}`} />)}
          </g>
          <g stroke="#ffe38a" strokeWidth="1.05" opacity=".5" strokeDasharray="1 4">
            {dataPaths.map((path, index) => <path d={path} key={`grain-${index}`} />)}
          </g>
        </g>

        <circle cx="596" cy="615" r="177" fill="url(#filterAura)" filter="url(#nodeGlow)" opacity=".72" />

        <g className="hyperhedge-filter">
          <path d="M553 702H631L640 715V744Q640 756 628 756H560Q548 756 548 744V715Z" fill="#ed9c29" opacity=".38" filter="url(#softGlow)" />
          <path d="M553 702H631L640 715V744Q640 756 628 756H560Q548 756 548 744V715Z" fill="url(#adapterFill)" stroke="#ffe98f" strokeWidth="2" />
          <path d="M600 484 704 546Q710 550 710 560V669Q710 679 702 684L608 741Q596 748 585 741L493 684Q484 679 484 668V559Q484 550 493 544L586 488Q596 481 600 484Z" fill="url(#filterFill)" stroke="#ffd465" strokeWidth="3.2" filter="url(#softGlow)" />
          <path d="M600 484 704 546Q710 550 710 560V669Q710 679 702 684L608 741Q596 748 585 741L493 684Q484 679 484 668V559Q484 550 493 544L586 488Q596 481 600 484Z" fill="url(#filterFill)" stroke="#ffe78d" strokeWidth="2.35" />
          <circle cx="600" cy="477" r="15" fill="#f6a42d" opacity=".28" filter="url(#softGlow)" />
          <circle cx="600" cy="477" r="5.7" fill="#fff1a2" />
          <text x="597" y="612" textAnchor="middle" fill="#d8d6d8" fontSize="29" fontWeight="600">HyperHedge</text>
          <text x="597" y="648" textAnchor="middle" fill="#d8d6d8" fontSize="29" fontWeight="600">Filter</text>
        </g>

        <g className="hyperhedge-copy" fontFamily="Inter, sans-serif">
          <text x="111" y="232" fill="#bcb9bb" fontSize="30" fontWeight="600">Raw Market Data</text>

          <text x="841" y="268" textAnchor="middle" fill="url(#titleSilver)" fontSize="78" fontWeight="500" letterSpacing="-3">The</text>
          <text x="841" y="363" textAnchor="middle" fill="url(#titleSilver)" fontSize="78" fontWeight="500" letterSpacing="-3">HyperHedge</text>
          <text x="841" y="458" textAnchor="middle" fill="url(#titleSilver)" fontSize="78" fontWeight="500" letterSpacing="-3">Flow</text>

          <text x="627" y="1078" fill="#aaa7a9" fontSize="30" fontWeight="600">Clean, Calibrated Risk Data</text>
        </g>

        <BitLeaseMark />
      </svg>
    </main>
  );
}
