type EmojiIconProps = {
  symbol: string;
  label?: string;
  className?: string;
};

export function EmojiIcon({ symbol, label, className = "" }: EmojiIconProps) {
  const accessibilityProps = label ? { "aria-label": label } : { "aria-hidden": "true" };

  return (
    <span
      role="img"
      {...accessibilityProps}
      className={`leading-none select-none ${className}`.trim()}
    >
      {symbol}
    </span>
  );
}
