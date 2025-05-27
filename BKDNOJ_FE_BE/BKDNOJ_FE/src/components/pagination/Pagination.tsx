interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="justify-left flex items-center gap-2 bg-gray-100 p-4">
      <button
        className="rounded border px-3 py-1 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 2 ||
            page === currentPage - 2 ||
            page === currentPage + 2
          );
        })
        .reduce((acc: (number | "...")[], page, idx, arr) => {
          if (idx > 0 && page !== arr[idx - 1] + 1) {
            acc.push("...");
          }
          acc.push(page);
          return acc;
        }, [])
        .map((item, index) =>
          item === "..." ? (
            <span key={`dots-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={item}
              className={`rounded border px-3 py-1 ${
                currentPage === item ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => onPageChange(item as number)}
            >
              {item}
            </button>
          ),
        )}

      <button
        className="rounded border px-3 py-1 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
