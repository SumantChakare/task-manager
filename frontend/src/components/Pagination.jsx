export function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page, total, per_page } = meta;
    const startItem = (current_page - 1) * per_page + 1;
    const endItem = Math.min(current_page * per_page, total);

    // Generate page numbers to display
    const pages = [];
    for (let i = 1; i <= last_page; i++) {
        // Show first, last, and current +/- 1 pages
        if (i === 1 || i === last_page || (i >= current_page - 1 && i <= current_page + 1)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{total}</strong> tasks
            </div>

            <div className="pagination-controls">
                <button
                    type="button"
                    className="pagination-btn"
                    disabled={current_page <= 1}
                    onClick={() => onPageChange(current_page - 1)}
                >
                    &larr; Prev
                </button>

                {pages.map((p, index) =>
                    p === '...' ? (
                        <span key={`dots-${index}`} className="pagination-ellipsis">&hellip;</span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            className={`pagination-page-btn ${p === current_page ? 'active' : ''}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    type="button"
                    className="pagination-btn"
                    disabled={current_page >= last_page}
                    onClick={() => onPageChange(current_page + 1)}
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
}
