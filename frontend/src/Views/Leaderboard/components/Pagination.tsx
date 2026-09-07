type PaginationProps = { 
    page: number; 
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onPageSelect?: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPrev, onNext, onPageSelect}: PaginationProps) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const pages = Array.from({ length: Math.min(totalPages, 5)}, (_, i) => start + i).filter(p => p >= 1 && p <=totalPages);
    
    return (
        <div className="flex items-center justify-center gap-4">
            <button onClick={onPrev} disabled={page <= 1} className="btn btn-secondary btn-sm"> Prev</button>

            <div className="flex items-center gap-2">
                {pages.map(p => (
                    <button key={p}
                        onClick={() => onPageSelect?.(p)}
                        className={`w-9 h-9 rounded-full text-sm font-black transition-colors ${
                            p === page ? 'bg-primary text-button-text-primary' : 'text-muted hover:bg-background-elevated'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button onClick={onNext} disabled={page >= totalPages} className="btn btn-secondary btn-sm">Next</button>
        </div>
    );
};

export default Pagination;