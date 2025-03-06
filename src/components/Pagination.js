import { Button } from "@/components/ui/Button";

export default function Pagination({ courtsPerPage, totalCourts, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCourts / courtsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <Button
              variant={currentPage === number ? "default" : "outline"}
              onClick={() => paginate(number)}
              className={currentPage === number ? "btn-primary-hover" : "hover:bg-secondary"}
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
