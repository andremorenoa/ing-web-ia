export function CornerTicks() {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-torch-500"
      />
      <span
        aria-hidden="true"
        className="absolute -right-px -bottom-px h-3 w-3 border-b-2 border-r-2 border-torch-500"
      />
    </>
  );
}
