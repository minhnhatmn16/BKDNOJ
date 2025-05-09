interface GotoPageInputProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const GotoPageInput = ({ totalPages, onPageChange }: GotoPageInputProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("pageInput") as HTMLInputElement;
    const page = parseInt(input.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      input.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        name="pageInput"
        min={1}
        max={totalPages}
        placeholder="Page"
        className="w-20 rounded border px-2 py-1"
      />
      <button type="submit" className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
        Go
      </button>
    </form>
  );
};

export default GotoPageInput;
