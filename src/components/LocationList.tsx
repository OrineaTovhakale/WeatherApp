interface LocationListProps {
  locations: string[];
  onSelect: (loc: string) => void;
  onDelete: (loc: string) => void;
}

const LocationList: React.FC<LocationListProps> = ({ locations, onSelect, onDelete }) => {
  return (
    <ul className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mt-8 w-full max-w-md">
      {locations.map((loc) => (
        <li key={loc} className="flex justify-between items-center py-2 border-b last:border-none">
          <span onClick={() => onSelect(loc)} className="cursor-pointer hover:text-blue-500">{loc}</span>
          <button onClick={() => onDelete(loc)} className="text-red-500 hover:text-red-700">Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default LocationList;