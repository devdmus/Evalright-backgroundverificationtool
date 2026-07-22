const LOGO_SRC = "/evalright-logo.jpg";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center select-none">
      <img
        src={LOGO_SRC}
        alt="EvalRight — Screen before Hire"
        className={
          collapsed
            ? "h-8 w-8 object-cover object-left"
            : "h-10 w-full object-contain object-left"
        }
      />
    </div>
  );
}
