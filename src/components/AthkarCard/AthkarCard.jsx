import { useState, useCallback, useEffect } from "react";

const AthkarCard = ({ content, count, initialCount, onCountChange }) => {
  const [currentCount, setCurrentCount] = useState(initialCount ?? count);

  useEffect(() => {
    setCurrentCount(initialCount ?? count);
  }, [initialCount, count]);

  const isDone = currentCount === 0;
  const remaining = count - currentCount;

  const countDown = useCallback(() => {
    if (currentCount > 0) {
      const next = currentCount - 1;
      setCurrentCount(next);
      onCountChange?.(next);
    }
  }, [currentCount, onCountChange]);

  const countReset = useCallback(
    (event) => {
      event.stopPropagation();
      setCurrentCount(count);
      onCountChange?.(count);
    },
    [count, onCountChange]
  );

  return (
    /*
      The whole card is the tap target for counting — that's the primary action
      and it wants to be big. Reset is a real nested button, so the card itself
      is a <button> only in behavior, not markup: it uses role/keyboard wiring
      to avoid an invalid button-inside-button.
    */
    <article
      className={`surface-card group relative flex gap-4 p-4 transition-colors duration-200 sm:gap-5 sm:p-5 ${
        isDone ? "" : "hover:border-brand/25"
      }`}
    >
      <div
        role="button"
        tabIndex={isDone ? -1 : 0}
        onClick={countDown}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            countDown();
          }
        }}
        aria-label={isDone ? "اكتمل الذكر" : `اضغط للعد، المتبقي ${currentCount}`}
        aria-disabled={isDone}
        className={`flex min-w-0 flex-1 rounded-control ${
          isDone ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <p
          className={`t-dhikr measure-prose font-naskh transition-colors duration-300 ${
            isDone ? "text-ink-3" : "text-ink"
          }`}
        >
          {content}
        </p>
      </div>

      {/* Counter rail: a fixed-width column, aligned to the top of the text. */}
      <div className="flex shrink-0 flex-col items-center gap-2">
        <button
          type="button"
          onClick={countDown}
          disabled={isDone}
          aria-label={isDone ? "اكتمل" : `المتبقي ${currentCount}`}
          className={`grid h-16 w-16 place-items-center rounded-control border transition-colors duration-200 sm:h-[4.5rem] sm:w-[4.5rem] ${
            isDone
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-line/10 bg-surface-2 text-brand hover:border-brand/40 hover:bg-brand/5 active:scale-95"
          }`}
        >
          {isDone ? (
            <i className="ri-check-line text-3xl" aria-hidden="true" />
          ) : (
            <span className="text-3xl font-bold tabular-nums">{currentCount}</span>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <span className="t-label tabular-nums text-ink-3" dir="ltr">
            {remaining}/{count}
          </span>
          <button
            type="button"
            onClick={countReset}
            aria-label="إعادة الضبط"
            title="إعادة الضبط"
            className="relative grid h-7 w-7 place-items-center rounded-md text-ink-3 transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-brand/10 hover:text-brand"
          >
            <i className="ri-refresh-line text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default AthkarCard;
