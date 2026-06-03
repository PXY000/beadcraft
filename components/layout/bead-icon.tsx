export function BeadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Checkerboard background */}
      <rect width="32" height="32" rx="8" fill="#F8F8FA" />
      {/* Grid of beads */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const colors = [
            "#5E6AD2", "#9373EE", "#FF6B6B", "#FFB300",
            "#2EA244", "#4371C7", "#EF3E6F", "#F98421",
            "#784198", "#30CCCC", "#C71585", "#77C74A",
            "#212121", "#9B9B9B", "#FEE434", "#D4AF37",
          ];
          const color = colors[(row * 4 + col) % colors.length];
          return (
            <circle
              key={`${row}-${col}`}
              cx={6 + col * 7}
              cy={6 + row * 7}
              r="2.8"
              fill={color}
            />
          );
        })
      )}
    </svg>
  );
}
